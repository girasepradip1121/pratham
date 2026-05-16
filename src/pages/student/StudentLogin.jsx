import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('studentToken', data.token);
        if (data.student.paymentStatus === 'Paid') {
          navigate('/dashboard');
        } else {
          navigate('/select-plan');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="glass w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 sm:p-10 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Student Login</h1>
          <p className="text-gray-400">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full py-4 text-lg mt-4 group">
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-sm">
          Don't have an account? <Link to="/" className="text-primary-400 hover:text-primary-300 font-medium">Sign up on homepage</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
