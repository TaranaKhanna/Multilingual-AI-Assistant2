import { useState, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import PropTypes from 'prop-types';

const AudioRecorder = ({ onAudioCaptured, language = 'en-US' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    setError(null);

    try {
      // Check if the browser supports the Web Speech API
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setError('Your browser does not support speech recognition. Try Chrome or Edge.');
        return;
      }

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onAudioCaptured(transcript);
      };

      recognition.onerror = (event) => {
        setError(`Error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      setError(`Failed to start recording: ${err.message}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className={`flex items-center justify-center p-3 rounded-full ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
        onClick={isRecording ? stopRecording : startRecording}
        title={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? <FaStop /> : <FaMicrophone />}
      </button>

      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}

      {isRecording && (
        <div className="mt-2 text-sm text-gray-600">Listening...</div>
      )}
    </div>
  );
};

AudioRecorder.propTypes = {
  onAudioCaptured: PropTypes.func.isRequired,
  language: PropTypes.string
};

export default AudioRecorder;
