import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { 
  requestEmailChange as requestEmailChangeThunk, 
  verifyEmailChange as verifyEmailChangeThunk 
} from '../../app/store/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, CheckCircle } from 'lucide-react';

export const ChangeEmail = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, successMessage, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [localError, setLocalError] = useState('');
  const [timer, setTimer] = useState(0);
  
  const otpRefs = useRef([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

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

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!newEmail) {
      setLocalError('Please enter a new email address');
      return;
    }
    
    if (user && newEmail === user.email) {
      setLocalError('New email cannot be the same as current email');
      return;
    }

    try {
      // ✅ Thunk directly dispatch karein
      const resultAction = await dispatch(requestEmailChangeThunk(newEmail));
      
      // ✅ Ab thunk directly import kiya hai, isliye .fulfilled.match() kaam karega
      if (requestEmailChangeThunk.fulfilled.match(resultAction)) {
        setStep(2);
        setTimer(60);
      } else {
        setLocalError(resultAction.payload || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setLocalError(err.message || 'Something went wrong');
    }
  };

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setLocalError('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      // ✅ Thunk directly dispatch karein
      const resultAction = await dispatch(verifyEmailChangeThunk(otpString));
      
      if (verifyEmailChangeThunk.fulfilled.match(resultAction)) {
        setNewEmail('');
        setOtp(['', '', '', '', '', '']);
        setStep(1);
      } else {
        setLocalError(resultAction.payload || 'Failed to verify OTP');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setLocalError(err.message || 'Something went wrong');
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLocalError('');
    
    try {
      const resultAction = await dispatch(requestEmailChangeThunk(newEmail));
      if (requestEmailChangeThunk.fulfilled.match(resultAction)) {
        setTimer(60);
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Mail className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Change Email Address</h2>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Current Email</p>
          <p className="text-lg font-medium text-gray-900">{user?.email || 'Loading...'}</p>
        </div>

        {(error || localError) && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-100">
            {localError || error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-100 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp} className="space-y-6">
          {step === 1 ? (
            <>
              <Input
                label="New Email Address"
                type="email"
                name="newEmail"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="newemail@example.com"
              />
              <p className="text-xs text-gray-500 -mt-4">
                We will send a 6-digit OTP to this new email address for verification.
              </p>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter 6-digit OTP sent to <br />
                  <span className="font-semibold text-indigo-600">{newEmail}</span>
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

              <div className="flex items-center justify-between text-sm pt-2">
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

              <div className="flex justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp(['', '', '', '', '', '']);
                    setLocalError('');
                  }}
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  ← Change Email
                </button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify & Update'}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};