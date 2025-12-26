from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import psycopg2
from datetime import datetime
import bcrypt
import re
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Session configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') 
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.getcwd(), 'flask_session')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
Session(app)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        dbname="smartwaste_db",
        user="postgres",
        password="keshav@98765", 
        host="localhost",
        port="5432"
    )
    return conn

# Validate email format
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Validate password
def is_valid_password(password):
    return len(password) >= 8 and any(c.isalpha() for c in password) and any(c.isdigit() for c in password)

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email', '')
        password = data.get('password', '')
        name = data.get('name', '')

        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        if not is_valid_password(password):
            return jsonify({"error": "Password must be at least 8 characters with letters and numbers"}), 400

        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO users (email, password_hash, name)
                VALUES (%s, %s, %s)
                RETURNING id, email, name
                """,
                (email, password_hash, name)
            )
            user = cursor.fetchone()
            conn.commit()
            session['user'] = {'id': user[0], 'email': user[1], 'name': user[2]}
            return jsonify({"message": "User registered successfully", "user": session['user']})
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            return jsonify({"error": "Email already exists"}), 400
        finally:
            cursor.close()
            conn.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '')
        password = data.get('password', '')

        if not email or not password:
            return jsonify({"error": "Missing email or password"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, email, password_hash, name
            FROM users
            WHERE email = %s
            """,
            (email,)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user or not bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
            return jsonify({"error": "Invalid email or password"}), 401

        session['user'] = {'id': user[0], 'email': user[1], 'name': user[3]}
        return jsonify({"message": "Login successful", "user": session['user']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully"})

@app.route('/profile', methods=['GET'])
def profile():
    if 'user' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"user": session['user']})

if __name__ == '__main__':
    os.makedirs(app.config['SESSION_FILE_DIR'], exist_ok=True)
    app.run(debug=True, port=5003)
