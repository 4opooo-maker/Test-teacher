import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import type { Student, AttendanceRecord, AppSettings } from '../types/attendance';

export const INITIAL_STUDENTS: Student[] = [
  {
    studentId: 'AEF-101',
    name: 'Aarav Sharma',
    grade: 'Grade 5',
    section: 'A',
    rollNo: '01',
    guardianName: 'Rajesh Sharma',
    contactPhone: '+91 98765 43210',
    isActive: true,
  },
  {
    studentId: 'AEF-102',
    name: 'Priya Patel',
    grade: 'Grade 5',
    section: 'A',
    rollNo: '02',
    guardianName: 'Sunil Patel',
    contactPhone: '+91 98765 43211',
    isActive: true,
  },
  {
    studentId: 'AEF-103',
    name: 'Rohan Verma',
    grade: 'Grade 6',
    section: 'B',
    rollNo: '05',
    guardianName: 'Vikram Verma',
    contactPhone: '+91 98765 43212',
    isActive: true,
  },
  {
    studentId: 'AEF-104',
    name: 'Ananya Gupta',
    grade: 'Grade 6',
    section: 'A',
    rollNo: '08',
    guardianName: 'Manoj Gupta',
    contactPhone: '+91 98765 43213',
    isActive: true,
  },
  {
    studentId: 'AEF-105',
    name: 'Mohd. Zaid Khan',
    grade: 'Grade 7',
    section: 'A',
    rollNo: '12',
    guardianName: 'Farhan Khan',
    contactPhone: '+91 98765 43214',
    isActive: true,
  },
  {
    studentId: 'AEF-106',
    name: 'Diya Mukherjee',
    grade: 'Grade 7',
    section: 'B',
    rollNo: '14',
    guardianName: 'Debashis Mukherjee',
    contactPhone: '+91 98765 43215',
    isActive: true,
  },
  {
    studentId: 'AEF-107',
    name: 'Kabir Singh',
    grade: 'Grade 8',
    section: 'A',
    rollNo: '03',
    guardianName: 'Harpreet Singh',
    contactPhone: '+91 98765 43216',
    isActive: true,
  },
  {
    studentId: 'AEF-108',
    name: 'Sneha Reddy',
    grade: 'Grade 8',
    section: 'B',
    rollNo: '09',
    guardianName: 'Venkat Reddy',
    contactPhone: '+91 98765 43217',
    isActive: true,
  },
];

// Seed initial students into Firestore if collection is empty
export async function seedInitialStudentsIfEmpty(): Promise<void> {
  const path = 'students';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (snapshot.empty) {
      for (const student of INITIAL_STUDENTS) {
        await setDoc(doc(db, path, student.studentId), {
          ...student,
          createdAt: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    // If not authenticated or error, silently fallback to in-memory seed
    console.warn('Could not auto-seed students (user might not be authenticated yet):', error);
  }
}

// Subscribe to students list
export function subscribeToStudents(
  onData: (students: Student[]) => void,
  onError?: (error: Error) => void
): () => void {
  const path = 'students';
  try {
    const q = collection(db, path);
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onData(INITIAL_STUDENTS);
        } else {
          const list: Student[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Student, 'id'>),
          }));
          onData(list);
        }
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (err) {
    if (onError && err instanceof Error) onError(err);
    onData(INITIAL_STUDENTS);
    return () => {};
  }
}

// Add or update student
export async function saveStudent(student: Student): Promise<void> {
  const path = `students/${student.studentId}`;
  try {
    await setDoc(doc(db, 'students', student.studentId), {
      ...student,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Subscribe to attendance records
export function subscribeToAttendanceRecords(
  onData: (records: AttendanceRecord[]) => void,
  onError?: (error: Error) => void
): () => void {
  const path = 'attendance_records';
  try {
    const q = query(collection(db, path), orderBy('submissionTimestamp', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const records: AttendanceRecord[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<AttendanceRecord, 'id'>),
        }));
        onData(records);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (err) {
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

// Save attendance record to Firestore
export async function createAttendanceRecord(record: AttendanceRecord): Promise<string> {
  const path = 'attendance_records';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...record,
      serverCreatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Send attendance record to Google Sheets webhook
export async function dispatchToGoogleSheet(
  webhookUrl: string,
  record: {
    studentId: string;
    studentName: string;
    attendanceDate: string;
    attendanceTime: string;
    selfiePhotoLink: string;
    attendanceStatus: string;
    submissionTimestamp: string;
  }
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.trim()) {
    return { success: false, message: 'Google Sheets webhook URL is not configured yet.' };
  }

  const payload = {
    studentId: record.studentId,
    studentName: record.studentName,
    attendanceDate: record.attendanceDate,
    attendanceTime: record.attendanceTime,
    selfiePhotoLink: record.selfiePhotoLink,
    attendanceStatus: record.attendanceStatus,
    submissionTimestamp: record.submissionTimestamp,
  };

  try {
    // Google Apps Script redirects require handling, mode 'no-cors' allows browser POST without CORS preflight failure
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });

    return { success: true, message: 'Dispatched to Google Sheet successfully!' };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Google Sheets dispatch error:', errorMsg);
    return { success: false, message: `Could not send to Google Sheet: ${errorMsg}` };
  }
}

// Subscribe to app settings
export function subscribeToAppSettings(
  onData: (settings: AppSettings) => void
): () => void {
  const path = 'app_settings/general';
  try {
    return onSnapshot(
      doc(db, 'app_settings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          onData(docSnap.data() as AppSettings);
        } else {
          onData({
            foundationName: 'ANGAN EDUCARE FOUNDATION',
            googleSheetsWebhookUrl: '',
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (err) {
    console.warn('Could not listen to settings:', err);
    return () => {};
  }
}

// Update app settings
export async function updateAppSettings(settings: Partial<AppSettings>): Promise<void> {
  const path = 'app_settings/general';
  try {
    await setDoc(
      doc(db, 'app_settings', 'general'),
      {
        ...settings,
        foundationName: settings.foundationName || 'ANGAN EDUCARE FOUNDATION',
        updatedBy: auth.currentUser?.uid || 'anonymous',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Generate CSV string from records
export function generateAttendanceCSV(records: AttendanceRecord[]): string {
  const headers = [
    'Student ID',
    'Student Name',
    'Attendance Date',
    'Attendance Time',
    'Selfie Photo Link',
    'Attendance Status',
    'Submission Timestamp',
    'Recorded By',
  ];

  const rows = records.map((r) => [
    `"${r.studentId}"`,
    `"${r.studentName}"`,
    `"${r.attendanceDate}"`,
    `"${r.attendanceTime}"`,
    `"${r.selfiePhotoLink.startsWith('data:') ? '[Captured Selfie Base64 Data URL]' : r.selfiePhotoLink}"`,
    `"${r.attendanceStatus}"`,
    `"${r.submissionTimestamp}"`,
    `"${r.recordedByEmail || r.recordedByUid}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

// Generate TSV string for 1-click Ctrl+V pasting directly into Google Sheets
export function generateAttendanceTSV(records: AttendanceRecord[]): string {
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
    r.selfiePhotoLink.startsWith('data:') ? 'Captured Camera Selfie' : r.selfiePhotoLink,
    r.attendanceStatus,
    r.submissionTimestamp,
  ]);

  return [headers.join('\t'), ...rows.map((row) => row.join('\t'))].join('\n');
}
