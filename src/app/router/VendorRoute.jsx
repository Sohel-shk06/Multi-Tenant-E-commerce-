import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../providers/AuthProvider'

/**
 * VendorRoute — ensures the authenticated user has the "vendor" role.
 * TODO: Replace with real role check from backend user profile.
 */
function VendorRoute({ children }) {
  const { isAuthenticated } = useAuthContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // TODO: Validate user.role === 'vendor' from backend profile
  // if (user?.role !== 'vendor') {
  //   return <Navigate to="/unauthorized" replace />
  // }

  return children
}

export default VendorRoute
