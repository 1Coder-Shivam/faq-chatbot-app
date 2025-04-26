import { API_ENDPOINTS, HTTP_METHODS } from '../constants/api.constants';
import BaseService from './base.service';

/**
 * API Service for handling all API requests
 */
class ApiService extends BaseService {
  /**
   * Ask a question to the backend API
   * @param {string} username - The username of the requester
   * @param {string} question - The question to ask
   * @returns {Promise<Object>} The response data from the API
   * @throws {Error} If the request fails
   */
  async askQuestion(username, question) {
    try {
      return await this.post(`${API_ENDPOINTS.ASK}?username=${username}`, { question });
    } catch (error) {
      console.error('API Service Error:', error);
      throw error;
    }
  }
}

// Export as a singleton instance
const apiService = new ApiService();
export default apiService; 