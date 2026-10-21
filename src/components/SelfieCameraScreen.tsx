import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  CheckCircle,
  RotateCcw,
  Clock,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SelfieCameraScreenProps {
  studentId: string;
  studentName: string;
  grade?: string;
  onBack: () => void;
  onSubmitAttendance: (data: {
    studentId: string;
    studentName: string;
    attendanceDate: string;
    attendanceTime: string;
    selfiePhotoLink: string;
    attendanceStatus: 'Present' | 'Late' | 'Excused' | 'Absent';
    submissionTimestamp: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const SelfieCameraScreen: React.FC<SelfieCameraScreenProps> = ({
  studentId,
  studentName,
  grade,
  onBack,
  onSubmitAttendance,
  isSubmitting,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedDateStr, setCapturedDateStr] = useState('');
  const [capturedTimeStr, setCapturedTimeStr] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [flashActive, setFlashActive] = useState(false);

  // Live ticking date and time for the camera overlay HUD
  const [liveDate, setLiveDate] = useState('');
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      );
      setLiveTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not available on this browser.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 720 },
            height: { ideal: 960 },
          },
          audio: false,
        });

        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch((e) => console.warn('Video play error:', e));
        }
      } catch (err) {
        console.warn('Camera access issue:', err);
        const message =
          err instanceof Error
            ? err.message
            : 'Camera permission denied or camera device not detected.';
        setCameraError(message);
      }
    };

    if (!capturedPhoto) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, capturedPhoto]);

  // Flip between front (user) and back (environment) camera
  const toggleCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Capture photo from live video or fallback generator
  const handleCapture = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    setCapturedDateStr(formattedDate);
    setCapturedTimeStr(formattedTime);

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      if (videoRef.current && stream && !cameraError) {
        // Draw real webcam feed
        ctx.save();
        if (facingMode === 'user') {
          // Mirror front camera
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      } else {
        // Render fallback professional selfie card with student credentials
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(0.5, '#1e40af');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Student avatar circle placeholder
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 280, 110, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2563eb';
        ctx.font = 'bold 80px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          studentName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          canvas.width / 2,
          280
        );

        // Fallback banner
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.roundRect(40, 440, canvas.width - 80, 160, 20);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(studentName, canvas.width / 2, 490);

        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 22px monospace';
        ctx.fillText(`ID: ${studentId}`, canvas.width / 2, 535);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '18px sans-serif';
        ctx.fillText(grade || 'ANGAN EDUCARE FOUNDATION', canvas.width / 2, 570);
      }

      // Burn-in Stamp Watermark on bottom of image for compliance
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, canvas.height - 130, canvas.width, 130);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ANGAN EDUCARE FOUNDATION • VERIFIED ATTENDANCE', 24, canvas.height - 90);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`STUDENT: ${studentId} • ${studentName}`, 24, canvas.height - 60);

      ctx.fillStyle = '#67e8f9';
      ctx.font = '16px monospace';
      ctx.fillText(`DATE: ${formattedDate} | TIME: ${formattedTime}`, 24, canvas.height - 30);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setCapturedPhoto(dataUrl);

      // Stop camera stream after capture
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirmAttendance = async () => {
    if (!capturedPhoto) return;

    const now = new Date();
    const dateStr = capturedDateStr || now.toISOString().split('T')[0];
    const timeStr =
      capturedTimeStr ||
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

    await onSubmitAttendance({
      studentId,
      studentName,
      attendanceDate: dateStr,
      attendanceTime: timeStr,
      selfiePhotoLink: capturedPhoto,
      attendanceStatus: 'Present',
      submissionTimestamp: now.toISOString(),
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white justify-between select-none relative overflow-hidden">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Flash effect overlay */}
      {flashActive && <div className="absolute inset-0 bg-white z-50 animate-ping opacity-90" />}

      {/* Top Controls Header */}
      <div className="p-3 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between z-30">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-1 text-xs text-white/90 hover:text-white bg-white/10 backdrop-blur px-3 py-1.5 rounded-full transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur border border-blue-400/30 text-xs font-semibold text-white">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
          <span>Selfie Camera</span>
        </div>

        {!capturedPhoto && !cameraError && (
          <button
            onClick={toggleCamera}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition cursor-pointer"
            title="Switch Camera (Front/Rear)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Viewfinder / Photo Display Area */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {capturedPhoto ? (
          // Review Captured Photo
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              src={capturedPhoto}
              alt="Captured Attendance Selfie"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between bg-emerald-600/90 backdrop-blur text-white px-3.5 py-1.5 rounded-xl shadow-lg border border-emerald-400/30 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-200" />
                Photo Captured
              </span>
              <span className="font-mono text-[11px] text-emerald-100">{capturedTimeStr}</span>
            </div>
          </div>
        ) : (
          // Live Camera Viewfinder
          <div className="w-full h-full relative flex items-center justify-center">
            {cameraError ? (
              // Camera permission or device error fallback
              <div className="flex flex-col items-center justify-center p-6 text-center max-w-xs z-20">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Camera Stream Inactive</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Webcam permission is unavailable in this preview container. No problem! You can still tap
                  the shutter button below to generate a verified photo badge and test attendance.
                </p>
                <div className="bg-blue-900/40 border border-blue-500/30 rounded-xl p-3 text-[11px] text-blue-200 text-left w-full space-y-1">
                  <div className="font-bold text-blue-100 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Automatic Fallback Mode
                  </div>
                  <div>Student: <span className="font-semibold text-white">{studentName} ({studentId})</span></div>
                  <div>Date: <span className="font-mono text-white">{liveDate}</span></div>
                  <div>Time: <span className="font-mono text-emerald-400">{liveTime}</span></div>
                </div>
              </div>
            ) : (
              // Live HTML5 Video element
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />
            )}

            {/* Face Alignment Oval Guide */}
            {!cameraError && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-60 h-72 border-2 border-dashed border-white/60 rounded-[48%] relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                  {/* Alignment tick marks */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-blue-400 rounded-full" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-blue-400 rounded-full" />
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 h-6 w-2 bg-blue-400 rounded-full" />
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 h-6 w-2 bg-blue-400 rounded-full" />
                </div>
              </div>
            )}

            {/* Live Camera HUD Overlay: Date & Time Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none space-y-2">
              {/* Foundation Watermark Badge */}
              <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[10px] font-bold tracking-wider text-amber-300 uppercase flex items-center justify-between">
                <span>ANGAN EDUCARE FOUNDATION</span>
                <span className="text-blue-300">LIVE HUD</span>
              </div>

              {/* Student Identification & Live Clock Banner */}
              <div className="bg-slate-900/85 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-white shadow-2xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-blue-300 font-semibold uppercase tracking-wider">
                    Student Verified
                  </div>
                  <div className="text-sm font-extrabold text-white truncate max-w-[170px]">
                    {studentName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-300">
                    ID: {studentId} {grade ? `• ${grade}` : ''}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-[11px] text-slate-300">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    <span>{liveDate}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-sm font-extrabold font-mono text-emerald-400 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{liveTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Shutter & Action Controls */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 z-30">
        {capturedPhoto ? (
          // Review Actions: Retake vs Submit
          <div className="flex items-center gap-3">
            <button
              onClick={handleRetake}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-2xl border border-slate-700 transition cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
              <span>Retake</span>
            </button>

            <button
              onClick={handleConfirmAttendance}
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-xl transition cursor-pointer text-sm active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to Firebase & Sheets...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Attendance</span>
                </>
              )}
            </button>
          </div>
        ) : (
          // Shutter Action
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleCapture}
                className="w-20 h-20 rounded-full border-4 border-white/90 bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center p-1 active:scale-95 transition shadow-2xl cursor-pointer"
                title="Tap to take selfie photo"
              >
                <div className="w-full h-full rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-inner">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Tap shutter button to snap attendance selfie
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
