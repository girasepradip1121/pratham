import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../ui/Section';

const FAQ = ({ data = [] }) => {
  const faqs = data.length > 0 ? data : [
    { q: 'Loading...', a: 'Please wait...' }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Section id="faq" className="bg-surface/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass rounded-full">
            <HelpCircle size={16} className="text-primary-500" />
            <span className="text-xs font-bold tracking-widest text-primary-300 uppercase">Support Center</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white tracking-tight">
            वारंवार विचारले जाणारे <span className="text-accent-gradient italic">प्रश्न</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
            तुमच्या मनात काही शंका आहेत? येथे सर्वात सामान्य प्रश्नांची उत्तरे शोधा.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`rounded-[2rem] overflow-hidden transition-all duration-500 border ${
                openIndex === i ? 'glass border-primary-500/30' : 'bg-surface border-white/5'
              }`}
            >
              <button 
                className="w-full p-8 text-left flex justify-between items-center group"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className={`text-xl font-medium transition-colors duration-300 ${
                  openIndex === i ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                }`}>
                  {faq.question || faq.q}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  openIndex === i ? 'bg-primary-500 text-black rotate-180' : 'bg-white/5 text-gray-500 group-hover:bg-white/10'
                }`}>
                  {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 text-gray-400 leading-relaxed font-light text-lg">
                      <div className="pt-2 border-t border-white/5">
                        {faq.answer || faq.a}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default FAQ;
