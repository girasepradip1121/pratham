import { Users, GraduationCap } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa6';
import Section from '../ui/Section';

const Stats = () => {
  const stats = [
    {
      label: 'Instagram Followers',
      value: '90K+',
      icon: FaInstagram,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10'
    },
    {
      label: 'Students Helped',
      value: '117+',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Top Colleges Secured',
      value: '45+',
      icon: GraduationCap,
      color: 'text-primary-500',
      bg: 'bg-primary-500/10'
    },
  ];

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="
              glass glass-hover
              p-8 md:p-10
              rounded-[2rem]
              flex flex-col items-center text-center
              group relative overflow-hidden
            "
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.08),transparent_45%)] pointer-events-none" />

            {/* Icon */}
            <div
              className={`
                p-5 rounded-2xl ${stat.bg}
                mb-8
                group-hover:scale-110
                group-hover:rotate-6
                transition-all duration-500
                border border-white/10
              `}
            >
              <stat.icon className={stat.color} size={40} />
            </div>

            {/* Value */}
            <h3 className="text-4xl md:text-5xl font-bold mb-3 text-white tracking-tight">
              {stat.value}
            </h3>

            {/* Label */}
            <p className="text-gray-400 font-medium tracking-wide text-xs md:text-sm uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Stats;