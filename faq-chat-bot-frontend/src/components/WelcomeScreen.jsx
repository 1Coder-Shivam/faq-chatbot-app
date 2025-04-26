import React from 'react';
import '../App.css';

/**
 * Welcome screen component for user name input
 * @param {Object} props - Component props
 * @param {string} props.inputName - Input name value
 * @param {Function} props.setInputName - Function to update input name
 * @param {boolean} props.isNameValid - Whether the name is valid
 * @param {Function} props.handleStartChat - Function to handle starting chat
 * @param {Function} props.handleNameKeyPress - Function to handle key press events
 * @param {boolean} props.isLoading - Whether the authentication is loading
 * @param {string} props.error - Authentication error message if any
 */
const WelcomeScreen = ({ 
  inputName, 
  setInputName, 
  isNameValid, 
  handleStartChat, 
  handleNameKeyPress,
  isLoading,
  error
}) => {
  return (
    <div className="welcome-screen">
      <h1>Welcome to Krishna FAQ Bot</h1>
      <p>Please enter your name to begin</p>
      <div className="input-area" style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyPress={handleNameKeyPress}
          placeholder="Your name (3-15 characters)"
          maxLength={15}
          disabled={isLoading}
        />
        <button 
          className={`btn ${isNameValid && !isLoading ? 'btn-primary' : 'btn-disabled'}`}
          onClick={handleStartChat}
          disabled={!isNameValid || isLoading}
        >
          {isLoading ? 'Loading...' : 'Start'}
        </button>
      </div>
      {inputName && !isNameValid && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>Name must be between 3-15 characters</p>
      )}
      {error && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>
      )}
    </div>
  );
};

export default WelcomeScreen; 