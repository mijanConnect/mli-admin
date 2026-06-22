import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for now; replace with remote logging if available
     
    console.error("Unhandled error caught by ErrorBoundary:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{ padding: 20, textAlign: "center" }}
        >
          <h2>Something went wrong</h2>
          <p>
            An unexpected error occurred while rendering this part of the
            application. You can try to reload or go back to the home screen.
          </p>
          <div style={{ marginTop: 12 }}>
            <button onClick={this.handleReload} style={{ marginRight: 8 }}>
              Reload
            </button>
            <button onClick={this.handleGoHome}>Go to Home</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
