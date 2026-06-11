import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');
  const { resetPassword, isLoading, error, successMessage } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    const resultAction = await resetPassword({ token, newPassword: formData.newPassword });
    if (resetPassword.fulfilled.match(resultAction)) {
      navigate('/login', { state: { message: 'Password reset successful! Please login.' }, replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Set new password</h2>
          <p className="mt-2 text-sm text-gray-600">Your new password must be different from previous ones.</p>
        </div>

        {(error || localError) && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{localError || error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            required
            value={formData.newPassword}
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>
      </div>
    </div>
  );
};