import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

interface PTRouteProps {
    children: React.ReactNode
}

const PTRoute: React.FC<PTRouteProps> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const roleId = useAuthStore((state) => state.roleId)
    const roleName = useAuthStore((state) => state.roleName)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (roleId !== 2 && roleName !== 'PT') {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}

export default PTRoute
