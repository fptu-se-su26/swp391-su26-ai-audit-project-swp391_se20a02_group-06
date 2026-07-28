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

// Response interceptor to handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops if refresh-token API itself returns 401
    if (originalRequest.url === '/auth/refresh-token') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const raw = localStorage.getItem('auth-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          const refreshToken = parsed?.state?.refreshToken;
          const accessToken = parsed?.state?.accessToken;

          if (refreshToken && accessToken) {
            // Call refresh-token using a new axios instance to avoid interceptors loop
            const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`, {
              accessToken,
              refreshToken,
            });

            // Parse and update the local storage directly to avoid circular dependency with useAuthStore
            parsed.state.accessToken = data.token;
            parsed.state.refreshToken = data.refreshToken;
            if (data.roleId) {
              parsed.state.roleId = data.roleId;
            }
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
            
            // Reload window if we want Zustand to catch it, or just use custom event
            // But updating header for the current request is enough to retry
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, force logout
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient
