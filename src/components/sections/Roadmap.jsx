import {
  Trophy,
  FileText,
  ListChecks,
  School,
  ArrowDown,
  GraduationCap,
  Target,
  Briefcase,
  Building2,
  FileCheck,
  MessageCircleMore
} from 'lucide-react';

import Section from '../ui/Section';

const Roadmap = () => {
  const features = [
    {
      title: 'College & Branch Guidance',
      desc: 'Best colleges आणि branches निवडण्यासाठी personalized guidance.',
      icon: GraduationCap,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10'
    },
    {
      title: 'CAP Round Strategy',
      desc: 'Round-wise smart priority strategy आणि cutoff analysis.',
      icon: Target,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },
    {
      title: 'Career Roadmap',
      desc: 'Placements, higher studies आणि future opportunities बद्दल clarity.',
      icon: Briefcase,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10'
    },
    {
      title: 'Campus Partner Network',
      desc: 'Trusted colleges आणि partner network कडून support.',
      icon: Building2,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Document Checklist',
      desc: 'Admission documents verification आणि checklist support.',
      icon: FileCheck,
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    {
      title: 'WhatsApp Support',
      desc: 'Instant updates आणि direct WhatsApp doubt solving.',
      icon: MessageCircleMore,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <Section className="bg-surface/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white tracking-tight">
            तुमचा प्रवेशाचा{' '}
            <span className="text-accent-gradient italic">प्रवास</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            रिझल्टपासून ते कॉलेजमध्ये जाईपर्यंतचा प्रत्येक टप्पा आम्ही सोपा करू.
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
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass glass-hover rounded-[2rem] p-8 relative overflow-hidden group"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_45%)] pointer-events-none" />

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${feature.bg} border border-white/10 flex items-center justify-center mb-7 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
              >
                <feature.icon className={feature.color} size={30} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-8 font-light text-[15px] md:text-base">
                {feature.desc}
              </p>

              {/* Big Number */}
              <div className="absolute top-5 right-5 text-7xl font-serif font-bold text-white/[0.03] select-none">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;