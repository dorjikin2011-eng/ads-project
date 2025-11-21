import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- SERVICE WORKER KILL SWITCH ---
// This forces the browser to delete the old cache and service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      console.log('FORCE UNREGISTERING Service Worker:', registration);
      registration.unregister();
    }
  });
  // Also clear caches
  if ('caches' in window) {
    caches.keys().then((names) => {
        names.forEach((name) => {
            caches.delete(name);
        });
    });
  }
}

// --- Polyfill for crypto.randomUUID if missing (prevents crashes in some browsers) ---
if (!window.crypto) {
    // @ts-ignore
    window.crypto = {};
}
if (!window.crypto.randomUUID) {
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