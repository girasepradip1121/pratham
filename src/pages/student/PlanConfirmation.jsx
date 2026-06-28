/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Check,
  ChevronLeft,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Info,
  Calendar,
  Lock,
  CheckCircle2,
  X
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const downloadReceipt = (studentProfile) => {
  const receiptId = localStorage.getItem('receiptId') || `REC-${Math.floor(100000 + Math.random() * 900000)}`;
  const txnId = localStorage.getItem('transactionId') || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const amount = localStorage.getItem('paymentAmount') || (studentProfile.plan?.includes('PLATINUM') ? '1999' : '999');
  
  const receiptText = `==================================================
              CET COUNSELLING PORTAL
                 PAYMENT RECEIPT
==================================================
Receipt ID      : \${receiptId}
Date            : \${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
Transaction ID  : \${txnId}
--------------------------------------------------
STUDENT DETAILS:
Name            : \${studentProfile.name || 'Student'}
Email           : \${studentProfile.email || '-'}
WhatsApp Phone  : \${studentProfile.phone || '-'}
City            : \${studentProfile.city || '-'}
MHT-CET Score   : \${studentProfile.cetScore || '-'} Percentile
--------------------------------------------------
PLAN DETAILS:
Selected Plan   : \${studentProfile.plan || 'SILVER'}
Amount Paid     : INR \${amount}.00
Payment Status  : SUCCESSFUL / PAID
--------------------------------------------------
Thank you for enrolling! Senior counsellor Pradip Girase
will reach out to schedule your 1-on-1 session.
==================================================`;

  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CET_Counselling_Receipt_\${receiptId}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

const PlanConfirmation = () => {
  const { user, fetchProfile } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('studentToken');

  const [cmsData, setCmsData] = useState(null);

  // Fetch CMS Data
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/cms-data`)
      .then(res => res.json())
      .then(data => setCmsData(data))
      .catch(console.error);
  }, []);

  // ── Profile completeness check (admission-type aware) ──────────────────────
  const admType = user?.admissionType || 'CET';
  const isProfileIncomplete = !user?.phone || !user?.category || !user?.city ||
    (admType === 'CET' ? !user?.cetScore : !user?.diplomaPercentage);

  // ── Inline profile form state ──────────────────────────────────────────────
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileForm, setProfileForm] = useState({
    admissionType: 'CET',
    phone: '', city: '', category: 'Open', stream: 'PCM',
    twelfthPercent: '', cetScore: '',
    diplomaPercentage: '',
    preferredBranch: 'CS/IT', preferredLocation: 'Pune',
    message: ''
  });

  // Pre-fill form from user data when available
  useEffect(() => {
    if (user) {
      setProfileForm({
        admissionType: user.admissionType || 'CET',
        phone: user.phone || '',
        city: user.city || '',
        category: user.category || 'Open',
        stream: user.stream || 'PCM',
        twelfthPercent: user.twelfthPercent || '',
        cetScore: user.cetScore || '',
        diplomaPercentage: user.diplomaPercentage || '',
        preferredBranch: user.preferredBranch || 'CS/IT',
        preferredLocation: user.preferredLocation || 'Pune',
        message: user.message || ''
      });
      // Auto-open form if profile is incomplete
      if (!user.phone || !user.category || !user.city) {
        setShowProfileForm(true);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (res.ok) {
        await fetchProfile(token); // Refresh context — clears isProfileIncomplete
        setProfileSaved(true);
        setTimeout(() => {
          setShowProfileForm(false);
          setProfileSaved(false);
        }, 1200);
      } else {
        setProfileError(data.message || 'Failed to save profile.');
      }
    } catch {
      setProfileError('Connection error. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };


  const selectedPlan = searchParams.get('plan') || localStorage.getItem('selectedPlan') || 'Silver';
  const isPlatinum = selectedPlan.toLowerCase().includes('platinum');

  const matchingPlan = cmsData?.pricingPlans?.find(
    p => p.name.toLowerCase() === selectedPlan.toLowerCase() ||
         p.name.toLowerCase().replace(/\s+/g, '').includes(selectedPlan.toLowerCase().replace(/\s+/g, ''))
  );

  const planDetails = matchingPlan ? {
    name: matchingPlan.name,
    price: Number(matchingPlan.price),
    oldPrice: Number(matchingPlan.oldPrice),
    discount: matchingPlan.oldPrice ? `${Math.round(((Number(matchingPlan.oldPrice) - Number(matchingPlan.price)) / Number(matchingPlan.oldPrice)) * 100)}% Off` : 'Special Discount',
    validity: 'Till CAP Round Admission Confirmation (Dec 2026)',
    badge: matchingPlan.badge || 'Mentorship Plan',
    features: matchingPlan.features || [],
    benefits: matchingPlan.description || ''
  } : (isPlatinum ? {
    name: 'Platinum Counselling',
    price: 1999,
    oldPrice: 2999,
    discount: '33% Off',
    validity: 'Till CAP Round Admission Confirmation (Dec 2026)',
    badge: 'Most Popular Mentorship',
    features: [
      '1-on-1 Personal Call Consultation with Pradip Sir',
      'Advanced CAP Round Option List Strategy',
      'Fully Customised PDF College Roadmaps',
      'Priority Phone Call & Emergency Support',
      'Admission Support Till Seat Securing',
      'Live Doubt Solving Sessions Access'
    ],
    benefits: 'Get absolute peace of mind with senior counsellor supervision. Pradip Girase will personally review and prepare your final option entry list.'
  } : {
    name: 'Silver Guidance',
    price: 999,
    oldPrice: 1499,
    discount: '33% Off',
    validity: 'Till CAP Round Admission Confirmation (Dec 2026)',
    badge: 'Standard Starter Guidance',
    features: [
      'Personalized College Preference List',
      'CAP Round Merit Rank Mapping',
      'Branch Selection Assistance',
      'Premium WhatsApp Chat Support',
      'Required Document Checklist & FC Verification Help',
      'Basic Admission Strategy PDF guides'
    ],
    benefits: 'Properly arrange your engineering or pharmacy preferences to guarantee the highest tier college possible based on your rank.'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSandboxOptions, setShowSandboxOptions] = useState(false);
  const [sandboxOrder, setSandboxOrder] = useState(null);

  const [scriptReady, setScriptReady] = useState(false);
  // Load Razorpay script and set readiness flag
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setScriptReady(false);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: planDetails.price,
          planName: planDetails.name
        })
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.message || 'Could not initiate checkout transaction.');

      if (orderData.sandbox) {
        // Fallback Sandbox simulated mode
        setSandboxOrder(orderData);
        setShowSandboxOptions(true);
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        // Razorpay script not loaded – fallback to sandbox UI
        setShowSandboxOptions(true);
        setLoading(false);
        return;
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RRIca3IrHhfxkt',
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "CET Counselling Platform",
        description: `Purchase for ${planDetails.name}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await fetch(`${API_BASE_URL}/api/student/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planName: planDetails.name,
                amount: planDetails.price,
                sandbox: false
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              localStorage.setItem('selectedPlan', planDetails.name);
              localStorage.setItem('receiptId', verifyData.payment?.receiptId || `REC-${Date.now()}`);
              localStorage.setItem('transactionId', response.razorpay_payment_id);
              localStorage.setItem('paymentAmount', planDetails.price);
              
              await fetchProfile(token);
              navigate('/payment-success');
            } else {
              setError(verifyData.message || 'Payment signature validation failed.');
            }
          } catch {
            setError('Connection failed during verification.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: "#f59e0b"
        },
        modal: {
          ondismiss: function () {
            setError('Payment checkout cancelled.');
            fetch(`${API_BASE_URL}/api/student/payment-failed`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ orderId: orderData.orderId })
            }).catch(console.error);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setError(resp.error.description || 'Razorpay checkout transaction failed.');
        fetch(`${API_BASE_URL}/api/student/payment-failed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ orderId: orderData.orderId })
        }).catch(console.error);
      });
      rzp.open();

    } catch (err) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      if (!showSandboxOptions) setLoading(false);
    }
  };

  const handleSandboxComplete = async (success) => {
    if (!sandboxOrder) return;
    setLoading(true);
    setError('');

    try {
      if (!success) {
        await fetch(`${API_BASE_URL}/api/student/payment-failed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ orderId: sandboxOrder.orderId })
        });
        setError('Simulated payment failed.');
        setShowSandboxOptions(false);
        setLoading(false);
        return;
      }

      const verifyRes = await fetch(`${API_BASE_URL}/api/student/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(7)}`,
          razorpay_order_id: sandboxOrder.orderId,
          razorpay_signature: 'sandbox_signature',
          planName: planDetails.name,
          amount: planDetails.price,
          sandbox: true
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        localStorage.setItem('selectedPlan', planDetails.name);
        localStorage.setItem('receiptId', sandboxOrder.receiptId || `REC-SAND-${Date.now()}`);
        localStorage.setItem('transactionId', `TXN-SAND-${Date.now()}`);
        localStorage.setItem('paymentAmount', planDetails.price);
        
        await fetchProfile(token);
        navigate('/payment-success');
      } else {
        setError(verifyData.message || 'Sandbox confirmation failure.');
      }
    } catch {
      setError('Connection failed during simulated billing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Glow Rings */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-32 pb-20 relative z-10">

        {/* Back Link */}
        <Link
          to="/#pricing"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm mb-8"
        >
          <ChevronLeft size={16} /> Back to Pricing Plans
        </Link>

        {/* Confirmation Layout */}
        <div className="grid md:grid-cols-5 gap-8 items-start">

          {/* Plan Breakdown details */}
          <div className="glass border border-white/10 rounded-[2rem] p-6 sm:p-8 md:col-span-3 space-y-6 bg-white/[0.01]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-500/10 text-primary-400 border border-primary-500/10">
              <Sparkles size={10} className="fill-current" /> {planDetails.badge}
            </span>

            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">{planDetails.name}</h1>
              <p className="text-gray-400 text-sm leading-relaxed">{planDetails.benefits}</p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="font-bold text-white mb-4 text-base">Counselling Services Included:</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {planDetails.features.map((feat, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 bg-primary-500/10 text-primary-400 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-500/10">
                      <Check size={12} />
                    </div>
                    <span className="text-xs text-gray-300 leading-relaxed font-light">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-3 text-xs text-gray-400 leading-relaxed">
              <Calendar className="text-primary-500 flex-shrink-0" size={16} />
              <div>
                <span className="font-semibold text-white block">Validity Timeline:</span>
                {planDetails.validity}
              </div>
            </div>
          </div>

          {/* Pricing Checkout Ledger */}
          <div className="glass border border-white/10 rounded-[2rem] p-6 sm:p-8 md:col-span-2 space-y-6 bg-white/[0.02] sticky top-32">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-3">Payment Summary</h2>

            {/* Price list */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Subtotal Plan Price</span>
                <span className="text-gray-300 line-through">₹{planDetails.oldPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-light">Direct Discount</span>
                <span className="text-green-400 font-semibold">-{planDetails.discount}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3">
                <span className="text-white font-bold">Total (Inclusive of GST)</span>
                <span className="text-primary-400 text-xl font-mono font-bold">₹{planDetails.price}</span>
              </div>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-2xl text-xs flex gap-2">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Checkout Options */}
            {isProfileIncomplete ? (
              <div className="space-y-4 pt-2">
                {/* Incomplete alert bar */}
                <div className="bg-amber-500/10 border border-amber-500/25 text-amber-400 p-4 rounded-2xl text-xs flex gap-2 font-medium">
                  <AlertTriangle className="flex-shrink-0 mt-0.5" size={14} />
                  <span>Please complete your profile before proceeding to payment.</span>
                </div>

                {/* Toggle button */}
                {!showProfileForm ? (
                  <button
                    onClick={() => setShowProfileForm(true)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3.5 rounded-2xl transition-all text-sm"
                  >
                    Complete Profile & Continue
                  </button>
                ) : (
                  /* ── INLINE PROFILE FORM ─────────────────────────────── */
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                    {/* Form header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-surface/50">
                      <div>
                        <h4 className="text-white font-bold text-sm">Complete Your Academic Profile</h4>
                        <p className="text-gray-400 text-[11px] mt-0.5">Required before payment. Takes 30 seconds.</p>
                      </div>
                      <button onClick={() => setShowProfileForm(false)} className="text-gray-500 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>

                    {/* Success state */}
                    {profileSaved ? (
                      <div className="py-10 text-center space-y-3">
                        <CheckCircle2 size={40} className="mx-auto text-green-400" />
                        <p className="text-white font-bold text-sm">Profile Saved!</p>
                        <p className="text-gray-400 text-xs">Unlocking payment...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveProfile} className="p-5 space-y-4 text-sm">

                        {/* Admission Type Toggle */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Admission Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setProfileForm({ ...profileForm, admissionType: 'CET', diplomaPercentage: '' })}
                              className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left text-xs ${
                                profileForm.admissionType === 'CET'
                                  ? 'border-primary-500 bg-primary-500/10 text-white'
                                  : 'border-white/10 bg-white/5 text-gray-400'
                              }`}
                            >
                              <span className="font-bold">📘 CET (12th Pass)</span>
                              <span className="opacity-60 text-[10px]">First Year via MHT-CET</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfileForm({ ...profileForm, admissionType: 'Diploma', twelfthPercent: '', cetScore: '' })}
                              className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left text-xs ${
                                profileForm.admissionType === 'Diploma'
                                  ? 'border-blue-500 bg-blue-500/10 text-white'
                                  : 'border-white/10 bg-white/5 text-gray-400'
                              }`}
                            >
                              <span className="font-bold">🎓 Diploma (DSY)</span>
                              <span className="opacity-60 text-[10px]">Direct Second Year</span>
                            </button>
                          </div>
                        </div>

                        {/* Phone + City */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">WhatsApp No. <span className="text-red-400">*</span></label>
                            <input
                              type="tel" required
                              value={profileForm.phone}
                              onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                              placeholder="9876543210"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-primary-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">City <span className="text-red-400">*</span></label>
                            <input
                              type="text" required
                              value={profileForm.city}
                              onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                              placeholder="e.g. Pune"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-primary-500 outline-none"
                            />
                          </div>
                        </div>

                        {/* Academic Score (admission-type conditional) */}
                        {profileForm.admissionType === 'CET' ? (
                          <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-3 space-y-3">
                            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">📘 CET Track</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">12th PCM % <span className="text-red-400">*</span></label>
                                <input
                                  type="number" step="0.01" min="0" max="100" required
                                  value={profileForm.twelfthPercent}
                                  onChange={e => setProfileForm({ ...profileForm, twelfthPercent: e.target.value })}
                                  placeholder="e.g. 84.5"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-primary-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">CET Percentile <span className="text-red-400">*</span></label>
                                <input
                                  type="number" step="0.0001" min="0" max="100" required
                                  value={profileForm.cetScore}
                                  onChange={e => setProfileForm({ ...profileForm, cetScore: e.target.value })}
                                  placeholder="e.g. 95.12"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-primary-500 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 space-y-2">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">🎓 Diploma Track</p>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Diploma % <span className="text-red-400">*</span></label>
                              <input
                                type="number" step="0.01" min="0" max="100" required
                                value={profileForm.diplomaPercentage}
                                onChange={e => setProfileForm({ ...profileForm, diplomaPercentage: e.target.value })}
                                placeholder="e.g. 72.5"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-primary-500 outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {/* Category */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                            <select
                              value={profileForm.category}
                              onChange={e => setProfileForm({ ...profileForm, category: e.target.value })}
                              className="w-full bg-[#071028] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-primary-500 outline-none"
                            >
                              <option value="Open">Open / General</option>
                              <option value="OBC">OBC</option>
                              <option value="SC">SC</option>
                              <option value="ST">ST</option>
                              <option value="EWS">EWS</option>
                              <option value="VJ/NT">VJ / NT</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Preferred Branch</label>
                            <select
                              value={profileForm.preferredBranch}
                              onChange={e => setProfileForm({ ...profileForm, preferredBranch: e.target.value })}
                              className="w-full bg-[#071028] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:border-primary-500 outline-none"
                            >
                              <option value="CS/IT">CS / IT / AIML</option>
                              <option value="Electrical">Electrical</option>
                              <option value="Mechanical">Mechanical</option>
                              <option value="Civil">Civil</option>
                              <option value="Pharmacy">Pharmacy</option>
                            </select>
                          </div>
                        </div>

                        {/* Error */}
                        {profileError && (
                          <p className="text-red-400 text-xs flex items-center gap-1.5">
                            <AlertCircle size={12} /> {profileError}
                          </p>
                        )}

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={profileSaving}
                          className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-all text-sm"
                        >
                          {profileSaving ? 'Saving...' : 'Save Profile & Unlock Payment'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ) : !showSandboxOptions ? (
              <div className="space-y-4 pt-2">
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 text-base font-bold flex items-center justify-center gap-2"
                >
                  {loading ? 'Initializing payment gateway...' : 'Proceed to Payment'}
                </Button>

                <p className="text-center text-[10px] text-gray-500 tracking-wider flex items-center justify-center gap-1.5 uppercase">
                  <Lock size={10} /> Secure SSL • Encrypted billing
                </p>
              </div>
            ) : (
              <div className="space-y-4 bg-primary-500/5 border border-primary-500/25 p-5 rounded-2xl text-center">
                <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Info size={12} /> Sandbox Billing Emulator
                </h4>
                <p className="text-xs text-gray-300">
                  We detected that there is no active Razorpay key configured. Use the sandbox buttons below to simulate billing.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleSandboxComplete(true)}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-black py-2.5 rounded-xl font-bold text-xs transition-colors"
                  >
                    Simulate Success
                  </button>
                  <button
                    onClick={() => handleSandboxComplete(false)}
                    disabled={loading}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 py-2.5 rounded-xl font-bold text-xs transition-colors"
                  >
                    Simulate Fail
                  </button>
                </div>
              </div>
            )}

            {/* Guarantee footer */}
            <div className="pt-4 border-t border-white/5 text-[11px] text-gray-500 flex gap-2">
              <ShieldCheck className="text-green-500 flex-shrink-0" size={16} />
              <span>Full compliance with standard CAP round reservation rules in Maharashtra. No hidden pricing adjustments.</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlanConfirmation;
