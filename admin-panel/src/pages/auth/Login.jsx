



import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
} from 'lucide-react';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const {
    user,
    login,
    isLoading,
    error,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;

        case 'vendor':
          navigate('/vendor/dashboard', { replace: true });
          break;

        default:
          navigate('/customer/dashboard', {
            replace: true,
          });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center px-6 py-10 overflow-hidden relative"
      style={{
        background:
          'linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 45%,#DDE5FF 100%)',
      }}
    >
      {/* Background Glow */}
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          width: '500px',
          height: '500px',
          top: '-150px',
          left: '-150px',
          background: 'rgba(99,102,241,.20)',
          filter: 'blur(150px)',
        }}
      />

      <div
        className="absolute rounded-full animate-pulse"
        style={{
          width: '450px',
          height: '450px',
          bottom: '-120px',
          right: '-120px',
          background: 'rgba(129,140,248,.18)',
          filter: 'blur(150px)',
        }}
      />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">
        {/* LEFT SECTION */}
        <div className="hidden lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#818CF8] bg-[#EEF2FF] px-4 py-2 text-[#4338CA] text-sm mb-6">
            <ShieldCheck size={16} />
            Enterprise Security
          </div>

          <h1 className="text-6xl font-bold leading-tight text-[#1E1B4B]">
            Manage Your
            <br />
            <span className="bg-gradient-to-r from-[#6366F1] to-[#4338CA] bg-clip-text text-transparent">
              E-Commerce
            </span>
            <br />
            Platform
          </h1>

          <p className="mt-8 text-[#4338CA] text-lg leading-relaxed max-w-xl">
            Securely manage customers, vendors,
            products and orders with an elegant
            and powerful admin dashboard.
          </p>

          <div className="flex gap-6 mt-10">
            <div className="rounded-2xl border border-[#818CF8] bg-white shadow-xl px-8 py-5">
              <h3 className="text-[#312E81] text-3xl font-bold">
                24/7
              </h3>
              <p className="text-[#4338CA] text-sm mt-1 font-medium">
                Monitoring
              </p>
            </div>

            <div className="rounded-2xl border border-[#818CF8] bg-white shadow-xl px-8 py-5">
              <h3 className="text-[#312E81] text-3xl font-bold">
                99.9%
              </h3>
              <p className="text-[#4338CA] text-sm mt-1 font-medium">
                Uptime
              </p>
            </div>

            <div className="rounded-2xl border border-[#818CF8] bg-white shadow-xl px-8 py-5">
              <h3 className="text-[#312E81] text-3xl font-bold">
                100%
              </h3>
              <p className="text-[#4338CA] text-sm mt-1 font-medium">
                Secure
              </p>
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div
          className="rounded-[35px] p-10 transition-all duration-500 hover:-translate-y-2"
          style={{
            background: 'rgba(255,255,255,.85)',
            border: '1px solid rgba(99,102,241,.15)',
            backdropFilter: 'blur(35px)',
            boxShadow:
              '0 25px 80px rgba(67,56,202,.18), 0 8px 30px rgba(99,102,241,.10)',
          }}
        >
          <div className="flex justify-center mb-8">
            <div
              className="flex items-center justify-center"
              style={{
                width: 90,
                height: 90,
                borderRadius: 30,
              }}
            >
              <ShieldCheck
                size={40}
                color="#6366F1"
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#1E1B4B] text-center">
            Welcome Back
          </h2>

          <p className="text-[#4338CA] text-center mt-3 mb-8">
            Sign in to access your dashboard
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-red-500 text-sm">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label className="text-sm text-[#4338CA] mb-2 block font-medium">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full h-14 rounded-2xl bg-white border-2 border-[#C7D2FE] text-[#1E1B4B] pl-12 pr-4 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-[#4338CA] mb-2 block font-medium">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-14 rounded-2xl bg-white border-2 border-[#C7D2FE] text-[#1E1B4B] pl-12 pr-14 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6366F1]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex gap-2 items-center text-[#4338CA] text-sm">
                <input
                  type="checkbox"
                  style={{
                    accentColor:
                      '#6366F1',
                  }}
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-[#4338CA] text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl text-white font-semibold"
              style={{
                background:
                  'linear-gradient(135deg,#6366F1 0%,#4338CA 100%)',
              }}
            >
              {isLoading
                ? 'Signing In...'
                : 'Sign In'}
            </button>
          </form>

         
        </div>
      </div>
    </div>
  );
};