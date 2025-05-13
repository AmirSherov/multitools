'use client'
import Navbar from "./components/mainpage/navigation/Navbar"
import Footer from "./components/mainpage/footer/Footer"
import ParticlesBackground from "./components/mainpage/mainbackground/ParticlesBackground"
import ShowCase from "./components/mainpage/showcase/showCase"
import { useState, useEffect, useRef } from "react"
import "./page.scss"
import Hero from './components/mainpage/Hero/Hero'
import { NotifyProvider , notify } from 'amirdev-notify'
import Features from './components/mainpage/features/Features'
import Tools from './components/mainpage/tools-landing/Tools'
export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const [serverAwake, setServerAwake] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  
  function awakeserver() {
    const interval = setInterval(() => {
      console.log('Подключение к серверу...');
      // fetch('http://127.0.0.1:8000/api/v1/awakeserver/')
      fetch('https://multitoolserver.onrender.com/api/v1/awakeserver/')
      .then(response => response.json())
        .then(data => {
          if(data.message === 'Server is awake') {
            console.log('Подключение к серверу успешно!');
            notify({
              message: 'Подключение к серверу успешно!',
              type: 'success',
              delay:1
            })
            setServerAwake(true);
            clearInterval(interval);
          }
        })
        .catch(error => {
          console.log('Ошибка подключения к серверу!');
        });
    }, 5000);
    return interval;
  }
  
  useEffect(() => {
    const intervalId = awakeserver();
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  };

  return (
    <main className="mainlanding-page">
      <NotifyProvider>
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
      </NotifyProvider>
    </main>
  );
}
