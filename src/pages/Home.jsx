import { useState } from 'react';
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

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => setIsFormOpen(!isFormOpen);

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
    </div>
  );
};

export default Home;
