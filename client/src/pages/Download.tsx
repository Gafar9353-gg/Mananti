import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Monitor, 
  Smartphone, 
  Download as DownloadIcon, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  Sparkles,
  Stethoscope,
  FileCheck
} from 'lucide-react';

type Platform = 'windows' | 'android' | 'other';

const Download: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [device, setDevice] = useState<Platform>('windows');
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    let detected: Platform = 'windows';
    if (/android/i.test(ua)) {
      detected = 'android';
    } else if (/Windows/i.test(ua)) {
      detected = 'windows';
    } else {
      detected = 'other';
    }
    setDevice(detected);

    // Auto-trigger download if auto=true or on initial visit
    const noAuto = searchParams.get('auto') === 'false';
    if (!noAuto) {
      const timer = setTimeout(() => {
        if (detected === 'windows') {
          triggerDownload('/downloads/MANANTI-Setup.exe', 'MANANTI-Setup.exe');
        } else if (detected === 'android') {
          triggerDownload('/downloads/MANANTI.apk', 'MANANTI.apk');
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-100 font-sans text-slate-800 flex flex-col justify-between">
      
      {/* Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/mananti-app-icon.png" alt="MANANTI" className="w-10 h-10 rounded-xl object-contain shadow-md border border-slate-100" />
            <div>
              <span className="font-extrabold text-lg text-slate-900 leading-none block">MANANTI</span>
              <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider block">Psychiatrist Care App</span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold text-teal-800 hover:text-purple-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>Open Web App</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        
        {/* App Hero */}
        <div className="flex flex-col items-center text-center max-w-xl mb-8">
          <div className="relative mb-5">
            <img 
              src="/mananti-app-icon.png" 
              alt="MANANTI App Icon" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl shadow-xl shadow-teal-900/10 border-4 border-white object-contain"
            />
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-teal-500 to-purple-500 text-white p-1 rounded-full shadow border-2 border-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-wider bg-gradient-to-r from-[#0d9488] via-[#0284c7] to-[#8b5cf6] bg-clip-text text-transparent mb-1">
            Download MANANTI
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight mb-1">
            Psychiatrist Care App
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-2">
            Better Mind &bull; Brighter Tomorrow
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Fast, secure, dedicated application for your laptop and mobile device.
          </p>
        </div>

        {/* Download Status Alert */}
        {downloadStarted && (
          <div className="w-full max-w-xl bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-emerald-800 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="flex-1">
              Your download has started automatically! If it did not start, click one of the buttons below.
            </p>
          </div>
        )}

        {/* Primary Download Cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          
          {/* WINDOWS CARD */}
          <div className={`bg-white rounded-3xl border ${device === 'windows' ? 'border-[#004f6e] ring-2 ring-[#004f6e]/20' : 'border-slate-200'} p-6 sm:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden group`}>
            {device === 'windows' && (
              <div className="absolute top-4 right-4 bg-[#004f6e] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Your Device
              </div>
            )}
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#004f6e] flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Windows Laptop / PC
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Standalone desktop application for Windows 10 & 11 with desktop shortcut.
              </p>
              
              <div className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Format: <strong>MANANTI-Setup.exe</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified & Secure Installer</span>
                </div>
              </div>
            </div>

            <a
              href="/downloads/MANANTI-Setup.exe"
              download="MANANTI-Setup.exe"
              onClick={() => setDownloadStarted(true)}
              className="w-full bg-[#004f6e] hover:bg-[#023047] text-white py-3.5 px-5 rounded-2xl font-bold text-sm shadow-md shadow-[#004f6e]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-center"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Download for Windows (.exe)</span>
            </a>
          </div>

          {/* ANDROID CARD */}
          <div className={`bg-white rounded-3xl border ${device === 'android' ? 'border-[#004f6e] ring-2 ring-[#004f6e]/20' : 'border-slate-200'} p-6 sm:p-7 shadow-lg flex flex-col justify-between relative overflow-hidden group`}>
            {device === 'android' && (
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Your Device
              </div>
            )}

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Android Phone / Tablet
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Native Android package (APK) for mobile install with full-screen experience.
              </p>

              <div className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Format: <strong>MANANTI.apk</strong> (1.2 MB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Signed & Ready to Install</span>
                </div>
              </div>
            </div>

            <a
              href="/downloads/MANANTI.apk"
              download="MANANTI.apk"
              onClick={() => setDownloadStarted(true)}
              className="w-full bg-[#004f6e] hover:bg-[#023047] text-white py-3.5 px-5 rounded-2xl font-bold text-sm shadow-md shadow-[#004f6e]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-center"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Download for Android (.apk)</span>
            </a>
          </div>

        </div>

        {/* Quick Installation Steps */}
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Quick Installation Guide</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
            <div>
              <p className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-[#004f6e]" /> On Windows Laptop:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Click <strong>Download for Windows (.exe)</strong>.</li>
                <li>Open the downloaded <strong>MANANTI-Setup.exe</strong>.</li>
                <li>MANANTI will launch and automatically create a Desktop shortcut.</li>
              </ol>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" /> On Android Phone:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Tap <strong>Download for Android (.apk)</strong>.</li>
                <li>When download finishes, tap the notification or open <strong>MANANTI.apk</strong>.</li>
                <li>Tap <strong>Install</strong> (allow install from this source if prompted).</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Web Access Link */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <span>Prefer using your web browser?</span>
          <Link to="/" className="text-[#004f6e] hover:underline flex items-center gap-1">
            <span>Continue to MANANTI Web</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/40">
        <p>© {new Date().getFullYear()} MANANTI Psychiatry Care. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-slate-400">Direct secured downloads for Windows Desktop (.exe) and Android (.apk)</p>
      </footer>

    </div>
  );
};

export default Download;
