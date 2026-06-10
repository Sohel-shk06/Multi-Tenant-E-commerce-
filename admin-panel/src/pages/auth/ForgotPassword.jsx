import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { forgotPassword, isLoading, error, successMessage } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  if (successMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="text-sm text-gray-600">{successMessage}</p>
          <Link to="/login" className="inline-flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500">
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Forgot password?</h2>
          <p className="mt-2 text-sm text-gray-600">No worries, we'll send you reset instructions.</p>
        </div>

        {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
            {isLoading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
        
        <div className="text-center">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};