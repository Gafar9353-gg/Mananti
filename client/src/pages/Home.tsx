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
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW (Visible on screen width >= md: Laptops, Desktops, PCs)   */}
      {/* Classic / Old MANANTI desktop style with full home-bg.jpg & Login Options */}
      {/* ========================================================================= */}
      <div className="hidden md:block h-screen w-full relative overflow-hidden bg-white font-sans select-none">
        {/* Top Navbar with Login Button overlaying the image */}
        <div className="absolute top-0 w-full p-6 lg:p-8 flex justify-end z-50">
          <Link 
            to="/login" 
            className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 text-[#004f6e] hover:bg-[#004f6e] hover:text-white hover:border-[#004f6e] px-7 lg:px-8 py-2.5 lg:py-3 rounded-full font-bold transition-all shadow-md active:scale-95 text-sm lg:text-base cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            <span>Login Options</span>
          </Link>
        </div>

        {/* Full Screen Desktop Image */}
        <img 
          src="/home-bg.jpg" 
          alt="MANANTI Mental Health and Psychiatry Care Software" 
          className="w-full h-full object-fill pointer-events-none"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. PHONE & APK VIEW (Visible on mobile screens < md / Phones / APK app)   */}
      {/* New MANANTI style: Logo + Name header, clean graphic, single Get Started  */}
      {/* ========================================================================= */}
      <div className="flex md:hidden h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#f1f6fc] via-[#ffffff] to-[#eef9f6] flex-col justify-between items-center font-sans select-none p-4">
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
            <span className="text-xl font-black bg-gradient-to-r from-teal-700 via-teal-800 to-purple-700 bg-clip-text text-transparent tracking-wider">
              MANANTI
            </span>
          </div>

          <Link 
            to="/login" 
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 text-teal-800 hover:text-purple-700 hover:border-purple-300 px-4 py-2 rounded-full font-bold transition-all shadow-sm active:scale-95 text-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-teal-600" />
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
        <div className="w-full max-w-md flex flex-col items-center pb-4 z-40">
          <Link
            to="/login"
            className="w-[88%] max-w-[340px] h-[54px] bg-gradient-to-r from-[#0d9488] via-[#0284c7] to-[#8b5cf6] hover:opacity-95 text-white font-extrabold text-base rounded-full flex items-center justify-center gap-2 shadow-xl shadow-teal-900/25 transition-all duration-200 active:scale-95 cursor-pointer tracking-wide"
            aria-label="Get Started"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
