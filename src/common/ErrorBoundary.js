import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error,
    })
  }

  render() {
    const { hasError, error } = this.state
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            color: 'white',
            display: 'flex',
            fontFamily: 'Muli',
            width: '50%',
            margin: '0 auto',
            flexDirection: 'column',
            padding: 25,
            alignItems: 'center',
          }}
        >
          <div style={{ marginBottom: 25 }}>Whoops! Looks like we had a hiccup!</div>
          <div>It'd be great if you could let us know you saw this error:</div>
          <div style={{ margin: '25px 0', textDecoration: 'underline' }}>
            {error && error.message}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
