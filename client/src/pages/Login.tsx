import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Stethoscope, 
  ArrowLeft, 
  Download, 
  Smartphone, 
  ShieldCheck, 
  User, 
  Lock, 
  Sparkles,
  CheckCircle2
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
      setError(err.response?.data?.message || 'Invalid username or password. Try quick-fill demo below.');
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
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-slate-50 font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. DESKTOP LEFT SIDE IMAGE & BRANDING (Visible on screens >= lg)           */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-950 items-center justify-center overflow-hidden">
        <img 
          src="/login-bg.jpg" 
          alt="MANANTI Healthcare" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center flex flex-col items-center max-w-md p-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-2xl mb-8 flex items-center justify-center relative group border border-white/20">
            {/* Animation Layers */}
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 bg-emerald-100 rounded-full animate-pulse opacity-50"></div>
            
            <Stethoscope className="h-16 w-16 text-emerald-400 relative z-10 transform transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 drop-shadow-md" />
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">MANANTI</h1>
          <p className="text-xl text-slate-200 font-semibold mb-3 px-4 drop-shadow-md">
            Mental Health and Psychiatry Care Software
          </p>
          <p className="text-xs text-slate-300 font-medium">
            Dr. N.R. Acharya Memorial Hospital • Practitioner Access
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE HEADER (Visible on Phone Screens < lg)                          */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full bg-gradient-to-br from-slate-950 via-[#002f43] to-[#023047] text-white p-5 relative overflow-hidden rounded-b-3xl shadow-xl">
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-8 left-10 w-28 h-28 bg-teal-400/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Mobile Top Navigation */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <a 
            href="/downloads/MANANTI.apk" 
            download="MANANTI.apk"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-full active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </a>
        </div>

        {/* Branding content */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center justify-center relative border border-white/20 shrink-0">
            <div className="absolute inset-0 bg-emerald-400 rounded-2xl animate-ping opacity-20"></div>
            <Stethoscope className="h-8 w-8 text-emerald-400 relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight leading-none">
                MANANTI
              </h1>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-snug mt-1">
              Mental Health & Psychiatry Care
            </p>
            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">
              Practitioner Portal Sign In
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SIGN IN FORM (Optimized for both Desktop & Mobile Phone View)          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 lg:p-20 bg-white relative">
        
        {/* Desktop Back button */}
        <div className="hidden lg:block absolute top-8 right-8">
          <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          
          <div className="mb-6 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Sign in to your practitioner account</p>
          </div>

          {/* Quick-Fill Demo Helpers for Fast Mobile Testing */}
          <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Fill:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('doctor')}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 active:scale-95 transition-all flex items-center gap-1"
              >
                <span>👨‍⚕️ Doctor</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff')}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 active:scale-95 transition-all flex items-center gap-1"
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
                Username / Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none text-slate-900 text-sm font-medium transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="doctor"
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
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none text-slate-900 text-sm font-medium transition-all"
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

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Dedicated Android APK Install Banner (Phone View) */}
          <div className="mt-8 pt-5 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Install Phone App</p>
                  <p className="text-[11px] text-slate-500">Android APK • 1.2 MB</p>
                </div>
              </div>
              <a
                href="/downloads/MANANTI.apk"
                download="MANANTI.apk"
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Encrypted Healthcare Access</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
