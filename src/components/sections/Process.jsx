import * as LucideIcons from 'lucide-react';
import Section from '../ui/Section';

const Process = ({ data = [] }) => {
  const steps = data.length > 0 ? data : [
    { number: '01', title: 'Loading...', desc: 'Please wait...', iconName: 'ClipboardList', colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10' }
  ];

  return (
    <Section
      id="process"
      className="relative overflow-hidden bg-[#050816] py-10 md:py-14"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Label */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-px bg-primary-500" />
          <span className="text-primary-400 uppercase tracking-[0.3em] text-sm font-semibold">
            PROCESS
          </span>
        </div>

        {/* Heading */}
        <div className="max-w-3xl mb-20 md:mb-28">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8">
            How Counselling <br />
            Works?
          </h2>

          <p className="text-gray-400 text-lg md:text-2xl font-light leading-relaxed max-w-2xl">
            From CET results to college admission — in 4 simple steps.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop Line */}
          <div className="hidden lg:block absolute top-[38px] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

          {/* Mobile Line */}
          <div className="lg:hidden absolute left-[38px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-500/30 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-10">
            {steps.map((step, index) => {
              let IconComponent = LucideIcons[step.iconName] || LucideIcons.HelpCircle;
              return (
              <div
                key={index}
                className="relative group flex lg:block items-start gap-6"
              >
                {/* Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="
                      w-20 h-20 rounded-full
                      glass
                      border border-white/10
                      flex items-center justify-center
                      group-hover:border-primary-500/40
                      transition-all duration-500
                      group-hover:-translate-y-1
                    "
                  >
                    <span className="text-primary-400 font-bold text-2xl">
                      0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-2 lg:pt-10 lg:text-center">
                  {/* Icon */}
                  <div
                    className={`
                      hidden lg:flex
                      w-16 h-16 rounded-2xl
                      ${step.bgClass || 'bg-primary-500/10'}
                      border border-white/10
                      items-center justify-center
                      mx-auto mb-8
                      group-hover:scale-110
                      group-hover:rotate-3
                      transition-all duration-500
                    `}
                  >
                    <IconComponent
                      size={28}
                      className={step.colorClass || 'text-primary-400'}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-8 text-[15px] md:text-lg font-light max-w-xs lg:max-w-none mx-auto">
                    {step.description || step.desc}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Process;