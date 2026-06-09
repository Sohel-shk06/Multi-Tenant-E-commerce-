import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../providers/AuthProvider'

/**
 * CustomerRoute — ensures the authenticated user has the "customer" role.
 * TODO: Replace with real role check from backend user profile.
 */
function CustomerRoute({ children }) {
  const { isAuthenticated, user } = useAuthContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // TODO: Validate user.role === 'customer' from backend profile
  // if (user?.role !== 'customer') {
  //   return <Navigate to="/unauthorized" replace />
  // }

  return children
}

export default CustomerRoute
