/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { Bell, Check, Info } from 'lucide-react';

const Notifications = () => {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/student/notifications`, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('studentToken')}` },
        params: { studentId: user?.id }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id, token]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/student/notifications/${id}/read`, null, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('studentToken')}` }
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center glass p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-gray-400 text-xs">Stay updated on CAP announcements and personal counselling reviews.</p>
            </div>
          </div>
          <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-gray-400">
            {notifications.filter(n => !n.isRead).length} Unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="glass border border-white/10 rounded-3xl p-12 text-center text-gray-500 space-y-2">
            <Info size={40} className="mx-auto text-white/5" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`border rounded-2xl p-5 flex items-start justify-between gap-4 transition-all ${
                  n.isRead 
                    ? 'bg-white/[0.01] border-white/5 opacity-60' 
                    : 'bg-[#0f172a] border-primary-500/20 shadow-lg shadow-primary-500/5'
                }`}
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">{n.title || 'System Notification'}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-gray-500 font-mono pt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="flex items-center gap-1 px-3.5 py-2 bg-primary-500 hover:bg-primary-600 text-black text-xs font-bold rounded-xl transition-colors shrink-0"
                    title="Mark as Read"
                  >
                    <Check size={14} /> Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
  );
};

export default Notifications;
