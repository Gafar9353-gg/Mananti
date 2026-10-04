import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Share, 
  MoreVertical, 
  ShieldCheck, 
  Zap, 
  Layers,
  Sparkles,
  Stethoscope
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type PlatformType = 'windows' | 'android' | 'ios' | 'mac' | 'other';

const getInitialPlatform = (): PlatformType => {
  if (typeof window === 'undefined') return 'windows';
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  if (/android/i.test(ua)) return 'android';
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'mac';
  if (/Windows/i.test(ua)) return 'windows';
  return 'other';
};

const getInitialStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

const Install: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(getInitialStandalone);
  const [detectedPlatform] = useState<PlatformType>(getInitialPlatform);
  const [activePlatform, setActivePlatform] = useState<PlatformType>(getInitialPlatform);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Check if already running standalone and listen for display-mode changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
      setCanPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle native install click
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setInstallSuccess(true);
        }
        setDeferredPrompt(null);
        setCanPrompt(false);
      } catch (err) {
        console.error('PWA install prompt error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-100 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* Top Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/mananti-logo.jpg" alt="MANANTI" className="w-10 h-10 rounded-xl object-contain shadow-md border border-slate-100 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none block">MANANTI</span>
              <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider block">Psychiatrist Care App</span>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-800 hover:text-purple-700 bg-slate-100 hover:bg-slate-200/80 px-4 py-2 rounded-xl transition-all"
          >
            <span>Continue to MANANTI Website</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        
        {/* App Hero Badge */}
        <div className="flex flex-col items-center text-center max-w-2xl mb-8">
          <div className="relative mb-6">
            <img 
              src="/mananti-logo.jpg" 
              alt="MANANTI Logo" 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl shadow-xl shadow-teal-900/10 border-4 border-white object-contain"
            />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-teal-500 to-purple-500 text-white p-1.5 rounded-full shadow-md border-2 border-white">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-wider bg-gradient-to-r from-[#0d9488] via-[#0284c7] to-[#8b5cf6] bg-clip-text text-transparent mb-1">
            MANANTI
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-1">
            Psychiatrist Care App
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-3 tracking-wide">
            Better Mind &bull; Brighter Tomorrow
          </p>
          <p className="text-sm text-slate-600 max-w-md">
            Install MANANTI on your device for a faster app-like experience.
          </p>
        </div>

        {/* ALREADY INSTALLED CARD */}
        {(isInstalled || installSuccess) ? (
          <div className="w-full max-w-xl bg-white rounded-3xl border border-emerald-200 p-8 shadow-xl shadow-emerald-500/5 mb-8 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              MANANTI is already installed
            </h2>
            <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">
              MANANTI is running on your device. You can open and use it directly anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#004f6e] hover:bg-[#023047] text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-[#004f6e]/20"
              >
                <span>Open MANANTI</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ) : (
          /* INSTALLATION CARD */
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden mb-8">
            
            {/* Platform Selector Tabs */}
            <div className="bg-slate-50/80 p-2 border-b border-slate-100 flex gap-1.5 justify-center overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActivePlatform('windows')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                  activePlatform === 'windows'
                    ? 'bg-white text-[#004f6e] shadow-sm border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Windows {detectedPlatform === 'windows' && '(Detected)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatform('android')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                  activePlatform === 'android'
                    ? 'bg-white text-[#004f6e] shadow-sm border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android {detectedPlatform === 'android' && '(Detected)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePlatform('ios')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                  activePlatform === 'ios'
                    ? 'bg-white text-[#004f6e] shadow-sm border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iOS / iPad</span>
              </button>
            </div>

            {/* Installation Body */}
            <div className="p-6 sm:p-8">
              
              {/* WINDOWS EXPERIENCE */}
              {activePlatform === 'windows' && (
                <div>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-100">
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Windows Desktop & Laptop</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                      Install MANANTI for Windows
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Run MANANTI as a dedicated desktop application with full screen support and offline access.
                    </p>
                  </div>

                  {canPrompt ? (
                    <div className="space-y-4">
                      <button
                        onClick={handleInstallClick}
                        className="w-full bg-[#004f6e] hover:bg-[#023047] text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg shadow-[#004f6e]/25 hover:shadow-xl hover:shadow-[#004f6e]/30 transition-all flex items-center justify-center gap-2 group"
                      >
                        <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                        <span>Install MANANTI</span>
                      </button>

                      <div className="text-center">
                        <span className="text-xs text-slate-400">or download standalone desktop setup:</span>
                      </div>

                      <a
                        href="/downloads/MANANTI-Setup.exe"
                        download="MANANTI-Setup.exe"
                        className="w-full bg-slate-100 hover:bg-slate-200 text-[#004f6e] py-3 px-5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Windows Desktop App (.exe)</span>
                      </a>
                    </div>
                  ) : (
                    <div>
                      {/* Chrome / Edge Instructions */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-left">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                          <Monitor className="w-4 h-4 text-[#004f6e]" />
                          <span>Installation Instructions for Chrome / Edge:</span>
                        </div>
                        
                        <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#004f6e] font-bold flex items-center justify-center text-xs">
                              1
                            </span>
                            <p>
                              Look at the right side of the address bar for the <strong className="text-slate-800">Install icon</strong> (🖥️ or ➕ icon).
                            </p>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#004f6e] font-bold flex items-center justify-center text-xs">
                              2
                            </span>
                            <p>
                              Alternatively, click the browser menu (<strong className="text-slate-800">⋮</strong> in Chrome or <strong className="text-slate-800">⋯</strong> in Edge) at the top-right corner.
                            </p>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#004f6e] font-bold flex items-center justify-center text-xs">
                              3
                            </span>
                            <p>
                              Select <strong className="text-slate-800">&quot;Save and share&quot; → &quot;Install MANANTI&quot;</strong> (Chrome) or <strong className="text-slate-800">&quot;Apps&quot; → &quot;Install this site as an app&quot;</strong> (Edge).
                            </p>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#004f6e] font-bold flex items-center justify-center text-xs">
                              4
                            </span>
                            <p>
                              Click <strong className="text-slate-800">&quot;Install&quot;</strong> in the confirmation popup. MANANTI will launch in its own window and be added to your Desktop and Start Menu.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        <a
                          href="/downloads/MANANTI-Setup.exe"
                          download="MANANTI-Setup.exe"
                          className="w-full bg-[#004f6e] hover:bg-[#023047] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md shadow-[#004f6e]/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Windows Desktop App (.exe)</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ANDROID EXPERIENCE */}
              {activePlatform === 'android' && (
                <div>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-100">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Android Mobile & Tablet</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                      Install MANANTI on Android
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Get full app capabilities on your phone with instant notifications and fast loading.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="/downloads/MANANTI.apk"
                      download="MANANTI.apk"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-center"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Android App (.apk)</span>
                    </a>

                    {canPrompt && (
                      <button
                        onClick={handleInstallClick}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-[#004f6e] py-3.5 px-6 rounded-2xl font-bold text-sm border border-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Install via Browser Prompt</span>
                      </button>
                    )}

                    {/* Android Manual Instructions */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-left">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <MoreVertical className="w-4 h-4 text-[#004f6e]" />
                        <span>How to install the downloaded APK:</span>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                        <p>1. Tap <strong>Download Android App (.apk)</strong> above.</p>
                        <p>2. Once downloaded, open the notification or file manager.</p>
                        <p>3. Tap <strong>Install</strong> (allow unknown sources if prompted).</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* iOS EXPERIENCE */}
              {activePlatform === 'ios' && (
                <div>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3 border border-slate-200">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>iPhone & iPad (Safari)</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">
                      Install MANANTI on iOS
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Follow these steps in Safari to add MANANTI to your iOS home screen.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-left">
                    <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs">
                          1
                        </span>
                        <p>
                          Tap the <strong className="text-slate-800">Share button</strong> (<Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> icon) at the bottom or top of Safari.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs">
                          2
                        </span>
                        <p>
                          Scroll down the share sheet and tap <strong className="text-slate-800">&quot;Add to Home Screen&quot;</strong>.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs">
                              3
                        </span>
                        <p>
                          Tap <strong className="text-slate-800">&quot;Add&quot;</strong> in the top-right corner to complete installation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* macOS / Other */}
              {(activePlatform === 'mac' || activePlatform === 'other') && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Install MANANTI
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Install MANANTI directly through your browser for quick desktop access.
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full bg-[#004f6e] hover:bg-[#023047] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md shadow-[#004f6e]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install MANANTI</span>
                  </button>
                </div>
              )}

              {/* Navigation link to website */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center">
                <Link
                  to="/"
                  className="text-sm font-semibold text-slate-500 hover:text-[#004f6e] flex items-center gap-1.5 transition-colors"
                >
                  <span>Continue to MANANTI Website</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* Feature Highlights Grid */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004f6e] flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Instant Launch</h3>
            <p className="text-xs text-slate-500 mt-0.5">Launches directly from your desktop or home screen</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Secure & Private</h3>
            <p className="text-xs text-slate-500 mt-0.5">End-to-end clinical data protection via HTTPS</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">No App Store Needed</h3>
            <p className="text-xs text-slate-500 mt-0.5">Always updated to latest version automatically</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/40">
        <p>© {new Date().getFullYear()} MANANTI Psychiatry Care. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-slate-400">Progressive Web Application (PWA) • No executable or APK download required</p>
      </footer>

    </div>
  );
};

export default Install;
