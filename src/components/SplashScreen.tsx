import React, { useEffect, useState } from 'react';
import { Building2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onContinue: () => void;
  foundationName?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onContinue,
  foundationName = 'ANGAN EDUCARE FOUNDATION',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-950 text-white relative overflow-hidden select-none">
      {/* Decorative background geometry */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <div className="pt-6 flex flex-col items-center text-center z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold tracking-wider text-blue-200 uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
          Official Mobile Attendance
        </span>
      </div>

      {/* Central Branding */}
      <div className="flex flex-col items-center text-center max-w-xs z-10 my-auto">
        {/* Emblem & Logo Seal */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-white/10 to-white/25 backdrop-blur-md border-2 border-white/30 flex items-center justify-center shadow-2xl ring-8 ring-blue-500/20 animate-pulse">
            <Building2 className="w-14 h-14 text-white drop-shadow-md" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-amber-400 border-2 border-blue-950 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
        </div>

        {/* Foundation Name */}
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2 leading-snug">
          {foundationName}
        </h1>

        {/* Foundation Motto */}
        <p className="text-sm text-blue-200 font-medium mb-4 leading-relaxed">
          Nurturing Minds • Building Futures
        </p>

        <div className="text-[11px] text-blue-300/80 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-800/40 font-mono">
          Smart Android Selfie Verification System
        </div>
      </div>

      {/* Bottom Loading Progress & Continue Button */}
      <div className="w-full max-w-xs pb-4 z-10 flex flex-col items-center gap-3">
        {progress < 100 ? (
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] text-blue-200 font-medium">
              <span>Initializing secure app...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-blue-950/60 rounded-full overflow-hidden border border-blue-700/40">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-medium mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready for attendance capture</span>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-900 font-bold py-3.5 px-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all cursor-pointer text-sm"
        >
          <span>Tap to Enter Student ID</span>
          <ArrowRight className="w-4 h-4 text-blue-700" />
        </button>

        <p className="text-[10px] text-blue-300/60 text-center">
          Angan Educare Foundation Attendance v2.4 • Powered by Firebase & Google Sheets
        </p>
      </div>
    </div>
  );
};
