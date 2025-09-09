import React from 'react'

type Props = { children: React.ReactNode; fallback?: React.ReactNode }

type State = { hasError: boolean; error?: any }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="container-apple py-16">
          <div className="rounded-xl border border-gray-200/50 bg-gray-100/20 p-6">
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm text-gray-600">Please refresh the page or go back to Learn.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

