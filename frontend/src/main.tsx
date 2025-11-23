import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios'; // Using axios for simplicity, as it's in package.json

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        // This URL should match the backend service name in docker-compose for inter-container communication,
        // and localhost:3000 for local development (without docker-compose up).
        // For now, we'll use localhost:3000 which will work if the backend is running directly on the host,
        // or if docker-compose maps it correctly.
        const response = await axios.get(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/');
        setMessage(response.data.message);
      } catch (err) {
        console.error('Error fetching from backend:', err);
        setError('Failed to connect to backend.');
      }
    };

    fetchBackendData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MemeMuseum Frontend</h1>
      <p>Attempting to connect to backend...</p>
      {message ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>Backend Message: {message}</p>
      ) : error ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
