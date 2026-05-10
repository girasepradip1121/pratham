import { useState } from 'react';
import axios from 'axios';
import { Send, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const InquiryForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cetScore: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // Mocking API call if local server is not running
      // await axios.post('http://localhost:5000/api/inquiry', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', phone: '', cetScore: '', message: '' });
      }, 3000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass w-full max-w-lg rounded-[2.5rem] p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -z-10" />
            
            <button 
              onClick={onClose} 
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-4xl font-serif font-bold mb-2 text-white">माहिती भरा</h2>
            <p className="text-gray-400 mb-8">आमची टीम तुम्हाला लवकरच कॉल करेल.</p>
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">धन्यवाद!</h3>
                <p className="text-gray-400">तुमची माहिती यशस्वीरित्या सबमिट झाली आहे.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-2">तुमचे नाव</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-2">मोबाईल नंबर</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 00000 00000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-2">CET स्कोर</label>
                      <input 
                        type="text"
                        placeholder="Percentile"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10"
                        value={formData.cetScore}
                        onChange={(e) => setFormData({...formData, cetScore: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-2">Branch</label>
                      <input 
                        type="text"
                        placeholder="CS/IT/ETC"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-2">तुमचा प्रश्न</label>
                    <textarea 
                      rows="3"
                      placeholder="Tell us about your requirements..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none transition-all placeholder:text-gray-600 focus:bg-white/10 resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-5 text-lg"
                >
                  {status === 'loading' ? 'पाठवत आहे...' : 'सबमिट करा'}
                  <Send size={20} className="ml-2" />
                </Button>
                
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center">काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InquiryForm;
