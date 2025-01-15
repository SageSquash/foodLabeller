// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline
import theme from './theme'; // Import your theme configuration
import App from './App.jsx';
import './styles/global.css';

console.log('Main.jsx executing');

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('Root element found:', document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS and set up base styles */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);