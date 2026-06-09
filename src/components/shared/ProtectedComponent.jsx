/**
 * ProtectedComponent — conditionally renders children based on auth/permission.
 *
 * Props:
 *  isAllowed — boolean — render children when true
 *  fallback  — ReactNode — shown when isAllowed is false (default: null)
 *
 * TODO: Integrate real permission checks from usePermissions hook
 *       once the auth module is connected to the backend.
 */
function ProtectedComponent({ isAllowed, fallback = null, children }) {
  if (!isAllowed) return fallback
  return children
}

export default ProtectedComponent
