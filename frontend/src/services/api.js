// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const foodAnalyzerApi = {
  // Analyze food image
  analyzeFood: async (imageData) => {
    try {
      const formData = new FormData();
      formData.append('image', imageData);
      const response = await api.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get scan history
  getScanHistory: async () => {
    try {
      const response = await api.get('/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get specific scan result
  getScanResult: async (scanId) => {
    try {
      const response = await api.get(`/results/${scanId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // You can add custom error handling here
    return Promise.reject(error);
  }
);

export default foodAnalyzerApi;