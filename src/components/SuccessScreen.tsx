import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  IdCard,
  User,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  History,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import type { AttendanceRecord } from '../types/attendance';

interface SuccessScreenProps {
  record: AttendanceRecord;
  hasGoogleSheetWebhook: boolean;
  onMarkNext: () => void;
  onViewRecords: () => void;
  onOpenSheetsSetup: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  record,
  hasGoogleSheetWebhook,
  onMarkNext,
  onViewRecords,
  onOpenSheetsSetup,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyRecord = () => {
    const text = `ANGAN EDUCARE FOUNDATION ATTENDANCE
Student ID: ${record.studentId}
Student Name: ${record.studentName}
Date: ${record.attendanceDate}
Time: ${record.attendanceTime}
Status: ${record.attendanceStatus}
Timestamp: ${record.submissionTimestamp}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-slate-50 justify-between select-none">
      <div className="space-y-4">
        {/* Celebratory Check Banner */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-300" />
          </div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-300/40 text-[11px] font-bold text-emerald-200 tracking-wider uppercase mb-1">
            Status: {record.attendanceStatus}
          </span>
          <h2 className="text-xl font-extrabold tracking-tight">Attendance Recorded!</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            ANGAN EDUCARE FOUNDATION • Verified Entry
          </p>
        </div>

        {/* Detailed Attendance Slip Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3.5">
          {/* Header row with Selfie thumbnail and Student name */}
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            {record.selfiePhotoLink ? (
              <div className="relative">
                <img
                  src={record.selfiePhotoLink}
                  alt={record.studentName}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-blue-600 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl border-2 border-blue-600">
                {record.studentName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase">
                Student Profile
              </span>
              <h3 className="text-base font-extrabold text-slate-900 truncate">
                {record.studentName}
              </h3>
              <div className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mt-0.5">
                <IdCard className="w-3.5 h-3.5" />
                <span>{record.studentId}</span>
              </div>
            </div>
          </div>

          {/* Grid of Key Values (Date, Time, Status, Timestamp) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span>Attendance Date</span>
              </div>
              <p className="font-bold text-slate-800 mt-0.5 font-mono">{record.attendanceDate}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                <Clock className="w-3 h-3 text-blue-600" />
                <span>Attendance Time</span>
              </div>
              <p className="font-bold text-slate-800 mt-0.5 font-mono">{record.attendanceTime}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Attendance Status</span>
              </div>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                {record.attendanceStatus}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                <span>Cloud Storage</span>
              </div>
              <p className="font-semibold text-blue-700 mt-0.5 text-[11px]">Firebase Saved</p>
            </div>
          </div>

          {/* Submission Timestamp */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Submission Timestamp:</span>
            <span className="font-mono text-[10px] text-slate-700 font-medium">
              {new Date(record.submissionTimestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Google Sheet Sync Status Card */}
        <div
          className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
            hasGoogleSheetWebhook
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              hasGoogleSheetWebhook ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold">
                {hasGoogleSheetWebhook
                  ? 'Auto-Synced to Google Sheet'
                  : 'Google Sheet Not Connected'}
              </h4>
              <button
                onClick={onOpenSheetsSetup}
                className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>{hasGoogleSheetWebhook ? 'Settings' : 'Setup Now'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              {hasGoogleSheetWebhook
                ? 'Record was pushed to your connected Google Sheet webhook.'
                : 'Data is securely stored in Firebase. Connect your Google Sheet in 60 seconds with no code!'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        <button
          onClick={onMarkNext}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition cursor-pointer text-sm"
        >
          <span>Mark Next Attendance</span>
          <ArrowRight className="w-4 h-4 text-blue-200" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onViewRecords}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold py-2.5 px-3 rounded-xl border border-slate-200 text-xs transition cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-blue-600" />
            <span>View Register</span>
          </button>

          <button
            onClick={handleCopyRecord}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold py-2.5 px-3 rounded-xl border border-slate-200 text-xs transition cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
