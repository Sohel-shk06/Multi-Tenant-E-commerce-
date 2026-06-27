import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser, registerUser, fetchCurrentUser, logout, 
  forgotPassword, resetPassword, 
  requestEmailChange, verifyEmailChange,
  changePassword // ✅ Ye import karein
} from '../app/store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error, successMessage } = useSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    successMessage,
    login: (credentials) => dispatch(loginUser(credentials)),
    register: (userData) => dispatch(registerUser(userData)),
    forgotPassword: (email) => dispatch(forgotPassword(email)),
    resetPassword: (data) => dispatch(resetPassword(data)),
    requestEmailChange: (newEmail) => dispatch(requestEmailChange(newEmail)),
    verifyEmailChange: (otp) => dispatch(verifyEmailChange(otp)),
    changePassword: (data) => dispatch(changePassword(data)), // ✅ Ye add karein
    fetchUser: () => dispatch(fetchCurrentUser()),
    logout: () => dispatch(logout()),
  };
};