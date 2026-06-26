/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';
import { CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const Payments = () => {
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/student/payments`, { headers });
      setPayments(res.data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'Failed':
        return <XCircle className="text-red-500" size={16} />;
      case 'Pending':
      default:
        return <AlertCircle className="text-yellow-500" size={16} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center glass p-6 rounded-3xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Payment Ledger</h1>
            <p className="text-gray-400 text-xs">Track enrollment invoices, receipt codes, and transaction updates.</p>
          </div>
        </div>
        <button 
          onClick={fetchPayments} 
          className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="glass border border-white/10 rounded-3xl p-12 text-center text-gray-500 space-y-2">
          <AlertCircle size={40} className="mx-auto text-white/5" />
          <p>No payments recorded yet.</p>
        </div>
      ) : (
        <div className="glass border border-white/10 rounded-3xl overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-medium">
                  <th className="p-4">Receipt ID</th>
                  <th className="p-4">Plan Name</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono font-bold text-white text-xs">{p.receiptId}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-500/10 text-primary-400 border border-primary-500/10 uppercase">
                        {p.planName}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white">₹{p.amount}</td>
                    <td className="p-4 font-mono text-xs text-gray-400">{p.razorpayPaymentId || 'N/A'}</td>
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-300">
                        {getStatusIcon(p.status)}
                        <span>{p.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
