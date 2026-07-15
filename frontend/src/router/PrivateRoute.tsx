import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface PrivateRouteProps {
    children: React.ReactNode
    requiredRoles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const roleId = useAuthStore((state) => state.roleId)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requiredRoles && roleId) {
        let userRole = '';
        if (roleId === 1) userRole = 'ADMIN';
        else if (roleId === 2) userRole = 'PT';
        else if (roleId === 3) userRole = 'MEMBER';

        const hasRole = requiredRoles.some(r => r.toUpperCase() === userRole)
        if (!hasRole) {
            return <Navigate to="/" replace />
        }
    }

    return <>{children}</>
}

export default PrivateRoute
