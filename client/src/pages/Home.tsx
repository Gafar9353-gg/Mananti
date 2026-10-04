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
  Smartphone,
  Brain,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

const Home = () => {
  const { doctor } = useContext(AuthContext);

  if (doctor) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-white font-sans antialiased selection:bg-teal-500 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW (Kept 100% faithful to the desktop psychiatric dashboard)  */}
      {/* ========================================================================= */}
      <div className="hidden md:block h-screen w-full relative overflow-hidden bg-white">
        <div className="absolute top-0 w-full p-8 flex justify-end z-50">
          <Link 
            to="/login" 
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200 text-[#004f6e] hover:bg-[#004f6e] hover:text-white hover:border-[#004f6e] px-8 py-3 rounded-full font-bold transition-all shadow-md active:scale-95"
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
      {/* 2. ANDROID PHONE VIEW (Smooth Native Android App Mobile Experience)        */}
      {/* ========================================================================= */}
      <div className="block md:hidden min-h-screen bg-slate-50 flex flex-col justify-between">
        
        {/* Android Top App Bar */}
        <header className="bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-slate-200/80 sticky top-0 z-30 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#004f6e] to-[#023047] flex items-center justify-center text-white shadow-md shadow-[#004f6e]/20">
              <Stethoscope className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base text-[#004f6e] tracking-tight leading-tight">MANANTI</h1>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">App</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Psychiatry Care</p>
            </div>
          </div>

          <a
            href="/downloads/MANANTI.apk"
            download="MANANTI.apk"
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm active:scale-95 transition-all"
            title="Download MANANTI Android App (.apk)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </a>
        </header>

        {/* Mobile Content */}
        <main className="p-4 space-y-4 flex-1">
          
          {/* Hero Medical Branding Card */}
          <div className="bg-gradient-to-br from-[#004f6e] via-[#005f85] to-[#023047] rounded-3xl p-5 text-white shadow-xl shadow-[#004f6e]/20 relative overflow-hidden">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-emerald-400/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/3 -mb-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Hospital Portal
              </span>
              <span className="text-[11px] text-slate-300 italic">Dr. Mahima Acharya</span>
            </div>

            <div className="mb-3">
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                MANANTI
              </h2>
              <p className="text-sm font-semibold text-emerald-300 tracking-wide mt-0.5">
                Mental Health and Psychiatry Care Software
              </p>
              <p className="text-xs text-slate-200 italic font-medium mt-1">
                "Better minds. Healthier lives."
              </p>
            </div>

            <p className="text-xs text-slate-200/90 mb-5 font-normal leading-relaxed">
              Dr. N.R. Acharya Memorial Hospital. Comprehensive patient psychiatric care, outpatient tokens & smart prescription management.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Options / Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <a
                href="/downloads/MANANTI.apk"
                download="MANANTI.apk"
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                <Smartphone className="w-4 h-4 text-emerald-300" />
                <span>Download Phone App (.apk)</span>
              </a>
            </div>
          </div>

          {/* 4 Core Pillars from the Psychiatric Care Dashboard */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Core Clinical Features
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold">Touch to access</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              
              {/* 1. Patient Management */}
              <Link
                to="/login"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#004f6e] active:scale-98 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004f6e] flex items-center justify-center mb-3">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Patient Management</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Clinical records & history</p>
                </div>
              </Link>

              {/* 2. Treatment Plans */}
              <Link
                to="/login"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#004f6e] active:scale-98 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Treatment Plans</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Rx, 1-0-1 dosing & charts</p>
                </div>
              </Link>

              {/* 3. Appointments */}
              <Link
                to="/login"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#004f6e] active:scale-98 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Appointments</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tokens & patient queue</p>
                </div>
              </Link>

              {/* 4. Secure Records */}
              <Link
                to="/login"
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-[#004f6e] active:scale-98 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Secure Records</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Encrypted health files</p>
                </div>
              </Link>

            </div>
          </div>

          {/* Android Direct Installation Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Download Android App</h4>
                <p className="text-[11px] text-slate-600">Install MANANTI.apk on your phone (1.2 MB)</p>
              </div>
            </div>
            <a
              href="/downloads/MANANTI.apk"
              download="MANANTI.apk"
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0 ml-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </a>
          </div>

          {/* Security & Hospital Footnote */}
          <div className="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-400 py-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-slate-600">End-to-End Encrypted Psychiatric Care</span>
            </div>
            <p className="text-[10px] text-slate-400">Dr. N.R. Acharya Memorial Hospital • v2.0</p>
          </div>

        </main>

        {/* Android Bottom Navigation Bar */}
        <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 flex items-center justify-around sticky bottom-0 z-30 shadow-lg">
          <Link to="/" className="flex flex-col items-center gap-0.5 text-[#004f6e] font-bold text-[10px]">
            <div className="p-1 rounded-xl bg-[#004f6e]/10">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span>Home</span>
          </Link>

          <Link to="/login" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-800 text-[10px]">
            <Brain className="w-4 h-4" />
            <span>Patients</span>
          </Link>

          <Link to="/login" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-800 text-[10px]">
            <ClipboardList className="w-4 h-4" />
            <span>Prescriptions</span>
          </Link>

          <Link to="/login" className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-800 text-[10px]">
            <LogIn className="w-4 h-4 text-emerald-600" />
            <span>Login</span>
          </Link>
        </nav>

      </div>

    </div>
  );
};

export default Home;
