import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle2, Clock, QrCode, CreditCard, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null); // 'razorpay' or 'manual'
  const navigate = useNavigate();
  const token = localStorage.getItem('studentToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    navigate('/login');
  };

  const handleRazorpayPayment = async () => {
    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${API_BASE_URL}/api/student/create-order`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const order = await orderRes.json();

      if (!orderRes.ok) throw new Error('Could not create order');

      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_1234567890", // Replace with real key
        amount: order.amount,
        currency: order.currency,
        name: "CET Counselling",
        description: "Premium Counselling Plan",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          await fetch(`${API_BASE_URL}/api/student/verify-payment`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          fetchProfile(); // Refresh status
        },
        prefill: {
          name: profile.name,
          email: profile.email,
          contact: profile.phone
        },
        theme: {
          color: "#f59e0b" // Primary color
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Payment failed to initialize.');
    }
  };

  const notifyAdmin = () => {
    alert("Admin has been notified. They will verify your payment and update your status shortly.");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass p-6 rounded-3xl border border-white/10">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-1">Welcome, {profile.name}!</h1>
            <p className="text-gray-400">Manage your counselling journey and payments here.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-4 py-2 rounded-xl">
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Status Card */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Profile Details */}
          <div className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="text-primary-400" /> Your Profile
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</p>
                <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">{profile.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">{profile.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">CET Score</p>
                <p className="text-white font-medium bg-white/5 px-4 py-3 rounded-xl border border-white/5">{profile.cetScore || 'Not Provided'}</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Payment Status</h2>
            
            {profile.paymentStatus === 'Paid' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-white">Payment Verified</h3>
                <p className="text-gray-400">You are fully enrolled. Our team will contact you shortly with your personalized college list and strategy session details.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <Clock className="text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-yellow-500 font-bold mb-1">Action Required</h4>
                    <p className="text-sm text-yellow-500/80">Your payment is pending. Complete your payment to unlock 1-on-1 sessions and personalized college lists.</p>
                  </div>
                </div>

                {!paymentMethod ? (
                  <div className="space-y-4 mt-auto">
                    <p className="text-gray-400 text-sm text-center">Choose Payment Method:</p>
                    <button 
                      onClick={() => setPaymentMethod('razorpay')}
                      className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                    >
                      <CreditCard size={20} /> Pay via Razorpay (Cards/UPI)
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('manual')}
                      className="w-full flex items-center justify-center gap-3 border border-primary-500 text-primary-400 py-4 rounded-xl font-bold hover:bg-primary-500/10 transition-colors"
                    >
                      <QrCode size={20} /> Manual UPI QR Code Scan
                    </button>
                  </div>
                ) : paymentMethod === 'razorpay' ? (
                  <div className="mt-auto text-center space-y-4">
                    <p className="text-gray-400">You will be redirected to the secure Razorpay checkout.</p>
                    <Button onClick={handleRazorpayPayment} className="w-full py-4 text-lg">
                      Proceed to Pay ₹999
                    </Button>
                    <button onClick={() => setPaymentMethod(null)} className="text-sm text-gray-500 hover:text-white">Back to options</button>
                  </div>
                ) : (
                  <div className="mt-auto text-center space-y-4">
                    <div className="bg-white p-4 rounded-2xl inline-block mx-auto">
                      {/* Placeholder for real QR code */}
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-black font-bold border-2 border-dashed border-gray-400">
                        [Your QR Code Here]
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">Scan with PhonePe, GPay, or Paytm to pay ₹999.</p>
                    <Button onClick={notifyAdmin} className="w-full py-4">
                      I have Paid via UPI
                    </Button>
                    <button onClick={() => setPaymentMethod(null)} className="text-sm text-gray-500 hover:text-white">Back to options</button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
