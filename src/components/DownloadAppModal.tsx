import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Check,
  Copy,
  ExternalLink,
  X,
  Code2,
  Share2,
  FolderArchive,
  Layers,
  Sparkles,
  QrCode,
} from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'apk' | 'source'>('phone');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCapacitor, setCopiedCapacitor] = useState(false);

  if (!isOpen) return null;

  const sharedAppUrl = 'https://ais-pre-omzqmjwluzuylyhohn7kzh-980881001485.asia-east1.run.app';

  const capacitorCommands = `# 1. Install Capacitor for native Android build
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Android app
npx cap init "Angan Educare Attendance" org.anganeducare.attendance --web-dir dist

# 3. Build project
npm run build

# 4. Add Android platform & copy files
npx cap add android
npx cap copy

# 5. Open in Android Studio to generate APK
npx cap open android
# (Android Studio me: Menu > Build > Build Bundle(s) / APK(s) > Build APK)`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCapacitor = () => {
    navigator.clipboard.writeText(capacitorCommands);
    setCopiedCapacitor(true);
    setTimeout(() => setCopiedCapacitor(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-amber-300">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                App Download & Installation
              </h3>
              <p className="text-xs text-blue-200">
                ANGAN EDUCARE FOUNDATION Mobile Attendance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'phone'
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. Phone me Install</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'apk'
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Android APK File</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'source'
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>3. Source Code ZIP</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'phone' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="font-extrabold text-blue-900 text-sm block mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Sabse Aasan Tarika: Android Phone par Install karein
                </span>
                <p className="text-slate-600 text-xs">
                  Aapko kisi computer ya Android Studio ki zaroorat nahi hai. Niche diye gaye link se direct apne mobile me full-screen app install karein:
                </p>
              </div>

              {/* Shared Link Card */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Shared Live App Link:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={sharedAppUrl}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <a
                  href={sharedAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-bold hover:underline pt-1"
                >
                  <span>Open in Browser</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Step by step install guide */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Mobile me Kaise Install Karein:</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      1
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Upar diye gaye link ko apne <strong>Android Phone ke Chrome Browser</strong> me open karein.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      2
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Chrome ke top-right me <strong>3 dots (⋮)</strong> menu par tap karein.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      3
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Menu me <strong>&quot;Install app&quot;</strong> ya <strong>&quot;Add to Home screen&quot;</strong> par tap karein.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      ✓
                    </span>
                    <p className="text-[11px] text-emerald-900 font-semibold">
                      App aapke phone ki home screen par <strong>ANGAN EDUCARE FOUNDATION</strong> icon ke sath install ho jayegi aur bina browser bar ke bilkul native app ki tarah chalegi!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <p className="font-bold text-xs">
                  Apne Computer se .APK File Generate Karein:
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Package Name: <code className="font-mono font-bold">org.anganeducare.attendance</code>
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 text-xs">
                    Terminal / Command Prompt Commands:
                  </span>
                  <button
                    onClick={handleCopyCapacitor}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer"
                  >
                    {copiedCapacitor ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCapacitor ? 'Copied!' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[10px] rounded-xl overflow-x-auto max-h-56 leading-relaxed">
                  {capacitorCommands}
                </pre>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <p className="font-bold text-slate-800">APK File Location:</p>
                <p className="text-slate-600">
                  Android Studio me build hone ke baad APK file yahan milegi:
                </p>
                <code className="text-blue-700 font-mono text-[10px] block bg-white p-1.5 rounded border border-slate-200">
                  android/app/build/outputs/apk/debug/app-debug.apk
                </code>
              </div>
            </div>
          )}

          {activeTab === 'source' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <p className="font-bold text-xs">AI Studio Build Interface se ZIP Download:</p>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Aap is pure project ka complete source code ZIP format me download kar sakte hain.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    1
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Google AI Studio screen ke <strong>Top-Right Corner</strong> me dekhein.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    2
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Wahan diye gaye <strong>Download Code / Export</strong> icon par click karein.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    3
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Poora project (React + TypeScript + Firebase Config + Google Services JSON) aapke computer me ZIP file ke roop me download ho jayega.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-medium">
            ANGAN EDUCARE FOUNDATION
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Theek Hai (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
