import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, GraduationCap, Percent, BookOpen, Map, IndianRupee, HelpCircle, Clock, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InquiryForm = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', city: '',
    category: '', stream: '', twelfthPercent: '', cetScore: '',
    preferredBranch: '', preferredLocation: '', feeBudget: '',
    mainProblem: '', contactTime: '', message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration Failed');

      // Auto login
      if (data.token) {
        localStorage.setItem('studentToken', data.token);
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        navigate('/select-plan');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white focus:border-primary-500 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10 appearance-none";
  const selectClass = "w-full bg-surface border border-white/10 rounded-2xl px-12 py-4 text-white focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm sm:p-6">
      <div 
        className="glass w-full max-w-4xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header (Sticky) */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-surface/50 backdrop-blur-xl shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">Student Registration</h2>
            <p className="text-gray-400 text-sm">Fill out your details to get a personalized college list.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          {status === 'success' ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
              <p className="text-gray-400">Redirecting to login...</p>
            </div>
          ) : (
            <form id="registrationForm" onSubmit={handleSubmit} className="space-y-8">
              
              {/* SECTION 1: Personal Info */}
              <div>
                <h3 className="text-lg font-bold text-primary-400 mb-4 uppercase tracking-wider text-sm border-b border-white/5 pb-2">1. Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" required placeholder="Full Name" className={inputClass} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="email" required placeholder="Email Address" className={inputClass} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="tel" required placeholder="WhatsApp Number" className={inputClass} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="password" required placeholder="Create Password" className={inputClass} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" required placeholder="City / District" className={inputClass} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                    <select required className={selectClass} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      <option value="" disabled>Select Category</option>
                      <option value="Open">Open / General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="VJ/NT">VJ / NT</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Academic Info */}
              <div>
                <h3 className="text-lg font-bold text-primary-400 mb-4 uppercase tracking-wider text-sm border-b border-white/5 pb-2">2. Academic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                    <select required className={selectClass} value={formData.stream} onChange={(e) => setFormData({...formData, stream: e.target.value})}>
                      <option value="" disabled>Select Stream</option>
                      <option value="PCM">12th PCM</option>
                      <option value="PCB">12th PCB</option>
                      <option value="Diploma">Diploma Engineering</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" required placeholder="12th / Diploma %" className={inputClass} value={formData.twelfthPercent} onChange={(e) => setFormData({...formData, twelfthPercent: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input type="text" placeholder="MHT CET Percentile (If any)" className={inputClass} value={formData.cetScore} onChange={(e) => setFormData({...formData, cetScore: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Preferences */}
              <div>
                <h3 className="text-lg font-bold text-primary-400 mb-4 uppercase tracking-wider text-sm border-b border-white/5 pb-2">3. College Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                    <select required className={selectClass} value={formData.preferredBranch} onChange={(e) => setFormData({...formData, preferredBranch: e.target.value})}>
                      <option value="" disabled>Preferred Branch</option>
                      <option value="CS/IT">CS / IT / AIML</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Electrical">Electrical / ENTC</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Any">Any Branch</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                    <select required className={selectClass} value={formData.preferredLocation} onChange={(e) => setFormData({...formData, preferredLocation: e.target.value})}>
                      <option value="" disabled>Preferred Location</option>
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Aurangabad">Aurangabad (Chhatrapati Sambhajinagar)</option>
                      <option value="Anywhere">Anywhere in Maharashtra</option>
                    </select>
                  </div>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                    <select required className={selectClass} value={formData.feeBudget} onChange={(e) => setFormData({...formData, feeBudget: e.target.value})}>
                      <option value="" disabled>Yearly Fee Budget</option>
                      <option value="Under 50K">Under ₹50,000</option>
                      <option value="50K - 1L">₹50,000 - ₹1 Lakh</option>
                      <option value="1L - 2L">₹1 Lakh - ₹2 Lakhs</option>
                      <option value="Above 2L">Above ₹2 Lakhs</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Support */}
              <div>
                <h3 className="text-lg font-bold text-primary-400 mb-4 uppercase tracking-wider text-sm border-b border-white/5 pb-2">4. Support Needed</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                    <select required className={selectClass} value={formData.mainProblem} onChange={(e) => setFormData({...formData, mainProblem: e.target.value})}>
                      <option value="" disabled>What is your main problem?</option>
                      <option value="College Confusion">Confusion in College Selection</option>
                      <option value="Low Percentile">Low Percentile / Rank</option>
                      <option value="Documents">Document Issues</option>
                      <option value="Branch Selection">Don't know which branch to take</option>
                      <option value="Fees">High Fees / Need Scholarship Info</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                    <select required className={selectClass} value={formData.contactTime} onChange={(e) => setFormData({...formData, contactTime: e.target.value})}>
                      <option value="" disabled>Preferred Contact Time</option>
                      <option value="Morning">Morning (10 AM - 1 PM)</option>
                      <option value="Afternoon">Afternoon (1 PM - 5 PM)</option>
                      <option value="Evening">Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer (Sticky) */}
        <div className="p-6 sm:p-8 border-t border-white/10 bg-surface/50 backdrop-blur-xl shrink-0 flex flex-col sm:flex-row gap-4 justify-end items-center">
          {status === 'error' && <span className="text-red-400 text-sm">Failed to register. Email might already exist.</span>}
          
          <button 
            type="button" 
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="registrationForm"
            disabled={status === 'loading'}
            className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-black px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2"
          >
            {status === 'loading' ? 'Submitting...' : 'Register Now'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default InquiryForm;
