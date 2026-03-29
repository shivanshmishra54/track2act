import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export function RoleBasedRoute({ children, requiredRoles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRole = user.role || user.roleId

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
