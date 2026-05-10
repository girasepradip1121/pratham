import { Users, GraduationCap } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa6';
import Section from '../ui/Section';

const Stats = () => {
  const stats = [
    {
      label: 'Youtube Followers',
      value: '27K+',
      icon: FaYoutube,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass p-10 rounded-3xl flex flex-col items-center text-center group glass-hover"
          >
            <div className={`p-5 rounded-2xl ${stat.bg} mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <stat.icon className={stat.color} size={40} />
            </div>

            <h3 className="text-5xl font-bold mb-3 text-white tracking-tight">
              {stat.value}
            </h3>

            <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Stats;
