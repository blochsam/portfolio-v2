import React, { Component } from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center text-center px-6">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#24A2A7] mb-4">Something went wrong</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-[12px] font-mono uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
