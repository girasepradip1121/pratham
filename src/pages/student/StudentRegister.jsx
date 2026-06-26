import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../context/AuthContext';


const StudentRegister = () => {
  const { signup, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginResponse = useCallback(async (response) => {
    setIsLoading(true);
    setError('');
    try {
      await googleLogin(response.credential);
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/student/profile'), 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Sign-Up failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize Google Login
  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "99999999999-placeholder.apps.googleusercontent.com",
          callback: handleGoogleLoginResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("registerGoogleBtn"),
          { theme: "filled_dark", size: "large", width: "100%", text: "signup_with" }
        );
      }
    };
    const timer = setTimeout(initGoogle, 500);
    return () => clearTimeout(timer);
  }, [handleGoogleLoginResponse]);

  const handleMockGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const mockProfile = {
        email: "student@demo.com",
        name: "Demo Student",
        googleId: "mock-google-id-99999"
      };
      await googleLogin('mock-token-123', mockProfile);
      setSuccess('Account created as Demo Student!');
      setTimeout(() => navigate('/student/profile'), 1000);
    } catch (err) {
      console.error(err);
        setError(err.message || 'Mock sign-up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/student/profile'), 1000);
    } catch (err) {
      console.error(err);
        setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="glass w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 sm:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-primary-500" size={28} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join Maharashtra's most trusted counselling platform</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-6 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-xs mb-6 text-center">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Google Buttons */}
          <div className="space-y-3">
            <div id="registerGoogleBtn" className="w-full min-h-[44px]"></div>
            <button
              type="button"
              onClick={handleMockGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary-500/10 border border-primary-500/25 text-primary-400 hover:bg-primary-500/20 py-3.5 rounded-xl text-sm font-semibold transition-all"
            >
              <Sparkles size={16} /> Instant Google Sign-Up Demo
            </button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <span className="absolute inset-x-0 h-px bg-white/10" />
            <span className="relative bg-[#0b0c10] px-4 text-xs text-gray-500 uppercase tracking-widest">Or register with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="student@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="WhatsApp Number"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-4 text-lg group">
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-400 mt-8 text-sm">
          Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;