import { Trophy, FileText, ListChecks, School, ArrowDown } from 'lucide-react';
import Section from '../ui/Section';

const Roadmap = () => {
  const points = [
    { title: 'CET Result', icon: Trophy, color: 'text-yellow-500' },
    { title: 'Registration', icon: FileText, color: 'text-blue-500' },
    { title: 'Choice Filling', icon: ListChecks, color: 'text-purple-500' },
    { title: 'Final Admission', icon: School, color: 'text-green-500' },
  ];

  return (
    <Section className="bg-surface/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white tracking-tight">
            तुमचा प्रवेशाचा <span className="text-accent-gradient italic">प्रवास</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            रिझल्टपासून ते कॉलेजमध्ये जाईपर्यंतचा प्रत्येक टप्पा आम्ही सोपा करू.
          </p>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 px-10">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent -z-10" />
          
          {/* Connector Line (Mobile) */}
          <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-500/30 to-transparent -translate-x-1/2 -z-10" />

          {points.map((point, index) => (
            <div key={index} className="flex flex-col items-center group relative flex-1">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-background border border-white/10 flex items-center justify-center relative shadow-2xl group-hover:border-primary-500/50 transition-all duration-500 group-hover:-translate-y-2">
                  <point.icon className={`${point.color} transition-transform duration-500 group-hover:scale-110`} size={36} />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-500 text-black rounded-xl text-xs font-black flex items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform">
                    0{index + 1}
                  </div>
                </div>

                {/* Mobile Arrow */}
                {index < points.length - 1 && (
                  <div className="md:hidden flex justify-center mt-6 text-primary-500 animate-bounce">
                    <ArrowDown size={20} />
                  </div>
                )}
              </div>
              
              <h4 className="text-xl font-bold text-white mt-6 group-hover:text-primary-400 transition-colors tracking-tight">
                {point.title}
              </h4>
              <div className="w-1 h-1 bg-primary-500/50 rounded-full mt-4 group-hover:scale-[3] transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;
