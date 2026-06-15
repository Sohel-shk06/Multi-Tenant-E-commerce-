import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../app/store/authSlice";
import { Button } from "../../components/ui/Button";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const { isLoading, error, successMessage } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Soft Particle Flow Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const stars = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.2 + 0.5,
      speed: Math.random() * 0.2 + 0.05,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

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
        ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const { confirmPassword, ...registerData } = formData;
    const resultAction = await dispatch(registerUser(registerData));
    if (resultAction.type === "auth/register/fulfilled") {
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] text-slate-800 antialiased font-sans overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply z-0"
      />

      {/* LEFT PANEL - Premium Light Blue Attraction Space */}
      <div className="hidden lg:flex lg:w-1/2 relative px-8 xl:px-16 py-8 flex-col justify-between z-10 bg-gradient-to-br from-[#6400fb] via-[#9988e7] to-[#3196fb] overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] bg-sky-300/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-[35rem] h-[35rem] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="bg-white/15 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.119-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            Marketplace
          </span>
        </div>

        <div className="my-auto max-w-lg relative z-10">
          <h2 className="text-4xl font-bold tracking-tight leading-[1.15] text-white uppercase mt-6 mb-3">
            Start Your Journey With Marketplace
            <br />
          </h2>
          <p className="text-base text-slate-200 leading-relaxed mb-10">
            Join thousands of shoppers and vendors in a seamless and secure marketplace experience.
          </p>

          <div className="relative mt-10">
            <img
              src="/images/signup.png"
              alt="Store"
              className="w-full max-w-[500px] xl:max-w-[600px] mx-auto"
            />
          </div>
        </div>

        {/* SHARED LOGO CONTAINER FOOTER */}
        <div className="border-t border-white/10 pt-6 mt-auto relative z-10">
          <p className="text-[11px] font-bold text-indigo-100/70 uppercase tracking-widest mb-4">
            Powering Modern Commerce
          </p>
          <div className="grid grid-cols-3 xl:grid-cols-5 gap-4 text-white">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 shadow-sm">
              <img src="/logos/nike.webp" alt="Puma" className="h-5 w-auto" />
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 shadow-sm">
              <img
                src="/logos/Adidas.png"
                alt="adidas"
                className="h-7 w-auto"
              />
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 shadow-sm">
              <img src="/logos/puma.png" alt="Puma" className="h-8 w-auto" />
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 shadow-sm">
              <img
                src="/logos/samsung.png"
                alt="Puma"
                className="h-20 w-auto"
              />
            </div>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-center w-24 h-11 shadow-sm">
              <img src="/logos/JBL.png" alt="Puma" className="h-5 w-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Clean Solid White Form Panel */}
      <div className="flex flex-1 lg:w-1/2 items-center justify-center
    px-4 py-8 sm:px-6 lg:px-12 z-10
    bg-gradient-to-br from-[#6400fb] via-[#654ec4] to-[#c03dec]
    lg:bg-none lg:bg-[#f3f4f8]">
        <div className="lg:hidden w-full bg-transparent px-5 py-4 fixed absolute top-0 left-0 flex items-center justify-center z-20">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-md p-2 rounded-xl border border-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.119-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                  />
                </svg>
              </div>

              <span className="text-xl font-bold text-white">Marketplace</span>
            </div>
          </div>
        <div className="w-full max-w-[400px] bg-white rounded-3xl p-8 sm:p-10 shadow-lg">
          
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-1.5">
              Join our marketplace and start your journey today
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-bold text-emerald-600">
              {successMessage}
            </div>
          )}

          <form className="space-y-4 max-w-md lg:max-w-lg" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
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
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
              />
            </div>

            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="customer">Register as Customer</option>
                <option value="vendor">Register as Vendor</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 pointer-events-none">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 text-xs font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                  className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 text-xs font-semibold"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-transparent cursor-pointer"
              />
              <span className="text-xs text-slate-400 font-medium leading-normal">
                I agree to the{" "}
                <span className="text-indigo-600 hover:underline font-semibold">
                  Terms &amp; Conditions
                </span>{" "}
                and{" "}
                <span className="text-indigo-600 hover:underline font-semibold">
                  Privacy Policy
                </span>
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              className="!py-3.5 shadow-md"
            >
              Create Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs font-medium text-slate-400">
              <span className="bg-white px-3">or continue with</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <Button
              variant="google"
              className="!bg-white !text-slate-700 !border-slate-200 hover:!bg-slate-50 !shadow-sm"
            >
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm font-medium text-slate-400 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4 decoration-indigo-200"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
