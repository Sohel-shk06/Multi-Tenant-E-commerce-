import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmail } from '../../app/store/authSlice';
import { PageLoader } from '../../components/loaders/PageLoader';

export const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, successMessage } = useSelector((state) => state.auth);
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token)).then((result) => {
        if (result.type === 'auth/verifyEmail/fulfilled') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      });
    }
  }, [token, dispatch]);

  if (isLoading && status === 'verifying') return <PageLoader />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
        {status === 'success' ? (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="mt-2 text-gray-600">Your account has been successfully verified. You can now log in.</p>
            <Link to="/login" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Login</Link>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="mt-2 text-gray-600">{error || 'The verification link is invalid or has expired.'}</p>
            <Link to="/register" className="mt-6 inline-block px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Back to Register</Link>
          </>
        )}
      </div>
    </div>
  );
};