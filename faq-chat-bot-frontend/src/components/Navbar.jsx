import React from 'react';
import krishnaIcon from '../assets/krishna.png';
import '../App.css';

/**
 * Navbar component with logo and user greeting
 * @param {Object} props - Component props
 * @param {string} props.userName - Name of the current user
 */
const Navbar = ({ userName }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={krishnaIcon} alt="Krishna Icon" className="krishna-icon" />
        <span>Krishna FAQ Bot</span>
      </div>
      <div className="user-greeting">Hey {userName}</div>
    </nav>
  );
};

export default Navbar; 