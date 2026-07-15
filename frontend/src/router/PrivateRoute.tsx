import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface PrivateRouteProps {
    children: React.ReactNode
    requiredRoles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredRoles && user?.roleName) {
        const userRole = user.roleName.toUpperCase()
        const hasRole = requiredRoles.some(r => r.toUpperCase() === userRole)
        if (!hasRole) {
            return <Navigate to="/" replace />
        }
    }

    return <>{children}</>
}

export default PrivateRoute
