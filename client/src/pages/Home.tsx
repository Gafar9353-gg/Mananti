import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

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

      {/* MANANTI Main Home Graphic from User's Design */}
      <div className="relative h-full w-full max-w-[430px] flex items-center justify-center p-0">
        <img 
          src="/mananti-home.jpg" 
          alt="MANANTI Psychiatrist Care App" 
          className="w-full h-full object-contain drop-shadow-md pointer-events-none"
        />

        {/* Interactive Clickable 'Get Started' Button Overlay */}
        <Link
          to="/login"
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[76%] h-[56px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-teal-500/30"
          aria-label="Get Started"
          title="Get Started"
        >
          {/* Subtle animated hover shine to indicate clickability */}
          <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/15 transition-colors"></span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
