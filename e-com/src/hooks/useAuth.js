import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../app/store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutAction());
  };

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    logout,
  };
};