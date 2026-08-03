import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5007/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('auth-storage')
      if (raw) {
        const parsed = JSON.parse(raw)
        const token = parsed?.state?.accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch {
      // Ignore parse errors
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ''
      const isAuthApi = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register') || requestUrl.includes('/auth/refresh')
      const currentPath = window.location.pathname
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/forgot-password'

      if (!isAuthApi && !isAuthPage) {
        try {
          const { logout } = useAuthStore.getState()
          logout()
        } catch {
          // Ignore storage errors
        }
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
