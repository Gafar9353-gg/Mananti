import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Eye, EyeOff, Stethoscope } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      {/* Left side image */}
        <div className="hidden lg:flex w-1/2 relative bg-slate-950 items-center justify-center overflow-hidden">
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
          <h1 className="text-5xl font-bold text-white tracking-tight mb-4 text-shadow-sm drop-shadow-lg">MANANTI</h1>
          <p className="text-xl text-slate-300 font-medium mb-6 px-4 drop-shadow-md">
            Mental Health and Psychiatry Care Software
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="absolute top-8 right-8">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            &larr; Back to Home
          </Link>
        </div>
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in to your practitioner account</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username / Email Address</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="doctor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 mt-4"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
