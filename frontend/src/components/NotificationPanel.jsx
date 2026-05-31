import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bell, Check, CheckCheck, Info, Calendar, Trophy, Clock, X, BellRing} from 'lucide-react';


export default function NotificationPanel({ isOpen, onClose, onUnreadCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notification`);
      const data = response.data.payload || [];
      setNotifications(data);
      
      // Calculate unread count and trigger callback
      const unread = data.filter(n => !n.isRead).length;
      onUnreadCountChange(unread);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // Only close if we didn't click the bell button itself (handled by parent toggle)
        if (!event.target.closest('.bell-btn-trigger')) {
          onClose();
        }
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Relative time helper
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Mark single as read
  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return; // Already read
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notification/${id}`);
      
      // Update local state
      const updated = notifications.map(notif => 
        notif._id === id ? { ...notif, isRead: true } : notif
      );
      setNotifications(updated);
      
      // Update unread count
      const unread = updated.filter(n => !n.isRead).length;
      onUnreadCountChange(unread);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/notification/mark-all-read`);
      
      // Update local state
      const updated = notifications.map(notif => ({ ...notif, isRead: true }));
      setNotifications(updated);
      onUnreadCountChange(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  if (!isOpen) return null;

  // Icon type mapping
  const getIconForType = (type) => {
    switch (type) {
      case 'DRIVE':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'RESULT':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'INTERVIEW':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  // Border color mapping for unread left-accent
  const getBorderColorForType = (type) => {
    switch (type) {
      case 'DRIVE':
        return 'border-l-blue-500';
      case 'RESULT':
        return 'border-l-emerald-500';
      case 'INTERVIEW':
        return 'border-l-amber-500';
      default:
        return 'border-l-brand-400';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl glass border border-slate-800 shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 ease-out"
      style={{ top: '100%' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-sm text-slate-200">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-xxs font-bold bg-brand-500 text-white rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-800/50">
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500 mb-2"></div>
            <p className="text-xs">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-slate-500">
            <div className="p-3 bg-slate-900/60 rounded-full border border-slate-800 mb-3">
              <Bell className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-400">All caught up!</p>
            <p className="text-xs mt-1">No notifications to show right now.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif._id}
              onClick={() => handleMarkAsRead(notif._id, notif.isRead)}
              className={`p-4 flex gap-3 text-left transition-all duration-200 cursor-pointer ${
                notif.isRead 
                  ? 'hover:bg-slate-900/30 bg-slate-950/20' 
                  : `bg-brand-500/5 hover:bg-brand-500/10 border-l-2 ${getBorderColorForType(notif.type)}`
              }`}
            >
              {/* Type Icon Indicator */}
              <div className={`p-2 rounded-lg shrink-0 h-9 w-9 flex items-center justify-center ${
                notif.isRead 
                  ? 'bg-slate-900/60 border border-slate-800/80 text-slate-400' 
                  : 'bg-slate-900 text-white border border-slate-800'
              }`}>
                {getIconForType(notif.type)}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`text-xs font-semibold truncate ${
                    notif.isRead ? 'text-slate-400' : 'text-slate-200'
                  }`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                    {getRelativeTime(notif.createdAt)}
                  </span>
                </div>
                <p className={`text-xxs mt-1 leading-relaxed ${
                  notif.isRead ? 'text-slate-500' : 'text-slate-350'
                }`}>
                  {notif.message}
                </p>
                {!notif.isRead && (
                  <button className="text-[10px] text-brand-400 font-semibold mt-2 flex items-center gap-1 hover:text-brand-350 transition-colors">
                    <Check className="w-3 h-3" />
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/40 text-center">
        <span className="text-[10px] text-slate-500 font-medium">
          Showing recent placement activity
        </span>
      </div>
    </div>
  );
}
