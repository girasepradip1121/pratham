import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart2, CreditCard, HelpCircle, GitMerge, LayoutDashboard, UserCircle, LogOut, Shield } from 'lucide-react';

// Subcomponents could be separated, but for speed, we'll keep simple versions here.
const StudentsManager = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [viewStudent, setViewStudent] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setStudents(data))
      .catch(console.error);
  }, [token]);

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

      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl rounded-[2rem] border border-white/10 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Student Details</h3>
              <button onClick={() => setViewStudent(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">Full Name</p>
                <p className="text-white font-medium">{viewStudent.name}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">Email</p>
                <p className="text-white font-medium">{viewStudent.email || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">WhatsApp</p>
                <p className="text-white font-medium">{viewStudent.phone}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">City</p>
                <p className="text-white font-medium">{viewStudent.city || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">Category</p>
                <p className="text-white font-medium">{viewStudent.category || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">Stream</p>
                <p className="text-white font-medium">{viewStudent.stream || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">12th / Diploma %</p>
                <p className="text-white font-medium">{viewStudent.twelfthPercent || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">CET Score</p>
                <p className="text-white font-medium">{viewStudent.cetScore || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">Preferred Branch</p>
                <p className="text-white font-medium">{viewStudent.preferredBranch || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">Preferred Location</p>
                <p className="text-white font-medium">{viewStudent.preferredLocation || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">Fee Budget</p>
                <p className="text-white font-medium">{viewStudent.feeBudget || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-gray-500 text-xs uppercase mb-1">Contact Time</p>
                <p className="text-white font-medium">{viewStudent.contactTime || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 sm:col-span-2">
                <p className="text-gray-500 text-xs uppercase mb-1">Main Problem</p>
                <p className="text-white font-medium">{viewStudent.mainProblem || '-'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 sm:col-span-2">
                <p className="text-gray-500 text-xs uppercase mb-1">Message</p>
                <p className="text-white font-medium">{viewStudent.message || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { Edit2, Trash2, Plus, X } from 'lucide-react';

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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl rounded-3xl border border-white/10 p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} {title}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map(f => (
                <div key={f.key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 capitalize">{f.key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  
                  {f.type === 'textarea' ? (
                    <textarea 
                      required={!f.optional}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                      rows="3"
                      value={formData[f.key] || ''}
                      onChange={e => setFormData({...formData, [f.key]: e.target.value})}
                    />
                  ) : f.type === 'boolean' ? (
                    <div className="flex items-center gap-3 mt-2">
                      <input 
                        type="checkbox" 
                        checked={formData[f.key] || false}
                        onChange={e => setFormData({...formData, [f.key]: e.target.checked})}
                        className="w-5 h-5 accent-primary-500 rounded"
                      />
                      <span className="text-gray-300">Enabled</span>
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                      value={formData[f.key] || ''}
                      onChange={e => setFormData({...formData, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value})}
                    />
                  )}
                </div>
              ))}
              
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-medium text-gray-300 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl font-medium bg-primary-500 text-black hover:bg-primary-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
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
  ]
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
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
    { id: 'stats', name: 'Stats Manager', icon: BarChart2 },
    { id: 'pricing', name: 'Pricing Plans', icon: CreditCard },
    { id: 'faqs', name: 'FAQs Manager', icon: HelpCircle },
    { id: 'process', name: 'Process Steps', icon: GitMerge },
    { id: 'roadmap', name: 'Roadmap Phases', icon: LayoutDashboard },
    { id: 'creator', name: 'Creator Profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/10 flex flex-col h-screen sticky top-0">
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Manage your platform content dynamically.</p>
          </header>

          {activeTab === 'students' && <StudentsManager token={token} />}
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
