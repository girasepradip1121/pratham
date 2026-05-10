import { CheckCircle, Award, UserCheck, Star, Quote } from 'lucide-react';
import Section from '../ui/Section';

const Creator = () => {
  return (
    <Section className="bg-background">
      <div className="glass rounded-[3rem] p-10 md:p-20 overflow-hidden relative group border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
          <div className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border border-white/10 p-3 bg-white/5 group-hover:rotate-3 transition-transform duration-700">
              <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-500/20 mix-blend-overlay" />
                <span className="text-gray-500 font-serif italic text-xl">Prathamesh</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 glass p-6 rounded-3xl shadow-2xl border-primary-500/20 flex flex-col items-center gap-1 group-hover:-translate-y-2 transition-transform duration-500">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-primary-500 text-primary-500" />)}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white">Top Rated</span>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              <span className="px-5 py-2 glass border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-primary-300 flex items-center gap-2">
                <UserCheck size={14} /> Trusted Expert
              </span>
              <span className="px-5 py-2 glass border-white/10 rounded-full text-xs font-bold tracking-widest uppercase text-primary-300 flex items-center gap-2">
                <Award size={14} /> Certified Counselor
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-white leading-tight">
              भेटा तुमच्या <br/> <span className="text-accent-gradient italic">मार्गदर्शकाला</span>
            </h2>
            
            <div className="relative mb-10">
              <Quote className="absolute -top-6 -left-8 text-primary-500/20 w-16 h-16 -z-10" />
              <p className="text-gray-400 text-xl leading-relaxed font-light italic">
                "मी तुम्हाला तुमच्या स्वप्नातील कॉलेज आणि इंजिनिअरिंग / फार्मसी ब्रांच निवडण्यासाठी मदत करेन. 
                विगत ३ वर्षांपासून मी शेकडो विद्यार्थ्यांना त्यांच्या प्रवेश प्रक्रियेत मार्गदर्शन केले आहे आणि त्यांच्या आयुष्याला दिशा दिली आहे."
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                '३+ वर्षे दांडगा अनुभव',
                '१००% विद्यार्थी समाधान',
                '१०००+ वैयक्तिक सत्रे',
                'तज्ञ प्रवेश रणनीती'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white font-medium group/item">
                  <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center group-hover/item:bg-primary-500 transition-colors duration-300">
                    <CheckCircle size={18} className="text-primary-400 group-hover/item:text-black transition-colors" />
                  </div>
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Creator;
