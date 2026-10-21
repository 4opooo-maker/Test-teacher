import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Calendar,
  Clock,
  IdCard,
  FileSpreadsheet,
  ArrowLeft,
  ShieldCheck,
  Eye,
  X,
  UserCheck,
} from 'lucide-react';
import { generateAttendanceCSV, generateAttendanceTSV } from '../services/attendanceService';
import type { AttendanceRecord } from '../types/attendance';

interface AttendanceRecordsScreenProps {
  records: AttendanceRecord[];
  onBack: () => void;
  onOpenSheetsSetup: () => void;
}

export const AttendanceRecordsScreen: React.FC<AttendanceRecordsScreenProps> = ({
  records,
  onBack,
  onOpenSheetsSetup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('ALL');
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string } | null>(null);
  const [copiedTSV, setCopiedTSV] = useState(false);

  // Available unique dates
  const availableDates = Array.from(new Set(records.map((r) => r.attendanceDate))).sort().reverse();
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate =
      selectedDate === 'ALL'
        ? true
        : selectedDate === 'TODAY'
        ? rec.attendanceDate === todayStr
        : rec.attendanceDate === selectedDate;

    return matchesSearch && matchesDate;
  });

  const handleDownloadCSV = () => {
    const csvData = generateAttendanceCSV(filteredRecords);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `angan_attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyTSV = () => {
    const tsvData = generateAttendanceTSV(filteredRecords);
    navigator.clipboard.writeText(tsvData);
    setCopiedTSV(true);
    setTimeout(() => setCopiedTSV(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-slate-50 justify-between select-none">
      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl p-4 max-w-sm w-full text-white space-y-3 border border-slate-700">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold truncate text-slate-200">{previewPhoto.title}</h4>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewPhoto.url}
              alt="Selfie"
              className="w-full h-80 object-cover rounded-2xl border border-white/20"
            />
            <button
              onClick={() => setPreviewPhoto(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                Attendance Register
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {records.length} Total Submissions Recorded
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyTSV}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition cursor-pointer shadow-sm"
              title="Copy as Google Sheet Table (Ctrl+V into Sheet)"
            >
              {copiedTSV ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTSV ? 'Copied!' : 'Copy for Sheets'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition cursor-pointer shadow-sm"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2 mb-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Student ID or Name..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Date Chips Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedDate('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                selectedDate === 'ALL'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Dates ({records.length})
            </button>

            <button
              onClick={() => setSelectedDate('TODAY')}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                selectedDate === 'TODAY'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Today ({records.filter((r) => r.attendanceDate === todayStr).length})
            </button>

            {availableDates.slice(0, 3).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition cursor-pointer font-mono ${
                  selectedDate === d
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-700">No attendance records found</p>
              <p className="text-[11px] text-slate-400">
                Mark attendance from the Attendance screen to see records appear here in real time.
              </p>
            </div>
          ) : (
            filteredRecords.map((r, idx) => (
              <div
                key={r.id || idx}
                className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Thumbnail click to preview */}
                    <div
                      onClick={() =>
                        setPreviewPhoto({
                          url: r.selfiePhotoLink,
                          title: `${r.studentName} (${r.studentId}) • ${r.attendanceDate} ${r.attendanceTime}`,
                        })
                      }
                      className="relative cursor-pointer group"
                      title="Tap to preview photo"
                    >
                      <img
                        src={r.selfiePhotoLink}
                        alt={r.studentName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-blue-600 transition"
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900">{r.studentName}</h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                          {r.attendanceStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                        <span className="font-bold text-blue-700 bg-blue-50 px-1 rounded">
                          {r.studentId}
                        </span>
                        <span>{r.attendanceDate}</span>
                        <span>•</span>
                        <span>{r.attendanceTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Submission info */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                  <span className="truncate max-w-[200px]">
                    Recorded: {new Date(r.submissionTimestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-slate-500">
                    {r.syncedToSheets ? 'Sheets Synced' : 'Cloud Saved'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-3 border-t border-slate-200">
        <button
          onClick={onOpenSheetsSetup}
          className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2.5 px-4 rounded-xl border border-emerald-300 text-xs transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Google Sheet Webhook Settings</span>
        </button>
      </div>
    </div>
  );
};
