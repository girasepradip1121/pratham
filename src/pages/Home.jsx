import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import Creator from '../components/sections/Creator';
import Process from '../components/sections/Process';
import Roadmap from '../components/sections/Roadmap';
import Pricing from '../components/sections/Pricing';
import FAQ from '../components/sections/FAQ';
import InquiryForm from '../components/ui/InquiryForm';
import AuthModal from '../components/auth/AuthModal';

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const scrollTimerRef = useRef(null);
  const hasShownAuthRef = useRef(false);

  const toggleForm = () => setIsFormOpen(!isFormOpen);

  // Scroll listener to trigger auth modal after 3 seconds of scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (hasShownAuthRef.current) return;
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        setIsAuthOpen(true);
        hasShownAuthRef.current = true;
      }, 3000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar onContactClick={toggleForm} />
      
      <main>
        <Hero onCtaClick={toggleForm} />
        <Stats />
        <Process />
        <Creator />
        <Roadmap />
        <Pricing onCtaClick={toggleForm} />
        <FAQ />
      </main>

      <Footer />
      
      <InquiryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab="login" />
    </div>
  );
};

export default Home;
