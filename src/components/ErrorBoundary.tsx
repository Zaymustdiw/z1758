import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps>;
  declare state: ErrorBoundaryState;
  declare setState: (
    state: ErrorBoundaryState | ((prevState: Readonly<ErrorBoundaryState>) => ErrorBoundaryState)
  ) => void;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let userFriendlyMessage = 'A security or connection check interrupted this action.';
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.error) {
        userFriendlyMessage = parsed.error.includes('Missing or insufficient permissions')
          ? 'Permission denied by server security rules. Please verify your email and account permissions.'
          : parsed.error;
      }
    } catch {
      if (error.message) {
        userFriendlyMessage = error.message;
      }
    }
    return { hasError: true, message: userFriendlyMessage };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold">Security / Runtime Guard</h1>
            <p className="text-sm text-zinc-400 leading-relaxed">{this.state.message}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.href = '/';
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Return Safely
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
