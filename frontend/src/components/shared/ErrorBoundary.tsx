import { Component, type ErrorInfo, type ReactNode } from 'react'
import ErrorPage from '../../pages/ErrorPage'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled runtime error in React tree:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          errorCode="500"
          message={
            this.state.error?.message ||
            'Hệ thống phát sinh sự cố bất ngờ khi kết xuất giao diện. Vui lòng thử tải lại trang.'
          }
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
