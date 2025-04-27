import { DEFAULT_HEADERS } from '../constants/api.constants';
import authService from './auth.service';
import encryptionUtil from '../utils/encryption';

/**
 * Base service with common HTTP request methods
 */
export default class BaseService {
  /**
   * Make a GET request
   * @param {string} url - The URL to request
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The response data
   */
  async get(url, options = {}) {
    return this.request(url, { 
      method: 'GET', 
      ...options 
    });
  }

  /**
   * Make a POST request
   * @param {string} url - The URL to request
   * @param {Object} data - The data to send
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The response data
   */
  async post(url, data, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * Add authorization header with token if available
   * @param {Object} headers - Existing headers object
   * @returns {Object} - Headers with authorization
   */
  addAuthHeader(headers = {}) {
    const token = authService.getToken();
    
    if (!token) return headers;
    
    return {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Add security headers (X-Nonce and X-Timestamp)
   * @param {Object} headers - Existing headers object
   * @returns {Promise<Object>} - Headers with security additions
   */
  async addSecurityHeaders(headers = {}) {
    const { nonce, timestamp } = await encryptionUtil.generateSecurityHeaders();
    
    return {
      ...headers,
      'X-Nonce': nonce,
      'X-Timestamp': timestamp
    };
  }

  /**
   * Make a general request
   * @param {string} url - The URL to request
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} - The response data
   */
  async request(url, options = {}) {
    // Add auth header
    let headers = this.addAuthHeader({
      ...DEFAULT_HEADERS,
      ...options.headers
    });
    
    // Add security headers
    headers = await this.addSecurityHeaders(headers);

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      // Handle token expiration (401 Unauthorized)
      if (response.status === 401 && authService.username) {
        // Try to refresh the token
        await authService.refreshToken();
        
        // Update headers with new token
        headers = this.addAuthHeader({
          ...DEFAULT_HEADERS,
          ...options.headers
        });
        
        // Add fresh security headers for retry
        headers = await this.addSecurityHeaders(headers);
        
        // Retry the request with new token and security headers
        const retryResponse = await fetch(url, {
          ...config,
          headers
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Request failed with status ${retryResponse.status}`);
        }
        
        // Parse and return the response
        const contentType = retryResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await retryResponse.json();
        }
        return await retryResponse.text();
      }
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      // Handle regular response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('Request Error:', error);
      throw error;
    }
  }
} 