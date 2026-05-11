import { Check, Sparkles, ShieldCheck, Crown, Star } from 'lucide-react';
import Section from '../ui/Section';
import Button from '../ui/Button';

const Pricing = ({ onCtaClick }) => {
  const plans = [
    {
      name: 'Silver Guidance',
      price: '999',
      oldPrice: '1499',
      badge: 'Starter Plan',
      icon: Star,
      description:
        'Basic counselling support for students who want proper college and branch guidance.',
      features: [
        'Personalized College List',
        'CAP Round Guidance',
        'Branch Selection Help',
        'WhatsApp Support',
        'Document Checklist',
        'Basic Strategy PDF'
      ],
      button: 'Join Silver Plan',
      highlight: false
    },
    {
      name: 'Platinum Counselling',
      price: '1999',
      oldPrice: '2999',
      badge: 'Most Popular',
      icon: Crown,
      description:
        'Complete premium counselling with personal mentorship till final admission.',
      features: [
        '1-on-1 Personal Meeting',
        'Advanced CAP Strategy',
        'Customized College Roadmap',
        'Priority WhatsApp Support',
        'Admission Support Till End',
        'Live Doubt Solving Sessions'
      ],
      button: 'Join Platinum Plan',
      highlight: true
    }
  ];

  return (
    <Section
      id="pricing"
      className="relative overflow-hidden bg-background py-20 lg:py-28"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <div className="text-center mb-14 lg:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 text-white tracking-tight leading-tight">
            निवडा तुमचा{' '}
            <span className="text-accent-gradient italic">
              यशस्वी
            </span>{' '}
            प्लॅन
          </h2>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            एकदाच गुंतवणूक करा आणि तुमच्या dream college admission ला proper direction द्या.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group overflow-hidden rounded-[2rem] border transition-all duration-500 ${plan.highlight
                ? 'glass border-primary-500/30 scale-[1] lg:scale-[1.03] shadow-[0_0_60px_rgba(245,158,11,0.12)]'
                : 'glass border-white/10 hover:border-primary-500/20'
                }`}
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_45%)]" />

              {/* Badge */}
              <div className="absolute top-5 right-5 z-20">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] ${plan.highlight
                    ? 'bg-primary-500 text-black'
                    : 'bg-white/5 text-primary-300 border border-white/10'
                    }`}
                >
                  <Sparkles size={14} />
                  {plan.badge}
                </div>
              </div>

              <div className="relative z-10 p-6 sm:p-8 lg:p-10 h-full flex flex-col">

                {/* Top */}
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
                    <plan.icon
                      className="text-primary-400"
                      size={30}
                    />
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3 leading-tight">
                    {plan.name}
                  </h3>

                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 mb-8 flex-wrap">
                  <span className="text-5xl sm:text-6xl font-bold text-white leading-none">
                    ₹{plan.price}
                  </span>

                  <span className="text-gray-500 line-through text-xl sm:text-2xl mb-1">
                    ₹{plan.oldPrice}
                  </span>
                </div>

                {/* Offer */}
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-primary-300 text-sm font-medium mb-10 w-fit">
                  <ShieldCheck size={18} />
                  Limited Time Offer
                </div>

                {/* Features */}
                <div className="space-y-5 flex-1">
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4"
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check
                          className="text-primary-400"
                          size={14}
                        />
                      </div>

                      <span className="text-gray-300 font-light text-sm sm:text-base leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="pt-10">
                  <Button
                    size="lg"
                    className={`w-full rounded-2xl py-5 text-lg shadow-[0_20px_40px_rgba(245,158,11,0.15)] ${plan.highlight
                      ? ''
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                      }`}
                    onClick={onCtaClick}
                  >
                    {plan.button}
                  </Button>

                  <p className="text-center text-gray-600 text-[10px] sm:text-xs mt-5 uppercase tracking-[0.15em] leading-relaxed">
                    Secure Payment • Instant Confirmation • No Hidden Charges
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Pricing;