'use client'
import Navbar from "./components/mainpage/navigation/Navbar"
import Footer from "./components/mainpage/footer/Footer"
import ParticlesBackground from "./components/mainpage/mainbackground/ParticlesBackground"
import ShowCase from "./components/mainpage/showcase/showCase"
import { useState, useEffect, useRef } from "react"
import "./page.scss"
import Hero from './components/mainpage/Hero/Hero'
import Features from './components/mainpage/features/Features'
import Tools from './components/mainpage/tools-landing/Tools'

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const featuresRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="mainlanding-page">
      <ParticlesBackground />
      <Navbar />
      <Hero onScrollClick={scrollToFeatures} showScroll={isVisible} />
      
      <div ref={featuresRef} id="features" style={{ position: 'relative', zIndex: 2 }}>
        <Features />
      </div>
      
      <ShowCase />
      
      <div ref={toolsRef} id="tools" style={{ position: 'relative', zIndex: 2 }}>
        <Tools />
      </div>
      
      <Footer />
    </main>
  );
}
