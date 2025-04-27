# FAQ Chatbot App

A full-stack FAQ Chatbot application powered by a Spring Boot backend and React frontend, delivering intelligent answers inspired by the Bhagavad Gita.

---

## 🚀 Features
- **Intelligent FAQ Search**: Automatically matches user queries to pre-defined FAQs.
- **Bhagavad Gita Insights**: If no FAQ match is found, the chatbot answers with wisdom from the Bhagavad Gita.
- **User-Friendly Interface**: React frontend for easy and smooth interaction.
- **Real-Time Interaction**: Quick responses to help users find answers efficiently.
- **Security**: JWT authentication and replay attack prevention using AES-encrypted nonces.

---

## 📦 Tech Stack
- **Backend**: Spring Boot (Java)
- **Frontend**: React (Vite)

---

## ⚡ Setup Instructions

### Prerequisites
- **Backend**: Java 21+, Maven
- **Frontend**: Node.js (v14+), npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/1Coder-Shivam/faq-chatbot-app.git
cd faq-chatbot-app
```

### 2. Backend Setup
```bash
cd faq-chat-bot-backend
# Configure environment variables (see below)
mvn clean install
mvn spring-boot:run
```

#### Backend Environment Variables
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: Token expiration time in milliseconds
- `NONCE_ENCRYPTION_KEY`: Secret key for AES encryption of nonces (shared with frontend)
- `OPENAI_API_KEY`: OpenAI API key

### 3. Frontend Setup
```bash
cd faq-chat-bot-frontend
npm install
npm run dev
```

---

## 🧠 Summary of Approach

This project is a secure, full-stack FAQ chatbot:
- **Frontend**: React SPA for user interaction, input validation, and chat display. Integrates with backend via secure API calls, including JWT authentication and AES-encrypted nonces to prevent replay attacks.
- **Backend**: Spring Boot REST API. Handles authentication (JWT), validates and answers user questions. If a question matches a pre-defined FAQ, it returns the answer; otherwise, it provides wisdom from the Bhagavad Gita (potentially using OpenAI API).
- **Security**: All API requests (except token generation) require a valid JWT and unique AES-encrypted nonce with timestamp headers to prevent replay attacks. Nonces are validated for uniqueness and freshness.

---

## 🔗 API Integration Notes

### Endpoints
- `POST /api/auth/token`: Generate JWT token
- `POST /api/ask`: Get answers from the chatbot

### Security Headers (for `/api/ask`)
- `Authorization: Bearer <JWT_TOKEN>`
- `X-Nonce: <AES-encrypted unique nonce>`
- `X-Timestamp: <current timestamp in ms>`

### Example Request
```bash
curl --location 'http://localhost:8080/api/ask?username=YourName' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <JWT_TOKEN>' \
--header 'X-Nonce: <ENCRYPTED_NONCE>' \
--header 'X-Timestamp: <TIMESTAMP>' \
--data '{
    "question": "What is death?"
}'
```

### Nonce Generation (Frontend Example)
```js
// AES encryption utility for the frontend
class AesUtil {
  constructor(key) {
    this.key = CryptoJS.enc.Utf8.parse(key);
  }
  encrypt(plaintext) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plaintext, this.key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    const ivAndEncrypted = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(ivAndEncrypted);
  }
}
const generateEncryptedNonce = () => {
  const timestamp = Date.now();
  const randomData = CryptoJS.lib.WordArray.random(16).toString();
  const nonceData = `${timestamp}:${randomData}`;
  const aesUtil = new AesUtil('<YOUR_NONCE_ENCRYPTION_KEY>');
  return aesUtil.encrypt(nonceData);
};
```
> **Note:** The nonce encryption key must match the backend's `NONCE_ENCRYPTION_KEY`. Sharing this key with the frontend is only recommended for development or low-security use cases.

### Security Constraints
- Each nonce is AES-encrypted with the shared key
- Nonces contain an embedded timestamp and random data
- Each nonce can only be used once
- Timestamps must be within 5 minutes of the server time
- Requests from the same user must be at least 1 second apart (rate limiting)
- Requests with expired or used nonces will be rejected

---

## 📄 License
MIT
