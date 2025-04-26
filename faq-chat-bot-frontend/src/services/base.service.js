import { DEFAULT_HEADERS } from '../constants/api.constants';

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
   * Make a general request
   * @param {string} url - The URL to request
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} - The response data
   */
  async request(url, options = {}) {
    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers
    };

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      // Handle empty responses
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