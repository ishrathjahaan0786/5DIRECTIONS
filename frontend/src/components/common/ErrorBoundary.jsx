import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Caught error in ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFCF7] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-pure-white p-8 rounded-2xl shadow-card border border-crimson-red/20">
            <div className="w-12 h-12 rounded-xl bg-crimson-red/10 text-crimson-red flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">error_outline</span>
            </div>
            <h2 className="text-xl font-bold text-deep-navy mb-2">Something went wrong</h2>
            <p className="text-sm text-text-muted mb-4">
              An unexpected error occurred while rendering this page:
            </p>
            <pre className="bg-gray-100 p-3 rounded-lg text-xs text-left overflow-x-auto text-red-600 mb-6 font-mono">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/'
              }}
              className="btn-primary w-full py-2.5 text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
