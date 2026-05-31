import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Page Imports
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseDrives from './pages/student/BrowseDrives';
import StudentProfile from './pages/student/StudentProfile';

// Admin Page Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCompanies from './pages/admin/ManageCompanies';
import ManageDrives from './pages/admin/ManageDrives';
import ManageApplications from './pages/admin/ManageApplications';
import ManageStudents from './pages/admin/ManageStudents';
import UpdateStudent from './pages/admin/UpdateStudent';

// Landing Page Redirector
const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center font-sans text-slate-500 animate-pulse text-xs">
        Bootstrapping smart placement network...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === 'admin' 
    ? <Navigate to="/admin" replace /> 
    : <Navigate to="/student" replace />;
};

// Admin Guard Middleware
const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Student Guard Middleware
const StudentGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public authentication portals */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Dashboard Core layouts */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeRedirect />} />

          {/* Student Area */}
          <Route path="student" element={<StudentGuard><StudentDashboard /></StudentGuard>} />
          <Route path="student/drives" element={<StudentGuard><BrowseDrives /></StudentGuard>} />
          <Route path="student/profile" element={<StudentGuard><StudentProfile /></StudentGuard>} />

          {/* Admin Area */}
          <Route path="admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="admin/companies" element={<AdminGuard><ManageCompanies /></AdminGuard>} />
          <Route path="admin/drives" element={<AdminGuard><ManageDrives /></AdminGuard>} />
          <Route path="admin/applications" element={<AdminGuard><ManageApplications /></AdminGuard>} />
          <Route path="admin/students" element={<AdminGuard><ManageStudents /></AdminGuard>} />
          <Route path="admin/update-student/:id" element={<AdminGuard><UpdateStudent /></AdminGuard>} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
