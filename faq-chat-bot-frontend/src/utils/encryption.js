/**
 * Utility for AES encryption for API security
 */
class EncryptionUtil {
  constructor() {
    // Get encryption key from environment variables
    this.escapedKey = import.meta.env.VITE_AES_ENCRYPTION_KEY;
    console.log(this.escapedKey);
    // Fallback for development if not set
    if (this.escapedKey) {
      // Unescape to get the original key with special characters
      this.encryptionKey = decodeURIComponent(this.escapedKey);
      console.log("Using key from environment:", this.encryptionKey);
    } else {
      console.warn("Encryption key not found in environment variables!");
    }
  }

  /**
   * Generate a random string of specified length
   * @param {number} length - Length of the random string
   * @returns {string} Random string
   */
  generateRandomString(length = 16) {
    // Generate cryptographically secure random bytes
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    
    // Convert to Base64 and trim to desired length
    return btoa(String.fromCharCode.apply(null, randomBytes))
      .replace(/[+/=]/g, '')  // Remove non-alphanumeric chars
      .substring(0, length);
  }

  /**
   * Encrypt a string using AES-CBC
   * @param {string} text - Text to encrypt
   * @returns {string} Base64 encoded encrypted string with IV prepended
   */
  async encrypt(text) {
    try {
      if (!this.encryptionKey) {
        throw new Error("Encryption key not available");
      }

      // Convert encryption key to ArrayBuffer
      const keyData = new TextEncoder().encode(this.encryptionKey);

      // Import the key
      const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "AES-CBC" },
        false,
        ["encrypt"]
      );

      // Generate random IV (16 bytes)
      const iv = crypto.getRandomValues(new Uint8Array(16));

      // Encrypt the data
      const data = new TextEncoder().encode(text);
      const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        key,
        data
      );

      // Combine IV and encrypted data
      const encryptedArray = new Uint8Array(
        iv.length + encryptedData.byteLength
      );
      encryptedArray.set(iv);
      encryptedArray.set(new Uint8Array(encryptedData), iv.length);

      // Convert to Base64
      return btoa(String.fromCharCode.apply(null, encryptedArray));
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  /**
   * Generate encrypted nonce for API requests
   * @returns {Promise<{nonce: string, timestamp: string}>} Object containing encrypted nonce and timestamp
   */
  async generateSecurityHeaders() {
    const timestamp = Date.now().toString();
    const nonce = this.generateRandomString(24);

    // Combine timestamp and nonce to prevent replay attacks
    const nonceWithTimestamp = `${nonce}|${timestamp}`;
    const encryptedNonce = await this.encrypt(nonceWithTimestamp);

    return {
      nonce: encryptedNonce,
      timestamp,
    };
  }
}

// Export as singleton
const encryptionUtil = new EncryptionUtil();
export default encryptionUtil;
