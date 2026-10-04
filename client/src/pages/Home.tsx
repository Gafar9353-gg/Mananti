import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LogIn, 
  Stethoscope, 
  Users, 
  Calendar, 
  ClipboardList, 
  PackageSearch, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Sparkles,
  Smartphone
} from 'lucide-react';

const Home = () => {
  const { doctor } = useContext(AuthContext);

  if (doctor) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-white font-sans">
      
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW (Kept exactly as original for PC / Laptop screens)        */}
      {/* ========================================================================= */}
      <div className="hidden md:block h-screen w-full relative overflow-hidden bg-white">
        <div className="absolute top-0 w-full p-8 flex justify-end z-50">
          <Link 
            to="/login" 
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200 text-[#004f6e] hover:bg-[#004f6e] hover:text-white hover:border-[#004f6e] px-8 py-3 rounded-full font-bold transition-all shadow-md"
          >
            <LogIn className="w-5 h-5" /> Login Options
          </Link>
        </div>
        <img 
          src="/home-bg.jpg" 
          alt="Psychiatry Care Home" 
          className="w-full h-full object-cover md:object-fill"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. ANDROID PHONE VIEW (Native Android App Interface for Mobile Screens)   */}
      {/* ========================================================================= */}
      <div className="block md:hidden min-h-screen bg-slate-50 flex flex-col justify-between">
        
        {/* Android Top App Bar */}
        <header className="bg-white px-5 py-4 border-b border-slate-200/80 sticky top-0 z-30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#004f6e] to-[#023047] flex items-center justify-center text-white shadow-md shadow-[#004f6e]/20">
              <Stethoscope className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">MANANTI</h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Psychiatry Care Mobile</p>
            </div>
          </div>

          <Link
            to="/download"
            className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl"
            title="Download Android App"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get App</span>
          </Link>
        </header>

        {/* Mobile Content */}
        <main className="p-4 space-y-4 flex-1">
          
          {/* Hospital Greeting Card */}
          <div className="bg-gradient-to-br from-[#004f6e] via-[#005f85] to-[#023047] rounded-3xl p-5 text-white shadow-xl shadow-[#004f6e]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30">
                Hospital Portal
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <h2 className="text-xl font-extrabold tracking-tight mb-1">
              Dr. N.R. Acharya Memorial Hospital
            </h2>
            <p className="text-xs text-slate-200 mb-4 font-medium leading-relaxed">
              Dr. Mahima Acharya (MBBS, MD Psychiatrist) • Mental Health, Prescriptions & Clinic Records
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Practitioner Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Access Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-2.5">
              Clinic Mobile Services
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#004f6e] transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#004f6e] flex items-center justify-center mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Patients</h4>
                  <p className="text-[10px] text-slate-500">Records & Case History</p>
                </div>
              </Link>

              <Link
                to="/login"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#004f6e] transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Prescriptions</h4>
                  <p className="text-[10px] text-slate-500">1-0-1 Dosing & Duration</p>
                </div>
              </Link>

              <Link
                to="/login"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#004f6e] transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Token Queue</h4>
                  <p className="text-[10px] text-slate-500">Live Patient Tokens</p>
                </div>
              </Link>

              <Link
                to="/login"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#004f6e] transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <PackageSearch className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Pharmacy</h4>
                  <p className="text-[10px] text-slate-500">Stock & Batch Expiry</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Android App Download Banner */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Install MANANTI Android App</h4>
                <p className="text-[11px] text-slate-500">Get 1-tap access on your home screen</p>
              </div>
            </div>
            <a
              href="/downloads/MANANTI.apk"
              download="MANANTI.apk"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </a>
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted Clinical Portal</span>
          </div>

        </main>

        {/* Android Bottom Navigation Bar */}
        <nav className="bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-around sticky bottom-0 z-30 shadow-lg">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-[#004f6e] font-bold text-[10px]">
            <div className="p-1 rounded-xl bg-[#004f6e]/10">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span>Home</span>
          </Link>

          <Link to="/login" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-800 text-[10px]">
            <Users className="w-4 h-4" />
            <span>Patients</span>
          </Link>

          <Link to="/login" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-800 text-[10px]">
            <ClipboardList className="w-4 h-4" />
            <span>Prescription</span>
          </Link>

          <Link to="/login" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-800 text-[10px]">
            <LogIn className="w-4 h-4 text-emerald-600" />
            <span>Sign In</span>
          </Link>
        </nav>

      </div>

    </div>
  );
};

export default Home;
