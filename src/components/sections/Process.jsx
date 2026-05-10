import { ClipboardList, CreditCard, Users2, ArrowRight } from 'lucide-react';
import Section from '../ui/Section';

const Process = () => {
  const steps = [
    {
      title: 'माहिती भरा',
      desc: 'तुमची शैक्षणिक माहिती आणि स्कोर फॉर्ममध्ये भरा जेणेकरून आम्ही तुमचे प्रोफाइल समजू शकू.',
      icon: ClipboardList,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'प्लॅन निवडा',
      desc: 'तुमच्या गरजेनुसार आणि बजेटनुसार आमचा कोणताही एक प्रिमियम प्लॅन निवडा.',
      icon: CreditCard,
      color: 'text-primary-500',
      bg: 'bg-primary-500/10'
    },
    {
      title: 'वैयक्तिक चर्चा',
      desc: 'आमच्या तज्ञांसोबत १-वर-१ सत्रात तुमच्या सर्व शंकांचे निरसन करा आणि बेस्ट कॉलेज मिळवा.',
      icon: Users2,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    }
  ];

  return (
    <Section id="process" className="bg-surface/30">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white tracking-tight">
          प्रवेशाचा <span className="text-accent-gradient italic">सोपा</span> मार्ग
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
          आम्ही तुमची प्रवेश प्रक्रिया ३ सोप्या टप्प्यात विभागली आहे, ज्यामुळे तुम्हाला कोणताही तणाव येणार नाही.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {steps.map((step, index) => (
          <div key={index} className="relative group">
            {/* Step Number */}
            <div className="absolute -top-12 left-0 text-9xl font-bold text-white/5 font-serif select-none group-hover:text-primary-500/10 transition-colors duration-500">
              0{index + 1}
            </div>

            <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className={`w-20 h-20 rounded-[2rem] ${step.bg} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/5 shadow-2xl`}>
                <step.icon size={36} className={step.color} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                {step.title}
                <ArrowRight className="w-5 h-5 text-gray-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </h3>
              
              <p className="text-gray-400 leading-relaxed font-light">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Process;
