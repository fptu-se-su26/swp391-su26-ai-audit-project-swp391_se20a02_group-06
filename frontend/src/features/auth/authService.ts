import apiClient from '../../lib/axios'

export interface AuthResponse {
  userId: number
  fullname: string
  email: string
  token: string
}

export const authService = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  register: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google', { credential })
    return response.data
  }
}
