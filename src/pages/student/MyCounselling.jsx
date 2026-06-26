import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { Calendar, Clock, FileText, GraduationCap, MapPin, MessageSquare, AlertCircle } from 'lucide-react';

const MyCounselling = () => {
  const { user: profile, token } = useContext(AuthContext);
  const [upcomingCall, setUpcomingCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!token) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_BASE_URL}/api/student/meetings`, { headers });
        
        // Find the first pending call schedule to display as upcoming
        const meetings = res.data || [];
        const pendingCall = meetings.find(m => m.status === 'Pending');
        setUpcomingCall(pendingCall || meetings[0] || null);
      } catch (err) {
        console.error('Error fetching meetings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Parse assigned colleges if stored as JSON
  let collegesList = [];
  if (profile?.assignedColleges) {
    try {
      collegesList = JSON.parse(profile.assignedColleges);
    } catch {
      collegesList = profile.assignedColleges.split(',').map(c => c.trim()).filter(Boolean);
    }
  }

  // Parse assigned PDFs
  let pdfList = [];
  if (profile?.assignedPDFs) {
    try {
      pdfList = JSON.parse(profile.assignedPDFs);
    } catch {
      pdfList = profile.assignedPDFs.split(',').map(url => ({ name: 'Counselling PDF Guide', url: url.trim() }));
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'InProgress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Pending':
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-6 rounded-3xl border border-white/10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-1">My Counselling Panel</h1>
            <p className="text-gray-400 text-sm">Direct status updates and recommendations from Mentor Pradip Girase.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">Status:</span>
            <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${getStatusColor(profile?.counsellingStatus)}`}>
              {profile?.counsellingStatus || 'Pending'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Content: Notes and Colleges */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Admin/Counsellor Notes */}
            <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="text-primary-500" size={20} />
                Counsellor's Personal Notes
              </h3>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl min-h-[120px] text-gray-300 text-sm leading-relaxed">
                {profile?.counsellingNotes ? (
                  profile.counsellingNotes
                ) : (
                  <p className="text-gray-500 italic flex items-center gap-2">
                    <AlertCircle size={16} /> No counsellor notes added yet. Notes will appear here as soon as the mentor updates your profile.
                  </p>
                )}
              </div>
            </div>

            {/* Assigned Colleges / CAP Option Form recommendations */}
            <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="text-primary-500" size={20} />
                Your Assigned CAP Option Form
              </h3>
              <p className="text-xs text-gray-400">
                These colleges have been hand-picked by our experts specifically matching your rank, categories, and branch preferences.
              </p>
              
              {collegesList.length === 0 ? (
                <div className="bg-white/5 p-6 rounded-2xl text-center text-gray-500 text-sm">
                  Counsellor has not assigned colleges to your choice form yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {collegesList.map((college, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.07] transition-all">
                      <span className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-white text-sm">{typeof college === 'string' ? college : college.collegeName}</h4>
                        {college.branch && (
                          <p className="text-gray-400 text-xs flex items-center gap-1">
                            <MapPin size={12} /> {college.branch} | {college.location || college.city || 'MH'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Side Panel: Schedule & Documents */}
          <div className="space-y-8">
            
            {/* Call Schedule */}
            <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="text-primary-500" size={20} />
                Upcoming Meeting
              </h3>
              
              {upcomingCall ? (
                <div className="bg-primary-500/5 border border-primary-500/15 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-primary-400 font-semibold uppercase tracking-wider">
                    <Clock size={14} /> Upcoming Call
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{upcomingCall.title || 'Counselling Consultation'}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(upcomingCall.scheduledAt).toLocaleString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  {upcomingCall.meetLink && (
                    <a
                      href={upcomingCall.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-primary-500 hover:bg-primary-600 text-black text-xs font-bold py-2 px-4 rounded-xl transition-all"
                    >
                      Join Meeting
                    </a>
                  )}
                  <div className="text-[10px] text-gray-500 font-mono">
                    Status: <span className="text-yellow-500">{upcomingCall.status}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 p-4 rounded-2xl text-center text-gray-500 text-xs py-8">
                  No upcoming calls scheduled at this moment.
                </div>
              )}
            </div>

            {/* Custom PDF Guides / PDFs Assigned */}
            <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-primary-500" size={20} />
                Premium PDF Guides
              </h3>
              <p className="text-xs text-gray-400">Download personalized seat matrices, previous year's option sheets, and cutoff lists.</p>

              {pdfList.length === 0 ? (
                <div className="bg-white/5 p-4 rounded-2xl text-center text-gray-500 text-xs py-8">
                  No customized guides uploaded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {pdfList.map((pdf, idx) => (
                    <a
                      key={idx}
                      href={pdf.url.startsWith('http') ? pdf.url : `${API_BASE_URL}${pdf.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 hover:border-primary-500/20 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText size={16} className="text-red-400 shrink-0" />
                        <span className="text-xs text-white truncate font-medium">{pdf.name || 'Counselling Guide PDF'}</span>
                      </div>
                      <span className="text-[10px] text-primary-400 group-hover:underline">Download</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
  );
};

export default MyCounselling;
