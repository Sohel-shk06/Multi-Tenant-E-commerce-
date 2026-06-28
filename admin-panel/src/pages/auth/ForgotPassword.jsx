import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { 
  forgotPassword as forgotPasswordThunk,
  verifyResetOtp as verifyResetOtpThunk,
  resetPasswordWithOtp as resetPasswordWithOtpThunk
} from '../../app/store/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, successMessage, clearError } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [timer, setTimer] = useState(0);
  
  const otpRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    setLocalError('');
    if (error) clearError();
  }, [step]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }

    try {
      const resultAction = await dispatch(forgotPasswordThunk(email));
      if (forgotPasswordThunk.fulfilled.match(resultAction)) {
        setStep(2);
        setTimer(60);
      } else {
        setLocalError(resultAction.payload || 'Failed to send OTP');
      }
    } catch (err) {
      setLocalError(err.message || 'Something went wrong');
    }
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLocalError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setLocalError('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      const resultAction = await dispatch(verifyResetOtpThunk({ email, otp: otpString }));
      if (verifyResetOtpThunk.fulfilled.match(resultAction)) {
        setStep(3);
      } else {
        setLocalError(resultAction.payload || 'Invalid OTP');
      }
    } catch (err) {
      setLocalError(err.message || 'Something went wrong');
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!newPassword || !confirmPassword) {
      setLocalError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    const otpString = otp.join('');

    try {
      const resultAction = await dispatch(resetPasswordWithOtpThunk({ 
        email, 
        otp: otpString, 
        newPassword 
      }));
      
      if (resetPasswordWithOtpThunk.fulfilled.match(resultAction)) {
        navigate('/login', { 
          state: { message: 'Password reset successfully! Please login with your new password.' } 
        });
      } else {
        setLocalError(resultAction.payload || 'Failed to reset password');
      }
    } catch (err) {
      setLocalError(err.message || 'Something went wrong');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLocalError('');
    
    try {
      const resultAction = await dispatch(forgotPasswordThunk(email));
      if (forgotPasswordThunk.fulfilled.match(resultAction)) {
        setTimer(60);
      }
    } catch (err) {
      setLocalError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
            {step === 1 && <Mail className="h-6 w-6 text-indigo-600" />}
            {step === 2 && <CheckCircle className="h-6 w-6 text-indigo-600" />}
            {step === 3 && <Lock className="h-6 w-6 text-indigo-600" />}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {step === 1 && 'Forgot password?'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Set new password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && "No worries, we'll send you a verification code."}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && 'Your new password must be different from previous ones.'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors ${
                s <= step ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {localError || error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter 6-digit OTP
              </label>
              
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0 || isLoading}
                className={`font-medium ${
                  timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-500'
                }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp(['', '', '', '', '', '']);
                setLocalError('');
              }}
              className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change email
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        {/* Back to Login */}
        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};