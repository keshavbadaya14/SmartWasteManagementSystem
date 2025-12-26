## 🌍 Smart Waste Management System

A full-stack waste-sorting and community-driven recycling application built using:

Frontend: React + Vite

Backend (Microservices):

auth_server.py – User authentication (Flask + Sessions)

server.js – Main API Gateway (Node.js + Express + PostgreSQL)

pickup_server.py – Waste pickup scheduling & community challenges (Flask)

Database: PostgreSQL

---

🚀 Features

1️⃣ Waste Sorting

The waste sorting feature uses a rule-based keyword classifier that analyzes the item name and description.
Based on predefined keywords, waste is categorized into Recyclable, Organic, Hazardous, or General Waste.


2️⃣ Waste Pickup Scheduling

Schedule a pickup by selecting date, time slot, waste type, address & notes.


3️⃣ Learning Section

Educational modules + quizzes for:

1. Recycling

2. Composting / Organic

3. Hazardous waste

4. Waste reduction

5. Reuse

6. E-Waste management
   

4️⃣ Community Challenges

Users can:

1. Join challenges

2. Create challenges

3. Track challenge completion

4. View leaderboard

5. Auto weekly reset (scheduler)

---

⚙️ Prerequisites

✔ Install Software

Node.js ≥ 18

Express.js (^4.19.2)

Python ≥ 3.10

PostgreSQL ≥ 14

npm / pip


✔ PostgreSQL Setup

Create a database:

```sql
CREATE DATABASE smartwaste_db;
```
Inside the database create required tables:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  name TEXT
);

-- Waste logs
CREATE TABLE waste_logs (
  id SERIAL PRIMARY KEY,
  item_name TEXT,
  description TEXT,
  category TEXT,
  timestamp TIMESTAMP
);

-- Learning Progress
CREATE TABLE learning_progress (
  user_id INT,
  lesson_id TEXT,
  completed BOOLEAN,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id)
);

-- Quiz Results
CREATE TABLE quiz_results (
  user_id INT,
  lesson_id TEXT,
  answers JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, lesson_id)
);

-- Pickup requests
CREATE TABLE pickup_requests (
  id SERIAL PRIMARY KEY,
  user_id INT,
  pickup_date DATE,
  pickup_time TEXT,
  waste_type TEXT,
  address TEXT,
  notes TEXT,
  status TEXT
);

-- Community Challenges
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  creator_id INT,
  name TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  goal FLOAT,
  category TEXT,
  scope TEXT,
  status TEXT
);

CREATE TABLE challenge_participants (
  user_id INT,
  challenge_id INT,
  PRIMARY KEY (user_id, challenge_id)
);

CREATE TABLE pending_completions (
  user_id INT,
  challenge_id INT,
  name TEXT,
  category TEXT
);

CREATE TABLE completed_challenges (
  user_id INT,
  challenge_id INT,
  name TEXT,
  category TEXT,
  timestamp TIMESTAMP
);

CREATE TABLE user_ratings (
  user_id INT PRIMARY KEY,
  rating INT
);
```
---

🔧 Environment Variables (.env)

Create .env inside backend folder:

```pqsql
PG_HOST=host
PG_USER=user
PG_PASSWORD=password
PG_DATABASE=database
PG_PORT=5432
PORT=port_number
SECRET_KEY=your_secret_key
```

▶️ How to Run the Entire Application

1️⃣ Start React Frontend

```arduino
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

2️⃣ Start Authentication Server (auth_server.py)

Handles login/signup & session management.

```bash
cd backend
pip install flask flask-cors flask-session python-dotenv psycopg2-binary bcrypt requests apscheduler 
python auth_server.py
```

Runs on: http://localhost:5003

3️⃣ Start Pickup + Challenges Server (pickup_server.py)

Schedules pickups + manages challenges.

```nginx
python pickup_server.py
```

4️⃣ Start Main API Gateway (server.js)

Controls waste sorting + quiz storage + learning progress.

```nginx
node server.js
```

Runs on: http://localhost:port

