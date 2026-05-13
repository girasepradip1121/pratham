import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { X, Mail, User, Phone, Lock, Globe } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { login, signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (activeTab === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await signup(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  // Placeholder social login handlers
  const handleGoogle = () => alert('Google login coming soon');
  const handleApple = () => alert('Apple login coming soon');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-xl glassmorphism"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {activeTab === 'login' ? 'Login' : 'Sign Up'}
              </h2>
              <button onClick={onClose} className="p-1 hover:text-primary-400">
                <X size={20} />
              </button>
            </div>

            {/* Tab Switch */}
            <div className="flex mb-4 space-x-2">
              <Button
                variant={activeTab === 'login' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('login')}
              >
                Login
              </Button>
              <Button
                variant={activeTab === 'signup' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </Button>
            </div>

            {error && (
              <div className="bg-red-600/20 text-red-300 p-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <>
                  <div className="flex items-center space-x-2 border-b border-gray-700 pb-1">
                    <User size={18} className="text-gray-400" />
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-transparent focus:outline-none w-full"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 border-b border-gray-700 pb-1">
                    <Phone size={18} className="text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-transparent focus:outline-none w-full"
                      required
                    />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2 border-b border-gray-700 pb-1">
                <Mail size={18} className="text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none w-full"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 border-b border-gray-700 pb-1">
                <Lock size={18} className="text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent focus:outline-none w-full"
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                {activeTab === 'login' ? 'Log In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-400 text-sm">Or continue with</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleGoogle}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <Globe size={20} className="text-white" />
                </button>
                <button
                  onClick={handleApple}
                  className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                  >
                    <path d="M16.365 1.43c0 1.14-.46 2.35-1.31 3.24-.86.94-2.12 1.58-3.33 1.48-0.05-1.13.45-2.34 1.31-3.24.9-.93 2.2-1.58 3.33-1.48zM20.56 13.9c-.24-.58-.53-1.12-.85-1.63-1.13-1.73-2.69-3.2-4.57-4.28.02.18.04.36.04.55 0 1.44-.55 2.85-1.51 3.95-.96 1.1-2.28 1.78-3.68 1.88-.13 1.46.23 2.76.99 3.85.75 1.09 2.02 2.09 3.49 2.12 1.43.03 2.96-.84 3.77-2.09 1.03-1.61 1.27-3.58.77-5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
