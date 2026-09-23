import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'lenis/dist/lenis.css';
import './index.css';
import { warmImageCache } from './utils/imagePreload';

// Warm up critical image cache during idle cycles for instant zero-lag loading
warmImageCache();

/**
 * Application Entry Point
 * Mounts the root React component into the DOM.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

