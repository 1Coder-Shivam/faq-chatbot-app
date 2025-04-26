import { DEFAULT_HEADERS } from '../constants/api.constants';

/**
 * Authentication service for handling user authentication
 */
class AuthService {
  constructor() {
    this.token = null;
    this.username = null;
    this.tokenExpiry = null;
  }

  /**
   * Get the stored token
   * @returns {string|null} The stored token or null if not set
   */
  getToken() {
    // Check if token is expired and username exists to refresh
    if (this.isTokenExpired() && this.username) {
      this.refreshToken();
    }
    return this.token;
  }

  /**
   * Set the authentication token and calculate expiry
   * @param {string} token - The token to store
   */
  setToken(token) {
    this.token = token;
    
    // Set expiry time (5 minutes from now)
    this.tokenExpiry = Date.now() + 4.5 * 60 * 1000; // 4.5 minutes in milliseconds to refresh before expiry
  }

  /**
   * Check if token is expired
   * @returns {boolean} True if token is expired or about to expire
   */
  isTokenExpired() {
    if (!this.tokenExpiry) return true;
    return Date.now() >= this.tokenExpiry;
  }

  /**
   * Check if user is authenticated (has token)
   * @returns {boolean} True if user has valid token, false otherwise
   */
  isAuthenticated() {
    return !!this.token && !this.isTokenExpired();
  }

  /**
   * Generate token for a username
   * @param {string} username - The username to generate token for
   * @returns {Promise<string>} The generated token
   */
  async generateToken(username) {
    try {
      this.username = username; // Store username for token refresh
      
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

  /**
   * Refresh the token
   * @returns {Promise<string>} The refreshed token
   */
  async refreshToken() {
    if (!this.username) {
      throw new Error('Cannot refresh token: No username stored');
    }
    
    return this.generateToken(this.username);
  }
}

// Export as a singleton instance
const authService = new AuthService();
export default authService; 