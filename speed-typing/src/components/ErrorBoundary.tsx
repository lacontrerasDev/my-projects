import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorProps {
  children: ReactNode;
  //   onReload: (() => void) | undefined;
}

interface ErrorState {
  hasError: boolean;
  errMsg: string | null;
}

export class ErrorBoundary extends Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = { hasError: false, errMsg: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errMsg: error.message || "unknown error" };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload() {
    // this.props.onReload!();
    this.setState({
      hasError: false,
      errMsg: null,
    });
  }

  errorMessage() {
    return (
      <>
        <h3>{this.state.errMsg}</h3>
      </>
    );
  }

  render() {
    if (this.state.hasError) {
      // return <h1>{this.errMsg}</h1>;
      return this.errorMessage();
    }

    return this.props.children;
  }
}
