/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Sparkles,
  Shield,
  ChevronRight,
  MessageCircle,
  BookOpen,
} from 'lucide-react';

import ProfileCompletionCard from '../../components/Dashboard/ProfileCompletionCard';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const StudentProfile = () => {
  const { user, token, fetchProfile, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    admissionType: 'CET',      // 'CET' | 'Diploma'
    name: '',
    email: '',
    phone: '',
    city: '',
    category: 'Open',
    stream: 'PCM',
    twelfthPercent: '',        // CET track only
    cetScore: '',              // CET track only
    diplomaPercentage: '',     // Diploma track only
    preferredBranch: 'CS/IT',
    preferredLocation: 'Pune',
    mainProblem: '',
    contactTime: 'Morning',
    message: '',
  });

  // Pre-fill form from AuthContext user profile
  useEffect(() => {
    if (user) {
      setFormData({
        admissionType: user.admissionType || 'CET',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        category: user.category || 'Open',
        stream: user.stream || 'PCM',
        twelfthPercent: user.twelfthPercent || '',
        cetScore: user.cetScore || '',
        diplomaPercentage: user.diplomaPercentage || '',
        preferredBranch: user.preferredBranch || 'CS/IT',
        preferredLocation: user.preferredLocation || 'Pune',
        mainProblem: user.mainProblem || '',
        contactTime: user.contactTime || 'Morning',
        message: user.message || '',
      });
    }
  }, [user]);

  // Handle Redirect if not authenticated
  useEffect(() => {
    if (!token && !authLoading) {
      navigate('/login');
    }
  }, [token, authLoading, navigate]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle admission type switch — clear irrelevant fields immediately
  const handleAdmissionTypeChange = (type) => {
    if (type === 'Diploma') {
      setFormData({
        ...formData,
        admissionType: 'Diploma',
        twelfthPercent: '',
        cetScore: '',
      });
    } else {
      setFormData({
        ...formData,
        admissionType: 'CET',
        diplomaPercentage: '',
      });
    }
  };

  // Save Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const activeToken = token || localStorage.getItem('studentToken');
      const res = await fetch(`${API_BASE_URL}/api/student/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        await fetchProfile(activeToken); // Sync Context state
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server error');
    } finally {
      setSaving(false);
    }
  };

  // Profile Completion Percent Calculator — admission-type aware
  const getCompletionPercent = () => {
    const baseFields = ['name', 'email', 'phone', 'city', 'preferredBranch', 'preferredLocation'];
    const scoreField = formData.admissionType === 'Diploma' ? 'diplomaPercentage' : 'cetScore';
    const fields = [...baseFields, 'stream', scoreField];

    const filled = fields.filter(
      (field) => formData[field] && formData[field].toString().trim() !== ''
    ).length;

    return Math.round((filled / fields.length) * 100);
  };

  const completion = getCompletionPercent();
  const isDiploma = formData.admissionType === 'Diploma';

  if (authLoading || (!user && token)) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PROFILE COMPLETION */}
      <ProfileCompletionCard completion={completion} />

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl px-5 py-4">
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-5 py-4">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── ADMISSION TYPE SELECTOR ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f172a] border border-white/10 rounded-[28px] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <BookOpen className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Admission Type</h2>
              <p className="text-gray-400 text-sm">Choose how you are applying for engineering admission</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CET Card */}
            <button
              type="button"
              onClick={() => handleAdmissionTypeChange('CET')}
              className={`flex flex-col items-start gap-2 p-5 rounded-2xl border transition-all text-left ${
                !isDiploma
                  ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">📘</span>
                <span className={`font-bold text-base ${!isDiploma ? 'text-white' : 'text-gray-400'}`}>
                  CET (12th Pass)
                </span>
                {!isDiploma && (
                  <span className="ml-auto text-[9px] font-bold bg-primary-500 text-black px-2 py-0.5 rounded-full">SELECTED</span>
                )}
              </div>
              <p className={`text-xs leading-relaxed ${!isDiploma ? 'text-gray-300' : 'text-gray-500'}`}>
                First Year Engineering via MHT-CET Percentile. Requires 12th PCM % and CET score.
              </p>
            </button>

            {/* Diploma Card */}
            <button
              type="button"
              onClick={() => handleAdmissionTypeChange('Diploma')}
              className={`flex flex-col items-start gap-2 p-5 rounded-2xl border transition-all text-left ${
                isDiploma
                  ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <span className={`font-bold text-base ${isDiploma ? 'text-white' : 'text-gray-400'}`}>
                  Diploma (DSY)
                </span>
                {isDiploma && (
                  <span className="ml-auto text-[9px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">SELECTED</span>
                )}
              </div>
              <p className={`text-xs leading-relaxed ${isDiploma ? 'text-gray-300' : 'text-gray-500'}`}>
                Direct Second Year (Lateral Entry) Admission. Only Diploma Percentage required — no CET score needed.
              </p>
            </button>
          </div>
        </motion.div>

        {/* ── PERSONAL DETAILS ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f172a] border border-white/10 rounded-[28px] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <User className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Personal Details</h2>
              <p className="text-gray-400 text-sm">Fill your personal information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NAME */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* EMAIL (read-only — set by Google) */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-gray-400"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">WhatsApp Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="WhatsApp Number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">City / District</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── ACADEMIC DETAILS (Admission-Type Conditional) ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`border rounded-[28px] p-6 sm:p-8 transition-colors ${
            isDiploma
              ? 'bg-blue-500/[0.03] border-blue-500/20'
              : 'bg-[#0f172a] border-white/10'
          }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDiploma ? 'bg-blue-500/10' : 'bg-primary-500/10'}`}>
              <GraduationCap className={isDiploma ? 'text-blue-400' : 'text-primary-400'} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Academic Details</h2>
              <p className="text-gray-400 text-sm">
                {isDiploma
                  ? '🎓 Diploma Track — enter your diploma percentage'
                  : '📘 CET Track — enter your 12th PCM % and CET percentile'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* STREAM */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Stream</label>
              <select
                name="stream"
                value={formData.stream}
                onChange={handleChange}
                className="w-full bg-[#071028] border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary-500"
              >
                <option value="PCM" className="bg-[#071028] text-white">PCM (Engineering)</option>
                <option value="PCB" className="bg-[#071028] text-white">PCB (Pharmacy)</option>
              </select>
            </div>

            {/* ── CET TRACK FIELDS ── */}
            {!isDiploma && (
              <>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    MHT-CET Percentile <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      name="cetScore"
                      step="0.0001"
                      min="0"
                      max="100"
                      value={formData.cetScore}
                      onChange={handleChange}
                      placeholder="e.g. 98.45"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    12th PCM Percentage <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Award size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      name="twelfthPercent"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.twelfthPercent}
                      onChange={handleChange}
                      placeholder="e.g. 85.5"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── DIPLOMA TRACK FIELD ── */}
            {isDiploma && (
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-2 block">
                  Diploma Percentage <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Award size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                  <input
                    type="number"
                    name="diplomaPercentage"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.diplomaPercentage}
                    onChange={handleChange}
                    placeholder="e.g. 72.5"
                    className="w-full bg-blue-500/5 border border-blue-500/20 rounded-xl pl-12 pr-4 py-4 text-white outline-none focus:border-blue-400 font-mono"
                  />
                </div>
                <p className="text-xs text-blue-400/70 mt-1.5">
                  As a Diploma student, 12th PCM % and CET Percentile are not required.
                </p>
              </div>
            )}

            {/* CATEGORY */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#071028] border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary-500"
              >
                <option value="Open" className="bg-[#071028] text-white">Open / General</option>
                <option value="OBC" className="bg-[#071028] text-white">OBC</option>
                <option value="SC" className="bg-[#071028] text-white">SC</option>
                <option value="ST" className="bg-[#071028] text-white">ST</option>
                <option value="EWS" className="bg-[#071028] text-white">EWS</option>
                <option value="VJ/NT" className="bg-[#071028] text-white">VJ / NT</option>
              </select>
            </div>

            {/* BRANCH */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Preferred Branch</label>
              <select
                name="preferredBranch"
                value={formData.preferredBranch}
                onChange={handleChange}
                className="w-full bg-[#071028] border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary-500"
              >
                <option value="CS/IT" className="bg-[#071028] text-white">CS / IT / AIML</option>
                <option value="Electrical" className="bg-[#071028] text-white">Electrical</option>
                <option value="Mechanical" className="bg-[#071028] text-white">Mechanical</option>
                <option value="Civil" className="bg-[#071028] text-white">Civil</option>
                <option value="Pharmacy" className="bg-[#071028] text-white">Pharmacy</option>
              </select>
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Preferred Location</label>
              <select
                name="preferredLocation"
                value={formData.preferredLocation}
                onChange={handleChange}
                className="w-full bg-[#071028] border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary-500"
              >
                <option value="Pune" className="bg-[#071028] text-white">Pune</option>
                <option value="Mumbai" className="bg-[#071028] text-white">Mumbai</option>
                <option value="Nashik" className="bg-[#071028] text-white">Nashik</option>
                <option value="Aurangabad" className="bg-[#071028] text-white">Aurangabad</option>
                <option value="Nagpur" className="bg-[#071028] text-white">Nagpur</option>
                <option value="Anywhere" className="bg-[#071028] text-white">Anywhere in MH</option>
              </select>
            </div>

          </div>
        </motion.div>

        {/* ── COUNSELLING DETAILS ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0f172a] border border-white/10 rounded-[28px] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <MessageCircle className="text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Counselling Details</h2>
              <p className="text-gray-400 text-sm">Tell us your problems or needs</p>
            </div>
          </div>

          <div className="space-y-5">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Write your confusion, queries, or specific college concerns..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary-500 resize-none font-light leading-relaxed"
            />
          </div>
        </motion.div>

        {/* ── SUBMIT ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f172a] border border-white/10 rounded-[28px] p-6 flex flex-col lg:flex-row gap-5 items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Shield className="text-primary-500" />
            <p className="text-gray-400 text-sm">Your data is stored securely and is visible only to senior counsellors.</p>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="px-10 py-4 text-lg group font-bold"
          >
            {saving ? 'Saving...' : 'Save & View Dashboard'}
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default StudentProfile;