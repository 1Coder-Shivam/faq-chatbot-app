import React from 'react';
import '../App.css';

/**
 * Component for the question input field and send button
 * @param {Object} props - Component props
 * @param {string} props.question - Current question text
 * @param {Function} props.setQuestion - Function to update question text
 * @param {Function} props.handleQuestionSubmit - Function to handle question submission
 * @param {boolean} props.isLoading - Whether the app is in loading state
 */
const QuestionInput = ({ 
  question, 
  setQuestion, 
  handleQuestionSubmit,
  isLoading 
}) => {
  const remainingChars = 100 - question.length;
  
  return (
    <form onSubmit={handleQuestionSubmit} className="input-area">
      <div className="input-container">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask Krishna about life, dharma, or spirituality..."
          maxLength={100}
          autoFocus
        />
        <span className="char-counter">{remainingChars}</span>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isLoading}>Send</button>
    </form>
  );
};

export default QuestionInput; 