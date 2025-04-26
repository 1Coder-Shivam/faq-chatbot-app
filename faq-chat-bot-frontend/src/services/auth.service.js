import { DEFAULT_HEADERS } from '../constants/api.constants';

/**
 * Authentication service for handling user authentication
 */
class AuthService {
  constructor() {
    this.token = null;
  }

  /**
   * Get the stored token
   * @returns {string|null} The stored token or null if not set
   */
  getToken() {
    return this.token;
  }

  /**
   * Set the authentication token
   * @param {string} token - The token to store
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Check if user is authenticated (has token)
   * @returns {boolean} True if user has token, false otherwise
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Generate token for a username
   * @param {string} username - The username to generate token for
   * @returns {Promise<string>} The generated token
   */
  async generateToken(username) {
    try {
      const response = await fetch('http://localhost:8080/api/auth/token', {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ username })
      });

      if (!response.ok) {
        throw new Error(`Token generation failed with status ${response.status}`);
      }

      const data = await response.json();
      this.setToken(data.token);
      return data.token;
    } catch (error) {
      console.error('Auth Service Error:', error);
      throw error;
    }
  }
}

// Export as a singleton instance
const authService = new AuthService();
export default authService; 