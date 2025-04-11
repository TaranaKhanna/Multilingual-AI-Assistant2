import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const ChatMessage = ({ message, isUser }) => {
  const [isTyping, setIsTyping] = useState(!isUser);
  const [displayedContent, setDisplayedContent] = useState('');
  const content = message.content || '';

  // Simulate typing effect for AI responses
  useEffect(() => {
    if (isUser) {
      setDisplayedContent(content);
      return;
    }

    let index = 0;
    setDisplayedContent('');
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(prev => prev + content.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 15); // Adjust speed as needed

    return () => clearInterval(typingInterval);
  }, [content, isUser]);

  return (
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block max-w-[85%] px-4 py-2 rounded-lg ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        {isUser ? (
          <div className="text-left">{content}</div>
        ) : (
          <div className="text-left markdown-content">
            <ReactMarkdown>{displayedContent}</ReactMarkdown>
            {isTyping && <span className="typing-indicator">▌</span>}
          </div>
        )}
      </div>
      <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
        {isUser ? 'You' : 'AI Assistant'}
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  isUser: PropTypes.bool.isRequired
};

export default ChatMessage;
