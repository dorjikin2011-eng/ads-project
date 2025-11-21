import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- SERVICE WORKER KILL SWITCH ---
// This unregisters existing workers to fix the caching issue
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      // Unregister to clear old cache
      registration.unregister();
    }
  });
}

// --- Safe Polyfill for crypto.randomUUID ---
if (typeof window !== 'undefined' && !window.crypto) {
  // @ts-ignore
  window.crypto = {};
}
if (typeof window !== 'undefined' && window.crypto && !window.crypto.randomUUID) {
  // @ts-ignore
  window.crypto.randomUUID = () => {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).substring(2)
    );
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);