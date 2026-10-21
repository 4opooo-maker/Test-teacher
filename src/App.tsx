import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, testConnection } from './firebase';
import {
  INITIAL_STUDENTS,
  seedInitialStudentsIfEmpty,
  subscribeToStudents,
  subscribeToAttendanceRecords,
  subscribeToAppSettings,
  createAttendanceRecord,
  dispatchToGoogleSheet,
  saveStudent,
  updateAppSettings,
} from './services/attendanceService';
import type { Student, AttendanceRecord, AppSettings, ScreenType } from './types/attendance';
import { AndroidFrame } from './components/AndroidFrame';
import { SplashScreen } from './components/SplashScreen';
import { StudentIdScreen } from './components/StudentIdScreen';
import { SelfieCameraScreen } from './components/SelfieCameraScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { AttendanceRecordsScreen } from './components/AttendanceRecordsScreen';
import { GoogleSheetsSetupModal } from './components/GoogleSheetsSetupModal';
import { StudentDirectoryModal } from './components/StudentDirectoryModal';
import { DownloadAppModal } from './components/DownloadAppModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    foundationName: 'ANGAN EDUCARE FOUNDATION',
    googleSheetsWebhookUrl: '',
  });

  // Current attendance session states
  const [activeStudentId, setActiveStudentId] = useState('');
  const [activeStudentName, setActiveStudentName] = useState('');
  const [activeGrade, setActiveGrade] = useState('');
  const [lastSubmittedRecord, setLastSubmittedRecord] = useState<AttendanceRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Test Firebase connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        seedInitialStudentsIfEmpty();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Subscribe to Firestore data
  useEffect(() => {
    const unsubStudents = subscribeToStudents(
      (data) => setStudents(data),
      (err) => console.warn('Students listener notice:', err)
    );

    const unsubRecords = subscribeToAttendanceRecords(
      (data) => setRecords(data),
      (err) => console.warn('Records listener notice:', err)
    );

    const unsubSettings = subscribeToAppSettings((settings) => {
      setAppSettings(settings);
    });

    return () => {
      unsubStudents();
      unsubRecords();
      unsubSettings();
    };
  }, []);

  // Handler: Proceed from Student ID to Selfie Camera
  const handleProceedToCamera = (studentId: string, studentName: string, grade?: string) => {
    setActiveStudentId(studentId);
    setActiveStudentName(studentName);
    setActiveGrade(grade || '');
    setCurrentScreen('selfie-camera');
  };

  // Handler: Submit Attendance
  const handleSubmitAttendance = async (attendanceData: {
    studentId: string;
    studentName: string;
    attendanceDate: string;
    attendanceTime: string;
    selfiePhotoLink: string;
    attendanceStatus: 'Present' | 'Late' | 'Excused' | 'Absent';
    submissionTimestamp: string;
  }) => {
    setIsSubmitting(true);
    try {
      let syncedToSheets = false;

      // 1. Dispatch to Google Sheets Webhook if configured
      if (appSettings.googleSheetsWebhookUrl && appSettings.googleSheetsWebhookUrl.trim()) {
        const result = await dispatchToGoogleSheet(
          appSettings.googleSheetsWebhookUrl.trim(),
          attendanceData
        );
        syncedToSheets = result.success;
      }

      // 2. Prepare full attendance record for Firestore
      const newRecord: AttendanceRecord = {
        ...attendanceData,
        recordedByUid: user ? user.uid : 'anonymous_terminal',
        recordedByEmail: user?.email || 'admin@anganeducare.org',
        syncedToSheets,
        grade: activeGrade,
      };

      // 3. Save to Firebase Firestore
      await createAttendanceRecord(newRecord);

      // 4. Update local state and navigate to Success Screen
      setLastSubmittedRecord(newRecord);
      setCurrentScreen('success');
    } catch (err) {
      console.error('Failed to submit attendance:', err);
      // Fallback local display so the user gets confirmation
      const fallbackRecord: AttendanceRecord = {
        ...attendanceData,
        recordedByUid: user ? user.uid : 'guest_mode',
        recordedByEmail: user?.email || 'offline_sync',
        syncedToSheets: false,
        grade: activeGrade,
      };
      setLastSubmittedRecord(fallbackRecord);
      setCurrentScreen('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Save Webhook URL
  const handleSaveWebhook = async (url: string) => {
    await updateAppSettings({ googleSheetsWebhookUrl: url });
    setAppSettings((prev) => ({ ...prev, googleSheetsWebhookUrl: url }));
  };

  // Handler: Add new student
  const handleAddStudent = async (newStudent: Student) => {
    await saveStudent(newStudent);
  };

  return (
    <AndroidFrame
      currentScreen={currentScreen}
      onNavigate={(screen) => setCurrentScreen(screen)}
      user={user}
      hasGoogleSheetWebhook={Boolean(
        appSettings.googleSheetsWebhookUrl && appSettings.googleSheetsWebhookUrl.trim()
      )}
      onOpenSheetsSetup={() => setIsSheetsModalOpen(true)}
      onOpenRecords={() => setCurrentScreen('records')}
      onOpenStudents={() => setIsStudentsModalOpen(true)}
      onOpenDownload={() => setIsDownloadModalOpen(true)}
    >
      {/* 1. Splash Screen */}
      {currentScreen === 'splash' && (
        <SplashScreen
          onContinue={() => setCurrentScreen('student-id')}
          foundationName={appSettings.foundationName}
        />
      )}

      {/* 2. Student ID Entry Screen */}
      {currentScreen === 'student-id' && (
        <StudentIdScreen
          students={students}
          initialStudentId={activeStudentId}
          onProceedToCamera={handleProceedToCamera}
          onOpenAddStudentModal={() => setIsStudentsModalOpen(true)}
        />
      )}

      {/* 3. Selfie Camera Screen */}
      {currentScreen === 'selfie-camera' && (
        <SelfieCameraScreen
          studentId={activeStudentId}
          studentName={activeStudentName}
          grade={activeGrade}
          onBack={() => setCurrentScreen('student-id')}
          onSubmitAttendance={handleSubmitAttendance}
          isSubmitting={isSubmitting}
        />
      )}

      {/* 4. Attendance Success Screen */}
      {currentScreen === 'success' && lastSubmittedRecord && (
        <SuccessScreen
          record={lastSubmittedRecord}
          hasGoogleSheetWebhook={Boolean(
            appSettings.googleSheetsWebhookUrl && appSettings.googleSheetsWebhookUrl.trim()
          )}
          onMarkNext={() => {
            setActiveStudentId('');
            setActiveStudentName('');
            setCurrentScreen('student-id');
          }}
          onViewRecords={() => setCurrentScreen('records')}
          onOpenSheetsSetup={() => setIsSheetsModalOpen(true)}
        />
      )}

      {/* 5. Attendance Records Register */}
      {currentScreen === 'records' && (
        <AttendanceRecordsScreen
          records={records}
          onBack={() => setCurrentScreen('student-id')}
          onOpenSheetsSetup={() => setIsSheetsModalOpen(true)}
        />
      )}

      {/* Modals */}
      <GoogleSheetsSetupModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        currentWebhookUrl={appSettings.googleSheetsWebhookUrl || ''}
        onSaveWebhookUrl={handleSaveWebhook}
        records={records}
      />

      <StudentDirectoryModal
        isOpen={isStudentsModalOpen}
        onClose={() => setIsStudentsModalOpen(false)}
        students={students}
        onAddStudent={handleAddStudent}
        onSelectStudentForAttendance={(id, name, grade) => {
          handleProceedToCamera(id, name, grade);
        }}
      />

      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </AndroidFrame>
  );
}
