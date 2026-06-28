/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  QrCode,
  CreditCard,
  Shield,
  Lock,
  Unlock,
  GraduationCap,
  Award,
  ChevronRight,
  ListChecks,
  PhoneCall,
  MapPin,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Edit,
  X,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import Button from '../../components/ui/Button';
import API_BASE_URL from '../../config/api';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import Documents from './Documents';
import StudentProfile from './StudentProfile';
import ProfileCompletionCard from '../../components/Dashboard/ProfileCompletionCard';
import { AuthContext } from '../../context/AuthContext';

const downloadReceipt = (studentProfile) => {
  const receiptId = localStorage.getItem('receiptId') || `REC-${Math.floor(100000 + Math.random() * 900000)}`;
  const txnId = localStorage.getItem('transactionId') || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const amount = localStorage.getItem('paymentAmount') || (studentProfile.plan === 'PLATINUM' ? '1999' : '999');

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

const StudentDashboard = ({ defaultTab }) => {
  const { user: profile, loading, fetchProfile, token } = useContext(AuthContext);
  
  const savedPlanName = localStorage.getItem('selectedPlan') || 'Silver Guidance';
  const isPlatinumPlan = savedPlanName.toLowerCase().includes('platinum');
  const activePlanPrice = isPlatinumPlan ? 1999 : 999;
  const activePlanName = isPlatinumPlan ? 'Platinum Counselling' : 'Silver Guidance';

  const [paymentMethod, setPaymentMethod] = useState(null); // 'razorpay' or 'manual'
  const [recommendedColleges, setRecommendedColleges] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Profile editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    admissionType: 'CET',       // 'CET' | 'Diploma'
    phone: '', city: '', category: 'Open', stream: 'PCM',
    twelfthPercent: '',         // CET track: 12th PCM %
    cetScore: '',               // CET track: MHT-CET percentile
    diplomaPercentage: '',      // Diploma track: Diploma %
    preferredBranch: 'CS/IT',
    preferredLocation: 'Pune', mainProblem: 'College Confusion',
    contactTime: 'Morning', message: ''
  });
  const [editStatus, setEditStatus] = useState('idle'); // idle, loading, success

  const navigate = useNavigate();
  const location = useLocation();

  // Profile is incomplete if phone/city/category missing,
  // OR if CET student has no cetScore, OR if Diploma student has no diplomaPercentage
  const admType = profile?.admissionType || 'CET';
  const isProfileIncomplete = !profile || !profile.phone || !profile.category || !profile.city ||
    (admType === 'CET' ? !profile.cetScore : !profile.diplomaPercentage);

  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab');
  const activeTab = isProfileIncomplete ? 'profile' : (defaultTab || urlTab || 'overview');

  useEffect(() => {
    if (!token && !loading) {
      navigate('/login');
    }
  }, [token, loading, navigate]);

  useEffect(() => {
    if (profile && profile.paymentStatus !== 'Paid' && activeTab === 'documents') {
      navigate('/#pricing');
    }
  }, [profile, activeTab, navigate]);

  // Pre-fill edit form once profile data is loaded from context
  useEffect(() => {
    if (profile) {
      setEditForm({
        admissionType: profile.admissionType || 'CET',
        phone: profile.phone || '',
        city: profile.city || '',
        category: profile.category || 'Open',
        stream: profile.stream || 'PCM',
        twelfthPercent: profile.twelfthPercent || '',
        cetScore: profile.cetScore || '',
        diplomaPercentage: profile.diplomaPercentage || '',
        preferredBranch: profile.preferredBranch || 'CS/IT',
        preferredLocation: profile.preferredLocation || 'Pune',
        mainProblem: profile.mainProblem || 'College Confusion',
        contactTime: profile.contactTime || 'Morning',
        message: profile.message || ''
      });
    }
  }, [profile]);

  const fetchRecommendations = async () => {
    const isDiplomaStudent = (profile?.admissionType || 'CET') === 'Diploma';
    const scoreValue = isDiplomaStudent ? profile?.diplomaPercentage : profile?.cetScore;
    if (!profile || !scoreValue) return;

    setLoadingRecommendations(true);
    try {
      const branchParam = profile.preferredBranch || 'All';
      const locParam = profile.preferredLocation || 'Anywhere';
      const catParam = profile.category || 'Open';
      const examType = isDiplomaStudent ? 'DSY' : 'MHT-CET';
      const url = `${API_BASE_URL}/api/public/predict-colleges?examType=${examType}&scoreType=percentile&scoreValue=${scoreValue}&category=${catParam}&gender=Co-Ed&branch=${branchParam}&location=${locParam}&admissionType=${profile.admissionType || 'CET'}`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setRecommendedColleges(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Fetch Recommended Colleges for Paid Students based on profile details
  useEffect(() => {
    if (profile && profile.paymentStatus === 'Paid') {
      fetchRecommendations();
    }
  }, [profile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (res.ok) {
        await fetchProfile(token); // Synchronize context profile
        setEditStatus('success');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditStatus('idle');
        }, 1200);
      } else {
        setEditStatus('idle');
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setEditStatus('idle');
      console.error(err);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/student/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: activePlanPrice, planName: activePlanName })
      });
      const order = await orderRes.json();
 
      if (!orderRes.ok) throw new Error('Could not create order');
 
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_1234567890",
        amount: order.amount,
        currency: order.currency,
        name: "CET Counselling",
        description: `Premium Counselling - ${activePlanName}`,
        order_id: order.orderId,
        handler: async function (response) {
          await fetch(`${API_BASE_URL}/api/student/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: activePlanPrice,
              planName: activePlanName,
              sandbox: order.sandbox
            })
          });
          await fetchProfile(token); // Update context profile state
          localStorage.setItem('receiptId', `REC-${Math.floor(100000 + Math.random() * 900000)}`);
          localStorage.setItem('transactionId', response.razorpay_payment_id);
          localStorage.setItem('paymentAmount', activePlanPrice.toString());
          localStorage.setItem('selectedPlan', activePlanName);
          navigate('/payment-success');
        },
        prefill: {
          name: profile.name,
          email: profile.email,
          contact: profile.phone || ''
        },
        theme: {
          color: "#f59e0b"
        }
      };
 
      if (order.sandbox) {
        // Automatically bypass signature verification for sandbox fallback
        await fetch(`${API_BASE_URL}/api/student/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            razorpay_payment_id: `pay_sand_${Date.now()}`,
            razorpay_order_id: order.orderId,
            razorpay_signature: 'sandbox_sig',
            amount: activePlanPrice,
            planName: activePlanName,
            sandbox: true
          })
        });
        await fetchProfile(token);
        localStorage.setItem('receiptId', `REC-${Math.floor(100000 + Math.random() * 900000)}`);
        localStorage.setItem('transactionId', `pay_sand_${Date.now()}`);
        localStorage.setItem('paymentAmount', activePlanPrice.toString());
        localStorage.setItem('selectedPlan', activePlanName);
        navigate('/payment-success');
        return;
      }
 
      if (!window.Razorpay) {
        alert('Razorpay SDK not loaded');
        return;
      }
 
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Payment failed to initialize.');
    }
  };
 
  const notifyAdmin = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/student/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_payment_id: `pay_sand_${Date.now()}`,
          razorpay_order_id: `order_sand_${Math.random().toString(36).substring(7)}`,
          razorpay_signature: 'sandbox_sig',
          amount: activePlanPrice,
          planName: activePlanName,
          sandbox: true
        })
      });
      await fetchProfile(token);
      localStorage.setItem('receiptId', `REC-${Math.floor(100000 + Math.random() * 900000)}`);
      localStorage.setItem('transactionId', `pay_sand_${Date.now()}`);
      localStorage.setItem('paymentAmount', activePlanPrice.toString());
      localStorage.setItem('selectedPlan', activePlanName);
      navigate('/payment-success');
    } catch (err) {
      console.error(err);
    }
  };

  const moveCollegeUp = (index) => {
    if (index === 0) return;
    const newList = [...recommendedColleges];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    setRecommendedColleges(newList);
  };

  const moveCollegeDown = (index) => {
    if (index === recommendedColleges.length - 1) return;
    const newList = [...recommendedColleges];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    setRecommendedColleges(newList);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  // If profile hasn't loaded yet but loading is done, show a placeholder within the layout
  if (!profile) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background flex items-center justify-center text-white">
          Unable to load profile. Please try refreshing.
        </div>
      </DashboardLayout>
    );
  }

  const getCompletionPercent = () => {
    if (!profile) return 0;
    const isDiploma = (profile.admissionType || 'CET') === 'Diploma';
    const scoreField = isDiploma ? 'diplomaPercentage' : 'cetScore';
    const fields = [
      'name', 'email', 'phone', 'city', 'stream',
      scoreField,          // cetScore for CET, diplomaPercentage for Diploma
      'preferredBranch',
      'preferredLocation',
    ];

    const filled = fields.filter(
      (field) =>
        profile[field] &&
        profile[field].toString().trim() !== ''
    ).length;

    return Math.round((filled / fields.length) * 100);
  };

  const completionPercent = getCompletionPercent();

  const whatsappUrl = `https://wa.me/918983511645?text=Hello%20Pradip%20Sir,%20I%20have%20registered%20on%20your%20CET%20Counselling%20portal%20and%20completed%20the%20payment.%20My%20details%20are:%20Name:%20${encodeURIComponent(profile.name)},%20Score:%20${encodeURIComponent(profile.cetScore || 'Not Provided')},%20Phone:%20${encodeURIComponent(profile.phone || 'Not Provided')}.%20Please%20schedule%20our%20counselling%20session!`;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {activeTab !== 'overview' ? (
          <>
            {activeTab === 'documents' && (
              <Documents profile={profile} />
            )}

            {activeTab === 'profile' && (
              <StudentProfile profile={profile} />
            )}
          </>
        ) : (
          <>
            {/* Profile Completion Card */}
            <div className="mb-6">
              <ProfileCompletionCard completion={completionPercent} />
            </div>

            {/* Profile Incomplete Banner */}
            {isProfileIncomplete && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full" />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-base">Complete Your Academic Profile</h4>
                    <p className="text-sm text-gray-400 max-w-xl">
                      Please add your WhatsApp number, category, and MHT-CET score to get custom college predictors and personalized CAP lists.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-3 rounded-xl text-sm transition-all whitespace-nowrap"
                >
                  Complete Profile
                </button>
              </div>
            )}

            {/* Top Section: Profile and Payment */}
            <div className="">

              {/* Profile Details */}
              <div className="glass p-8 rounded-3xl border border-white/10 md:col-span-2 relative group">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                  title="Edit Profile"
                >
                  <Edit size={16} />
                </button>

                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <Shield className="text-primary-400" size={20} /> Your Profile
                </h2>

                {/* Admission Type Badge */}
                <div className="mb-5 mt-1">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${(profile.admissionType || 'CET') === 'Diploma'
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                    : 'bg-primary-500/15 border-primary-500/30 text-primary-400'
                    }`}>
                    {(profile.admissionType || 'CET') === 'Diploma'
                      ? '🎓 Diploma → DSY (Lateral Entry)'
                      : '📘 CET → First Year Engineering'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</p>
                    <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                    <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">{profile.phone || 'Not Provided'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {(profile.admissionType || 'CET') === 'Diploma' ? (
                        <>
                          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Diploma %</p>
                          <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5 font-mono">{profile.diplomaPercentage || 'Not Added'}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">MHT-CET Score</p>
                          <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5 font-mono">{profile.cetScore || 'Not Added'}</p>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Category</p>
                      <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">{profile.category || 'Open'}</p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Payment Status */}
              <div className="glass p-8 rounded-3xl border border-white/10 md:col-span-3 flex flex-col justify-between mt-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 font-serif">Counselling Enrollment</h2>

                  {profile.paymentStatus === 'Paid' ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <CheckCircle2 size={36} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Guidance Plan Activated</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto mb-4">You have unlocked premium predictors, custom CAP Round option builders, and 1-on-1 counselling access.</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {profile.whatsappGroupLink && (
                            <a
                              href={profile.whatsappGroupLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-xl font-bold transition-all text-sm shadow-[0_0_20px_rgba(37,211,102,0.25)]"
                            >
                              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.905-6.99C16.558 1.875 14.09 .843 11.473.843 6.037.843 1.613 5.263 1.611 10.7c-.001 1.716.452 3.39 1.31 4.869l-1.02 3.725 3.825-1.002.046.027zm11.96-6.141c-.273-.137-1.62-.8-1.87-.891-.252-.09-.435-.137-.617.137-.182.273-.706.891-.865 1.072-.159.182-.319.205-.592.069-.273-.137-1.15-.424-2.19-1.353-.809-.722-1.355-1.614-1.514-1.887-.159-.273-.017-.421.12-.557.123-.122.273-.319.41-.478.136-.159.182-.273.273-.455.09-.182.046-.341-.023-.478-.069-.137-.617-1.484-.845-2.031-.22-.53-.443-.458-.61-.466-.159-.008-.341-.009-.523-.009-.182 0-.478.069-.728.341-.25.273-.956.934-.956 2.278 0 1.344.978 2.641 1.115 2.823.137.182 1.925 2.94 4.664 4.122.652.28 1.161.448 1.558.574.655.208 1.25.178 1.72.108.523-.078 1.62-.663 1.85-1.3.228-.638.228-1.186.159-1.3-.069-.114-.25-.182-.523-.319z"/>
                              </svg>
                              Join Premium WhatsApp Group
                            </a>
                          )}
                          <Link
                            to="/payment-success"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm"
                          >
                            View Receipt
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3 text-sm">
                        <Clock className="text-yellow-500 flex-shrink-0 mt-1" size={18} />
                        <div>
                          <h4 className="text-yellow-500 font-bold mb-0.5">Payment Pending</h4>
                          <p className="text-yellow-500/80">Complete your payment to unlock personalized lists, direct WhatsApp mentorship, and preference form builders.</p>
                        </div>
                      </div>

                      {isProfileIncomplete ? (
                        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5 text-center space-y-3">
                          <p className="text-amber-500 text-xs font-semibold leading-relaxed">
                            Please complete your profile first to proceed with plan activation.
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2.5 rounded-xl text-xs transition-all whitespace-nowrap"
                          >
                            Complete Profile
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            to="/#pricing"
                            className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-black font-bold py-3.5 rounded-2xl transition-all text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                          >
                            <Sparkles size={16} />
                            View Counselling Plans
                          </Link>

                          {!paymentMethod ? (
                            <div className="grid sm:grid-cols-2 gap-3">
                              <button
                                onClick={() => setPaymentMethod('razorpay')}
                                className="flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm"
                              >
                                <CreditCard size={16} /> Pay via Razorpay
                              </button>
                              <button
                                onClick={() => setPaymentMethod('manual')}
                                className="flex items-center justify-center gap-2 border border-primary-500 text-primary-400 py-3 rounded-xl font-bold hover:bg-primary-500/10 transition-colors text-sm"
                              >
                                <QrCode size={16} /> QR Code Scan
                              </button>
                            </div>
                          ) : paymentMethod === 'razorpay' ? (
                            <div className="text-center space-y-3">
                              <p className="text-gray-400 text-xs">Redirecting to Razorpay payment gateway...</p>
                              <Button onClick={handleRazorpayPayment} className="w-full py-3">
                                Pay Now ₹{activePlanPrice}
                              </Button>
                              <button onClick={() => setPaymentMethod(null)} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                            </div>
                          ) : (
                            <div className="text-center space-y-3">
                              <div className="bg-white p-2 rounded-xl inline-block mx-auto">
                                <div className="w-36 h-36 bg-gray-200 flex items-center justify-center text-black font-bold text-xs border border-dashed border-gray-400">
                                  [QR CODE PRE-SEEDED]
                                </div>
                              </div>
                              <p className="text-gray-400 text-xs font-mono text-[10px]">GPay/PhonePe Scan to pay ₹{activePlanPrice}</p>
                              <Button onClick={notifyAdmin} className="w-full py-3">
                                I Have Completed Payment
                              </Button>
                              <button onClick={() => setPaymentMethod(null)} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Public Utility Tools Quick Access */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-serif">Quick Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  to="/college-predictor"
                  className="glass p-6 rounded-3xl border border-white/10 hover:border-primary-500/30 hover:bg-white/[0.01] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500 group-hover:bg-primary-500/20 transition-colors">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">College Predictor</h4>
                      <p className="text-xs text-gray-400">Search cutoff eligibility</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                </Link>

                <Link
                  to="/student/advanced-predictor"
                  className="glass p-6 rounded-3xl border border-white/10 hover:border-yellow-500/30 hover:bg-white/[0.01] transition-all flex items-center justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-2xl rounded-full translate-x-12 -translate-y-12"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 transition-colors">
                      <Award size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Advanced AI Predictor</h4>
                      <p className="text-xs text-gray-400">Premium Historical Analytics</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors relative z-10" />
                </Link>
              </div>
            </div>

            {/* Premium Tools Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                  {profile.paymentStatus === 'Paid' ? (
                    <Unlock size={20} className="text-green-500" />
                  ) : (
                    <Lock size={20} className="text-gray-500" />
                  )}
                  Premium Counselling Features
                </h3>
                {profile.paymentStatus !== 'Paid' && (
                  <span className="text-xs font-semibold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400">
                    Premium Locked
                  </span>
                )}
              </div>

              {profile.paymentStatus !== 'Paid' ? (
                <div className="glass border border-white/10 rounded-3xl p-8 text-center space-y-6 bg-white/[0.01]">
                  <Lock size={48} className="mx-auto text-white/10" />
                  <div className="max-w-md mx-auto space-y-2">
                    <h4 className="text-lg font-bold text-white">Unlock Option Builder & 1-on-1 Guidance</h4>
                    <p className="text-sm text-gray-400">
                      Upgrade your plan to unlock our customized CAP Round priority list generator matching your exact score and get direct support from Mentor Pradip Girase.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => navigate('/#pricing')}
                      className="bg-primary-500 hover:bg-primary-600 text-black px-6 py-3 rounded-xl font-bold transition-all text-sm"
                    >
                      Unlock Plan Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">

                  {/* Option List Generator / Priority Custom List */}
                  <div className="glass p-6 rounded-3xl border border-white/10 md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <ListChecks className="text-primary-500" size={20} />
                        <h4 className="font-bold text-white">Custom CAP Preference Builder</h4>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded border border-primary-500/10">
                        Live Matcher
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      These colleges are predicted for your score ({profile.cetScore} Percentile) under Category ({profile.category}). Use the up/down arrows to organize your priority order.
                    </p>

                    {loadingRecommendations ? (
                      <div className="py-12 text-center text-gray-500 text-sm">Analyzing cutoffs...</div>
                    ) : recommendedColleges.length === 0 ? (
                      <div className="py-12 text-center text-gray-500 text-sm">
                        No matching colleges found for score {profile.cetScore}. Open profile editor to adjust criteria.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {recommendedColleges.map((college, idx) => (
                          <div
                            key={college.id}
                            className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs hover:bg-white/[0.07] transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <div>
                                <h5 className="font-bold text-white">{college.collegeName}</h5>
                                <p className="text-gray-400 text-[10px] flex items-center gap-1.5 mt-0.5">
                                  <BookOpen size={10} /> {college.branch} | <MapPin size={10} /> {college.location}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                disabled={idx === 0}
                                onClick={() => moveCollegeUp(idx)}
                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                disabled={idx === recommendedColleges.length - 1}
                                onClick={() => moveCollegeDown(idx)}
                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          const printContent = recommendedColleges.map((c, i) => `${i + 1}. ${c.collegeName} - ${c.branch} (Code: ${c.collegeCode})`).join('\n');
                          const blob = new Blob([printContent], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `CAP_Preference_List_${profile.name}.txt`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-semibold"
                      >
                        Download Priority List (.txt)
                      </button>
                    </div>
                  </div>

                  {/* 1-on-1 Session booking */}
                  <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <PhoneCall className="text-primary-500" size={20} />
                        <h4 className="font-bold text-white">Mentor 1-on-1</h4>
                      </div>

                      <p className="text-sm text-gray-400">
                        Your Platinum plan includes direct personal support from counsellor Pradip Girase.
                      </p>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                        <p className="text-gray-400">Contact Counselor:</p>
                        <p className="text-white font-bold font-serif">+91 89835 11645</p>
                        <p className="text-gray-500 text-[10px]">Timing: 10:00 AM - 7:00 PM</p>
                      </div>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold transition-colors text-sm text-center shadow-lg shadow-green-500/10"
                    >
                      Schedule Session via WhatsApp
                    </a>
                  </div>

                </div>
              )}
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                <div className="glass w-full max-w-2xl rounded-[2rem] border border-white/10 shadow-2xl flex flex-col my-8 max-h-[90vh]">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface/50 backdrop-blur-xl shrink-0">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white">Update Academic Profile</h3>
                      <p className="text-xs text-gray-400">Fill in details for rank prediction and college shortlisting.</p>
                    </div>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Modal Form Body */}
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                    {editStatus === 'success' ? (
                      <div className="py-12 text-center text-green-400 space-y-3">
                        <CheckCircle2 size={48} className="mx-auto" />
                        <h4 className="text-lg font-bold text-white">Profile Updated Successfully!</h4>
                        <p className="text-sm text-gray-400">Refreshing database recommendations...</p>
                      </div>
                    ) : (
                      <form id="editProfileForm" onSubmit={handleUpdateProfile} className="space-y-6 text-sm">

                        {/* ── STEP 1: Admission Type ─────────────────────────── */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Admission Type <span className="text-red-400">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setEditForm({ ...editForm, admissionType: 'CET', diplomaPercentage: '' })}
                              className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${editForm.admissionType === 'CET'
                                ? 'border-primary-500 bg-primary-500/10 text-white'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/[0.07]'
                                }`}
                            >
                              <span className="text-lg mb-1">📘</span>
                              <span className="font-bold text-sm">CET (12th Pass)</span>
                              <span className="text-[10px] mt-0.5 opacity-70">First Year Engineering via MHT-CET</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditForm({ ...editForm, admissionType: 'Diploma', twelfthPercent: '', cetScore: '' })}
                              className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${editForm.admissionType === 'Diploma'
                                ? 'border-blue-500 bg-blue-500/10 text-white'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/[0.07]'
                                }`}
                            >
                              <span className="text-lg mb-1">🎓</span>
                              <span className="font-bold text-sm">Diploma (DSY)</span>
                              <span className="text-[10px] mt-0.5 opacity-70">Direct Second Year Lateral Entry</span>
                            </button>
                          </div>
                        </div>

                        {/* ── STEP 2: Contact & Location ─────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">WhatsApp Number <span className="text-red-400">*</span></label>
                            <input
                              type="tel"
                              required
                              value={editForm.phone}
                              onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                              placeholder="e.g. 9876543210"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">City / District <span className="text-red-400">*</span></label>
                            <input
                              type="text"
                              required
                              value={editForm.city}
                              onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                              placeholder="e.g. Pune"
                            />
                          </div>
                        </div>

                        {/* ── STEP 3: Academic Scores (admission-type-conditional) ── */}
                        {editForm.admissionType === 'CET' ? (
                          <div className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-4 space-y-4">
                            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">📘 CET Track — Academic Details</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">12th PCM Percentage <span className="text-red-400">*</span></label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  required
                                  value={editForm.twelfthPercent}
                                  onChange={e => setEditForm({ ...editForm, twelfthPercent: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                  placeholder="e.g. 84.5"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">MHT-CET Percentile <span className="text-red-400">*</span></label>
                                <input
                                  type="number"
                                  step="0.0001"
                                  min="0"
                                  max="100"
                                  required
                                  value={editForm.cetScore}
                                  onChange={e => setEditForm({ ...editForm, cetScore: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                  placeholder="e.g. 98.4521"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-4">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">🎓 Diploma Track — Academic Details</p>
                            <div>
                              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Diploma Percentage <span className="text-red-400">*</span></label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                required
                                value={editForm.diplomaPercentage}
                                onChange={e => setEditForm({ ...editForm, diplomaPercentage: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                placeholder="e.g. 72.5"
                              />
                            </div>
                            <p className="text-[11px] text-blue-400/70">
                              As a Diploma student, you are eligible for Direct Second Year (DSY) Lateral Entry admissions. 12th PCM % and CET Percentile are not required.
                            </p>
                          </div>
                        )}

                        {/* ── STEP 4: Category, Stream, Preferences ──────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
                            <select
                              value={editForm.category}
                              onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full bg-[#071028] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                            >
                              <option value="Open" className="bg-[#071028] text-white">Open / General</option>
                              <option value="OBC" className="bg-[#071028] text-white">OBC</option>
                              <option value="SC" className="bg-[#071028] text-white">SC</option>
                              <option value="ST" className="bg-[#071028] text-white">ST</option>
                              <option value="EWS" className="bg-[#071028] text-white">EWS</option>
                              <option value="VJ/NT" className="bg-[#071028] text-white">VJ / NT</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Stream</label>
                            <select
                              value={editForm.stream}
                              onChange={e => setEditForm({ ...editForm, stream: e.target.value })}
                              className="w-full bg-[#071028] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                            >
                              <option value="PCM" className="bg-[#071028] text-white">PCM (Engineering)</option>
                              <option value="PCB" className="bg-[#071028] text-white">PCB (Pharmacy)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Preferred Branch</label>
                            <select
                              value={editForm.preferredBranch}
                              onChange={e => setEditForm({ ...editForm, preferredBranch: e.target.value })}
                              className="w-full bg-[#071028] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                            >
                              <option value="CS/IT" className="bg-[#071028] text-white">CS / IT / AIML</option>
                              <option value="Electrical" className="bg-[#071028] text-white">Electrical</option>
                              <option value="Mechanical" className="bg-[#071028] text-white">Mechanical</option>
                              <option value="Civil" className="bg-[#071028] text-white">Civil</option>
                              <option value="Pharmacy" className="bg-[#071028] text-white">Pharmacy</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Preferred Location</label>

                            <select
                              value={editForm.preferredLocation}
                              onChange={e => setEditForm({ ...editForm, preferredLocation: e.target.value })}
                              className="w-full bg-[#071028] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
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

                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Brief Message (Your Confusion / Needs)</label>
                          <textarea
                            rows={3}
                            value={editForm.message}
                            onChange={e => setEditForm({ ...editForm, message: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                            placeholder="e.g. I have scored 94% in MHT-CET, confused between IT in VIT Pune or Computer in PCCOE..."
                          />
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Modal Footer */}
                  {editStatus !== 'success' && (
                    <div className="p-6 border-t border-white/10 bg-surface/50 backdrop-blur-xl shrink-0 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="editProfileForm"
                        className="bg-primary-500 hover:bg-primary-600 text-black font-bold px-6 py-2.5 rounded-xl transition-all"
                      >
                        Save Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;