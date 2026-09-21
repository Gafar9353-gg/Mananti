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
    <div className="h-screen w-full relative overflow-hidden bg-white">
      
      {/* Top Navbar with Login Button overlaying the image */}
      <div className="absolute top-0 w-full p-8 flex justify-end z-50">
        <Link 
          to="/login" 
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200 text-[#004f6e] hover:bg-[#004f6e] hover:text-white hover:border-[#004f6e] px-8 py-3 rounded-full font-bold transition-all shadow-md"
        >
          <LogIn className="w-5 h-5" /> Login Options
        </Link>
      </div>

      {/* Full Screen Image (Text & Icons are baked into this exact image) */}
      <img 
        src="/home-bg.jpg" 
        alt="Psychiatry Care Home" 
        className="w-full h-full object-cover md:object-fill"
      />
      
    </div>
  );
};

export default Home;
