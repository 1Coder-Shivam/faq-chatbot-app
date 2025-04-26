import React from 'react';
import '../App.css';

/**
 * Component for displaying inline suggestions based on user input
 * @param {Object} props - Component props
 * @param {Array} props.suggestions - List of suggestions to display
 * @param {Function} props.handleSuggestionClick - Function to handle clicking a suggestion
 */
const SuggestionsList = ({ suggestions, handleSuggestionClick }) => {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="matching-suggestions">
      <div className="suggestions-list">
        {suggestions.map((item, index) => (
          <button 
            key={index} 
            className="suggestion-inline"
            onClick={() => handleSuggestionClick(item.question)}
          >
            {item.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsList; 