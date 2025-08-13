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

  // Cuando ocurre un error en algún hijo, actualizamos el estado para mostrar UI alternativa
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Aquí podemos hacer logging o enviar error a un servicio externo
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary atrapó un error:", error);
    this.props.onError?.(error, info);
  }

  // Limpia el error actual y borra logs guardados en localStorage
  handleReset = () => {
    localStorage.removeItem("renderErrors");
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded space-y-3">
          <h2 className="text-lg font-semibold">
            ⚠ Error al renderizar el formulario
          </h2>
          <p>{this.state.error?.message}</p>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={this.handleReset}
            type="button"
          >
            Limpiar errores e intentar nuevamente
          </button>
        </div>
      );
    }

    // Renderizamos los hijos normalmente si no hay error
    return this.props.children;
  }
}
