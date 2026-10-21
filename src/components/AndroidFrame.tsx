import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Smartphone,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  Users,
  History,
  LogIn,
  LogOut,
  Building2,
  Download,
} from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { ScreenType } from '../types/attendance';
import { AdMobBanner } from './AdMobBanner';

interface AndroidFrameProps {
  children: React.ReactNode;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: User | null;
  hasGoogleSheetWebhook: boolean;
  onOpenSheetsSetup: () => void;
  onOpenRecords: () => void;
  onOpenStudents: () => void;
  onOpenDownload: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  currentScreen,
  onNavigate,
  user,
  hasGoogleSheetWebhook,
  onOpenSheetsSetup,
  onOpenRecords,
  onOpenStudents,
  onOpenDownload,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Strictly comply with AdMob policy: Never show ads on camera or selfie capture screens!
  const shouldShowAdMobBanner = currentScreen !== 'selfie-camera' && currentScreen !== 'splash';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 transition-all duration-300">
      {/* Top Desktop Controls Bar (only visible on tablet/desktop) */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200 tracking-wide">
            ANGAN EDUCARE ATTENDANCE
          </span>
          <span className="bg-blue-900/60 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-700/50">
            Android OS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition cursor-pointer"
            title="Toggle Android Device Frame or Full Screen"
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Screen</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container - Android Mockup or Responsive Full View */}
      <div
        className={`w-full bg-white text-slate-800 flex flex-col overflow-hidden transition-all duration-300 ${
          isPhoneFrame
            ? 'sm:max-w-[420px] sm:h-[860px] sm:rounded-[42px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700'
            : 'max-w-2xl min-h-screen sm:min-h-[850px] sm:rounded-2xl shadow-xl'
        }`}
      >
        {/* Android Device Notch & Status Bar */}
        <div className="bg-blue-900 text-white px-5 pt-2.5 pb-2 flex items-center justify-between text-xs select-none relative z-30">
          <div className="font-semibold tracking-wider font-mono text-[13px]">{timeStr || '09:41'}</div>
          {/* Subtle camera punch hole */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="flex items-center gap-2.5 text-blue-200">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono">98%</span>
              <Battery className="w-4 h-4 fill-white" />
            </div>
          </div>
        </div>

        {/* Foundation App Top Bar */}
        <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white px-4 py-2.5 shadow-md flex items-center justify-between z-20">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => onNavigate('splash')}
            title="Angan Educare Foundation"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-inner">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xs font-bold uppercase tracking-wider leading-tight text-white">
                ANGAN EDUCARE
              </h1>
              <p className="text-[10px] text-blue-200 font-medium tracking-tight">FOUNDATION • ATTENDANCE</p>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-1.5">
            {/* Download / Install App Button */}
            <button
              onClick={onOpenDownload}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-400 hover:bg-amber-300 text-blue-950 transition cursor-pointer shadow-sm"
              title="Download / Install App"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>

            {/* Google Sheets Status Indicator Button */}
            <button
              onClick={onOpenSheetsSetup}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition cursor-pointer border ${
                hasGoogleSheetWebhook
                  ? 'bg-emerald-600/90 hover:bg-emerald-700 text-white border-emerald-400/30'
                  : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
              }`}
              title="Google Sheet Sync Status"
            >
              <FileSpreadsheet className="w-3 h-3" />
              <span>{hasGoogleSheetWebhook ? 'Sheets Active' : 'Link Sheet'}</span>
            </button>

            {/* Auth / User avatar */}
            {user ? (
              <div className="flex items-center gap-1 pl-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-white/40 object-cover"
                    title={`Signed in as ${user.displayName || user.email}`}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 border border-white/40 flex items-center justify-center text-xs font-bold text-white">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="p-1 text-blue-200 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={authLoading}
                className="flex items-center gap-1 bg-white text-blue-900 hover:bg-blue-50 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow transition cursor-pointer"
              >
                <LogIn className="w-3 h-3 text-blue-700" />
                <span>{authLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50 relative">
          {children}
        </main>

        {/* Google AdMob Mobile Banner Slot (Compliant Placement: Never over camera/attendance capture) */}
        {shouldShowAdMobBanner && (
          <div className="border-t border-slate-200 bg-slate-50 shrink-0">
            <AdMobBanner />
          </div>
        )}

        {/* Bottom Android Navigation Bar */}
        <nav className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around text-slate-600 text-[11px] select-none shadow-lg z-20">
          <button
            onClick={() => onNavigate('student-id')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition cursor-pointer ${
              currentScreen === 'student-id' || currentScreen === 'selfie-camera' || currentScreen === 'success'
                ? 'text-blue-700 font-bold bg-blue-50'
                : 'hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Attendance</span>
          </button>

          <button
            onClick={onOpenRecords}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition cursor-pointer ${
              currentScreen === 'records'
                ? 'text-blue-700 font-bold bg-blue-50'
                : 'hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Records</span>
          </button>

          <button
            onClick={onOpenStudents}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition cursor-pointer ${
              currentScreen === 'students'
                ? 'text-blue-700 font-bold bg-blue-50'
                : 'hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students</span>
          </button>

          <button
            onClick={onOpenSheetsSetup}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl hover:text-slate-900 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Sheet Sync</span>
          </button>
        </nav>

        {/* Android Gesture Pill Indicator */}
        <div className="bg-white py-1 flex justify-center items-center">
          <div className="w-28 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
