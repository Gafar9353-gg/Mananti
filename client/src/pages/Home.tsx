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
    <div className="h-screen w-full relative overflow-hidden bg-[#eef5f8] flex flex-col justify-center items-center font-sans">
      {/* Top Bar with Login Options Button */}
      <div className="absolute top-0 w-full p-3 sm:p-8 flex justify-end z-50">
        <Link 
          to="/login" 
          className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md border border-slate-200 text-[#004f6e] hover:bg-[#004f6e] hover:text-white hover:border-[#004f6e] px-4 sm:px-8 py-2 sm:py-3 rounded-full font-bold transition-all shadow-md active:scale-95 text-xs sm:text-base"
        >
          <LogIn className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          <span>Login Options</span>
        </Link>
      </div>

      {/* MANANTI Main Graphic completely fitted on mobile phone view without cropping */}
      <div className="w-full h-full flex items-center justify-center p-0">
        <img 
          src="/home-bg.jpg" 
          alt="MANANTI Mental Health and Psychiatry Care Software" 
          className="w-full h-full object-contain sm:object-fill"
        />
      </div>
    </div>
  );
};

export default Home;
