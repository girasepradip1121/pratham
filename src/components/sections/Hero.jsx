import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Play } from 'lucide-react';
import Button from '../ui/Button';

const Hero = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-20 bg-background" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute inset-0 bg-noise opacity-20 -z-10" />

      <div className="max-w-6xl w-full">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] text-primary-300 uppercase">
                Maharashtra's Most Trusted Partner
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-[1.1] tracking-tight">
              महारष्ट्रातील बेस्ट <br />
              <span className="text-accent-gradient italic">काउन्सिलिंग</span> प्लॅटफॉर्म
            </h1>

            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              तुमच्या स्वप्नातील कॉलेज आणि ब्रांच निवडण्यासाठी आम्ही तुम्हाला मदत करू. 
              आमच्या तज्ञ मार्गदर्शनाखाली तुमची प्रवेश प्रक्रिया सोपी आणि सुरक्षित करा.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto group"
              onClick={() => window.open('https://wa.me/91XXXXXXXXXX', '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp वर चर्चा करा
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto group"
              onClick={onCtaClick}
            >
              <Play className="w-5 h-5 fill-current" />
              प्लॅन्स पहा
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 pt-10 border-t border-white/5 w-full flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">5,000+</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Students Guided</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">98%</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Success Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">15+</span>
              <span className="text-xs uppercase tracking-widest text-gray-500">Expert Counselors</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
