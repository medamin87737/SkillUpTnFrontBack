import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import AccessibilityWidget from './components/shared/AccessibilityWidget'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import LoginPage from './pages/LoginPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDepartments from './pages/admin/AdminDepartments'
import AdminSkills from './pages/admin/AdminSkills'
import AdminQuestions from './pages/admin/AdminQuestions'
import AdminAnalytics from './pages/admin/AdminAnalytics'

// HR pages
import HRDashboard from './pages/hr/HRDashboard'
import HRActivities from './pages/hr/HRActivities'
import CreateActivity from './pages/hr/CreateActivity'
import HRRecommendations from './pages/hr/HRRecommendations'
import HRHistory from './pages/hr/HRHistory'
import HRAnalytics from './pages/hr/HRAnalytics'
import HRImportEmployees from './pages/hr/HRImportEmployees'

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ManagerActivities from './pages/manager/ManagerActivities'
import ManagerActivityDetail from './pages/manager/ManagerActivityDetail'
import ManagerValidations from './pages/manager/ManagerValidations'
import ManagerHistory from './pages/manager/ManagerHistory'

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import EmployeeActivities from './pages/employee/EmployeeActivities'
import EmployeeNotifications from './pages/employee/EmployeeNotifications'
import EmployeeHistory from './pages/employee/EmployeeHistory'
import EmployeeProfile from './pages/employee/EmployeeProfile'

export default function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <DataProvider>
            <ToastProvider>
              <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Admin routes */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/departments" element={<AdminDepartments />} />
                  <Route path="/admin/skills" element={<AdminSkills />} />
                  <Route path="/admin/questions" element={<AdminQuestions />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                </Route>

                {/* HR routes (accessible to HR and ADMIN) */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/hr/dashboard" element={<HRDashboard />} />
                  <Route path="/hr/activities" element={<HRActivities />} />
                  <Route path="/hr/create-activity" element={<CreateActivity />} />
                  <Route path="/hr/recommendations/:activityId" element={<HRRecommendations />} />
                  <Route path="/hr/import-employees" element={<HRImportEmployees />} />
                  <Route path="/hr/history" element={<HRHistory />} />
                  <Route path="/hr/analytics" element={<HRAnalytics />} />
                </Route>

                {/* Manager routes (accessible to MANAGER and ADMIN) */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                  <Route path="/manager/activities" element={<ManagerActivities />} />
                  <Route path="/manager/activity/:id" element={<ManagerActivityDetail />} />
                  <Route path="/manager/validations" element={<ManagerValidations />} />
                  <Route path="/manager/history" element={<ManagerHistory />} />
                </Route>

                {/* Employee routes (accessible to EMPLOYEE and ADMIN) */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                  <Route path="/employee/activities" element={<EmployeeActivities />} />
                  <Route path="/employee/notifications" element={<EmployeeNotifications />} />
                  <Route path="/employee/history" element={<EmployeeHistory />} />
                  <Route path="/employee/profile" element={<EmployeeProfile />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>

              <ToastViewport />
              <AccessibilityWidget />
            </ToastProvider>
          </DataProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  )
}
