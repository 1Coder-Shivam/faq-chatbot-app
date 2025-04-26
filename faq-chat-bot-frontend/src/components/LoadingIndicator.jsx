import React from 'react';
import SudarshanChakra from './SudarshanChakra';
import '../App.css';

/**
 * Loading indicator component shown while waiting for API response
 */
const LoadingIndicator = () => {
  return (
    <div className="loading">
      <SudarshanChakra size="small" />
      <p className="loading-text">Krishna is contemplating...</p>
    </div>
  );
};

export default LoadingIndicator; 