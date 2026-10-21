import React, { useState } from 'react';
import {
  Users,
  X,
  UserPlus,
  Search,
  Check,
  GraduationCap,
  Phone,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { Student } from '../types/attendance';

interface StudentDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onAddStudent: (student: Student) => Promise<void>;
  onSelectStudentForAttendance: (studentId: string, name: string, grade?: string) => void;
}

export const StudentDirectoryModal: React.FC<StudentDirectoryModalProps> = ({
  isOpen,
  onClose,
  students,
  onAddStudent,
  onSelectStudentForAttendance,
}) => {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Grade 5');
  const [section, setSection] = useState('A');
  const [rollNo, setRollNo] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const filteredStudents = students.filter(
    (s) =>
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.grade.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !name.trim()) {
      setError('Please provide Student ID and Name');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await onAddStudent({
        studentId: studentId.trim().toUpperCase(),
        name: name.trim(),
        grade: grade.trim(),
        section: section.trim(),
        rollNo: rollNo.trim(),
        guardianName: guardianName.trim(),
        contactPhone: contactPhone.trim(),
        isActive: true,
      });

      // Reset form
      setStudentId('');
      setName('');
      setRollNo('');
      setGuardianName('');
      setContactPhone('');
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save student');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-blue-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Students Directory
              </h3>
              <p className="text-xs text-blue-200">
                ANGAN EDUCARE FOUNDATION ({students.length} Enrolled)
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

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Action toggle between list and new student form */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 mr-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-3 rounded-xl text-xs transition cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'View List' : 'Add Student'}</span>
            </button>
          </div>

          {/* Add Student Form */}
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-3">
              <h4 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Enroll New Student
              </h4>

              {error && (
                <div className="p-2 rounded-lg bg-red-100 text-red-700 text-[11px] font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    placeholder="e.g. AEF-109"
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sameer Roy"
                  className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Grade / Class
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="A / B"
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Parent / Guardian"
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold"
                >
                  {isSaving ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          ) : null}

          {/* Students List */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredStudents.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No students match your query.
              </div>
            ) : (
              filteredStudents.map((st) => (
                <div
                  key={st.studentId}
                  className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 flex items-center justify-between shadow-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-200 shrink-0">
                      {st.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{st.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {st.studentId} • {st.grade} {st.section ? `• Sec ${st.section}` : ''}
                      </p>
                      {st.contactPhone && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{st.contactPhone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectStudentForAttendance(st.studentId, st.name, st.grade);
                      onClose();
                    }}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition cursor-pointer shadow-sm"
                    title="Mark attendance for this student"
                  >
                    <span>Mark</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
