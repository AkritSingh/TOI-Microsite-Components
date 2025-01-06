import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // console.log('errorerrorerrorerror', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Report the Error to Some Error Reporting Service.
    // console.log('errorerrorerrorerror', error, errorInfo);

    console.error('getDerivedStateFromError:', error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;
    if (hasError) {
      return fallback;
    }

    return children;
  }
}

export default ErrorBoundary;
