import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart2, CreditCard, HelpCircle, GitMerge, LayoutDashboard, UserCircle, LogOut, Shield, FileText, GraduationCap, Menu, X, Edit2, Trash2, Plus } from 'lucide-react';
import API_BASE_URL from '../../config/api';

// Subcomponents could be separated, but for speed, we'll keep simple versions here.
const StudentsManager = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [viewStudent, setViewStudent] = useState(null);

  const [assignedCounsellor, setAssignedCounsellor] = useState('');
  const [counsellingNotes, setCounsellingNotes] = useState('');
  const [counsellingStatus, setCounsellingStatus] = useState('Pending');
  const [whatsappGroupLink, setWhatsappGroupLink] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setStudents(data))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    if (viewStudent) {
      setAssignedCounsellor(viewStudent.assignedCounsellor || 'Pradip Girase');
      setCounsellingNotes(viewStudent.counsellingNotes || '');
      setCounsellingStatus(viewStudent.counsellingStatus || 'Pending');
      setWhatsappGroupLink(viewStudent.whatsappGroupLink || '');
    }
  }, [viewStudent]);

  const togglePaymentStatus = async (student) => {
    const newStatus = student.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newStatus })
      });
      if (res.ok) {
        setStudents(students.map(s => s.id === student.id ? { ...s, paymentStatus: newStatus } : s));
      }
    } catch (err) { console.error(err) }
  };

  const handleSaveCounselling = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/students/${viewStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assignedCounsellor,
          counsellingNotes,
          counsellingStatus,
          whatsappGroupLink
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setStudents(students.map(s => s.id === viewStudent.id ? updated : s));
        setViewStudent(null);
        alert('Student counselling details updated successfully!');
      } else {
        alert('Failed to update details');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating details');
    }
  };

  return (
    <div className="glass p-6 rounded-3xl border border-white/10">
      <h3 className="text-2xl font-bold text-white mb-6">Registered Students</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="pb-3 px-4">Name</th>
              <th className="pb-3 px-4">Phone</th>
              <th className="pb-3 px-4">Score</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-4 text-white">{s.name}</td>
                <td className="py-4 px-4 text-gray-300">{s.phone}</td>
                <td className="py-4 px-4 text-gray-300">{s.cetScore || '-'}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${s.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {s.paymentStatus}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => togglePaymentStatus(s)} className="text-primary-500 text-xs hover:underline">
                      Toggle Payment
                    </button>
                    <button onClick={() => setViewStudent(s)} className="text-blue-400 text-xs hover:underline">
                      View Full Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewStudent && createPortal(
        <div 
          onClick={() => setViewStudent(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-slate-900/95 backdrop-blur-md w-full max-w-3xl rounded-3xl border border-white/10 p-5 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <UserCircle className="text-primary-500" size={24} />
                <h3 className="text-xl sm:text-2xl font-bold text-white">Student Profile Details</h3>
              </div>
              <button 
                onClick={() => setViewStudent(null)} 
                className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Plan & Status Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase font-medium">Selected Plan</p>
                  <p className="text-primary-400 font-bold text-base capitalize mt-0.5">{viewStudent.plan || 'None'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-medium">Payment Status</p>
                  <span className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold ${viewStudent.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'}`}>
                    {viewStudent.paymentStatus || 'Pending'}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-medium">Admission Track</p>
                  <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/20">
                    {viewStudent.admissionType === 'Diploma' ? 'Direct 2nd Year (Diploma)' : '1st Year (MHT-CET)'}
                  </span>
                </div>
              </div>

              {/* Personal Details Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal & Contact Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">Full Name</p>
                    <p className="text-white font-medium break-words">{viewStudent.name}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">Email Address</p>
                    <p className="text-white font-medium break-words">{viewStudent.email || '-'}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">WhatsApp Number</p>
                    <p className="text-white font-medium">{viewStudent.phone}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">City / Region</p>
                    <p className="text-white font-medium">{viewStudent.city || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Details Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Academic Credentials</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">Category (Reservation)</p>
                    <p className="text-white font-medium">{viewStudent.category || '-'}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">Selected Stream</p>
                    <p className="text-white font-medium">{viewStudent.stream || '-'}</p>
                  </div>
                  {viewStudent.admissionType === 'Diploma' ? (
                    <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all sm:col-span-2">
                      <p className="text-gray-500 text-xs uppercase mb-1">Diploma Percentage</p>
                      <p className="text-white font-medium">{viewStudent.diplomaPercentage || viewStudent.twelfthPercent || '-'}</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                        <p className="text-gray-500 text-xs uppercase mb-1">12th percentage</p>
                        <p className="text-white font-medium">{viewStudent.twelfthPercent || '-'}</p>
                      </div>
                      <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                        <p className="text-gray-500 text-xs uppercase mb-1">MHT-CET / JEE Score</p>
                        <p className="text-white font-medium">{viewStudent.cetScore || '-'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Preferences Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Admission Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">Preferred Branch</p>
                    <p className="text-white font-medium">{viewStudent.preferredBranch || '-'}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">Preferred Location</p>
                    <p className="text-white font-medium">{viewStudent.preferredLocation || '-'}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">Annual Fee Budget</p>
                    <p className="text-white font-medium">{viewStudent.feeBudget || '-'}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-gray-500 text-xs uppercase mb-1">Preferred Contact Time</p>
                    <p className="text-white font-medium">{viewStudent.contactTime || '-'}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all sm:col-span-2">
                    <p className="text-gray-500 text-xs uppercase mb-1">Primary Problem/Query</p>
                    <p className="text-white font-medium break-words whitespace-pre-wrap">{viewStudent.mainProblem || '-'}</p>
                  </div>
                  <div className="bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all sm:col-span-2">
                    <p className="text-gray-500 text-xs uppercase mb-1">Message from Student</p>
                    <p className="text-white font-medium break-words whitespace-pre-wrap">{viewStudent.message || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Counselling Controls */}
            <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
              <h4 className="text-lg font-bold text-white font-serif">Counselling & WhatsApp Settings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Assigned Counsellor</label>
                  <input
                    type="text"
                    value={assignedCounsellor}
                    onChange={e => setAssignedCounsellor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Counselling Status</label>
                  <select
                    value={counsellingStatus}
                    onChange={e => setCounsellingStatus(e.target.value)}
                    className="w-full bg-[#071028] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                  >
                    <option value="Pending" className="bg-[#071028] text-white">Pending</option>
                    <option value="InProgress" className="bg-[#071028] text-white">InProgress</option>
                    <option value="Completed" className="bg-[#071028] text-white">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">WhatsApp Group Link</label>
                <input
                  type="text"
                  value={whatsappGroupLink}
                  onChange={e => setWhatsappGroupLink(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Counselling Notes (Admin Only)</label>
                <textarea
                  rows={3}
                  value={counsellingNotes}
                  onChange={e => setCounsellingNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                  placeholder="Add private counselling notes about college choices, follow-up schedule..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveCounselling}
                  className="bg-primary-500 hover:bg-primary-600 text-black font-bold px-6 py-3 rounded-xl transition-all"
                >
                  Save Counselling Details
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
const DocumentsManager = ({ token }) => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('All');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDocuments(data);
    } catch (err) { console.error(err); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('visibility', visibility);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/documents/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('File uploaded successfully!');
        setTitle('');
        setDescription('');
        setFile(null);
        document.getElementById('file-input').value = '';
        fetchDocuments();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchDocuments();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8">
      <div className="glass p-6 rounded-3xl border border-white/10">
        <h3 className="text-2xl font-bold text-white mb-6">Upload Document</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Document Title</label>
              <input
                type="text"
                required
                placeholder="e.g. CAP Round 1 Cutoffs"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#071028] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
              >
                <option value="Cutoffs" className="bg-[#071028] text-white">Cutoffs</option>
                <option value="Syllabus" className="bg-[#071028] text-white">Syllabus</option>
                <option value="Guidelines" className="bg-[#071028] text-white">Guidelines</option>
                <option value="General" className="bg-[#071028] text-white">General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Select File (PDF, Image, etc.)</label>
              <input
                type="file"
                required
                id="file-input"
                onChange={e => setFile(e.target.files[0])}
                className="w-full text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Plan Visibility</label>
              <select
                value={visibility}
                onChange={e => setVisibility(e.target.value)}
                className="w-full bg-[#071028] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
              >
                <option value="All" className="bg-[#071028] text-white">All Students</option>
                <option value="Silver" className="bg-[#071028] text-white">Silver Plan Only</option>
                <option value="Platinum" className="bg-[#071028] text-white">Platinum Plan Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Description</label>
            <textarea
              rows={2}
              placeholder="Provide a brief description of the document..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-primary-500 hover:bg-primary-600 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/10">
        <h3 className="text-2xl font-bold text-white mb-6">Uploaded Documents</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="pb-3 px-4">Title</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4">Type</th>
                <th className="pb-3 px-4">Visibility</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.filter(d => !d.studentId).map(d => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4 text-white font-medium">{d.title}</td>
                  <td className="py-4 px-4 text-gray-300">{d.category}</td>
                  <td className="py-4 px-4 text-gray-400 uppercase font-mono text-xs">{d.type}</td>
                  <td className="py-4 px-4 text-gray-300">{d.visibility}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-3">
                      <a href={`${API_BASE_URL}${d.url}`} target="_blank" rel="noreferrer" className="text-primary-400 hover:underline text-xs">
                        View
                      </a>
                      <button onClick={() => handleDelete(d.id)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {documents.filter(d => !d.studentId).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No admin documents uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const GenericCMSManager = ({ title, endpoint, token, fields }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) { console.error(err); }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      const emptyForm = {};
      fields.forEach(f => {
        emptyForm[f.key] = f.type === 'array' ? [] : f.type === 'boolean' ? false : '';
      });
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem 
      ? `${API_BASE_URL}${endpoint}/${editingItem.id}` 
      : `${API_BASE_URL}${endpoint}`;
    
    try {
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) { console.error(err); }
  };

  const handleArrayChange = (key, index, value) => {
    const newArray = [...formData[key]];
    newArray[index] = value;
    setFormData({ ...formData, [key]: newArray });
  };

  const addArrayItem = (key) => {
    setFormData({ ...formData, [key]: [...(formData[key] || []), ''] });
  };

  const removeArrayItem = (key, index) => {
    const newArray = [...formData[key]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [key]: newArray });
  };

  return (
    <div className="glass p-6 rounded-3xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">{title} Management</h3>
        <button 
          onClick={() => openModal()} 
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-black px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              {fields.slice(0, 4).map(f => (
                <th key={f.key} className="pb-3 px-4 capitalize">{f.key.replace(/([A-Z])/g, ' $1').trim()}</th>
              ))}
              <th className="pb-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                {fields.slice(0, 4).map(f => (
                  <td key={f.key} className="py-4 px-4 text-gray-300 max-w-[200px] truncate">
                    {f.type === 'boolean' ? (item[f.key] ? 'Yes' : 'No') : 
                     f.type === 'array' ? `${item[f.key]?.length || 0} items` : 
                     String(item[f.key] || '')}
                  </td>
                ))}
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openModal(item)} className="text-blue-400 hover:text-blue-300 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">No {title.toLowerCase()} found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && createPortal(
        <div 
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 border border-white/10 w-full max-w-2xl rounded-3xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xl sm:text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} {title}</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {fields.map(f => {
                  const isFullWidth = f.type === 'textarea' || f.type === 'array' || f.type === 'boolean';
                  return (
                    <div key={f.key} className={`space-y-1.5 ${isFullWidth ? 'sm:col-span-2' : ''}`}>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">{f.key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      
                      {f.type === 'textarea' ? (
                        <textarea 
                          required={!f.optional}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                          rows="3"
                          value={formData[f.key] || ''}
                          onChange={e => setFormData({...formData, [f.key]: e.target.value})}
                        />
                      ) : f.type === 'boolean' ? (
                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                          <input 
                            type="checkbox" 
                            checked={formData[f.key] || false}
                            onChange={e => setFormData({...formData, [f.key]: e.target.checked})}
                            className="w-5 h-5 accent-primary-500 rounded"
                          />
                          <span className="text-gray-300">Enabled / Active</span>
                        </div>
                      ) : f.type === 'array' ? (
                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                          {(formData[f.key] || []).map((val, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input 
                                type="text"
                                value={val}
                                onChange={e => handleArrayChange(f.key, idx, e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none"
                              />
                              <button type="button" onClick={() => removeArrayItem(f.key, idx)} className="text-red-400 p-2 hover:bg-white/5 rounded-lg">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addArrayItem(f.key)} className="text-primary-400 text-sm hover:underline mt-2 flex items-center gap-1">
                            <Plus size={14} /> Add Item
                          </button>
                        </div>
                      ) : (
                        <input 
                          type={f.type === 'number' ? 'number' : 'text'} 
                          required={!f.optional}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                          value={formData[f.key] || ''}
                          onChange={e => setFormData({...formData, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value})}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-medium text-gray-300 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl font-medium bg-primary-500 text-black hover:bg-primary-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const schemas = {
  stats: [
    { key: 'label', type: 'text' },
    { key: 'value', type: 'text' },
    { key: 'iconName', type: 'text' },
    { key: 'colorClass', type: 'text' },
    { key: 'bgClass', type: 'text' }
  ],
  pricing: [
    { key: 'name', type: 'text' },
    { key: 'price', type: 'text' },
    { key: 'oldPrice', type: 'text' },
    { key: 'badge', type: 'text', optional: true },
    { key: 'iconName', type: 'text' },
    { key: 'description', type: 'textarea' },
    { key: 'features', type: 'array' },
    { key: 'buttonText', type: 'text' },
    { key: 'isHighlighted', type: 'boolean' }
  ],
  faqs: [
    { key: 'question', type: 'text' },
    { key: 'answer', type: 'textarea' }
  ],
  process: [
    { key: 'stepNumber', type: 'number' },
    { key: 'title', type: 'text' },
    { key: 'description', type: 'textarea' },
    { key: 'iconName', type: 'text' }
  ],
  roadmap: [
    { key: 'title', type: 'text' },
    { key: 'description', type: 'textarea' },
    { key: 'phase', type: 'text' }
  ],
  creator: [
    { key: 'name', type: 'text' },
    { key: 'role', type: 'text' },
    { key: 'description', type: 'textarea' },
    { key: 'imageUrl', type: 'text', optional: true }
  ],
  colleges: [
    { key: 'collegeName', type: 'text' },
    { key: 'collegeCode', type: 'text' },
    { key: 'stream', type: 'text' },
    { key: 'city', type: 'text' },
    { key: 'fees', type: 'number', optional: true },
    { key: 'autonomousStatus', type: 'text' },
    { key: 'naacGrade', type: 'text', optional: true },
    { key: 'placement', type: 'number', optional: true },
    { key: 'seatIntake', type: 'number', optional: true },
    { key: 'status', type: 'text' }
  ],
  callSchedules: [
    { key: 'studentId', type: 'number' },
    { key: 'title', type: 'text' },
    { key: 'description', type: 'textarea', optional: true },
    { key: 'scheduledAt', type: 'text' },
    { key: 'scheduledTime', type: 'text', optional: true },
    { key: 'meetLink', type: 'text', optional: true },
    { key: 'planVisibility', type: 'text' },
    { key: 'status', type: 'text' }
  ]
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) navigate('/admin');
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const tabs = [
    { id: 'students', name: 'Students & Payments', icon: Users },
    { id: 'documents', name: 'Documents Manager', icon: FileText },
    { id: 'colleges', name: 'Colleges Manager', icon: GraduationCap },
    { id: 'meetings', name: 'Meetings Scheduler', icon: HelpCircle },
    { id: 'stats', name: 'Stats Manager', icon: BarChart2 },
    { id: 'pricing', name: 'Pricing Plans', icon: CreditCard },
    { id: 'faqs', name: 'FAQs Manager', icon: HelpCircle },
    { id: 'process', name: 'Process Steps', icon: GitMerge },
    { id: 'roadmap', name: 'Roadmap Phases', icon: LayoutDashboard },
    { id: 'creator', name: 'Creator Profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Desktop Sidebar */}
      <aside className="w-64 glass border-r border-white/10 flex-col h-screen sticky top-0 hidden lg:flex">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="text-primary-500" size={24} />
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#071028] border-r border-white/10 z-50 flex flex-col justify-between transition-transform duration-300 transform lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="text-primary-500" size={24} />
              Admin Panel
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="px-4 py-4 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Hamburger Trigger */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all lg:hidden"
                aria-label="Open Navigation Drawer"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-serif font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Manage your platform content dynamically.</p>
              </div>
            </div>
          </header>

          {activeTab === 'students' && <StudentsManager token={token} />}
          {activeTab === 'documents' && <DocumentsManager token={token} />}
          {activeTab === 'colleges' && <GenericCMSManager title="Colleges" endpoint="/api/admin/colleges" token={token} fields={schemas.colleges} />}
          {activeTab === 'meetings' && <GenericCMSManager title="Meetings" endpoint="/api/admin/call-schedules" token={token} fields={schemas.callSchedules} />}
          {activeTab === 'stats' && <GenericCMSManager title="Stats" endpoint="/api/admin/stats" token={token} fields={schemas.stats} />}
          {activeTab === 'pricing' && <GenericCMSManager title="Pricing" endpoint="/api/admin/pricing-plans" token={token} fields={schemas.pricing} />}
          {activeTab === 'faqs' && <GenericCMSManager title="FAQs" endpoint="/api/admin/faqs" token={token} fields={schemas.faqs} />}
          {activeTab === 'process' && <GenericCMSManager title="Process" endpoint="/api/admin/process-steps" token={token} fields={schemas.process} />}
          {activeTab === 'roadmap' && <GenericCMSManager title="Roadmap" endpoint="/api/admin/roadmap-steps" token={token} fields={schemas.roadmap} />}
          {activeTab === 'creator' && <GenericCMSManager title="Creator Profile" endpoint="/api/admin/creator-profiles" token={token} fields={schemas.creator} />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
