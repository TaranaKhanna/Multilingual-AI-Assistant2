import { useState, useCallback, useEffect } from 'react';
import { sendMessage, processImage, processAudio, MODELS } from '../services/groqService';

const useChat = (initialMessages = [], options = {}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(options.language || 'en');
  const [model, setModel] = useState(options.model || MODELS.LLAMA3_8K);

  // Update language when options change
  useEffect(() => {
    if (options.language && options.language !== language) {
      setLanguage(options.language);
    }
  }, [options.language]);

  // Update model when options change
  useEffect(() => {
    if (options.model && options.model !== model) {
      setModel(options.model);
    }
  }, [options.model]);

  // We don't need to add a system message here anymore
  // as the groqService will handle that based on the language
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([]);
    }
  }, []);

  // Send a text message
  const sendTextMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      // Add user message to the chat
      const userMessage = { role: 'user', content: text };
      setMessages(prev => [...prev, userMessage]);

      // Send to API
      const allMessages = [...messages, userMessage];
      const response = await sendMessage(allMessages, { language, model });

      // Add AI response to the chat
      if (response.choices && response.choices.length > 0) {
        const assistantMessage = response.choices[0].message;
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No response from the assistant');
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language]);

  // Send an image with optional description
  const sendImageMessage = useCallback(async (imageData, description = '') => {
    setError(null);
    setIsLoading(true);

    try {
      // Add user message with image description
      const imageDesc = description.trim()
        ? `[Image with description]: ${description}`
        : '[Image without description]';

      const userMessage = { role: 'user', content: imageDesc };
      setMessages(prev => [...prev, userMessage]);

      // Process the image
      const response = await processImage(imageData, description, language, model);

      // Add AI response to the chat
      if (response.choices && response.choices.length > 0) {
        const assistantMessage = response.choices[0].message;
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No response from the assistant');
      }
    } catch (err) {
      setError(err.message || 'Failed to process image');
      console.error('Error processing image:', err);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Send audio transcript
  const sendAudioMessage = useCallback(async (transcript) => {
    if (!transcript.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      // Add user message with audio transcript
      const userMessage = {
        role: 'user',
        content: `[Voice input]: ${transcript}`
      };
      setMessages(prev => [...prev, userMessage]);

      // Process the audio transcript
      const response = await processAudio(transcript, language, model);

      // Add AI response to the chat
      if (response.choices && response.choices.length > 0) {
        const assistantMessage = response.choices[0].message;
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No response from the assistant');
      }
    } catch (err) {
      setError(err.message || 'Failed to process audio');
      console.error('Error processing audio:', err);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Change the language
  const changeLanguage = useCallback((newLanguage) => {
    setLanguage(newLanguage);
  }, []);

  // Change the model
  const changeModel = useCallback((newModel) => {
    setModel(newModel);
  }, []);

  return {
    messages,
    isLoading,
    error,
    language,
    model,
    sendTextMessage,
    sendImageMessage,
    sendAudioMessage,
    clearMessages,
    changeLanguage,
    changeModel
  };
};

export default useChat;
