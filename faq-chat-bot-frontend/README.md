# Krishna FAQ Chatbot

A single-page application (SPA) that allows users to ask questions and receive answers from a backend API.

## Features

- User name input with validation (3-7 characters)
- Chat interface with question and answer display
- API integration for answering questions
- Responsive design (mobile and desktop friendly)
- Loading indicators and animations
- 100 character limit for questions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## API Integration

The application makes API calls to `http://localhost:8080/api/ask` with the following format:

```
curl --location 'http://localhost:8080/api/ask?username=Shivam' \
--header 'Content-Type: application/json' \
--data '{
    "question": "What is death?"
}'
```

Ensure your backend server is running and accessible at this endpoint.

## Building for Production

To build the application for production:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- React
- Vite
- CSS3 with animations
- Fetch API for backend communication
