import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import WelcomeScreen from './components/WelcomeScreen'
import ChatInterface from './components/ChatInterface'
import authService from './services/auth.service'
import './App.css'

/**
 * Main application component
 */
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
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  // Validate name (3-15 characters)
  useEffect(() => {
    setIsNameValid(inputName.length >= 3 && inputName.length <= 15)
  }, [inputName])

  const handleStartChat = async () => {
    if (isNameValid) {
      setAuthLoading(true)
      setAuthError(null)
      
      try {
        // Generate token for the user
        await authService.generateToken(inputName)
        
        // Set the username and start the chat
        setUserName(inputName)
        setChatStarted(true)
      } catch (error) {
        console.error('Authentication error:', error)
        setAuthError('Failed to authenticate. Please try again.')
      } finally {
        setAuthLoading(false)
      }
    }
  }

  // Handle Enter key press in name input
  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter' && isNameValid) {
      e.preventDefault()
      handleStartChat()
    }
  }

  return (
    <div className="app">
      {/* Navbar */}
      <Navbar userName={userName} />

      {/* Main Content */}
      <div className="chat-container">
        {!chatStarted ? (
          // Welcome Screen
          <WelcomeScreen 
            inputName={inputName}
            setInputName={setInputName}
            isNameValid={isNameValid}
            handleStartChat={handleStartChat}
            handleNameKeyPress={handleNameKeyPress}
            isLoading={authLoading}
            error={authError}
          />
        ) : (
          // Chat Interface
          <ChatInterface 
            userName={userName}
            messages={messages}
            isLoading={isLoading}
            hasError={hasError}
            lastFailedQuestion={lastFailedQuestion}
            question={question}
            setMessages={setMessages}
            setIsLoading={setIsLoading}
            setHasError={setHasError}
            setQuestion={setQuestion}
            setLastFailedQuestion={setLastFailedQuestion}
          />
        )}
      </div>
    </div>
  )
}

export default App