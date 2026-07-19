import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface AdminRouteProps {
    children: React.ReactNode
    requiredRole?: number // 1=Admin, 2=PT; if set, only that role can access
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, requiredRole }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const roleId = useAuthStore((state) => state.roleId)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Allow only Admin (1) and PT (2)
    if (roleId !== 1 && roleId !== 2) {
        return <Navigate to="/dashboard" replace />
    }

    // If a specific role is required, check it
    if (requiredRole !== undefined && roleId !== requiredRole) {
        return <Navigate to={roleId === 2 ? '/pt/clients' : '/dashboard'} replace />
    }

    return <>{children}</>
}

export default AdminRoute

