import { motion } from 'framer-motion';
import {
  MessageCircle,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  GraduationCap
} from 'lucide-react';

import Button from '../ui/Button';

const Hero = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-background" />

      <div className="absolute top-[-10%] right-[-10%] w-[250px] sm:w-[400px] md:w-[500px] h-[250px] sm:h-[400px] md:h-[500px] bg-primary-500/10 rounded-full blur-[100px] md:blur-[150px] -z-10 animate-pulse" />

      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[500px] md:h-[600px] bg-primary-600/5 rounded-full blur-[100px] md:blur-[150px] -z-10" />

      <div className="absolute inset-0 bg-noise opacity-20 -z-10" />

      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="w-full"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 sm:mb-8 glass rounded-full max-w-full">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>

              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-primary-300 uppercase whitespace-nowrap">
                Maharashtra's Most Trusted Partner
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[42px] xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 sm:mb-8 leading-[1.05] tracking-tight">
              Maharashtra's Best <br />
              <span className="text-accent-gradient italic">
                Counselling
              </span>{' '}
              Platform
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-10 sm:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-2">
              तुमच्या स्वप्नातील कॉलेज आणि ब्रांच निवडण्यासाठी आम्ही तुम्हाला मदत करू.
              आमच्या तज्ञ मार्गदर्शनाखाली तुमची प्रवेश प्रक्रिया सोपी आणि सुरक्षित करा.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto group min-h-[56px]"
              onClick={() =>
                window.open(
                  'https://wa.me/917666991085',
                  '_blank'
                )
              }
            >
              <MessageCircle className="w-5 h-5" />

              <span>WhatsApp वर चर्चा करा</span>

              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto group min-h-[56px]"
              onClick={onCtaClick}
            >
              <Play className="w-5 h-5 fill-current" />

              <span>प्लॅन्स पहा</span>
            </Button>
          </motion.div>

          {/* Creator Card */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 1
            }}
            className="mt-16 sm:mt-20 md:mt-24 w-full max-w-xl mx-auto"
          >
            <div className="glass rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden group">
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary-500/50 blur-lg" />

              <div className="flex flex-col items-start gap-5 sm:gap-6">
                {/* Profile */}
                <div className="flex items-center gap-4 sm:gap-6 w-full">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl sm:text-3xl font-serif font-bold text-black shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                      P
                    </div>

                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary-500 rounded-full border-[3px] sm:border-4 border-[#111] shadow-lg" />
                  </div>

                  {/* Identity */}
                  <div className="text-left min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                      Prathamesh
                    </h3>

                    <p className="text-primary-400/80 font-medium text-sm sm:text-base break-all sm:break-normal">
                      @prathamesh
                      <span className="text-gray-600 mx-1 hidden sm:inline">
                        ·
                      </span>
                      <span className="block sm:inline text-gray-400">
                        Content Creator
                      </span>
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5" />

                {/* Stats */}
                <div className="grid grid-cols-3 w-full gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary-400 mb-1">
                      90K+
                    </div>

                    <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                      Followers
                    </div>
                  </div>

                  <div className="text-center border-x border-white/5">
                    <div className="text-2xl sm:text-3xl font-bold text-primary-400 mb-1">
                      500+
                    </div>

                    <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                      Students
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-primary-400 mb-1">
                      200+
                    </div>

                    <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                      Colleges
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-4">
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5 text-primary-500" />
                    Verified
                  </div>

                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <Star className="w-3.5 h-3.5 text-primary-500" />
                    Top Rated
                  </div>

                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5 text-primary-500" />
                    CET Expert
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;