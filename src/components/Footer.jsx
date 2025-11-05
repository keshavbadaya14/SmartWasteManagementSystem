import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>SmartWaste © 2025 | <Link to="/about">About</Link> | <Link to="/contact">Contact</Link> | <Link to="/privacy">Privacy Policy</Link></p>
      <p>Making Waste Management Smarter</p>
    </footer>
  );
};

export default Footer;