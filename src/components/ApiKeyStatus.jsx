import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { checkGroqApiKey, testGroqApiConnection } from '../utils/apiUtils';

const ApiKeyStatus = ({ onStatusChange }) => {
  const [status, setStatus] = useState({ loading: true });

  useEffect(() => {
    const checkApiKey = async () => {
      // First, check if the API key is available in the environment
      const keyStatus = checkGroqApiKey();
      
      if (!keyStatus.isAvailable) {
        setStatus({
          loading: false,
          success: false,
          message: keyStatus.message
        });
        
        if (onStatusChange) {
          onStatusChange(false);
        }
        
        return;
      }
      
      // If the key is available, test the connection
      const connectionStatus = await testGroqApiConnection();
      
      setStatus({
        loading: false,
        success: connectionStatus.success,
        message: connectionStatus.message,
        models: connectionStatus.models
      });
      
      if (onStatusChange) {
        onStatusChange(connectionStatus.success);
      }
    };
    
    checkApiKey();
  }, [onStatusChange]);

  if (status.loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
        <p>Checking API key...</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${status.success ? 'bg-green-100' : 'bg-red-100'}`}>
      <div className="flex items-center">
        <div className={`w-4 h-4 rounded-full mr-3 ${status.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <p className={status.success ? 'text-green-800' : 'text-red-800'}>
          {status.message}
        </p>
      </div>
      
      {status.success && status.models && (
        <div className="mt-2">
          <p className="text-sm text-gray-700">Available models:</p>
          <ul className="text-xs text-gray-600 mt-1 ml-5 list-disc">
            {status.models.slice(0, 5).map(model => (
              <li key={model.id}>{model.id}</li>
            ))}
            {status.models.length > 5 && (
              <li>...and {status.models.length - 5} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

ApiKeyStatus.propTypes = {
  onStatusChange: PropTypes.func
};

export default ApiKeyStatus;
