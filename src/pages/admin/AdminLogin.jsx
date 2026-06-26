import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import API_BASE_URL from '../../config/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass p-8 rounded-3xl max-w-md w-full border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-4 text-primary-500">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
          <p className="text-gray-400 mt-2">Secure access restricted</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary-500"
                placeholder="••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Login to Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
