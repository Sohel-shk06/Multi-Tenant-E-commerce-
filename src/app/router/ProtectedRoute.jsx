import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../providers/AuthProvider'

/**
 * ProtectedRoute — redirects unauthenticated users to /login.
 * TODO: Replace mock isAuthenticated with real auth state from backend.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext()
  const location = useLocation()

  // TODO: Add loading state while verifying auth token with backend
  if (!isAuthenticated) {
    // Preserve the attempted route for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
