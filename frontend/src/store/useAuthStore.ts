import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isTokenExpired } from '../lib/tokenUtils'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  roleId: number | null
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string, roleId?: number | null) => void
  logout: () => void
  checkTokenValidity: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
      checkTokenValidity: () => {
        const { accessToken } = get()
        if (accessToken && isTokenExpired(accessToken)) {
          console.info('[Auth] Token expired on startup — logging out.')
          get().logout()
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => {
        // This callback fires after Zustand restores state from localStorage
        return (state) => {
          if (state) {
            state.checkTokenValidity()
          }
        }
      },
    }
  )
)
