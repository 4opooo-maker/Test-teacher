import React, { useState } from 'react';
import {
  Sparkles,
  Info,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Award,
  ChevronRight,
  Code2,
  Copy,
  Check,
  X,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import bannerStudentImg from '../assets/images/angan_banner_student_1792581382569.jpg';

export const ADMOB_BANNER_TEST_UNIT_ID = 'ca-app-pub-3940256099942544/9214589741';
export const ADMOB_TEST_APP_ID = 'ca-app-pub-3940256099942544~3347511713';

interface AdMobBannerProps {
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ className = '' }) => {
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showDevCodeModal, setShowDevCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const androidAdMobCode = `<!-- 1. In AndroidManifest.xml inside <application> -->
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="${ADMOB_TEST_APP_ID}"/>

<!-- 2. In your layout XML (activity_attendance.xml) -->
<com.google.android.gms.ads.AdView
    xmlns:ads="http://schemas.android.com/apk/res-auto"
    android:id="@+id/adView"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_alignParentBottom="true"
    ads:adSize="BANNER"
    ads:adUnitId="${ADMOB_BANNER_TEST_UNIT_ID}" />

// 3. In Kotlin / Java Activity (MainActivity.kt)
MobileAds.initialize(this) {}
val adView = findViewById<AdView>(R.id.adView)
val adRequest = AdRequest.Builder().build()
adView.loadAd(adRequest)`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(androidAdMobCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className={`w-full select-none ${className}`}>
      {/* AdMob Notice & Compliance Label */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-100 text-[10px] text-slate-500 border-t border-slate-200">
        <div className="flex items-center gap-1.5 font-sans">
          <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded text-[9px] border border-amber-300/50">
            Ad
          </span>
          <span className="font-medium text-slate-600">
            AdMob Test Ad • Unit: <span className="font-mono text-slate-700 font-semibold">{ADMOB_BANNER_TEST_UNIT_ID}</span>
          </span>
        </div>
        <button
          onClick={() => setShowDevCodeModal(true)}
          className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
          title="View Android AdMob Integration Code"
        >
          <Code2 className="w-3 h-3" />
          <span>SDK Code</span>
        </button>
      </div>

      {/* Main Educational Banner Creative matching PRD */}
      <div
        onClick={() => setShowOpportunityModal(true)}
        className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-3 cursor-pointer overflow-hidden shadow-sm hover:brightness-105 transition-all group"
      >
        {/* Subtle decorative glow & pattern */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          {/* Student Artwork Thumbnail */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-300/80 shadow-md ring-2 ring-blue-500/30">
              <img
                src={bannerStudentImg}
                alt="Angan Educare Student"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-blue-950 flex items-center justify-center shadow">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          {/* Banner Content Body (PRD Specs) */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold tracking-wider text-amber-300 uppercase truncate">
                ANGAN EDUCARE FOUNDATION
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-sm font-extrabold text-white leading-tight mt-0.5 tracking-tight flex items-center gap-1">
              <span>अपने सपनों को पंख दें!</span>
            </h3>

            {/* Slogan */}
            <p className="text-[10px] text-blue-200 font-medium truncate mt-0.5">
              शिक्षा • कौशल • अवसर • सशक्तिकरण
            </p>

            {/* Subtitle */}
            <p className="text-[10px] text-slate-300 truncate">
              विद्यार्थियों के उज्ज्वल भविष्य की ओर एक कदम।
            </p>
          </div>

          {/* CTA Action Button */}
          <div className="shrink-0 flex flex-col items-end justify-center">
            <button
              type="button"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-extrabold text-[11px] px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1 active:scale-95 transition cursor-pointer"
            >
              <span>आज ही जुड़ें</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[9px] text-blue-200/80 mt-1">अवसर जानें</span>
          </div>
        </div>
      </div>

      {/* 1. Educational Opportunity / Scholarship Modal */}
      {showOpportunityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-amber-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    ANGAN EDUCARE FOUNDATION
                  </h3>
                  <p className="text-xs text-blue-200">
                    शिक्षा और छात्रवृत्ति जागरूकता पहल
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOpportunityModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src={bannerStudentImg}
                  alt="Student"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5 text-white">
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      अपने सपनों को पंख दें!
                    </h4>
                    <p className="text-[11px] text-slate-200">
                      हर विद्यार्थी के उज्ज्वल भविष्य के लिए समर्पित।
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/60">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>गुणवत्तापूर्ण शिक्षा</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    कक्षा 1 से 10 तक के विद्यार्थियों के लिए विशेष मार्गदर्शन और डिजिटल अध्ययन सामग्री।
                  </p>
                </div>

                <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/60">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>कौशल व अवसर</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    स्कॉलरशिप जानकारी, विज्ञान प्रतियोगिताएं एवं करियर काउंसलिंग सेशन।
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>विद्यार्थी सहायता एवं पंजीकरण</span>
                </h5>
                <p className="text-[11px] text-slate-600">
                  आंगन एडुकेयर फाउंडेशन द्वारा संचालित कार्यक्रमों में भाग लेने के लिए अपने विद्यालय के प्रतिनिधि अथवा फाउंडेशन समन्वयक से संपर्क करें।
                </p>
                <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-200">
                  <span>Helpline: +91 98765 43210</span>
                  <span>info@anganeducare.org</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] text-slate-400">
                AdMob Banner ID: {ADMOB_BANNER_TEST_UNIT_ID.slice(-10)}
              </span>
              <button
                onClick={() => setShowOpportunityModal(false)}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Developer AdMob SDK Code Snippet Modal */}
      {showDevCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">Google AdMob Android SDK Setup</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Unit ID: {ADMOB_BANNER_TEST_UNIT_ID}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDevCodeModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <p className="font-semibold text-xs">
                  Aapka AdMob Banner Testing ID project se successfully link ho gaya hai.
                </p>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Jab aap Android Studio me APK build karenge, tab niche diye gaye code ko copy-paste kar sakte hain:
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-800 text-[11px]">
                    Android Code Snippet (Manifest + XML + Kotlin):
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-[10px] rounded-xl overflow-x-auto max-h-56 leading-relaxed">
                  {androidAdMobCode}
                </pre>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <p className="font-bold text-slate-800">AdMob Compliance Rules Applied:</p>
                <p>• Selfie camera screen par koi ad nahi dikhaya jayega taaki attendance me koi rukawat na aaye.</p>
                <p>• Banner par clear &quot;Ad&quot; badge diya gaya hai jo Google policy ke anukool hai.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowDevCodeModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
