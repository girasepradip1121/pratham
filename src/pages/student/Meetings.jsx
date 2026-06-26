/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { Calendar, Clock, Video, AlertCircle, RefreshCw } from 'lucide-react';

const Meetings = () => {
  const { token } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/student/meetings`, { headers });
      setMeetings(res.data || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Pending':
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center glass p-6 rounded-3xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Scheduled Meetings</h1>
            <p className="text-gray-400 text-xs">Track your 1-on-1 calls and join live counselling sessions.</p>
          </div>
        </div>
        <button 
          onClick={fetchMeetings} 
          className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="glass border border-white/10 rounded-3xl p-12 text-center text-gray-500 space-y-2">
          <AlertCircle size={40} className="mx-auto text-white/5" />
          <p>No meetings scheduled yet.</p>
          <p className="text-xs text-gray-400">Your mentor will schedule a call when reviewing your profile details.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meet) => (
            <div 
              key={meet.id} 
              className="glass border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base">{meet.title || '1-on-1 Counselling Consultation'}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(meet.status)}`}>
                    {meet.status}
                  </span>
                </div>
                {meet.description && (
                  <p className="text-gray-400 text-sm">{meet.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(meet.scheduledAt).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                  {meet.scheduledTime && (
                    <span>Time Slot: {meet.scheduledTime}</span>
                  )}
                </div>
              </div>

              {meet.status === 'Pending' && meet.meetLink && (
                <a
                  href={meet.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-black text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-primary-500/10 shrink-0"
                >
                  <Video size={14} /> Join Meeting
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meetings;
