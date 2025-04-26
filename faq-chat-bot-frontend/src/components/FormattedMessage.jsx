import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

/**
 * Formatted message component for styling bot responses
 * @param {Object} props - Component props
 * @param {string} props.content - The text content to format
 */
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

export default FormattedMessage; 