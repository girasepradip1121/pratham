import {
  CheckCircle,
  Star,
  Quote,
  Users
} from 'lucide-react';

import { FaInstagram } from 'react-icons/fa6';

import Section from '../ui/Section';

const Creator = () => {
  return (
    <Section className="relative overflow-hidden bg-background py-20 lg:py-24">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">

          {/* ================= LEFT SIDE ================= */}
          <div className="relative">
            <div className="glass rounded-[2rem] xl:rounded-[2.5rem] border border-white/10 overflow-hidden relative p-6 sm:p-8 md:p-10 min-h-[520px] flex flex-col justify-between">

              {/* Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.08),transparent_45%)] pointer-events-none" />

              {/* Big P */}
              <div className="absolute top-5 left-5 sm:top-8 sm:left-8 text-[100px] sm:text-[140px] md:text-[180px] font-serif italic text-primary-500/10 leading-none select-none">
                P
              </div>

              {/* Quote */}
              <div className="relative z-10 pt-14 sm:pt-20">
                <Quote className="text-primary-500/20 w-8 h-8 sm:w-10 sm:h-10 mb-5" />

                <p className="text-xl sm:text-2xl md:text-3xl xl:text-[2.1rem] leading-[1.5] font-serif italic text-white/90 max-w-[95%]">
                  “CET नंतर मलाही खूप confuse वाटलं होतं —
                  कोणती college? कोणता branch?
                  मी त्याच confusion मधून आलोय.”
                </p>
              </div>

              {/* Bottom Area */}
              <div className="relative z-10 flex items-end justify-between gap-4 flex-wrap mt-10">

                {/* Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black font-serif text-xl sm:text-2xl font-bold shadow-[0_0_30px_rgba(245,158,11,0.35)]">
                    P
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-white">
                      Prathamesh
                    </h4>

                    <p className="text-gray-500 text-sm sm:text-base">
                      Content Creator · 90K+ Community
                    </p>
                  </div>
                </div>

                {/* Satisfaction */}
                <div className="glass border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[120px]">
                  <div className="text-4xl sm:text-5xl font-bold text-primary-400 leading-none">
                    98%
                  </div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2 whitespace-nowrap">
                    Satisfaction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex flex-col justify-center">

            {/* Label */}
            <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
              <div className="w-12 h-px bg-primary-500" />

              <span className="text-primary-400 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold">
                ABOUT ME
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-[5rem] font-bold text-white leading-[1.02] tracking-tight mb-8 text-center lg:text-left">
              मी Prathamesh — <br />
              तुझा Trusted Senior
            </h2>

            {/* Description */}
            <div className="space-y-6 text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed font-light text-center lg:text-left">
              <p>
                मी एक engineering student आणि content creator आहे.
                माझे{' '}
                <span className="text-primary-400 font-semibold">
                  90,000+ followers
                </span>{' '}
                आहेत Instagram वर.
              </p>

              <p>
                CET नंतर मला योग्य guidance मिळाली नव्हती.
                म्हणून मी ठरवलं की मी तो senior बनेन जो{' '}
                <span className="text-primary-400 font-semibold">
                  honestly आणि clearly
                </span>{' '}
                सांगेल.
              </p>

              <p>
                आतापर्यंत{' '}
                <span className="text-primary-400 font-semibold">
                  500+ students
                </span>{' '}
                ना guide केलंय. आता तुझी वेळ आहे.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 mt-10">

              {/* Instagram */}
              <div className="glass rounded-[1.7rem] border border-white/10 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaInstagram
                    className="text-primary-400"
                    size={20}
                  />

                  <span className="text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-semibold">
                    COMMUNITY
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  90K+
                </div>

                <p className="text-gray-500 text-sm sm:text-base">
                  Instagram Followers
                </p>
              </div>

              {/* Students */}
              <div className="glass rounded-[1.7rem] border border-white/10 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users
                    className="text-primary-400"
                    size={20}
                  />

                  <span className="text-gray-500 uppercase tracking-widest text-[10px] sm:text-xs font-semibold">
                    STUDENTS
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  500+
                </div>

                <p className="text-gray-500 text-sm sm:text-base">
                  Students Helped
                </p>
              </div>
            </div>

            {/* FEATURES */}
            <div className="grid sm:grid-cols-2 gap-4 mt-10">
              {[
                'Personal Guidance',
                'CAP Round Strategy',
                'Branch Selection Help',
                'Direct WhatsApp Support'
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle
                      size={18}
                      className="text-primary-400"
                    />
                  </div>

                  <span className="text-white text-sm sm:text-base font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mt-10 justify-center lg:justify-start flex-wrap">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-primary-500 text-primary-500"
                  />
                ))}
              </div>

              <span className="text-gray-400 text-sm sm:text-base text-center lg:text-left">
                Trusted by hundreds of Maharashtra students
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Creator;