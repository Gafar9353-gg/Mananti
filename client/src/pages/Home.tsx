import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, ArrowRight } from 'lucide-react';

const Home = () => {
  const { doctor } = useContext(AuthContext);

  if (doctor) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#f1f6fc] via-[#ffffff] to-[#eef9f6] flex flex-col justify-between items-center font-sans select-none p-4 sm:p-6">
      {/* Top Header: MANANTI Logo + Name on Left, Login on Right */}
      <header className="w-full max-w-md flex justify-between items-center z-50 pt-2 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-white rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-center">
            <img 
              src="/mananti-logo.png" 
              alt="MANANTI Logo" 
              className="w-8 h-8 object-contain rounded-lg" 
            />
          </div>
          <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-teal-700 via-teal-800 to-purple-700 bg-clip-text text-transparent tracking-wider">
            MANANTI
          </span>
        </div>

        <Link 
          to="/login" 
          className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md border border-slate-200 text-teal-800 hover:text-purple-700 hover:border-purple-300 px-4 sm:px-5 py-2 rounded-full font-bold transition-all shadow-sm active:scale-95 text-xs sm:text-sm"
        >
          <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
          <span>Login</span>
        </Link>
      </header>

      {/* MANANTI Main Graphic (Cropped, clean, no drawn duplicate button) */}
      <div className="relative flex-1 w-full max-w-[400px] flex items-center justify-center py-2">
        <img 
          src="/mananti-home.jpg" 
          alt="MANANTI Psychiatrist Care App" 
          className="max-h-[60vh] w-auto object-contain drop-shadow-md pointer-events-none"
        />
      </div>

      {/* Exactly ONE Interactive 'Get Started' Button */}
      <div className="w-full max-w-md flex flex-col items-center pb-4 sm:pb-6 z-40">
        <Link
          to="/login"
          className="w-[88%] max-w-[340px] h-[54px] bg-gradient-to-r from-[#0d9488] via-[#0284c7] to-[#8b5cf6] hover:opacity-95 text-white font-extrabold text-base sm:text-lg rounded-full flex items-center justify-center gap-2 shadow-xl shadow-teal-900/25 transition-all duration-200 active:scale-95 cursor-pointer tracking-wide"
          aria-label="Get Started"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
