import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../models/message.model';
import { predefinedQuestions } from '../constants/questions';
import ChatMessage from './ChatMessage';
import EmptyChatState from './EmptyChatState';
import LoadingIndicator from './LoadingIndicator';
import RegenerateButton from './RegenerateButton';
import QuestionInput from './QuestionInput';
import SuggestionsList from './SuggestionsList';
import chatService from '../services/chatService';
import useSuggestions from '../hooks/useSuggestions';
import '../App.css';

/**
 * Main chat interface component
 * @param {Object} props - Component props
 * @param {string} props.userName - Name of the current user
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.isLoading - Whether the app is in loading state
 * @param {boolean} props.hasError - Whether there's an error state
 * @param {string} props.lastFailedQuestion - The last question that failed
 * @param {string} props.question - Current question text
 * @param {Function} props.setMessages - Function to update messages array
 * @param {Function} props.setIsLoading - Function to update loading state
 * @param {Function} props.setHasError - Function to update error state
 * @param {Function} props.setQuestion - Function to update question text
 * @param {Function} props.setLastFailedQuestion - Function to update last failed question
 */
const ChatInterface = ({
  userName,
  messages,
  isLoading,
  hasError,
  lastFailedQuestion,
  question,
  setMessages,
  setIsLoading,
  setHasError,
  setQuestion,
  setLastFailedQuestion
}) => {
  const chatMessagesRef = useRef(null);
  const suggestions = useSuggestions(question, hasError);
  const [localSuggestions, setLocalSuggestions] = useState([]);

  // Update local suggestions when hook suggestions change
  useEffect(() => {
    setLocalSuggestions(suggestions);
  }, [suggestions]);

  // Auto-scroll to the bottom of chat
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to handle suggestion click
  const handleSuggestionClick = (questionText) => {
    if (isLoading || hasError) return;
    
    // Set the question in the input field
    setQuestion(questionText);
    
    // Automatically submit the question
    const userMessage = Message.createUserMessage(questionText);
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    
    // Send the question to the API
    sendQuestion(questionText);
  };

  // Function to send a question to the API
  const sendQuestion = (questionText, isRetry = false) => {
    chatService.sendQuestionToAPI(
      userName,
      questionText,
      isRetry,
      setIsLoading,
      setHasError,
      setMessages,
      setLastFailedQuestion,
      messages,
      setLocalSuggestions
    );
  };

  // Handle regenerate response
  const handleRegenerateResponse = () => {
    if (lastFailedQuestion) {
      sendQuestion(lastFailedQuestion, true);
    }
  };

  // Handle form submission
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;
    
    // Add user message
    const userMessage = Message.createUserMessage(trimmedQuestion);
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    
    // Send the question to the API
    sendQuestion(trimmedQuestion);
  };

  return (
    <>
      <div className="chat-header">
        <h2>Ask me your problem related to life, I'll answer</h2>
      </div>
      
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.length === 0 ? (
          <EmptyChatState 
            predefinedQuestions={predefinedQuestions} 
            handleSuggestionClick={handleSuggestionClick} 
          />
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}
        
        {isLoading && <LoadingIndicator />}
      </div>
      
      {hasError ? (
        <RegenerateButton 
          handleRegenerateResponse={handleRegenerateResponse} 
          isLoading={isLoading} 
        />
      ) : (
        <>
          <SuggestionsList 
            suggestions={localSuggestions} 
            handleSuggestionClick={handleSuggestionClick} 
          />
          
          <QuestionInput 
            question={question}
            setQuestion={setQuestion}
            handleQuestionSubmit={handleQuestionSubmit}
            isLoading={isLoading}
          />
        </>
      )}
    </>
  );
};

export default ChatInterface; 