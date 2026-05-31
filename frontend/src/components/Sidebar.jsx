import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  UserCircle, 
  Building2, 
  Users, 
  FileSpreadsheet, 
  LogOut, 
  GraduationCap 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { to: '/admin/companies', label: 'Recruiters', icon: Building2 },
    { to: '/admin/drives', label: 'Placement Drives', icon: Briefcase },
    { to: '/admin/applications', label: 'Track Applications', icon: FileSpreadsheet },
    { to: '/admin/students', label: 'Manage Students', icon: Users },
  ];

  const studentLinks = [
    { to: '/student', label: 'Student Dashboard', icon: LayoutDashboard },
    { to: '/student/drives', label: 'Placement Drives', icon: Briefcase },
    { to: '/student/profile', label: 'My Portfolio', icon: UserCircle },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 border-r border-slate-800 bg-slate-900/90 backdrop-blur-md transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-lg shadow-brand-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Smart Placement Tracker</h1>
            <p className="text-xs font-medium text-brand-400 tracking-wide uppercase">Placement Portal</p>
          </div>
        </div>

        {/* User Info Capsule */}
        <div className="mx-4 mt-6 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-brand-500/30 flex items-center justify-center font-bold text-brand-400 uppercase text-lg shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">{user?.name}</h2>
              <span className="inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-2xs font-semibold capitalize bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 mt-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/student'}
                onClick={() => {
                  if (isOpen) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/15'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-semibold text-rose-400 border border-rose-500/25 bg-rose-500/5 rounded-xl hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
