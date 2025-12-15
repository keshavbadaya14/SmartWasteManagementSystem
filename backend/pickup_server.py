from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
import requests
from apscheduler.schedulers.background import BackgroundScheduler

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'

# Database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('PG_DATABASE'),
            user=os.getenv('PG_USER'),
            password=os.getenv('PG_PASSWORD'),  
            host=os.getenv('PG_HOST'),
            port=os.getenv('PG_PORT')
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

# Authenticate user
def authenticate_user():
    try:
        cookies = request.cookies
        response = requests.get('http://localhost:5003/profile', cookies=cookies)
        if response.status_code != 200:
            return None, jsonify({'error': 'Unauthorized'}), 401
        user_data = response.json()
        return user_data['user']['id'], None, None
    except Exception as e:
        print(f"Auth error: {e}")
        return None, jsonify({'error': 'Unauthorized'}), 401

@app.route('/schedule-pickup', methods=['POST'])
def schedule_pickup():
    user_id, error, status = authenticate_user()
    if error:
        return error, status

    data = request.get_json()
    pickup_date = data.get('pickupDate')
    pickup_time = data.get('pickupTime')
    waste_type = data.get('wasteType')
    address = data.get('address')
    notes = data.get('notes', '')

    if not pickup_date or not pickup_time or not waste_type or not address:
        return jsonify({'error': 'All fields except notes are required'}), 400

    try:
        pickup_datetime = datetime.strptime(pickup_date, '%Y-%m-%d')
        if pickup_datetime < datetime.now():
            return jsonify({'error': 'Pickup date must be in the future'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    valid_times = ['Morning (8-11 AM)', 'Afternoon (12-3 PM)', 'Evening (4-7 PM)']
    valid_waste_types = ['Recyclable', 'Organic', 'Hazardous']
    if pickup_time not in valid_times:
        return jsonify({'error': 'Invalid time slot'}), 400
    if waste_type not in valid_waste_types:
        return jsonify({'error': 'Invalid waste type'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            INSERT INTO pickup_requests (user_id, pickup_date, pickup_time, waste_type, address, notes, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (user_id, pickup_date, pickup_time, waste_type, address, notes, 'Pending')
        )
        pickup_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': f'Pickup scheduled for {pickup_date} at {pickup_time}'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to schedule pickup'}), 500

@app.route('/community-challenges', methods=['POST'])
def create_challenge():
    user_id, error, status = authenticate_user()
    if error:
        return error, status

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    goal = data.get('goal')
    category = data.get('category')
    scope = data.get('scope', 'Public')

    if not name or not start_date or not end_date or not goal or not category:
        return jsonify({'error': 'All fields except description and scope are required'}), 400

    try:
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        if start < datetime.now() or end <= start:
            return jsonify({'error': 'Invalid date range'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    valid_categories = ['Recyclable', 'Organic', 'Hazardous']
    if category not in valid_categories:
        return jsonify({'error': 'Invalid category'}), 400

    valid_scopes = ['Public', 'Private']
    if scope not in valid_scopes:
        return jsonify({'error': 'Invalid scope'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            INSERT INTO challenges (creator_id, name, description, start_date, end_date, goal, category, scope, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (user_id, name, description, start_date, end_date, float(goal), category, scope, 'Active')
        )
        challenge_id = cur.fetchone()['id']
        # Auto-join creator
        cur.execute(
            """
            INSERT INTO challenge_participants (user_id, challenge_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """,
            (user_id, challenge_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': f'Challenge {name} created'}), 200
    except Exception as e:
        print(f"Error creating challenge: {e}")
        if conn:
            conn.rollback()
            cur.close()
            conn.close()
        return jsonify({'error': f'Failed to create challenge: {str(e)}'}), 500

@app.route('/community-challenges', methods=['GET'])
def get_challenges():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        today = datetime.now().date()
        next_week = today + timedelta(days=7)
        cur.execute(
            """
            SELECT c.*, u.email AS creator_email
            FROM challenges c
            JOIN users u ON c.creator_id = u.id
            WHERE c.start_date <= %s AND c.end_date >= %s AND c.status = %s
            """,
            (next_week, today, 'Active')
        )
        challenges = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(challenges), 200
    except Exception as e:
        print(f"Error fetching challenges: {e}")
        return jsonify({'error': 'Failed to fetch challenges'}), 500

@app.route('/challenge-logs', methods=['GET'])
def get_challenge_logs():
    user_id, error, status = authenticate_user()
    if error:
        return error, status

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            SELECT challenge_id
            FROM completed_challenges
            WHERE user_id = %s
            """,
            (user_id,)
        )
        challenge_logs = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(challenge_logs), 200
    except Exception as e:
        print(f"Error fetching challenge logs: {e}")
        return jsonify({'error': 'Failed to fetch challenge logs'}), 500
    
@app.route('/pending-completions', methods=['GET'])
def get_pending_completions():
    user_id, error, status = authenticate_user()
    if error:
        return error, status

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            SELECT challenge_id
            FROM pending_completions
            WHERE user_id = %s
            """,
            (user_id,)
        )
        pending_completions = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(pending_completions), 200
    except Exception as e:
        print(f"Error fetching pending completions: {e}")
        return jsonify({'error': 'Failed to fetch pending completions'}), 500

@app.route('/join-challenge', methods=['POST'])
def join_challenge():
    user_id, error, status = authenticate_user()
    if error:
        return error, status

    data = request.get_json()
    challenge_id = data.get('challenge_id')

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            INSERT INTO challenge_participants (user_id, challenge_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """,
            (user_id, challenge_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': 'Joined challenge'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to join challenge'}), 500

@app.route('/complete-challenge', methods=['POST'])
def complete_challenge():
    user_id, error, status = authenticate_user()
    if error:
        return error, status

    data = request.get_json()
    challenge_id = data.get('challenge_id')
    completed = data.get('completed')

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            SELECT name, category, end_date FROM challenges WHERE id = %s
            """,
            (challenge_id,)
        )
        challenge = cur.fetchone()
        if not challenge:
            return jsonify({'error': 'Challenge not found'}), 404

        if completed:
            cur.execute(
                """
                INSERT INTO pending_completions (user_id, challenge_id, name, category)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT DO NOTHING
                """,
                (user_id, challenge_id, f"Completed {challenge['name']}", challenge['category'])
            )
        else:
            cur.execute(
                """
                DELETE FROM pending_completions
                WHERE user_id = %s AND challenge_id = %s
                """,
                (user_id, challenge_id)
            )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': 'Challenge completion status updated'}), 200
    except Exception as e:
        print(f"Error updating challenge completion: {e}")
        if conn:
            conn.rollback()
            cur.close()
            conn.close()
        return jsonify({'error': 'Failed to update challenge completion'}), 500

@app.route('/weekly-reset', methods=['POST'])
def weekly_reset():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        today = datetime.now().date()

        # Clear previous completed_challenges
        cur.execute("DELETE FROM completed_challenges")

        # Move pending completions to completed_challenges for ended challenges
        cur.execute(
            """
            INSERT INTO completed_challenges (user_id, challenge_id, name, category, timestamp)
            SELECT pc.user_id, pc.challenge_id, pc.name, pc.category, %s
            FROM pending_completions pc
            JOIN challenges c ON pc.challenge_id = c.id
            WHERE c.end_date < %s
            ON CONFLICT DO NOTHING
            """,
            (datetime.now(), today)
        )

        # Clear pending completions for ended challenges
        cur.execute(
            """
            DELETE FROM pending_completions
            WHERE challenge_id IN (
                SELECT id FROM challenges WHERE end_date < %s
            )
            """,
            (today,)
        )

        # Update user ratings based on completed_challenges
        cur.execute(
            """
            INSERT INTO user_ratings (user_id, rating)
            SELECT user_id, COUNT(*) AS rating
            FROM completed_challenges
            WHERE challenge_id IN (
                SELECT id FROM challenges WHERE end_date < %s
            )
            GROUP BY user_id
            ON CONFLICT (user_id)
            DO UPDATE SET rating = user_ratings.rating + EXCLUDED.rating
            """,
            (today,)
        )

        # Clear all challenges
        # cur.execute("DELETE FROM challenges")
        
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': 'Weekly reset completed'}), 200
    except Exception as e:
        print(f"Error during weekly reset: {e}")
        if conn:
            conn.rollback()
            cur.close()
            conn.close()
        return jsonify({'error': 'Failed to reset weekly challenges'}), 500

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            """
            SELECT u.email, ur.rating
            FROM user_ratings ur
            JOIN users u ON ur.user_id = u.id
            ORDER BY ur.rating DESC
            LIMIT 100
            """
        )
        leaderboard = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(leaderboard), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to fetch leaderboard'}), 500

# Scheduler setup
def reset_job():
    with app.app_context():
        weekly_reset()  # Call the reset endpoint logic directly

if __name__ == '__main__':
    scheduler = BackgroundScheduler(timezone='Asia/Kolkata')
    scheduler.add_job(reset_job, 'cron', hour=0, minute=0, id='weekly_reset_job')
    scheduler.start()

    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5002)
