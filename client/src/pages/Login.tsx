import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Lock,
  ArrowRight,
  Stethoscope
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password. Try quick-fill below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'doctor') {
      setEmail('doctor');
      setPassword('doctor');
    } else {
      setEmail('staff');
      setPassword('staff');
    }
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-gradient-to-br from-[#f0fdfa] via-[#ffffff] to-[#faf5ff] font-sans antialiased relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/25 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      {/* ========================================================================= */}
      {/* 1. DESKTOP LEFT SIDE BRANDING (Visible on screens >= lg)                  */}
      {/* Classic / Old MANANTI desktop style with login-bg.jpg & Stethoscope       */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-950 items-center justify-center p-12 overflow-hidden border-r border-slate-900">
        <img 
          src="/login-bg.jpg" 
          alt="MANANTI" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center flex flex-col items-center max-w-md">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-2xl mb-8 flex items-center justify-center relative group border border-white/20">
            {/* Animation Layers */}
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 bg-emerald-100 rounded-full animate-pulse opacity-50"></div>
            
            <Stethoscope className="h-16 w-16 text-emerald-400 relative z-10 transform transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 drop-shadow-md" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4 text-shadow-sm drop-shadow-lg">
            MANANTI
          </h1>
          <p className="text-xl text-slate-300 font-medium mb-6 px-4 drop-shadow-md">
            Mental Health and Psychiatry Care Software
          </p>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/15 text-slate-300 text-sm">
            Better Mind &bull; Brighter Tomorrow
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SIGN IN SECTION (Responsive for Mobile & Desktop)                     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-16 relative z-10 min-h-screen">
        
        {/* Back to Home Button (Top Right on Desktop, Top Left on Mobile) */}
        <div className="w-full max-w-md flex justify-between items-center mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-purple-700 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <span className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200/60">
            Psychiatry Portal
          </span>
        </div>

        {/* The Main Login Card */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
          
          {/* Header Inside Card: "Welcome to MANANTI" + "Sign In" */}
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Welcome to <span className="bg-gradient-to-r from-[#0d9488] via-[#0284c7] to-[#8b5cf6] bg-clip-text text-transparent">MANANTI</span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Sign In to your practitioner account
            </p>
          </div>

          {/* Quick-Fill Helpers for Easy 1-Tap Login */}
          <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Fill:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('doctor')}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 active:scale-95 transition-all flex items-center gap-1 shadow-xs"
              >
                <span>👨‍⚕️ Doctor</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff')}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 active:scale-95 transition-all flex items-center gap-1 shadow-xs"
              >
                <span>📋 Staff</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-xs sm:text-sm mb-5 border border-red-100 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-600">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 outline-none text-slate-900 text-sm font-medium transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="doctor or staff"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-600">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 outline-none text-slate-900 text-sm font-medium transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button with Home Page Gradient Theme */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#10b981] via-[#0d9488] to-[#8b5cf6] hover:opacity-95 active:scale-98 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-teal-600/25 mt-5 flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-6 pt-4 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>256-Bit Encrypted Healthcare Access</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
