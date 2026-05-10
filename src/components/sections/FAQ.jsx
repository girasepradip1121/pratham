import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '../ui/Section';

const FAQ = () => {
  const faqs = [
    {
      q: 'ही मार्गदर्शन प्रक्रिया कशी काम करते?',
      a: 'एकदा तुम्ही प्लॅन घेतला की, तुम्हाला एक फॉर्म पाठवला जाईल. त्यानंतर आमचे तज्ञ तुमच्याशी १-वर-१ संवाद साधून तुम्हाला कॉलेज लिस्ट आणि मार्गदर्शन पुरवतील.'
    },
    {
      q: 'कमी स्कोर असूनही चांगले कॉलेज मिळू शकते का?',
      a: 'हो, योग्य प्रेफरन्स लिस्ट आणि कॅप राउंड स्ट्रॅटेजी वापरून आम्ही तुम्हाला उपलब्ध पर्यायांपैकी सर्वोत्तम कॉलेज मिळवून देण्यास मदत करतो.'
    },
    {
      q: 'प्लॅनची वैधता किती दिवस आहे?',
      a: 'प्लॅनची वैधता तुमच्या प्रत्यक्ष प्रवेश प्रक्रियेच्या शेवटच्या दिवसापर्यंत (Admission Confirmed) असते.'
    },
    {
      q: 'मला वैयक्तिक कॉलेज लिस्ट मिळेल का?',
      a: 'हो, तुमच्या कास्ट, रिझर्व्हेशन आणि स्कोरनुसार पूर्णपणे कस्टमाईज्ड कॉलेज लिस्ट दिली जाईल.'
    }
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
                  {faq.q}
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
                        {faq.a}
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
