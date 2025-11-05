import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/LearnRecycling.css";

const HandleWaste = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5003/profile", {
          withCredentials: true,
          timeout: 5000,
        });
      } catch (err) {
        console.error("Auth check failed:", err.response?.data || err.message);
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="learn-recycling">
      <Navbar />
      <section
        className="learn-recycling-section"
        style={{
          backgroundColor: "#fff",
          border: "2px solid #4caf50",
          padding: "20px",
          maxWidth: "1200px",
          margin: "20px auto",
        }}
      >
        <h1
          style={{
            color: "#2e7d32",
            textAlign: "center",
            marginTop: "100px",
            marginBottom: "50px",
          }}
        >
          Learn Recycling
        </h1>
        <div
          className="columns"
          style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
        >
          <div
            className="column"
            style={{
              flex: "1",
              minWidth: "300px",
              border: "1px solid #4caf50",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h2 style={{ color: "#2e7d32", textAlign: "center" }}>
              Practice Recycling
            </h2>
            <p style={{ color: "#4caf50" }}>
              Learn how to sort and recycle plastics, paper, glass, and more.
            </p>
            <Link to="/learn/recyclable">
              <button
                style={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  marginTop: "44px",
                }}
              >
                Start Learning
              </button>
            </Link>
          </div>
          <div
            className="column"
            style={{
              flex: "1",
              minWidth: "300px",
              border: "1px solid #4caf50",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h2 style={{ color: "#2e7d32", textAlign: "center" }}>
              Master Composting
            </h2>
            <p style={{ color: "#4caf50" }}>
              Turn food scraps and organic waste into valuable compost.
            </p>
            <Link to="/learn/organic">
              <button
                style={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  marginTop: "44px",
                }}
              >
                Start Learning
              </button>
            </Link>
          </div>
          <div
            className="column"
            style={{
              flex: "1",
              minWidth: "300px",
              border: "1px solid #4caf50",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h2 style={{ color: "#2e7d32", textAlign: "center" }}>
              Handle Hazardous <br />
              Waste
            </h2>
            <p style={{ color: "#4caf50" }}>
              Safely dispose of batteries, chemicals, and other hazardous items.
            </p>
            <Link to="/learn/hazardous">
              <button
                style={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "5px",
                }}
              >
                Start Learning
              </button>
            </Link>
          </div>

            <div
              className="column"
              style={{
                flex: "1",
                minWidth: "300px",
                height: "235px",
                border: "1px solid #4caf50",
                padding: "15px",
                borderRadius: "5px",
                marginTop: "40px",
              }}
            >
              <h2 style={{ color: "#2e7d32", textAlign: "center" }}>
                Reduce Waste at Source
              </h2>
              <p style={{ color: "#4caf50" }}>
                Minimize Your Waste Footprint.
              </p>
              <Link to="/learn/reducewaste">
                <button
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    marginTop: "64px",
                  }}
                >
                  Start Learning
                </button>
              </Link>
            </div>
            <div
              className="column"
              style={{
                flex: "1",
                minWidth: "300px",
                border: "1px solid #4caf50",
                padding: "15px",
                borderRadius: "5px",
                marginTop: "40px",
              }}
            >
              <h2 style={{ color: "#2e7d32", textAlign: "center" }}>
                Upcycle Everyday Items
              </h2>
              <p style={{ color: "#4caf50" }}>
                Transform Trash into Treasure.
              </p>
              <Link to="/learn/reuse">
                <button
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    marginTop: "64px",
                  }}
                >
                  Start Learning
                </button>
              </Link>
            </div>
            <div
              className="column"
              style={{
                flex: "1",
                minWidth: "300px",
                border: "1px solid #4caf50",
                padding: "15px",
                borderRadius: "5px",
                marginTop: "40px",
              }}
            >
              <h2 style={{ color: "#2e7d32", textAlign: "center" }}>
                Manage E-Waste 
              </h2>
              <p style={{ color: "#4caf50" }}>
                Safeguard the Planet from E-Waste.
              </p>
              <Link to="/learn/ewaste">
                <button
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    marginTop: "64px",
                  }}
                >
                  Start Learning
                </button>
              </Link>
            </div>
        
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HandleWaste;
