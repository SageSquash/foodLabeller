// src/hooks/useApi.js
import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000'; // You might want to move this to an env variable

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeCall = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add specific API function for image analysis
  const analyzeImage = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return executeCall(async () => {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    });
  }, [executeCall]);

  return {
    loading,
    error,
    executeCall,
    analyzeImage, // Add the new function to the returned object
  };
};