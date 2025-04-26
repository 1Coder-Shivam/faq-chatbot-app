import { useState, useEffect } from 'react';
import { predefinedQuestions, keywordMap } from '../constants/questions';

/**
 * Custom hook to handle question suggestions based on user input
 * @param {string} question - The current question input
 * @param {boolean} hasError - Whether there's an error state
 * @returns {Array} Array of matching question suggestions
 */
export const useSuggestions = (question, hasError) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!question.trim() || question.length < 3 || hasError) {
      setSuggestions([]);
      return;
    }

    // Extract keywords from the input
    const words = question.toLowerCase().split(/\s+/);
    const matchedIndices = new Set();

    // Check each word against our keyword map
    words.forEach(word => {
      if (word.length >= 3) { // Only consider words with at least 3 characters
        // Check for partial matches in our keywords
        Object.keys(keywordMap).forEach(keyword => {
          if (keyword.includes(word) || word.includes(keyword)) {
            keywordMap[keyword].forEach(index => matchedIndices.add(index));
          }
        });
      }
    });

    // Get the matching questions
    const matches = Array.from(matchedIndices)
      .map(index => predefinedQuestions[index])
      .slice(0, 3); // Limit to 3 suggestions

    setSuggestions(matches);
  }, [question, hasError]);

  return suggestions;
};

export default useSuggestions; 