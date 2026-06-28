import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import Creator from '../components/sections/Creator';
import Process from '../components/sections/Process';
import Roadmap from '../components/sections/Roadmap';
import Pricing from '../components/sections/Pricing';
import FAQ from '../components/sections/FAQ';
import AuthModal from '../components/auth/AuthModal';
import API_BASE_URL from '../config/api';

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const scrollTimerRef = useRef(null);
  const hasShownAuthRef = useRef(false);
  const navigate = useNavigate();

  const [cmsData, setCmsData] = useState({
    stats: [], faqs: [], processSteps: [], roadmapSteps: [], pricingPlans: [], creatorProfiles: []
  });

  const toggleForm = () => setIsFormOpen(!isFormOpen);
  const openAuth = () => setIsAuthOpen(true);
  
  const handlePricingCta = (planName) => {
    localStorage.setItem('selectedPlan', planName);
    const token = localStorage.getItem('studentToken');
    if (!token) {
      setIsAuthOpen(true);
    } else {
      navigate(`/plan-confirmation?plan=${encodeURIComponent(planName)}`);
    }
  };

  // Fetch CMS Data
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/cms-data`)
      .then(res => res.json())
      .then(data => setCmsData(data))
      .catch(console.error);
  }, []);

  // Hash anchor scrolling after CMS data is fetched
  useEffect(() => {
    if (cmsData.pricingPlans.length > 0) {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace('#', '');
        setTimeout(() => {
          const elem = document.getElementById(targetId);
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [cmsData]);

  // Scroll listener to trigger auth modal after 3 seconds of scrolling (only if not logged in)
  useEffect(() => {
    const handleScroll = () => {
      const token = localStorage.getItem('studentToken');
      if (token) return;
      if (hasShownAuthRef.current) return;
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        const currentToken = localStorage.getItem('studentToken');
        if (!currentToken) {
          setIsAuthOpen(true);
          hasShownAuthRef.current = true;
        }
      }, 3000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-[90vh] lg:min-h-screen bg-background">
      <Navbar onContactClick={openAuth} />

      <main>
        <Hero onCtaClick={openAuth} />
        <Stats data={cmsData.stats} />
        <Process data={cmsData.processSteps} />
        <Creator data={cmsData.creatorProfiles} />
        <Roadmap data={cmsData.roadmapSteps} />
        <Pricing data={cmsData.pricingPlans} onCtaClick={handlePricingCta} />
        <FAQ data={cmsData.faqs} />
      </main>

      <Footer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab="login" />
    </div>
  );
};

export default Home;
