import { Check, Sparkles, ShieldCheck } from 'lucide-react';
import Section from '../ui/Section';
import Button from '../ui/Button';

const Pricing = ({ onCtaClick }) => {
  const features = [
    'Personalized 1-on-1 Meeting',
    'Customized College List based on Score',
    'Branch vs College Selection Guide',
    'Step-by-Step PDF Guide',
    'Live Q&A Sessions',
    'Final Admission Support'
  ];

  return (
    <Section id="pricing" className="bg-background relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] -z-10" />
      
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white tracking-tight">
          निवडा तुमचा <span className="text-accent-gradient italic">यशस्वी</span> प्लॅन
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
          एकदाच गुंतवणूक करा, तुमच्या उज्ज्वल भविष्यासाठी आणि स्वप्नातील करिअरसाठी.
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative group">
        {/* Decorative elements */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-primary-300/20 to-primary-600/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
        
        <div className="relative glass rounded-[3rem] p-10 md:p-16 border-white/10 overflow-hidden">
          {/* Most Popular Badge */}
          <div className="absolute top-10 right-10">
            <div className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-black rounded-full font-bold text-xs tracking-widest uppercase shadow-2xl">
              <Sparkles size={14} /> Most Popular
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-primary-400 font-bold mb-4">Complete Guidance</h3>
              <h4 className="text-4xl font-serif font-bold text-white mb-6">Platinum <br/> Counselling</h4>
              <p className="text-gray-400 leading-relaxed mb-8 font-light">
                Comprehensive support from college selection to final admission confirmation.
              </p>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-bold text-white">₹599</span>
                <span className="text-gray-500 line-through text-xl">₹999</span>
              </div>
              
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 inline-flex items-center gap-2 text-primary-300 text-sm font-medium">
                <ShieldCheck size={18} />
                Limited Time Launch Offer
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">What's Included</div>
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group/item">
                  <div className="w-6 h-6 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary-500/20 transition-colors">
                    <Check className="text-primary-400" size={14} />
                  </div>
                  <span className="text-gray-300 font-light group-hover/item:text-white transition-colors">{feature}</span>
                </div>
              ))}
              
              <div className="pt-8">
                <Button 
                  size="lg" 
                  className="w-full text-xl py-6 rounded-2xl shadow-[0_20px_40px_rgba(245,158,11,0.15)]"
                  onClick={onCtaClick}
                >
                  Join Platinum Now
                </Button>
                <p className="text-center text-gray-600 text-xs mt-6 uppercase tracking-tighter">
                  Secure Checkout • No Hidden Charges • Immediate Confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Pricing;
