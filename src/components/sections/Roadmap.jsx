import * as LucideIcons from 'lucide-react';
import Section from '../ui/Section';

const Roadmap = ({ data = [] }) => {
  const features = data.length > 0 ? data : [
    { title: 'Loading...', desc: 'Please wait...', iconName: 'GraduationCap', colorClass: 'text-orange-400', bgClass: 'bg-orange-500/10' }
  ];

  return (
    <Section className="bg-surface/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white tracking-tight">
            Your Admission{' '}
            <span className="text-accent-gradient italic">Journey</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            We will simplify every single step from results to college admission.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 px-6 md:px-10 mb-28">
          {/* Desktop Line */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent -z-10" />

          {/* Mobile Line */}
          <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-500/30 to-transparent -translate-x-1/2 -z-10" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            let IconComponent = LucideIcons[feature.iconName] || LucideIcons.HelpCircle;
            return (
            <div
              key={index}
              className="glass glass-hover rounded-[2rem] p-8 relative overflow-hidden group"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_45%)] pointer-events-none" />

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${feature.bgClass || 'bg-primary-500/10'} border border-white/10 flex items-center justify-center mb-7 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
              >
                <IconComponent className={feature.colorClass || 'text-primary-400'} size={30} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-8 font-light text-[15px] md:text-base">
                {feature.description || feature.desc}
              </p>

              {/* Big Number */}
              <div className="absolute top-5 right-5 text-7xl font-serif font-bold text-white/[0.03] select-none">
                0{index + 1}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;