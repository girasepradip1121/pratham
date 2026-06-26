import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../context/AuthContext';

const StudentLogin = () => {
  const { googleLogin } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load Google Authentication Button
  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLoginResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleBtnDiv"),
          { theme: "filled_dark", size: "large", width: "100%", text: "continue_with" }
        );
      }
    };

    const timer = setTimeout(initGoogle, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLoginResponse = async (response) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await googleLogin(response.credential);
      setSuccess('Logged in successfully!');
      setTimeout(() => navigate('/student/profile'), 1000);
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
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
      setTimeout(() => navigate('/student/profile'), 1000);
    } catch (err) {
      setError('Mock login failed. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="glass w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 sm:p-10 relative z-10 text-center">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-500 border border-primary-500/20">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2 font-display">Student Portal</h1>
          <p className="text-gray-400 text-sm">Sign in securely using Google to view your counselling roadmap.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-xs mb-6">
            {success}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Sign-in Button */}
          <div id="googleBtnDiv" className="w-full min-h-[44px] flex justify-center"></div>
          
          {/* Instant Sandbox Sign-in Demo */}
          <button
            type="button"
            onClick={handleMockGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary-500/10 border border-primary-500/25 text-primary-400 hover:bg-primary-500/20 py-3.5 rounded-xl text-sm font-semibold transition-all"
          >
            <Sparkles size={16} /> Instant Demo Sign In
          </button>
        </div>

        <p className="text-[11px] text-gray-500 mt-8 px-4">
          Google verification ensures your personal CAP academic details and choice sheets are encrypted and protected.
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
