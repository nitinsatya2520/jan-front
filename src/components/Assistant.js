import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Assistant.css'; // Import the CSS file

const Assistant = () => {
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Function to start the assistant
  const startAssistant = async () => {
    try {
      await axios.post('http://localhost:5000/ask', { command: 'hey jan' });
      setIsListening(true); // Start polling for responses
      setResponse('Listening for response...');
    } catch (error) {
      console.error('Error sending command:', error);
      setResponse('Error occurred while communicating with the server.');
    }
  };

  // Function to poll the server for updates
  const pollServer = async () => {
    if (!isListening) return;

    try {
      const result = await axios.post('http://localhost:5000/ask', { command: 'hey jan' });
      setResponse(result.data);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse('Error occurred while fetching the response.');
      setIsListening(false); // Stop polling on error
    }
  };

  // Poll the server every 3 seconds
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      pollServer();
    }, 3000); // Adjust the interval as needed

    // Cleanup interval on component unmount or when polling stops
    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <div className="assistant-container">
      <button className="assistant-button" onClick={startAssistant}>Start Assistant</button>
      <div className="response-container">
        <div className="response-title">Response:</div>
        <div className="response-text">{response}</div>
      </div>
    </div>
  );
};

export default Assistant;
