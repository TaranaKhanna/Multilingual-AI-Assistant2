/**
 * Utility functions for API-related operations
 */

/**
 * Check if the Groq API key is available in the environment
 * @returns {Object} - Object with status and message
 */
export const checkGroqApiKey = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    return {
      isAvailable: false,
      message: 'Groq API key is missing. Please add VITE_GROQ_API_KEY to your .env file.'
    };
  }
  
  // Check if the API key has the expected format (starts with 'gsk_')
  if (!apiKey.startsWith('gsk_')) {
    return {
      isAvailable: false,
      message: 'Groq API key has an invalid format. It should start with "gsk_".'
    };
  }
  
  return {
    isAvailable: true,
    message: 'Groq API key is available and has the correct format.'
  };
};

/**
 * Test the Groq API connection
 * @returns {Promise} - Promise with the test result
 */
export const testGroqApiConnection = async () => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        message: 'Groq API key is missing. Please add VITE_GROQ_API_KEY to your .env file.'
      };
    }
    
    // Make a simple request to the Groq API to check if the key is valid
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.error?.message || 'Failed to connect to Groq API. Please check your API key.'
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: `Successfully connected to Groq API. Available models: ${data.data.length}`,
      models: data.data
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing Groq API connection: ${error.message}`
    };
  }
};
