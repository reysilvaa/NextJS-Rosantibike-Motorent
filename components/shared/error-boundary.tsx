"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Komponen untuk menangkap error yang terjadi pada rendering
 * Mencegah crash aplikasi secara keseluruhan
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state agar render fallback UI
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error ke service monitoring (bisa ditambahkan nanti)
    console.error("Error dalam komponen:", error)
    console.error("Error stack info:", errorInfo.componentStack)
  }
  
  // Reset error state ketika children berubah
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: null
      })
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI sederhana atau custom fallback
      return this.props.fallback || (
        <div className="p-4">
          {/* Tidak menampilkan apapun untuk mencegah UI yang rusak, 
              tapi sebenarnya bisa dibuat lebih informatif */}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 