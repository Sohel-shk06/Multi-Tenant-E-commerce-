import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { requestEmailChange as requestEmailChangeThunk } from '../../app/store/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, CheckCircle } from 'lucide-react';

export const ChangeEmail = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, successMessage, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [newEmail, setNewEmail] = useState('');
  const [localError, setLocalError] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setLocalError('');
    if (error) clearError();
  }, [newEmail]);

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

  const handleSubmit = async (e) => {
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
      const resultAction = await dispatch(requestEmailChangeThunk(newEmail));
      if (requestEmailChangeThunk.fulfilled.match(resultAction)) {
        setNewEmail('');
      } else {
        setLocalError(resultAction.payload || 'Failed to update email');
      }
    } catch (err) {
      console.error('Update email error:', err);
      setLocalError(err.message || 'Something went wrong');
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="New Email Address"
            type="email"
            name="newEmail"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="newemail@example.com"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Email'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};