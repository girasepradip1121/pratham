import * as LucideIcons from 'lucide-react';
import Section from '../ui/Section';
import Button from '../ui/Button';

const Pricing = ({ data = [], onCtaClick }) => {
  const plans = data.length > 0 ? data : [
    {
      name: 'Loading...', price: '...', oldPrice: '...', badge: 'Loading', iconName: 'Star',
      description: 'Please wait...', features: [], buttonText: 'Loading...', isHighlighted: false
    }
  ];

  return (
    <Section
      id="pricing"
      className="relative overflow-hidden bg-background py-8 md:py-12"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 text-white tracking-tight leading-tight">
            Choose Your{' '}
            <span className="text-accent-gradient italic">
              Success
            </span>{' '}
            Plan
          </h2>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Invest once and give proper direction to your dream college admission.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {plans?.map((plan, index) => {
            let IconComponent = LucideIcons[plan.iconName] || LucideIcons.Star;
            return (
              <div
                key={index}
                className={`relative group overflow-hidden rounded-[1.8rem] border transition-all duration-500 ${plan.isHighlighted
                  ? 'glass border-primary-500/30 lg:scale-[1.02] shadow-[0_0_40px_rgba(245,158,11,0.10)]'
                  : 'glass border-white/10 hover:border-primary-500/20'
                  }`}
              >
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.08),transparent_45%)]" />

                {/* Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] ${plan.isHighlighted
                      ? 'bg-primary-500 text-black'
                      : 'bg-white/5 text-primary-300 border border-white/10'
                      }`}
                  >
                    <LucideIcons.Sparkles size={12} />
                    {plan.badge}
                  </div>
                </div>

                <div className="relative z-10 p-5 sm:p-6 lg:p-7 h-full flex flex-col">

                  {/* Top */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5">
                      <IconComponent
                        className="text-primary-400"
                        size={24}
                      />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 leading-tight">
                      {plan.name}
                    </h3>

                    <p className="text-gray-400 leading-relaxed text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-2 mb-6 flex-wrap">
                    <span className="text-4xl sm:text-5xl font-bold text-white leading-none">
                      ₹{plan.price}
                    </span>

                    <span className="text-gray-500 line-through text-lg mb-1">
                      ₹{plan.oldPrice}
                    </span>
                  </div>

                  {/* Offer */}
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-primary-300 text-xs font-medium mb-7 w-fit">
                    <LucideIcons.ShieldCheck size={15} />
                    Limited Time Offer
                  </div>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    {plan.features?.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-md bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <LucideIcons.Check
                            className="text-primary-400"
                            size={12}
                          />
                        </div>

                        <span className="text-gray-300 font-light text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <div className="pt-7">
                    <Button
                      size="lg"
                      className={`w-full rounded-2xl py-4 text-base ${plan.isHighlighted
                        ? ''
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                        }`}
                      onClick={() => onCtaClick(plan.name)}
                    >
                      {plan.buttonText}
                    </Button>

                    <p className="text-center text-gray-600 text-[10px] mt-4 uppercase tracking-[0.12em]">
                      Secure Payment • Instant Confirmation
                    </p>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </div>
    </Section>
  );
};

export default Pricing;