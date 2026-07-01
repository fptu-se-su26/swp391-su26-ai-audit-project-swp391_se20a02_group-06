import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5007/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add the auth token header to requests
apiClient.interceptors.request.use(
  (config) => {
    // Zustand persist stores state under 'auth-storage' as JSON: { state: { accessToken, ... }, version: 0 }
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

export default apiClient
