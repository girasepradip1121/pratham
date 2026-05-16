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

  const [cmsData, setCmsData] = useState({
    stats: [], faqs: [], processSteps: [], roadmapSteps: [], pricingPlans: [], creatorProfiles: []
  });

  const toggleForm = () => setIsFormOpen(!isFormOpen);

  // Fetch CMS Data
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/cms-data`)
      .then(res => res.json())
      .then(data => setCmsData(data))
      .catch(console.error);
  }, []);

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
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-[90vh] lg:min-h-screen bg-background">
      <Navbar onContactClick={toggleForm} />

      <main>
        <Hero onCtaClick={toggleForm} />
        <Stats data={cmsData.stats} />
        <Process data={cmsData.processSteps} />
        <Creator data={cmsData.creatorProfiles} />
        <Roadmap data={cmsData.roadmapSteps} />
        <Pricing data={cmsData.pricingPlans} onCtaClick={toggleForm} />
        <FAQ data={cmsData.faqs} />
      </main>

      <Footer />

      <InquiryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab="login" />
    </div>
  );
};

export default Home;
