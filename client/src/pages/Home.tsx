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
    <div className="h-screen w-full relative overflow-hidden bg-white font-sans">
      {/* Top Bar with Login Options Button */}
      <div className="absolute top-0 w-full p-4 sm:p-8 flex justify-end z-50">
        <Link 
          to="/login" 
          className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 text-[#004f6e] hover:bg-[#004f6e] hover:text-white hover:border-[#004f6e] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold transition-all shadow-md active:scale-95 text-sm sm:text-base"
        >
          <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Login Options</span>
        </Link>
      </div>

      {/* MANANTI Desktop Image */}
      <img 
        src="/home-bg.jpg" 
        alt="MANANTI Mental Health and Psychiatry Care Software" 
        className="w-full h-full object-cover sm:object-fill"
      />
    </div>
  );
};

export default Home;
