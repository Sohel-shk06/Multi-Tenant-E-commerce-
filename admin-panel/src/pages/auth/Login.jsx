// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { Button } from '../../components/ui/Button';
// import { Input } from '../../components/ui/Input';

// export const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const { login, isLoading, error } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const resultAction = await login(formData);
    
//     // 🔥 FIX: login.fulfilled.match() ki jagah direct type check karein
//     if (resultAction.type === 'auth/login/fulfilled') {
//       const role = resultAction.payload.user.role;
      
//       // Role ke hisaab se Dashboard par redirect
//       if (role === 'admin') {
//         navigate('/admin/dashboard', { replace: true });
//       } else if (role === 'vendor') {
//         navigate('/vendor/dashboard', { replace: true });
//       } else {
//         navigate('/customer/dashboard', { replace: true });
//       }
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
//         <div className="text-center">
//           <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Or <Link to="/contact-admin" className="font-medium text-blue-600 hover:text-blue-500">contact admin for vendor access</Link>
//           </p>
//         </div>

//         {error && (
//           <div className="rounded-md bg-red-50 p-4">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <Input
//               label="Email address"
//               type="email"
//               name="email"
//               autoComplete="email"
//               required
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//             />
//             <Input
//               label="Password"
//               type="password"
//               name="password"
//               autoComplete="current-password"
//               required
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
//             </div>
//             <div className="text-sm">
//               <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
//                 Forgot your password?
//               </Link>
//             </div>
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? 'Signing in...' : 'Sign in'}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };







import { useState } from 'react';
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

const { login, isLoading, error } = useAuth();
const navigate = useNavigate();

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

const resultAction = await login(formData);  

if (resultAction.type === 'auth/login/fulfilled') {  
  const role = resultAction.payload.user.role;  

  if (role === 'admin') {  
    navigate('/admin/dashboard', {  
      replace: true,  
    });  
  } else if (role === 'vendor') {  
    navigate('/vendor/dashboard', {  
      replace: true,  
    });  
  } else {  
    navigate('/customer/dashboard', {  
      replace: true,  
    });  
  }  
}

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

  {/* Grid */}  
  <div  
    className="absolute inset-0 opacity-[0.05]"  
    style={{  
      backgroundImage:  
        'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',  
      backgroundSize: '40px 40px',  
    }}  
  />  

  <div className="relative z-10 max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">  

    {/* LEFT */}  
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
        Securely manage customers, vendors, products and orders  
        with an elegant and powerful admin dashboard.  
      </p>  

      <div className="flex gap-6 mt-10">  

        <div className="rounded-2xl border border-[#818CF8] bg-white shadow-xl px-8 py-5">  
          <h3 className="text-[#312E81] text-3xl font-bold">24/7</h3>  
          <p className="text-[#4338CA] text-sm mt-1 font-medium">  
            Monitoring  
          </p>  
        </div>  

        <div className="rounded-2xl border border-[#818CF8] bg-white shadow-xl px-8 py-5">  
          <h3 className="text-[#312E81] text-3xl font-bold">99.9%</h3>  
          <p className="text-[#4338CA] text-sm mt-1 font-medium">  
            Uptime  
          </p>  
        </div>  

        <div className="rounded-2xl border border-[#818CF8] bg-white shadow-xl px-8 py-5">  
          <h3 className="text-[#312E81] text-3xl font-bold">100%</h3>  
          <p className="text-[#4338CA] text-sm mt-1 font-medium">  
            Secure  
          </p>  
        </div>  

      </div>  

    </div>  
    {/* RIGHT CARD */}  
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
            background: 'rgba(255,255,255,.05)',  
            border: '1px solid rgba(255,255,255,.08)',  
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

      <div className="flex justify-center gap-3 mt-5 mb-8">  

        <div className="rounded-full bg-white border border-[#818CF8] px-5 py-2 text-sm font-medium text-[#4338CA] shadow-md hover:shadow-lg transition-all duration-300">  
          🛡️ Secure  
        </div>  

        <div className="rounded-full bg-white border border-[#818CF8] px-5 py-2 text-sm font-medium text-[#4338CA] shadow-md hover:shadow-lg transition-all duration-300">  
          ⚡ Fast  
        </div>  

        <div className="rounded-full bg-white border border-[#818CF8] px-5 py-2 text-sm font-medium text-[#4338CA] shadow-md hover:shadow-lg transition-all duration-300">  
          ✅ Reliable  
        </div>  

      </div>  

      {error && (  
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">  
          <p className="text-red-300 text-sm">  
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
              className="w-full h-14 rounded-2xl bg-white border-2 border-[#C7D2FE] text-[#1E1B4B] pl-12 pr-4 outline-none transition-all duration-300 hover:border-[#818CF8] focus:ring-4 focus:ring-[#6366F1]/20"  
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
              type={showPassword ? 'text' : 'password'}  
              name="password"  
              required  
              value={formData.password}  
              onChange={handleChange}  
              placeholder="••••••••"  
              className="w-full h-14 rounded-2xl bg-white border-2 border-[#C7D2FE] text-[#1E1B4B] pl-12 pr-14 outline-none transition-all duration-300 hover:border-[#818CF8] focus:ring-4 focus:ring-[#6366F1]/20"  
            />  

            <button  
              type="button"  
              onClick={() => setShowPassword(!showPassword)}  
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
                accentColor: '#6366F1',  
              }}  
            />  
            Remember me  
          </label>  

          <Link  
            to="/forgot-password"  
            className="text-[#4338CA] text-sm hover:text-[#312E81]"  
          >  
            Forgot Password?  
          </Link>  

        </div>  

        <button  
          type="submit"  
          disabled={isLoading}  
          className="w-full h-14 rounded-2xl text-white font-semibold transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"  
          style={{  
            background:  
              'linear-gradient(135deg,#6366F1 0%,#4338CA 100%)',  
            boxShadow:  
              '0 15px 40px rgba(99,102,241,.4)',  
          }}  
        > 
        {isLoading ? (  
            'Signing In...'  
          ) : (  
            <span className="flex items-center justify-center gap-2">  
              Sign In  
              <span className="text-xl">→</span>  
            </span>  
          )}  
        </button>  

        <p className="text-center text-[#6366F1] text-xs pt-5">  
          © 2025 Admin Portal • Multi-Tenant E-Commerce Platform  
        </p>  

      </form>  

    </div>  
  </div>  
</div>

);
};