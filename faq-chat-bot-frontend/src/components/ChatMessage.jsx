import React from 'react';
import { MessageType } from '../models/message.model';
import FormattedMessage from './FormattedMessage';
import '../App.css';

/**
 * Component for displaying an individual chat message
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object to display
 */
const ChatMessage = ({ message }) => {
  return (
    <div className={`message ${message.type === MessageType.USER ? 'user-message' : 'bot-message'} ${message.error ? 'error-message' : ''}`}>
      {message.error ? (
        <div className="error-content">
          <p>{message.content}</p>
          <p className="error-text">Network error. Failed to respond.</p>
        </div>
      ) : message.type === MessageType.USER ? (
        message.content
      ) : (
        <FormattedMessage content={message.content} />
      )}
    </div>
  );
};

export default ChatMessage; 