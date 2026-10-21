import React, { useState, useEffect } from 'react';
import {
  IdCard,
  UserCheck,
  Camera,
  Search,
  UserPlus,
  Sparkles,
  AlertCircle,
  GraduationCap,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import type { Student } from '../types/attendance';

interface StudentIdScreenProps {
  students: Student[];
  initialStudentId?: string;
  onProceedToCamera: (studentId: string, studentName: string, grade?: string) => void;
  onOpenAddStudentModal: () => void;
}

export const StudentIdScreen: React.FC<StudentIdScreenProps> = ({
  students,
  initialStudentId = '',
  onProceedToCamera,
  onOpenAddStudentModal,
}) => {
  const [studentId, setStudentId] = useState(initialStudentId);
  const [studentName, setStudentName] = useState('');
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Look up student whenever studentId changes
  useEffect(() => {
    const cleanId = studentId.trim().toUpperCase();
    if (!cleanId) {
      setMatchedStudent(null);
      setStudentName('');
      setErrorMessage('');
      return;
    }

    // Match exact or partial ID
    const found = students.find(
      (s) => s.studentId.toUpperCase() === cleanId || s.studentId.toUpperCase().replace('-', '') === cleanId
    );

    if (found) {
      setMatchedStudent(found);
      setStudentName(found.name);
      setErrorMessage('');
    } else {
      setMatchedStudent(null);
    }
  }, [studentId, students]);

  const handleSelectStudent = (st: Student) => {
    setStudentId(st.studentId);
    setStudentName(st.name);
    setMatchedStudent(st);
    setErrorMessage('');
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = studentId.trim().toUpperCase();
    const cleanName = (matchedStudent ? matchedStudent.name : studentName).trim();

    if (!cleanId) {
      setErrorMessage('Please enter a valid Student ID');
      return;
    }

    if (!cleanName) {
      setErrorMessage('Please provide or confirm the Student Name');
      return;
    }

    setErrorMessage('');
    onProceedToCamera(cleanId, cleanName, matchedStudent?.grade || 'General');
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-slate-50 justify-between">
      <div>
        {/* Step Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[11px]">
                1
              </span>
              <span>Step 1 of 3</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Enter Student ID
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenAddStudentModal}
            className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleProceed} className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Student ID / Roll Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                <IdCard className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="e.g. AEF-101"
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold tracking-wider text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                autoFocus
              />
              {studentId && (
                <button
                  type="button"
                  onClick={() => {
                    setStudentId('');
                    setMatchedStudent(null);
                    setStudentName('');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Student Profile Card if Found */}
            {matchedStudent ? (
              <div className="mt-3.5 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 animate-fadeIn">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {matchedStudent.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-blue-950 truncate">
                      {matchedStudent.name}
                    </h3>
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-blue-800">
                    <span className="bg-white px-2 py-0.5 rounded border border-blue-200 font-medium">
                      {matchedStudent.grade}
                    </span>
                    {matchedStudent.section && (
                      <span className="bg-white px-2 py-0.5 rounded border border-blue-200 font-medium">
                        Sec {matchedStudent.section}
                      </span>
                    )}
                    {matchedStudent.rollNo && (
                      <span className="bg-white px-2 py-0.5 rounded border border-blue-200 font-medium font-mono">
                        Roll #{matchedStudent.rollNo}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : studentId.trim().length > 0 ? (
              <div className="mt-3.5 space-y-2">
                <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>ID not in database yet. Enter student name below:</span>
                </div>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter Student Full Name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
              </div>
            ) : null}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Select Student Chips for instant testing */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Select Enrolled Students
              </span>
              <span className="text-[11px] text-blue-600 font-normal">
                {students.length} Registered
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {students.slice(0, 6).map((st) => (
                <button
                  type="button"
                  key={st.studentId}
                  onClick={() => handleSelectStudent(st)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                    studentId === st.studentId
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white hover:bg-blue-50/60 text-slate-800 border-slate-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      studentId === st.studentId ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {st.studentId.replace('AEF-', '')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold truncate ${
                        studentId === st.studentId ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {st.name}
                    </p>
                    <p
                      className={`text-[10px] truncate ${
                        studentId === st.studentId ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {st.studentId} • {st.grade}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition cursor-pointer text-sm"
        >
          <Camera className="w-5 h-5 text-blue-200" />
          <span>Proceed to Selfie Camera</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
        <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
          Date & Time will be automatically recorded on camera capture
        </p>
      </div>
    </div>
  );
};
