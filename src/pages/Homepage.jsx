import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Homepage.css";
import ContactSection from "../components/ContactSection";

const Homepage = () => {
  const [videoError, setVideoError] = useState(null);
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactError, setContactError] = useState(null);
  const [contactSuccess, setContactSuccess] = useState(null);

  const handleIframeError = () => {
    console.error("YouTube iframe failed to load");
    setVideoError("Failed to load YouTube video. Showing local video instead.");
  };

  useEffect(() => {
    console.log("Video section mounted");
  }, []);

  

  return (
    <div className="homepage">
      {/* Navbar */}

      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div>
          <h1>Welcome to SmartWaste</h1>
          <p>Your Partner in Sustainable Waste Management</p>
        </div>

        <Link to="/sort-waste" className="cta-button">
          Get Started
        </Link>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <h2>Learn Why Waste Management Matters</h2>
        {videoError ? (
          <div className="video-container">
            <p className="video-error">{videoError}</p>
            <video
              autoPlay
              muted
              loop
              onError={() => console.error("Local video failed to load")}
              style={{ width: "100%", maxWidth: "800px", height: "400px" }}
            >
              <source src="/videos/waste-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="video-placeholder">Local video fallback</p>
          </div>
        ) : (
          <div className="video-container">
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/0ZiD_Lb3Tm0?start=0"
              title="Waste Management Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handleIframeError}
            ></iframe>
            {/* <p className="video-placeholder">YouTube video should appear here</p> */}
          </div>
        )}
      </section>

      {/* Features Overview */}
      <section className="features">
        <h2>Our Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Sort Waste</h3>
            <p>
              Easily classify your waste as recyclable, organic, or hazardous.
            </p>
            <Link to="/sort-waste">Explore</Link>
          </div>
          <div className="feature-card">
            <h3>Community Challenge</h3>
            <p>Collaborate, Reduce, Recycle – Make a Difference Together!</p>
            <Link to="/community-challenges">Explore</Link>
          </div>
          <div className="feature-card">
            <h3>Schedule Pickup</h3>
            <p>Never miss a pickup – schedule it at your convenience.</p>
            <Link to="/schedule-pickup">Explore</Link>
          </div>
          <div className="feature-card">
            <h3>Handle Waste</h3>
            <p>Your guide to effective and eco-friendly waste handling.</p>
            <Link to="/learn-recycling">Explore</Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section
        className="about-us"
        style={{
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", textDecorationLine: "underline", fontWeight: "bold" }}>About Us</h2>
        <p style={{ maxWidth: "1100px", margin: "0 auto", color: "#333", fontSize: "1.2rem", textAlign: "justify"}}>
          SmartWaste is a pioneering platform committed to transforming waste
          management through cutting-edge technology and community engagement.
          Our vision is to create a cleaner, greener planet by empowering
          individuals, municipalities, and businesses to manage waste
          sustainably. From smart bins and route optimization to educational
          resources and recycling locators, we provide innovative tools to
          reduce landfill waste and promote a circular economy. Founded by a
          passionate team of environmentalists, engineers, and tech enthusiasts,
          SmartWaste collaborates with local communities to drive impactful
          change, ensuring a healthier environment for future generations.
        </p>
        <Link
          to="/about"
          className="cta-button"
          style={{ marginTop: "20px", display: "inline-block" }}
        >
          Learn More
        </Link>
      </section>
      
      {/* Contact Section */}
        
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
