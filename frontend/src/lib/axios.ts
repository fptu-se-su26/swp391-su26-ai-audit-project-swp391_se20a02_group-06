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

// Response interceptor — auto-logout on 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { isAuthenticated, logout } = useAuthStore.getState()
      if (isAuthenticated) {
        console.info('[Auth] Received 401 — session expired. Logging out.')
        logout()
        // Redirect to login page (works outside React context)
        window.location.href = window.location.origin + '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
