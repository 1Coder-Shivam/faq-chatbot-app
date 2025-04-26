import React from 'react';
import '../App.css';

/**
 * Button to regenerate a response when there's an error
 * @param {Object} props - Component props
 * @param {Function} props.handleRegenerateResponse - Function to handle regenerating response
 * @param {boolean} props.isLoading - Whether the app is in loading state
 */
const RegenerateButton = ({ handleRegenerateResponse, isLoading }) => {
  return (
    <div className="regenerate-container">
      <p className="error-explanation">There was an error generating a response. Please try again.</p>
      <button 
        className="regenerate-button" 
        onClick={handleRegenerateResponse}
        disabled={isLoading}
      >
        <svg className="retry-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4v6h6"></path>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        Regenerate Response
      </button>
    </div>
  );
};

export default RegenerateButton; 