import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * Guards a route by authentication and (optionally) role.
 * role="ADMIN"    -> only admins may pass, others sent to /admin/login
 * role="CUSTOMER" -> only logged-in customers may pass, others sent to /login
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/'} replace />
  }

  return children
}
