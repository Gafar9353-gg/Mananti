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
  ArrowRight
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
      {/* ========================================================================= */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#e6f7f5] via-[#f0f9ff] to-[#f5f3ff] items-center justify-center p-12 overflow-hidden border-r border-slate-100">
        <div className="relative z-10 text-center flex flex-col items-center max-w-md">
          {/* Official Brain + Leaf App Logo */}
          <div className="p-3 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-teal-900/5 mb-6 border border-white">
            <img 
              src="/mananti-logo.jpg" 
              alt="MANANTI Logo" 
              className="w-28 h-28 object-contain rounded-2xl"
            />
          </div>
          
          <h1 className="text-5xl font-black tracking-wider bg-gradient-to-r from-[#0d9488] via-[#0284c7] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
            MANANTI
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
            Psychiatrist Care App
          </h2>
          <p className="text-sm font-semibold text-slate-500 tracking-wide mb-6">
            Better Mind &bull; Brighter Tomorrow
          </p>
          
          <div className="bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-200/60 shadow-sm max-w-sm">
            <p className="text-slate-600 font-medium text-sm leading-relaxed">
              Professional support for a healthier, happier you.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE HEADER (Phone View with Brain+Leaf Logo & Theme)                 */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full bg-gradient-to-b from-[#e6f7f5] to-white/60 p-6 relative overflow-hidden text-center flex flex-col items-center">
        {/* Back to Home Button */}
        <div className="w-full flex justify-between items-center mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-purple-700 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
            Care Portal
          </span>
        </div>

        {/* Mobile Logo & Brand */}
        <div className="flex flex-col items-center">
          <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-100 mb-3">
            <img 
              src="/mananti-logo.jpg" 
              alt="MANANTI Logo" 
              className="w-16 h-16 object-contain rounded-xl"
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-[#0d9488] via-[#0284c7] to-[#8b5cf6] bg-clip-text text-transparent leading-none">
            MANANTI
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Psychiatrist Care App
          </p>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Better Mind &bull; Brighter Tomorrow
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SIGN IN FORM CARD                                                      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 lg:p-16 relative z-10">
        
        {/* Desktop Back button */}
        <div className="hidden lg:block absolute top-8 right-8">
          <Link 
            to="/" 
            className="text-sm font-semibold text-slate-500 hover:text-teal-700 transition-colors flex items-center gap-1.5 bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
          
          <div className="mb-6 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Sign In</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Access your psychiatric care account</p>
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
              className="w-full bg-gradient-to-r from-[#10b981] via-[#0d9488] to-[#8b5cf6] hover:opacity-95 active:scale-98 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-teal-600/25 mt-5 flex items-center justify-center gap-2 cursor-pointer"
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
