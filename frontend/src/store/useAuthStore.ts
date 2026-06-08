import { create } from 'zustand'

export interface User {
  userId: number
  fullname: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setCredentials: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Load token and user from local storage initially
  const token = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null

  return {
    user,
    token,
    isAuthenticated: !!token,
    setCredentials: (user, token) => {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      set({ user, token, isAuthenticated: true })
    },
    logout: () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({ user: null, token: null, isAuthenticated: false })
    },
  }
})
