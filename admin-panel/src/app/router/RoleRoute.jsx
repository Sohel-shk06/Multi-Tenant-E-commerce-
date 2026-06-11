import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RoleRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // SRS Roles: 'admin', 'vendor', 'customer'
  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  // Agar role match nahi karta, toh Unauthorized page par bhej do
  return <Navigate to="/unauthorized" replace />;
};