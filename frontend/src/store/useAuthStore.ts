import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  roleId: number | null
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string, roleId?: number | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      roleId: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken, roleId) => set(state => ({ 
        ...state, 
        accessToken, 
        refreshToken, 
        isAuthenticated: true,
        ...(roleId !== undefined && { roleId })
      })),
      logout: () => set({ accessToken: null, refreshToken: null, roleId: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // This will be the key used in localStorage
    }
  )
)
