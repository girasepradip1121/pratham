/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FileText, Download } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const Documents = () => {
  const { token } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/student/documents`, { headers });
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Only admin-allocated reference sheets
  const adminGuides = documents.filter(doc => doc.studentId === null);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass p-6 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-serif font-bold text-white mb-1 flex items-center gap-3">
          <FileText className="text-primary-500" size={30} /> Counselling Reference Guides
        </h1>
        <p className="text-gray-400 text-sm">
          Download seat matrices, previous year cutoff reference sheets, and preference form guides published by the admin.
        </p>
      </div>

      {/* Admin Shared Cutoffs & PDF Guides */}
      <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Reference Documents</h3>
        {adminGuides.length === 0 ? (
          <div className="bg-white/5 p-8 rounded-2xl text-center text-gray-500 text-xs">
            No reference sheets published for your plan yet.
          </div>
        ) : (
          <div className="space-y-3">
            {adminGuides.map(doc => (
              <div key={doc.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText size={20} className="text-red-400 shrink-0" />
                  <div className="overflow-hidden">
                    <p className="font-bold text-white text-sm truncate">{doc.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Availability: <strong className="text-primary-400">{doc.visibility} Plan</strong></p>
                  </div>
                </div>
                <a
                  href={doc.url.startsWith('http') ? doc.url : `${API_BASE_URL}${doc.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/15 text-primary-400 hover:bg-primary-500/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  <Download size={12} /> Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
