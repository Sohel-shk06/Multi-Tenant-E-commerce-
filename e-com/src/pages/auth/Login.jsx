import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../app/store/authSlice';
import { Button } from '../../components/ui/Button';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  
  const { isLoading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const stars = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.2 + 0.05
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;

        const dx = star.x - mouseRef.current.x;
        const dy = star.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let shiftX = 0;
        let shiftY = 0;
        if (dist < 200) {
          const force = (200 - dist) / 200;
          shiftX = (dx / dist) * force * 10;
          shiftY = (dy / dist) * force * 10;
        }

        ctx.beginPath();
        ctx.arc(star.x + shiftX, star.y + shiftY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));
    if (resultAction.type === 'auth/login/fulfilled') {
      const role = resultAction.payload.user.role;
      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'vendor') navigate('/vendor/dashboard', { replace: true });
      else navigate('/customer/home', { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] text-slate-800 antialiased font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply z-0" />
      
      <div className="absolute top-[-20%] left-[-10%] w-[55rem] h-[55rem] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-fuchsia-600/15 rounded-full blur-[150px] pointer-events-none"></div>

      {/* LEFT PANEL - Shared Corporate Hero space */}
      <div className="hidden lg:flex lg:w-1/2 relative p-16 flex-col justify-between z-10 bg-gradient-to-br from-[#4f46e5] via-[#3b82f6] to-[#6366f1] overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] bg-sky-300/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-[35rem] h-[35rem] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="bg-white/15 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.119-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">Vendora</span>
        </div>

        <div className="my-auto max-w-lg relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.15] text-white uppercase mb-4">
            Join the Future of<br />Online Commerce
          </h1>
          <p className="text-base text-slate-200 leading-relaxed mb-10">
            Create your account and become part of a thriving global marketplace designed for modern brands and vendors.
          </p>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <p className="text-xs font-bold text-white tracking-wide uppercase">Platform Statistics</p>
              </div>
              <span className="text-xs text-indigo-100 font-medium">Live Analytics</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-indigo-100/80 font-medium">Total Sales Volume</p>
                <p className="text-2xl font-bold mt-0.5 text-white">$96,450</p>
              </div>
              <div>
                <p className="text-xs text-indigo-100/80 font-medium">Average Revenue Growth</p>
                <p className="text-2xl font-bold mt-0.5 text-white">+32.6%</p>
              </div>
            </div>
          </div>
        </div>

        {/* SHARED LOGO CONTAINER FOOTER */}
        <div className="border-t border-white/10 pt-6 mt-auto relative z-10">
          <p className="text-[11px] font-bold text-indigo-100/70 uppercase tracking-widest mb-4">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap items-center gap-4 text-white">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 shadow-sm">
              <svg className="h-4 w-auto text-white fill-current" viewBox="0 0 24 24"><path d="M21 6.5c-2.7 1.6-6.2 3.8-9.4 5.3-2.6 1.2-5.1 2.2-7.8 2.8-1.5.3-2.2-.3-1.6-1.4.7-1.3 2.6-3.8 5-6.2 2.1-2 4.3-3.7 6.4-4-.4.5-.8 1.1-1 1.7-.8 2.3-.2 4.5 1.7 5.8 2 1.3 4.9 1 7.7-1 .3-.2.5 0 .2.4z"/></svg>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 font-sans font-black italic tracking-tighter text-xs text-white shadow-sm">
              PUMA
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 shadow-sm">
              <svg className="h-5 w-auto text-white fill-current" viewBox="0 0 24 24"><path d="M2 19h3l2.8-5.2H4.8L2 19zm5.5 0h3l5.1-9.4H12.6L7.5 19zm5.5 0h3l7.5-13.8h-3L13.5 19z"/></svg>
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 font-serif font-bold tracking-widest text-[11px] text-white shadow-sm">
              ZARA
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 font-mono font-black tracking-widest text-[10px] text-white shadow-sm">
              SONY
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Clean Solid White Form Panel */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12 z-10 bg-white shadow-2xl">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-400 font-medium mt-1.5">Please enter your credentials to access your dashboard</p>
          </div>

          {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 text-xs font-semibold">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-transparent cursor-pointer" />
                <span className="text-slate-500 font-medium">Remember this device</span>
              </label>
              <Link to="/forgot-password" className="font-bold text-indigo-600 hover:text-indigo-700 underline decoration-indigo-200">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="!py-3.5 shadow-md">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs font-medium text-slate-400">
              <span className="bg-white px-3">or continue with</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <Button variant="google" className="!bg-white !text-slate-700 !border-slate-200 hover:!bg-slate-50 !shadow-sm">Continue with Google</Button>
            <Button variant="microsoft" className="!bg-white !text-slate-700 !border-slate-200 hover:!bg-slate-50 !shadow-sm">Continue with Microsoft</Button>
          </div>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4 decoration-indigo-200">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};