import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// --- Error Boundary to catch crashes ---
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public state: ErrorBoundaryState;

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 40, color: '#991b1b', backgroundColor: '#fef2f2', height: '100vh', fontFamily: 'sans-serif'}}>
          <h1 style={{fontSize: '24px', marginBottom: '10px'}}>Something went wrong.</h1>
          <p>Please check the console for more details.</p>
          <pre style={{backgroundColor: '#fca5a5', padding: '20px', borderRadius: '8px', overflow: 'auto'}}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{marginTop: 20, padding: '10px 20px', cursor: 'pointer'}}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Polyfill for crypto.randomUUID if missing (prevents crashes in some browsers) ---
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
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);