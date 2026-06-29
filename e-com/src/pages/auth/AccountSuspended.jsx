import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../app/store/authSlice';
import { Shield, LogOut, Mail, Phone } from 'lucide-react';

export const AccountSuspended = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Suspended
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your account has been suspended by the administrator. You cannot access the platform at this time.
        </p>

        {/* Info Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-red-800 mb-2">Why was my account suspended?</p>
          <ul className="text-xs text-red-700 space-y-1">
            <li>• Violation of platform policies</li>
            <li>• Suspicious activity detected</li>
            <li>• Admin decision</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-3">Need Help?</p>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@marketplace.com</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+91-XXXXXXXXXX</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};