import { useState } from 'react';
import { Menu, Bell , BellRing } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-400 rounded-lg hover:text-white hover:bg-slate-800 lg:hidden focus:outline-none transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Dynamic Welcome Heading */}
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight sm:text-xl">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'User'} 👋
          </h1>
          <p className="hidden text-xs text-slate-400 sm:block">
            {user?.role === 'admin' 
              ? 'Here is an overview of active recruitment stats and branch performance.' 
              : 'Track your placement progress, browse recruitment drives, and check analytics.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell trigger and dropdown panel */}
        <div className="relative">
  <button
    onClick={() => setNotifOpen(!notifOpen)}
    className={`bell-btn-trigger relative p-2 rounded-xl transition-all duration-200 ${
      notifOpen
        ? 'bg-slate-800 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {unreadCount > 0 ? (
      <BellRing className="w-5 h-5 text-brand-500" />
    ) : (
      <Bell className="w-5 h-5" />
    )}

    {unreadCount > 0 && (
      <>
        {/* Pulse Animation */}
        <span
          className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"
          style={{ pointerEvents: 'none' }}
        />

        {/* Red Dot */}
        <span
          className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-slate-900"
          style={{ pointerEvents: 'none' }}
        />

        {/* Count Badge */}
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-lg">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      </>
    )}
  </button>

  <NotificationPanel
    isOpen={notifOpen}
    onClose={() => setNotifOpen(false)}
    onUnreadCountChange={setUnreadCount}
  />
</div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-800" />

        {/* Compact User Capsule */}
        <div className="flex items-center gap-2.5">
          <div className="hidden text-right md:block">
            <p className="text-xs font-semibold text-white leading-none">{user?.name}</p>
            <span className="text-[10px] font-medium text-slate-400">
              {user?.role === 'admin' ? 'Admin / Placements' : user?.branch}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center font-bold text-brand-400 text-xs shadow-inner">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
