export interface Student {
  id?: string;
  studentId: string;
  name: string;
  grade: string;
  section?: string;
  rollNo?: string;
  guardianName?: string;
  contactPhone?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  studentName: string;
  attendanceDate: string; // e.g. 2026-10-21
  attendanceTime: string; // e.g. 09:30:15 AM
  selfiePhotoLink: string; // base64 data url or image link
  attendanceStatus: 'Present' | 'Late' | 'Excused' | 'Absent';
  submissionTimestamp: string; // ISO 8601 string
  recordedByUid: string;
  recordedByEmail: string;
  syncedToSheets: boolean;
  grade?: string;
  notes?: string;
}

export interface AppSettings {
  googleSheetsWebhookUrl: string;
  foundationName: string;
  updatedBy?: string;
  updatedAt?: string;
}

export type ScreenType = 'splash' | 'student-id' | 'selfie-camera' | 'success' | 'records' | 'students' | 'sheets-setup';
