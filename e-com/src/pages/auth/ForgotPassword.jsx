import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { forgotPassword as forgotPasswordThunk } from '../../app/store/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading, error, successMessage, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }

    try {
      const resultAction = await dispatch(forgotPasswordThunk(email));
      if (forgotPasswordThunk.fulfilled.match(resultAction)) {
        setSubmitted(true);
      } else {
        setLocalError(resultAction.payload || 'Failed to send reset link');
      }
    } catch (err) {
      setLocalError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
            {submitted ? <CheckCircle className="h-6 w-6 text-indigo-600" /> : <Mail className="h-6 w-6 text-indigo-600" />}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {submitted ? 'Check Your Email' : 'Forgot Password?'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {submitted 
              ? `We have sent a password reset link to ${email}`
              : "Enter your email address and we'll send you a reset link."
            }
          </p>
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

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setLocalError('');
              }}
              className="w-full flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try another email
            </button>
          </div>
        )}

        {/* Back to Login */}
        <div className="text-center pt-2">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};