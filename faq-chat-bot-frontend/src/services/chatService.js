import apiService from './api.service';
import { Message, MessageType } from '../models/message.model';

/**
 * Service for handling chat related functionality
 */
class ChatService {
  /**
   * Send a question to the API
   * @param {string} userName - Current user's name
   * @param {string} questionText - Question to send
   * @param {boolean} isRetry - Whether this is a retry attempt
   * @param {Function} setIsLoading - Function to update loading state
   * @param {Function} setHasError - Function to update error state
   * @param {Function} setMessages - Function to update messages array
   * @param {Function} setLastFailedQuestion - Function to update last failed question
   * @param {Array} messages - Current messages array
   * @param {Function} setSuggestions - Function to clear suggestions
   * @returns {Promise<void>}
   */
  async sendQuestionToAPI(
    userName, 
    questionText, 
    isRetry = false,
    setIsLoading,
    setHasError,
    setMessages,
    setLastFailedQuestion,
    messages,
    setSuggestions
  ) {
    setIsLoading(true);
    setHasError(false);
    setSuggestions([]); // Clear suggestions when sending a question
    
    try {
      const data = await apiService.askQuestion(userName, questionText);
      
      // Add bot response message
      const botMessage = Message.createBotMessage(data.answer || 'Sorry, I could not understand that.');
      setMessages(prev => [...prev, botMessage]);
      
      setLastFailedQuestion(''); // Clear any previous failed question
    } catch (error) {
      console.error('Error:', error);
      
      // Set error state and track the failed question
      setHasError(true);
      setLastFailedQuestion(questionText);
      
      // If this is the first attempt (not a retry), add an error message
      if (!isRetry) {
        // Find if the last message is a user message and replace it with an error message
        const updatedMessages = [...messages];
        if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].type === MessageType.USER) {
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: updatedMessages[updatedMessages.length - 1].content,
            error: true
          };
          setMessages(updatedMessages);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }
}

const chatService = new ChatService();
export default chatService; 