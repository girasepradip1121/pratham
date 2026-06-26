import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Download, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const selectedPlan = localStorage.getItem("selectedPlan") || 'Silver Guidance';
  const receiptId = localStorage.getItem("receiptId") || `INV-${Date.now()}`;
  const transactionId = localStorage.getItem("transactionId") || `TXN-${Date.now()}`;
  const amount = localStorage.getItem("paymentAmount") || '999';
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Glow rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-32 pb-20 relative z-10">
        
        {/* Printable Invoice Container */}
        <div className="glass border border-white/10 rounded-[2.5rem] p-8 sm:p-10 text-center space-y-8 bg-white/[0.01] print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          
          {/* Print Only Header */}
          <div className="hidden print:block text-left border-b border-gray-200 pb-5 mb-5">
            <h1 className="text-2xl font-bold font-serif text-black uppercase">CET Admissions Counselling Platform</h1>
            <p className="text-xs text-gray-500">Maharashtra Engineering & Pharmacy Preference Mentorship</p>
          </div>

          {/* Success Check circle */}
          <div className="print:hidden">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.15)] animate-pulse">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400 text-sm font-light">Thank you for enrolling. Your plan is now active.</p>
          </div>

          <div className="text-left print:text-black">
            <h3 className="text-white print:text-black font-bold text-base mb-4 flex items-center gap-2 border-b border-white/5 pb-2 print:border-gray-200">
              <FileText size={18} className="text-primary-500" /> Transaction Invoice
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-1">Receipt ID (Invoice No)</span>
                <span className="text-white print:text-black font-semibold font-mono">{receiptId}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-1">Transaction ID</span>
                <span className="text-white print:text-black font-semibold font-mono">{transactionId}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-1">Date & Time</span>
                <span className="text-white print:text-black font-semibold">{currentDate}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200">
                <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-1">Activated Plan</span>
                <span className="text-primary-400 print:text-yellow-600 font-bold">{selectedPlan}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 print:bg-gray-50 print:border-gray-200 col-span-2 flex justify-between items-center">
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[9px] mb-0.5">Amount Paid</span>
                  <span className="text-white print:text-black font-bold font-mono text-base">₹{amount}.00</span>
                </div>
                <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full font-bold uppercase print:bg-green-100 print:text-green-700">
                  PAID
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee footer */}
          <div className="bg-white/5 p-4 rounded-2xl text-[11px] text-gray-400 text-left flex gap-2 border border-white/5 print:hidden">
            <ShieldCheck className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
            <span>Your preference sheet matches will be generated immediately in the Student Dashboard based on MHT-CET seat listings. Keep this invoice for FC verification references.</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center print:hidden">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Download size={16} /> Download Receipt
            </button>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-black px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              Go to Student Dashboard <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;