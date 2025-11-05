// ContactSection.jsx

import React from "react";
import "../css/ContactSection.css";

const ContactSection = () => {
  return (
    <div className="contact">
      <h2 className="heading">Contact Us</h2>
      <div className="contact-container">
      <div className="contact-left">
        <h5 className="highlight-1">Get In Touch</h5>
        <h2>We are always ready to help you and answer your questions</h2>
        <p>
          Whether you have a question, a suggestion, or just want to say hello,
          this is the place to do it. Please fill out the form below with your
          details and message, and we'll get back to you as soon as possible.
        </p>
        <div className="contact-info">
          <div style={{ display: "flex", gap: "200px" }}>
            <p>
              <span>🕒</span> <strong>We're Open</strong>
              <br />
              Monday - Friday 08.00 - 18.00
            </p>
            <p>
              <span>📍</span> <strong>Office Location</strong>
              <br />
              100 S Main St, New York, NY
            </p>
          </div>
          <div style={{ display: "flex", gap: "270px" }}>
            <p>
              <span>📞</span> <strong>Call Us Directly</strong>
              <br />
              +1123 456 789
            </p>
            <p>
              <span>✉️</span> <strong>Send a Message</strong>
              <br />
              contact@wastewise.com
            </p>
          </div>
        </div>
      </div>

      <div className="contact-right">
        <h2 className="highlight">Get In Touch</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="Your Phone" required />
          <textarea placeholder="Your Message" rows="3" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default ContactSection;
