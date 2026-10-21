import React, { useState } from 'react';
import {
  FileSpreadsheet,
  X,
  Copy,
  Check,
  Send,
  ExternalLink,
  HelpCircle,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Table,
} from 'lucide-react';
import { dispatchToGoogleSheet } from '../services/attendanceService';
import type { AttendanceRecord } from '../types/attendance';

interface GoogleSheetsSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWebhookUrl: string;
  onSaveWebhookUrl: (url: string) => Promise<void>;
  records: AttendanceRecord[];
}

export const GoogleSheetsSetupModal: React.FC<GoogleSheetsSetupModalProps> = ({
  isOpen,
  onClose,
  currentWebhookUrl,
  onSaveWebhookUrl,
  records,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedTSV, setCopiedTSV] = useState(false);

  if (!isOpen) return null;

  const scriptCode = `// --- 🚀 ANGAN EDUCARE FOUNDATION ATTENDANCE SYNC SCRIPT ---
// 1. In your Google Sheet, click Extensions > Apps Script
// 2. Replace all code in the editor with this script
// 3. Click "Deploy" > "New deployment"
// 4. Select type: "Web app"
// 5. Set "Who has access" to "Anyone"
// 6. Click Deploy and copy the Web App URL into the app!

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add header row if sheet is fresh
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Student ID",
        "Student Name",
        "Attendance Date",
        "Attendance Time",
        "Selfie Photo Link",
        "Attendance Status",
        "Submission Timestamp"
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#1e40af").setFontColor("#ffffff");
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.studentId,
      data.studentName,
      data.attendanceDate,
      data.attendanceTime,
      data.selfiePhotoLink,
      data.attendanceStatus,
      data.submissionTimestamp
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Attendance row appended" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyTSV = () => {
    const headers = [
      'Student ID',
      'Student Name',
      'Attendance Date',
      'Attendance Time',
      'Selfie Photo Link',
      'Attendance Status',
      'Submission Timestamp',
    ];
    const rows = records.map((r) => [
      r.studentId,
      r.studentName,
      r.attendanceDate,
      r.attendanceTime,
      r.selfiePhotoLink.startsWith('data:') ? '[Captured Selfie Base64 Photo]' : r.selfiePhotoLink,
      r.attendanceStatus,
      r.submissionTimestamp,
    ]);
    const tsv = [headers.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsv);
    setCopiedTSV(true);
    setTimeout(() => setCopiedTSV(false), 2500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveWebhookUrl(webhookUrl.trim());
      setTestResult({ success: true, message: 'Google Sheet Webhook URL saved successfully!' });
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to save webhook URL',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      setTestResult({ success: false, message: 'Please enter your Web App URL first.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const now = new Date();
    const result = await dispatchToGoogleSheet(webhookUrl.trim(), {
      studentId: 'AEF-TEST',
      studentName: 'Test Student (Angan Educare)',
      attendanceDate: now.toISOString().split('T')[0],
      attendanceTime: now.toLocaleTimeString(),
      selfiePhotoLink: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
      attendanceStatus: 'Present',
      submissionTimestamp: now.toISOString(),
    });

    setTestResult(result);
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-emerald-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Google Sheets Integration
              </h3>
              <p className="text-xs text-blue-200">
                Direct live synchronization • No coding required
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-slate-700 text-xs leading-relaxed">
          {/* Quick Option 1: 1-Click Instant Copy to Google Sheets */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                <Table className="w-4 h-4 text-emerald-600" />
                <span>Instant 1-Click Copy for Google Sheets</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Copy all current {records.length} attendance rows to clipboard and press Ctrl+V into your sheet.
              </p>
            </div>
            <button
              onClick={handleCopyTSV}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl shadow-sm text-xs transition cursor-pointer shrink-0 ml-2"
            >
              {copiedTSV ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTSV ? 'Copied Table!' : 'Copy Table'}</span>
            </button>
          </div>

          {/* Option 2: Automatic Webhook Sync (Full Automation) */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Connect Existing Google Sheet for Auto-Sync</span>
            </div>

            <p className="text-slate-600 text-xs">
              Follow these simple 3 steps so attendance records automatically append to your Google Sheet the moment a selfie is taken:
            </p>

            {/* Step-by-step Guide */}
            <div className="space-y-2.5">
              <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-800">Open your Google Sheet & Apps Script</p>
                  <p className="text-[11px] text-slate-500">
                    Open your existing sheet in your browser, click menu <span className="font-semibold text-blue-800">Extensions &gt; Apps Script</span>.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-slate-800">Paste This Attendance Receiver Script</p>
                    <button
                      onClick={handleCopyScript}
                      className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-lg border border-blue-200 transition cursor-pointer"
                    >
                      {copiedScript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-emerald-300 p-2.5 rounded-lg text-[10px] font-mono overflow-x-auto max-h-24">
                    {scriptCode}
                  </pre>
                </div>
              </div>

              <div className="flex gap-2.5 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-800">Deploy as Web App & Paste URL</p>
                  <p className="text-[11px] text-slate-500">
                    Click <span className="font-semibold text-blue-800">Deploy &gt; New deployment &gt; Select type: Web app</span>. Set &quot;Who has access&quot; to <span className="font-semibold text-emerald-700">Anyone</span>, click Deploy and paste the Web App URL below:
                  </p>
                </div>
              </div>
            </div>

            {/* Input URL and Test */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Google Apps Script Web App URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer shrink-0"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTesting}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer border border-slate-200"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>{isTesting ? 'Sending Test Row...' : 'Test Connection with Sample Row'}</span>
              </button>
            </div>

            {/* Test result feedback banner */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-bold">{testResult.success ? 'Success!' : 'Notice'}</p>
                  <p className="text-[11px]">{testResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
