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
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#f1f6fc] via-[#ffffff] to-[#eef9f6] flex flex-col justify-center items-center font-sans select-none">
      {/* Top Bar with Login Button */}
      <div className="absolute top-0 w-full p-3 sm:p-6 flex justify-end z-50">
        <Link 
          to="/login" 
          className="flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md border border-slate-200/90 text-teal-800 hover:text-purple-700 hover:border-purple-300 px-4 sm:px-6 py-2 rounded-full font-bold transition-all shadow-sm active:scale-95 text-xs sm:text-sm"
        >
          <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
          <span>Login</span>
        </Link>
      </div>

      {/* MANANTI Main Home Graphic */}
      <div className="relative h-full w-full max-w-[430px] flex items-center justify-center p-0">
        <img 
          src="/mananti-home.jpg" 
          alt="MANANTI Psychiatrist Care App" 
          className="w-full h-full object-contain drop-shadow-md pointer-events-none"
        />

        {/* Visible Styled 'Get Started' Button */}
        <Link
          to="/login"
          className="absolute bottom-[9%] left-1/2 -translate-x-1/2 w-[78%] max-w-[320px] h-[52px] bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 hover:from-teal-800 hover:to-teal-950 text-white font-extrabold text-base rounded-full flex items-center justify-center gap-2 shadow-xl shadow-teal-900/30 transition-all duration-200 active:scale-95 cursor-pointer z-30 tracking-wide"
          aria-label="Get Started"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
