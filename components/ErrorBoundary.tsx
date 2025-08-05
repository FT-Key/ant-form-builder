"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary atrapó un error:", error);
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    // Borra los logs guardados y resetea el estado
    localStorage.removeItem("renderErrors");
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded">
          <h2 className="text-lg font-semibold mb-1">
            ⚠ Error al renderizar el formulario
          </h2>
          <p className="mb-3">{this.state.error?.message}</p>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={this.handleReset}
          >
            Limpiar errores e intentar nuevamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
