import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Outlet /> {/* Yahan Login/ForgotPassword render hoga */}
    </div>
  );
};