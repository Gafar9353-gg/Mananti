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
      {/* New MANANTI style: Full poster graphic + floating Get Started button      */}
      {/* ========================================================================= */}
      <div className="flex md:hidden w-full relative overflow-hidden bg-[#dceff3] select-none" style={{ height: '100dvh' }}>
        {/* Blurred backdrop fills any leftover space on tall/narrow phones */}
        <img
          src="/mananti-home.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-80 pointer-events-none"
        />
        {/* Full poster, never cropped or stretched */}
        <img 
          src="/mananti-home.jpg" 
          alt="MANANTI Mental Health & Psychiatric Care Software" 
          className="relative w-full h-full object-contain pointer-events-none"
        />

        {/* Floating Top Right Login Pill */}
        <div className="absolute top-0 right-0 p-4 z-40">
          <Link 
            to="/login" 
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 text-teal-800 hover:text-purple-700 px-4 py-1.5 rounded-full font-bold transition-all shadow-md active:scale-95 text-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-teal-600" />
            <span>Login</span>
          </Link>
        </div>

        {/* Floating Bottom 'Get Started' Button */}
        <div className="absolute bottom-5 left-0 w-full flex justify-center px-6 z-40">
          <Link
            to="/login"
            className="w-full max-w-[340px] h-[52px] bg-gradient-to-r from-[#0d9488] via-[#0284c7] to-[#8b5cf6] hover:opacity-95 text-white font-black text-base sm:text-lg rounded-full flex items-center justify-center gap-2 shadow-2xl shadow-teal-950/40 transition-all duration-200 active:scale-95 cursor-pointer tracking-wider"
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
