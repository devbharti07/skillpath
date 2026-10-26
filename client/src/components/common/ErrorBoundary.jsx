import React from 'react';
import { AlertTriangle, RotateCcw, Home, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Safe diagnostic logging in development
    if (import.meta.env.DEV) {
      console.error('[SkillPath ErrorBoundary] Caught render error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isSubRoute = this.props.isRouteLevel;

      return (
        <div className={`flex flex-col items-center justify-center p-6 text-center ${isSubRoute ? 'py-16 min-h-[50vh]' : 'min-h-screen bg-slate-50 dark:bg-slate-950'}`}>
          <div className="glass-card max-w-lg w-full p-8 rounded-3xl border border-red-500/20 shadow-soft-lg space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-textMain-light dark:text-textMain-dark">
                {this.props.title || 'Something went wrong in this section'}
              </h2>
              <p className="text-xs sm:text-sm text-textMuted-light dark:text-textMuted-dark max-w-md mx-auto leading-relaxed">
                {this.props.message ||
                  'A runtime rendering issue was safely caught. Your data remains safely stored in your browser.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-md shadow-primary/20 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <a
                href="/dashboard"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark text-textMain-light dark:text-textMain-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Student Dashboard</span>
              </a>

              <a
                href="/"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark text-textMuted-light dark:text-textMuted-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </a>
            </div>

            {/* Diagnostic Details Toggle */}
            <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark text-left">
              <button
                type="button"
                onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-textMuted-light dark:text-textMuted-dark hover:text-textMain-light"
              >
                <span>Diagnostic Technical Details</span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                  <p className="text-red-400 font-bold mb-1">{this.state.error?.toString()}</p>
                  <pre className="text-slate-400 whitespace-pre-wrap">{this.state.errorInfo?.componentStack || 'No stack trace available.'}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
