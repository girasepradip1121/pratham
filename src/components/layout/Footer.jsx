import { FaInstagram, FaYoutube, FaTwitter, FaWhatsapp } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaInstagram, href: "#", color: "hover:text-pink-500" },
    { icon: FaYoutube, href: "#", color: "hover:text-red-500" },
    { icon: FaTwitter, href: "#", color: "hover:text-sky-500" },
    { icon: FaWhatsapp, href: "#", color: "hover:text-green-500" },
  ];

  return (
    <footer className="pt-24 pb-12 px-6 border-t border-white/5 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 pb-12 border-b border-white/5">
          <div className="max-w-xs">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">
              PRATHAMESH<span className="text-primary-500 italic">CET</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Leading the way in Maharashtra engineering & pharmacy admissions guidance. 
              We transform your hard work into your dream college seat.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">Connect with us</span>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`p-3 glass rounded-xl text-gray-400 ${social.color} transition-all duration-300 hover:-translate-y-1`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12">
          <p className="text-gray-600 text-xs tracking-widest uppercase font-medium">
            © {currentYear} Prathamesh Counselling. Engineering your future.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
