import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match!');
      return;
    }
    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const resultAction = await resetPassword({ token, newPassword: formData.password });
      if (resultAction.meta?.requestStatus === 'fulfilled') {
        navigate('/login', { state: { message: 'Password reset successful! Please login.' }, replace: true });
      } else {
        setLocalError(resultAction.payload || 'Failed to reset password.');
      }
    } catch (err) {
      setLocalError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your new password below.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(localError || authError) && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{localError || authError}</p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="New Password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              ← Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};