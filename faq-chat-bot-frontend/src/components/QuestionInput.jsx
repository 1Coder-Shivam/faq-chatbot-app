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
  return (
    <form onSubmit={handleQuestionSubmit} className="input-area">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask Krishna..."
        maxLength={100}
        autoFocus
      />
      <button type="submit" className="btn btn-primary" disabled={isLoading}>Send</button>
    </form>
  );
};

export default QuestionInput; 