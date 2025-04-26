import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import WelcomeScreen from './components/WelcomeScreen'
import ChatInterface from './components/ChatInterface'
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

  // Validate name (3-15 characters)
  useEffect(() => {
    setIsNameValid(inputName.length >= 3 && inputName.length <= 15)
  }, [inputName])

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