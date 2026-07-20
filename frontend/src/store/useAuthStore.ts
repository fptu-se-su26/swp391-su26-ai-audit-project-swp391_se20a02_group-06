import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  roleId: number | null
  isAuthenticated: boolean
  sessionId: number
  setTokens: (access: string, refresh: string, roleId?: number | null) => void
  logout: () => void
}

const getNextSessionId = () => Date.now()

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      roleId: null,
      isAuthenticated: false,
      sessionId: 0,
      setTokens: (accessToken, refreshToken, roleId) => set(state => ({
        ...state,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        sessionId: getNextSessionId(),
        ...(roleId !== undefined && { roleId })
      })),
      logout: () => set({ accessToken: null, refreshToken: null, roleId: null, isAuthenticated: false, sessionId: 0 }),
    }),
    {
      name: 'auth-storage',
    }
  )
)


