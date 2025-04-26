import { useState, useRef, useEffect } from 'react'
import apiService from './services/api.service'
import { Message, MessageType } from './models/message.model'
import krishnaIcon from './assets/krishna.png'
import './App.css'

// Predefined questions about Bhagavad Gita
const predefinedQuestions = [
  {
    "question": "What is the Bhagavad Gita?"
  },
  {
    "question": "Who narrated the Bhagavad Gita?"
  },
  {
    "question": "What is the core message of the Bhagavad Gita?"
  },
  {
    "question": "Why did Arjuna refuse to fight in the war?"
  },
  {
    "question": "What is karma according to the Bhagavad Gita?"
  },
  {
    "question": "What is the significance of Krishna in the Gita?"
  },
  {
    "question": "What does the Gita say about life and death?"
  },
  {
    "question": "What is dharma in the context of the Gita?"
  },
  {
    "question": "How many chapters are there in the Bhagavad Gita?"
  },
  {
    "question": "What is the meaning of yoga in the Bhagavad Gita?"
  }
];

// Sudarshan Chakra SVG component with spinning animation
const SudarshanChakra = ({ size = "large" }) => (
  <div className={`chakra-container ${size === "small" ? "chakra-container-small" : ""}`}>
    <svg 
      className="chakra-svg" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="#d4af37" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="#d4af37" strokeWidth="1" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#d4af37" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="10" fill="#d4af37" />
      
      {/* Spokes */}
      {[...Array(24)].map((_, i) => (
        <line 
          key={i}
          x1="50" 
          y1="50" 
          x2={50 + 42 * Math.cos(i * Math.PI / 12)} 
          y2={50 + 42 * Math.sin(i * Math.PI / 12)} 
          stroke="#d4af37" 
          strokeWidth="1.5"
        />
      ))}
      
      {/* Triangle edges */}
      {[...Array(8)].map((_, i) => {
        const angle = i * Math.PI / 4;
        const x = 50 + 45 * Math.cos(angle);
        const y = 50 + 45 * Math.sin(angle);
        return (
          <path 
            key={`triangle-${i}`}
            d={`M ${x} ${y} L ${x + 8 * Math.cos(angle + Math.PI/2)} ${y + 8 * Math.sin(angle + Math.PI/2)} L ${x + 8 * Math.cos(angle - Math.PI/2)} ${y + 8 * Math.sin(angle - Math.PI/2)} Z`}
            fill="#d4af37"
          />
        );
      })}
    </svg>
  </div>
);

// Formatted message component for styling bot responses
const FormattedMessage = ({ content }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const messageRef = useRef(null);
  const timerRef = useRef(null);

  // Function to format text with markdown-like syntax
  const formatText = (text) => {
    // Replace bold text (**text**)
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace numbered points (1. **Point Title**:)
    formattedText = formattedText.replace(/(\d+\.\s+)(?:<strong>(.*?)<\/strong>)/g, 
      '<div class="point-number">$1</div><div class="point-title">$2</div>');
    
    // Add paragraph breaks
    formattedText = formattedText.split('\n').map(para => 
      `<div class="paragraph">${para}</div>`).join('');
    
    return formattedText;
  };

  // Clean markdown formatting for copying
  const cleanMarkdown = (text) => {
    // Remove **bold** syntax, keeping only the text inside
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  };

  useEffect(() => {
    return () => {
      // Clear any existing timers when component unmounts
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = (e) => {
    // Prevent event bubbling
    e.stopPropagation();
    
    // If already processing a click, return
    if (isClicked) return;
    
    // Set clicked state to prevent multiple rapid clicks
    setIsClicked(true);
    
    // Get plain text content with markdown removed
    const plainText = cleanMarkdown(content);
    
    // Use a more reliable clipboard method
    const copyToClipboard = async (text) => {
      try {
        // Use the newer clipboard API when available
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";  // Avoid scrolling to bottom
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
          } catch (err) {
            console.error('Fallback: Unable to copy', err);
            document.body.removeChild(textArea);
            return false;
          }
        }
      } catch (err) {
        console.error('Could not copy text: ', err);
        return false;
      }
    };
    
    copyToClipboard(plainText).then(success => {
      if (success) {
        setIsCopied(true);
        
        // Reset copied state after 2 seconds
        timerRef.current = setTimeout(() => {
          setIsCopied(false);
          setIsClicked(false);
        }, 2000);
      } else {
        console.error('Copy operation failed');
        setIsClicked(false);
      }
    });
  };

  return (
    <div className="formatted-message-container">
      <div 
        className="formatted-message"
        ref={messageRef}
        dangerouslySetInnerHTML={{ __html: formatText(content) }}
      />
      <button 
        className="copy-button" 
        onClick={handleCopy}
        aria-label="Copy to clipboard"
      >
        {isCopied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            <span className="tooltip">Copied!</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
            <span className="tooltip">Copy</span>
          </>
        )}
      </button>
    </div>
  );
};

function App() {
  const [userName, setUserName] = useState('Parth')
  const [inputName, setInputName] = useState('')
  const [isNameValid, setIsNameValid] = useState(false)
  const [chatStarted, setChatStarted] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastFailedQuestion, setLastFailedQuestion] = useState('') // Track the last question that failed
  const [hasError, setHasError] = useState(false) // Track if there's an error state
  const chatMessagesRef = useRef(null)

  // Validate name (3-15 characters)
  useEffect(() => {
    setIsNameValid(inputName.length >= 3 && inputName.length <= 15)
  }, [inputName])

  // Auto-scroll to the bottom of chat
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [messages])

  const handleStartChat = () => {
    if (isNameValid) {
      setUserName(inputName)
      setChatStarted(true)
    }
  }

  // Handle Enter key press in name input
  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter' && isNameValid) {
      e.preventDefault()
      handleStartChat()
    }
  }

  // Send a question to the API
  const sendQuestionToAPI = async (questionText, isRetry = false) => {
    setIsLoading(true)
    setHasError(false)
    
    try {
      const data = await apiService.askQuestion(userName, questionText)
      
      // Add bot response message
      const botMessage = Message.createBotMessage(data.answer || 'Sorry, I could not understand that.')
      setMessages(prev => [...prev, botMessage])
      
      setLastFailedQuestion('') // Clear any previous failed question
    } catch (error) {
      console.error('Error:', error)
      
      // Set error state and track the failed question
      setHasError(true)
      setLastFailedQuestion(questionText)
      
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
      setIsLoading(false)
    }
  }

  // Handle regenerate response
  const handleRegenerateResponse = () => {
    if (lastFailedQuestion) {
      sendQuestionToAPI(lastFailedQuestion, true)
    }
  }

  const handleQuestionSubmit = async (e) => {
    e.preventDefault()
    
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || isLoading) return
    
    // Add user message
    const userMessage = Message.createUserMessage(trimmedQuestion)
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    
    // Send the question to the API
    sendQuestionToAPI(trimmedQuestion)
  }

  // Function to handle clicking a suggestion chip
  const handleSuggestionClick = (question) => {
    if (isLoading || hasError) return;
    
    // Set the question in the input field
    setQuestion(question);
    
    // Automatically submit the question
    const userMessage = Message.createUserMessage(question);
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    
    // Send the question to the API
    sendQuestionToAPI(question);
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={krishnaIcon} alt="Krishna Icon" className="krishna-icon" />
          <span>Krishna FAQ Bot</span>
        </div>
        <div className="user-greeting">Hey {userName}</div>
      </nav>

      {/* Main Content */}
      <div className="chat-container">
        {!chatStarted ? (
          // Welcome Screen
          <div className="welcome-screen">
            <h1>Welcome to Krishna FAQ Bot</h1>
            <p>Please enter your name to begin</p>
            <div className="input-area" style={{ marginTop: '1rem' }}>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyPress={handleNameKeyPress}
                placeholder="Your name (3-15 characters)"
                maxLength={15}
              />
              <button 
                className={`btn ${isNameValid ? 'btn-primary' : 'btn-disabled'}`}
                onClick={handleStartChat}
                disabled={!isNameValid}
              >
                Start
              </button>
            </div>
            {inputName && !isNameValid && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>Name must be between 3-15 characters</p>
            )}
          </div>
        ) : (
          // Chat Interface
          <>
            <div className="chat-header">
              <h2>Ask me your problem related to life, I'll answer</h2>
            </div>
            
            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.length === 0 ? (
                <div className="empty-chat-container">
                  <SudarshanChakra />
                  <p className="empty-chat-message">Ask your first question below or try one of these:</p>
                  
                  <div className="suggestion-grid">
                    {predefinedQuestions.slice(0, 6).map((item, index) => (
                      <button 
                        key={index} 
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(item.question)}
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type === MessageType.USER ? 'user-message' : 'bot-message'} ${msg.error ? 'error-message' : ''}`}>
                    {msg.error ? (
                      <div className="error-content">
                        <p>{msg.content}</p>
                        <p className="error-text">Network error. Failed to respond.</p>
                      </div>
                    ) : msg.type === MessageType.USER ? (
                      msg.content
                    ) : (
                      <FormattedMessage content={msg.content} />
                    )}
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="loading">
                  <SudarshanChakra size="small" />
                  <p className="loading-text">Krishna is contemplating...</p>
                </div>
              )}
            </div>
            
            {hasError ? (
              <div className="regenerate-container">
                <button 
                  className="regenerate-button" 
                  onClick={handleRegenerateResponse}
                  disabled={isLoading}
                >
                  <svg className="retry-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6"></path>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  Regenerate Response
                </button>
              </div>
            ) : (
              <>
                {/* Suggestion chips above input */}
                <div className="suggestion-container">
                  <div className="suggestion-scroll">
                    {predefinedQuestions.map((item, index) => (
                      <button 
                        key={index} 
                        className="suggestion-chip"
                        onClick={() => handleSuggestionClick(item.question)}
                      >
                        {item.question}
                      </button>
                    ))}
                  </div>
                </div>
                
                <form onSubmit={handleQuestionSubmit} className="input-area">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask Krishna..."
                    maxLength={100}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>Send</button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
