import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const roleId = useAuthStore((state) => state.roleId)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Allow only Admin (1) and PT (2)
  if (roleId !== 1 && roleId !== 2) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default AdminRoute


