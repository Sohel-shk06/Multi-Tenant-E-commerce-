import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser, registerUser, logout, verifyEmail, changePassword,
  forgotPassword, verifyResetOtp, resetPasswordWithOtp,
  requestEmailChange, verifyEmailChange
} from '../app/store/authSlice';


export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error, successMessage } = useSelector((state) => state.auth);

  return {
    user,
    token,
    isLoading,
    error,
    successMessage,
    login: (credentials) => dispatch(loginUser(credentials)),
    register: (userData) => dispatch(registerUser(userData)),
    logout: () => dispatch(logout()),
    verifyEmail: (token) => dispatch(verifyEmail(token)),
    changePassword: (data) => dispatch(changePassword(data)),
    forgotPassword: (email) => dispatch(forgotPassword(email)),
    verifyResetOtp: (data) => dispatch(verifyResetOtp(data)),
    resetPasswordWithOtp: (data) => dispatch(resetPasswordWithOtp(data)),
    requestEmailChange: (newEmail) => dispatch(requestEmailChange(newEmail)),
    verifyEmailChange: (otp) => dispatch(verifyEmailChange(otp)),
  };
};