import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CardioVision Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 max-w-xl mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-slate-800 shadow-lg text-center">
          <h2 className="text-lg font-bold text-rose-700 mb-2">Display Component Notice</h2>
          <p className="text-xs text-slate-600 mb-4 font-mono bg-white p-3 rounded-lg border border-rose-100 text-left overflow-auto">
            {this.state.error?.message || 'Component failed to render'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition"
          >
            Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
