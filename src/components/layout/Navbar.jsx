import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from '../ui/Button';
import { AuthContext } from '../../context/AuthContext';

import logoImg from '../../assets/image.png';

const Navbar = ({ onContactClick }) => {

  // ✅ HOOKS COMPONENT KE ANDAR
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },

    ...(user
      ? [
        {
          name: 'College Predictor',
          href: '/college-predictor'
        }
      ]
      : []),

    { name: 'Pricing', href: '/#pricing' },

    { name: 'FAQ', href: '/#faq' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (location.pathname === '/') {
        const elem = document.getElementById(targetId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'
        }`}
    >

      <div className="max-w-7xl mx-auto px-6">

        <div
          className={`relative flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${isScrolled ? 'glass' : 'bg-transparent'
            }`}
        >

          {/* LOGO */}
          <a href="/" className="flex items-center gap-2.5 group">
            <img 
              src={logoImg} 
              alt="CET Counselling Logo" 
              className="h-8 sm:h-9 w-auto object-contain" 
            />
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-extrabold tracking-wider text-white leading-none uppercase">
                PRATHAM
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] text-primary-500 uppercase leading-none mt-1">
                MENTORSHIP
              </span>
            </div>
          </a>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
              >
                {link.name}

                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full" />
              </a>
            ))}

            <Button
              onClick={() => {

                if (user) {
                  navigate('/dashboard');
                } else {
                  onContactClick();
                }

              }}
              size="sm"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </Button>

          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>

        {isMobileMenuOpen && (

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10"
          >

            <div className="flex flex-col gap-4 p-6">

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg font-medium text-gray-300"
                >
                  {link.name}
                </a>
              ))}

              <Button
                onClick={() => {

                  if (user) {
                    navigate('/dashboard');
                  } else {
                    onContactClick();
                  }

                }}
                className="w-full"
              >
                {user ? 'Dashboard' : 'Get Started'}
              </Button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </nav>
  );
};

export default Navbar;