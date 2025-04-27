# FAQ Chatbot Backend

Backend service for the Bhagavad Gita FAQ chatbot application.

## Security Features

### Replay Attack Prevention with AES-Encrypted Nonces

To prevent replay attacks, all API requests (except the token endpoint) must include the following headers:

1. `X-Nonce`: An AES-encrypted unique string for each request
2. `X-Timestamp`: Current timestamp in milliseconds

The nonce is encrypted on the frontend using the same encryption key as the backend. 

**IMPORTANT SECURITY NOTE**: Sharing the encryption key with the frontend has security implications. The key becomes visible to users who inspect the code. Consider this approach only for development or lower-security applications.

Example client-side implementation:

```javascript
// AES encryption utility for the frontend
class AesUtil {
  constructor(key) {
    this.key = CryptoJS.enc.Utf8.parse(key);
  }

  encrypt(plaintext) {
    // Generate random IV
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Encrypt
    const encrypted = CryptoJS.AES.encrypt(plaintext, this.key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    
    // Combine IV and encrypted part
    const ivAndEncrypted = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(ivAndEncrypted);
  }
}

// Generate nonce and encrypt it
const generateEncryptedNonce = () => {
  const timestamp = Date.now();
  const randomData = CryptoJS.lib.WordArray.random(16).toString();
  const nonceData = `${timestamp}:${randomData}`;
  
  // Use the same key as on the server
  const aesUtil = new AesUtil('G8x#P9y$A2z@Q7w!');
  return aesUtil.encrypt(nonceData);
};

// Use the encrypted nonce for API requests
const makeApiRequest = async (url, data) => {
  const timestamp = Date.now();
  const nonce = generateEncryptedNonce();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Nonce': nonce,
      'X-Timestamp': timestamp.toString()
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
};
```

To use the above code, you need to include the CryptoJS library in your project:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
```

### Security Constraints

- Each nonce is AES-encrypted with the shared key
- Nonces contain an embedded timestamp and random data
- Each nonce can only be used once
- Timestamps must be within 5 minutes of the server time
- Requests from the same user must be at least 1 second apart (rate limiting)
- Requests with expired or used nonces will be rejected

## API Endpoints

- `POST /api/auth/token`: Generate JWT token
- `POST /api/ask`: Get answers from the chatbot

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: Token expiration time in milliseconds
- `NONCE_ENCRYPTION_KEY`: Secret key for AES encryption of nonces (shared with frontend)
- `OPENAI_API_KEY`: OpenAI API key 