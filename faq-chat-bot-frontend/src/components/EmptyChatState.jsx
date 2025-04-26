import React from 'react';
import SudarshanChakra from './SudarshanChakra';
import '../App.css';

/**
 * Component displayed when chat has no messages yet, shows suggestions
 * @param {Object} props - Component props
 * @param {Array} props.predefinedQuestions - List of predefined question objects
 * @param {Function} props.handleSuggestionClick - Function to handle clicking a suggestion
 */
const EmptyChatState = ({ predefinedQuestions, handleSuggestionClick }) => {
  return (
    <div className="empty-chat-container">
      <SudarshanChakra />
      <p className="empty-chat-message">Ask your first question below or try one of these:</p>
      
      <div className="suggestion-grid">
        {predefinedQuestions.map((item, index) => (
          <button 
            key={index} 
            className="suggestion-chip"
            onClick={() => handleSuggestionClick(item.question)}
          >
            {item.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyChatState; 