import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5003/signup",
        { email, password, name },
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/sort-waste");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-container">
        <Navbar />
        <div className="auth-container">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., user@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters with letters and numbers"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name (Optional):</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Doe"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
