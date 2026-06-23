import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import StudentProfilePage from './pages/StudentProfilePage'
import LessonsPage from './pages/LessonsPage'
import LessonDetailPage from './pages/LessonDetailPage'
import CalendarPage from './pages/CalendarPage'
import ClassesPage from './pages/ClassesPage'
import DocumentsPage from './pages/DocumentsPage'
import ClassDetailPage from './pages/ClassDetailPage'
import AdminSchoolsPage from './pages/admin/AdminSchoolsPage'
import AdminCounselorsPage from './pages/admin/AdminCounselorsPage'
import AdminSchoolYearsPage from './pages/admin/AdminSchoolYearsPage'
import AdminSupportPage from './pages/admin/AdminSupportPage'

function ThemedToaster() {
  const { isDark } = useTheme()
  return (
    <Toaster
      position="bottom-left"
      toastOptions={{
        duration: 3500,
        style: {
          direction: 'rtl',
          fontFamily: 'Rubik, sans-serif',
          background: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#f9fafb' : '#111827',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    />
  )
}

export default function App() {
  return (
    <ThemeProvider>
    <ThemedToaster />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentProfilePage />} />
            <Route path="lessons" element={<LessonsPage />} />
            <Route path="lessons/:id" element={<LessonDetailPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="classes/:level/:number" element={<ClassDetailPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="admin/schools" element={<AdminRoute><AdminSchoolsPage /></AdminRoute>} />
            <Route path="admin/counselors" element={<AdminRoute><AdminCounselorsPage /></AdminRoute>} />
            <Route path="admin/school-years" element={<AdminRoute><AdminSchoolYearsPage /></AdminRoute>} />
            <Route path="admin/support" element={<AdminRoute><AdminSupportPage /></AdminRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}
