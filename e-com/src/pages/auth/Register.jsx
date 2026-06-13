import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../app/store/authSlice';
import { Button } from '../../components/ui/Button';

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  
  const { isLoading, error, successMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });

  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Animated Interstellar Quantum Particle Canvas Loop
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

    const stars = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      stars.forEach((star, index) => {
        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;

        const dx = star.x - mouseRef.current.x;
        const dy = star.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let shiftX = 0;
        let shiftY = 0;
        if (dist < 250) {
          const force = (250 - dist) / 250;
          shiftX = (dx / dist) * force * 15;
          shiftY = (dy / dist) * force * 15;
        }

        ctx.beginPath();
        ctx.arc(star.x + shiftX, star.y + shiftY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = index % 3 === 0 ? 'rgba(236, 72, 153, 0.35)' : 'rgba(129, 140, 248, 0.35)';
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
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const { confirmPassword, ...registerData } = formData;
    const resultAction = await dispatch(registerUser(registerData));
    if (resultAction.type === 'auth/register/fulfilled') {
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#03000a] text-slate-100 antialiased font-sans overflow-hidden relative">
      {/* Background Simulation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen z-0" />
      
      <div className="absolute top-[-20%] left-[-10%] w-[55rem] h-[55rem] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-fuchsia-600/15 rounded-full blur-[150px] pointer-events-none"></div>

      {/* LEFT PANEL - Shared Corporate Hero space */}
      <div className="hidden lg:flex lg:w-1/2 relative p-16 flex-col justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/5 backdrop-blur-xl p-2 rounded-xl border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.119-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">Vendora</span>
        </div>

        <div className="my-auto max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.15] mb-4">
            Join the Future of<br />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              Online Commerce
            </span>
          </h1>
          <p className="text-base text-slate-400 leading-relaxed mb-10">
            Create your account and become part of a thriving global marketplace designed for modern brands and vendors.
          </p>

          <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <p className="text-xs font-bold text-purple-300 tracking-wide uppercase">Platform Statistics</p>
              </div>
              <span className="text-xs text-slate-400">Live Analytics</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Sales Volume</p>
                <p className="text-2xl font-bold mt-0.5 text-white">$96,450</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Average Revenue Growth</p>
                <p className="text-2xl font-bold mt-0.5 text-emerald-400">+32.6%</p>
              </div>
            </div>
          </div>
        </div>

        {/* PROTECTED LOGO FOOTER SECTION */}
        <div className="border-t border-white/10 pt-6 mt-auto relative z-20">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap items-center gap-4 text-white">
            {/* Nike Original Logo */}
            <div className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-md flex items-center justify-center w-24 h-12">
              <svg className="h-5 w-auto text-white fill-current" viewBox="0 0 24 24">
                <path d="M21 6.5c-2.7 1.6-6.2 3.8-9.4 5.3-2.6 1.2-5.1 2.2-7.8 2.8-1.5.3-2.2-.3-1.6-1.4.7-1.3 2.6-3.8 5-6.2 2.1-2 4.3-3.7 6.4-4-.4.5-.8 1.1-1 1.7-.8 2.3-.2 4.5 1.7 5.8 2 1.3 4.9 1 7.7-1 .3-.2.5 0 .2.4z"/>
              </svg>
            </div>

            {/* Puma Original Logo */}
            <div className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-md flex items-center justify-center w-24 h-12">
              <span className="font-sans font-black italic tracking-tighter text-sm text-white">PUMA</span>
            </div>

            {/* Adidas Original Logo */}
            <div className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-md flex items-center justify-center w-24 h-12">
              <svg className="h-6 w-auto text-white fill-current" viewBox="0 0 24 24">
                <path d="M2 19h3l2.8-5.2H4.8L2 19zm5.5 0h3l5.1-9.4H12.6L7.5 19zm5.5 0h3l7.5-13.8h-3L13.5 19z"/>
              </svg>
            </div>

            {/* Zara Original Logo */}
            <div className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-md flex items-center justify-center w-24 h-12">
              <span className="font-serif font-bold tracking-widest text-xs text-white">ZARA</span>
            </div>

            {/* Sony Original Logo */}
            <div className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-md flex items-center justify-center w-24 h-12">
              <span className="font-mono font-black tracking-widest text-xs text-white">SONY</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Unified Dynamic Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12 z-10">
        <div className="w-full max-w-[430px] bg-[#0c081d]/70 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
            <p className="text-xs text-slate-400 mt-1">Fill in the fields below to setup your profile</p>
          </div>

          {error && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 font-semibold">{error}</div>}
          {successMessage && <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-400 font-semibold">{successMessage}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:bg-[#110c29] transition-all"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:bg-[#110c29] transition-all"
              />
            </div>

            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-purple-500 focus:bg-[#110c29] cursor-pointer appearance-none"
              >
                <option value="customer" className="bg-[#0a0618]">Register as Customer</option>
                <option value="vendor" className="bg-[#0a0618]">Register as Vendor</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-4 pr-10 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs font-semibold">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                  className="w-full pl-4 pr-10 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs font-semibold">
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1 select-none">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-transparent cursor-pointer" />
              <span className="text-xs text-slate-400 font-medium leading-normal">
                I agree to the <span className="text-purple-400 hover:underline">Terms &amp; Conditions</span> and <span className="text-purple-400 hover:underline">Privacy Policy</span>
              </span>
            </label>

            <Button type="submit" variant="primary">
              Create Account
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0c081d] px-3 text-slate-500 font-medium">or continue with</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <Button variant="google">Continue with Google</Button>
            <Button variant="microsoft">Continue with Microsoft</Button>
          </div>

          <p className="text-center text-sm font-medium text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold underline underline-offset-4 decoration-white/5">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};