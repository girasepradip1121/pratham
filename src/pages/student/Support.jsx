import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import Button from '../../components/ui/Button';
import { HelpCircle, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';

const Support = () => {
  const { token } = useContext(AuthContext);
  const [category, setCategory] = useState('College Selection');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please describe your query.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(
        `${API_BASE_URL}/api/student/support`,
        { category, query },
        { headers }
      );
      setSuccess(res.data.message || 'Support ticket raised successfully!');
      setQuery('');
    } catch (err) {
      console.error('Error raising support ticket:', err);
      setError(err.response?.data?.message || 'Failed to submit support ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass p-6 rounded-3xl border border-white/10">
        <h1 className="text-2xl font-serif font-bold text-white mb-1 flex items-center gap-3">
          <HelpCircle className="text-primary-500" size={28} /> Help & Support Center
        </h1>
        <p className="text-gray-400 text-xs">
          Have a question about CAP option forms, cutoffs, or payments? Open a ticket to reach our experts directly.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6 items-start animate-fadeIn">
        {/* Info box */}
        <div className="glass p-6 rounded-3xl border border-white/10 md:col-span-2 space-y-4 text-xs text-gray-400 bg-white/[0.01]">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
            <ShieldAlert size={16} className="text-primary-400" />
            Support Guidelines
          </h3>
          <p>
            • Response Time: Tickets are typically answered within 2 to 4 business hours.
          </p>
          <p>
            • If you have uploaded mock files and they are pending verification, no ticket is needed; our documents desk reviews them automatically.
          </p>
          <p>
            • For critical priority, you can also reach us via the WhatsApp consultation scheduler on the overview page.
          </p>
        </div>

        {/* Form Box */}
        <div className="glass p-6 rounded-3xl border border-white/10 md:col-span-3 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <MessageSquare size={16} className="text-primary-400" />
            Submit Query Desk
          </h3>

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Ticket Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
              >
                <option value="College Selection">College Selection & CAP Priority</option>
                <option value="Payment Issue">Payment & Plan Upgrade Issues</option>
                <option value="Document Verification">Document Reviews / Errors</option>
                <option value="Profile Correction">Profile Detail Mistakes</option>
                <option value="Other">Other Technical Query</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Explain Your Problem</label>
              <textarea
                rows={5}
                required
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Please write details about your issue, queries or any assistance you need..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none resize-none text-xs leading-relaxed"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full py-3.5 font-bold">
              {loading ? 'Submitting query...' : 'Raise Ticket'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
