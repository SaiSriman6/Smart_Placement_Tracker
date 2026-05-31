import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Auth Guard: if not authenticated, redirect to Login
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden text-slate-100">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content body */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-950">
        {/* Header bar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Dashboard page viewport */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
