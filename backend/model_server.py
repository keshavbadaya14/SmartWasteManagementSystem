from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import joblib
import tensorflow as tf
import numpy as np
import psycopg2
from datetime import datetime
import os
from dotenv import load_dotenv
import traceback

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')  # Match auth_server.py
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.getcwd(), 'flask_session')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
Session(app)

# Load models and preprocessors
logreg_model = joblib.load('logreg_model.joblib')
nn_model = tf.keras.models.load_model('nn_model.keras')
vectorizer = joblib.load('tfidf_vectorizer.joblib')
label_encoder = joblib.load('label_encoder.joblib')

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        dbname="smartwaste_db",
        user="postgres",
        password="keshav@98765",  # Replace with your actual password
        host="localhost",
        port="5432"
    )
    return conn

@app.route('/predict', methods=['POST'])
def predict():

    try:

        data = request.get_json()
        item_name = data.get('itemName', '').strip()
        description = data.get('description', '').strip()
        print("Recieved", data)
        if not item_name:
            return jsonify({"error": "Missing itemName or description"}), 400
        
        # Combine input
        input_text = f"{item_name} {description}"
        input_vec = vectorizer.transform([input_text]).toarray()
        
        # Predict
        logreg_prob = logreg_model.predict_proba(input_vec)[0]
        logreg_pred = label_encoder.inverse_transform(logreg_model.predict(input_vec))[0]
        nn_prob = nn_model.predict(input_vec, verbose=0)[0]
        nn_pred = label_encoder.inverse_transform([np.argmax(nn_prob)])[0]

        
        final_pred = nn_pred
        
        # Log to database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO waste_logs (item_name, description, category, timestamp)
            VALUES (%s, %s, %s, %s)
            """,
            (item_name, description, final_pred, datetime.now())
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "category": final_pred,
            "message": f"Item classified as {final_pred}",
            "logistic_regression_probabilities": {label: f"{prob:.3f}" for label, prob in zip(label_encoder.classes_, logreg_prob)},
            "neural_network_probabilities": {label: f"{prob:.3f}" for label, prob in zip(label_encoder.classes_, nn_prob)}
        })
    except Exception as e:
        print("Model server exception:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    os.makedirs(app.config['SESSION_FILE_DIR'], exist_ok=True)
    app.run(debug=True, port=5001)