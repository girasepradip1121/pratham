import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

import logoImg from '../../assets/image.png';

const AuthModal = ({ isOpen, onClose }) => {
  const { googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Google Login Button in the Modal when open
  useEffect(() => {
    if (!isOpen) return;

    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLoginResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("modalGoogleBtn"),
          { theme: "filled_dark", size: "large", width: "100%", text: "signin_with" }
        );
      }
    };

    const timer = setTimeout(initGoogle, 500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleGoogleLoginResponse = async (response) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await googleLogin(response.credential);
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        onClose();
        navigate('/student/profile');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Google Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const mockProfile = {
        email: "student@demo.com",
        name: "Demo Student",
        googleId: "mock-google-id-99999"
      };
      await googleLogin('mock-token-123', mockProfile);
      setSuccess('Logged in as Demo Student!');
      setTimeout(() => {
        onClose();
        navigate('/student/profile');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Mock login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className="
              relative w-full max-w-md 
              rounded-3xl border border-white/10 
              bg-gray-900 text-white 
              shadow-2xl overflow-hidden
              p-6 flex flex-col items-center text-center
            "
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 blur-3xl rounded-full pointer-events-none" />

            {/* HEADER */}
            <div className="w-full flex justify-end mb-2">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Logo/Icon */}
            <div className="flex items-center gap-2.5 mb-4">
              <img 
                src={logoImg} 
                alt="CET Counselling Logo" 
                className="h-10 w-auto object-contain" 
              />
              <div className="flex flex-col justify-center text-left">
                <span className="text-base font-extrabold tracking-wider text-white leading-none uppercase">
                  PRATHAM
                </span>
                <span className="text-[8px] font-bold tracking-[0.25em] text-primary-500 uppercase leading-none mt-1">
                  MENTORSHIP
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold mb-2">
              Welcome to CET Counselling
            </h2>
            <p className="text-sm text-gray-400 mb-6 px-4">
              Access your personalized choice lists, track CAP round milestones, and book 1-on-1 expert sessions.
            </p>

            {/* ALERTS */}
            {error && (
              <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="w-full bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-sm mb-4">
                {success}
              </div>
            )}

            {/* LOGIN BUTTONS */}
            <div className="w-full space-y-4">
              <div
                id="modalGoogleBtn"
                className="w-full min-h-[42px] overflow-hidden rounded-xl flex justify-center"
              />

              <button
                type="button"
                onClick={handleMockGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary-500/10 border border-primary-500/25 text-primary-400 hover:bg-primary-500/20 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                <Sparkles size={16} />
                Instant Demo Sign In
              </button>
            </div>

            <p className="text-[10px] text-gray-500 mt-6 px-6">
              By continuing, you agree to our Terms of Service and Privacy Policy. Secure access via Google accounts only.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
