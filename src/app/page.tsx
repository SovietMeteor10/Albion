'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [showLanding, setShowLanding] = useState(true);
  const [showWhiteLine, setShowWhiteLine] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showMainSite, setShowMainSite] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const aboutRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Preload the main image
    const preloadImage = new window.Image();
    preloadImage.src = '/images/image1.jpg';
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      // Determine active section based on scroll position
      const sections = [
        { name: 'hero', element: document.getElementById('hero') },
        { name: 'about', element: aboutRef.current },
        { name: 'blog', element: blogRef.current },
        { name: 'contact', element: contactRef.current }
      ];

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // If on landing page and user tries to scroll, trigger animation
      if (showLanding && animationPhase === 0) {
        e.preventDefault();
        triggerWhiteLineAnimation();
        return;
      }
    };

    const handleTouchStart = () => {
      // If on landing page and user tries to scroll, trigger animation
      if (showLanding && animationPhase === 0) {
        triggerWhiteLineAnimation();
        return;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [showLanding, animationPhase]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        // Submit to Google Form
        const formData = new FormData();
        formData.append('entry.2091654403', email);
        
        await fetch('https://docs.google.com/forms/d/1SR8SdufF5mE_AYjn-Zz2T6_BCFI_0NMbxSf_ADkrYMM/formResponse', {
          method: 'POST',
          body: formData,
          mode: 'no-cors' // Required for cross-origin requests to Google Forms
        });
        
        // Since we're using no-cors mode, we can't check the response status
        // But the form should still submit successfully
        console.log('Email submitted to Google Form:', email);
        setEmail('');
        setShowThankYou(true);
        setTimeout(() => {
          setShowThankYou(false);
        }, 3000);
      } catch (error) {
        console.error('Error submitting to Google Form:', error);
        // Still show thank you message even if there's an error
        // since no-cors mode doesn't allow us to verify success
        setEmail('');
        setShowThankYou(true);
        setTimeout(() => {
          setShowThankYou(false);
        }, 3000);
      }
    }
  };

  const triggerWhiteLineAnimation = () => {
    setShowWhiteLine(true);
    
    // Phase 1: White line sweep - line moves from right to left
    setAnimationPhase(1);
    setTimeout(() => {
      // Phase 2: White line expand (0.6s) - expansion to 100vh
      setAnimationPhase(2);
      setTimeout(() => {
        // Phase 3: Start fading in the webpage immediately when line reaches full height
        setShowMainSite(true);
        setTimeout(() => {
          // Phase 4: Everything disappears and webpage is fully visible
          setAnimationPhase(3);
          setShowLanding(false);
          setShowWhiteLine(false);
          setAnimationPhase(0);
        }, 800); // Fade in duration
      }, 0); // Start fade in immediately when line reaches full height
    }, 600); // Start expansion when line reaches 1.2x width (halfway through sweep)
  };


  if (showLanding) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="relative w-full h-full flex items-center justify-start pl-8 md:pl-16 lg:pl-24">
          <div className="relative inline-block">
            <h1 
              ref={heroTextRef}
              className="keep-calm-style text-[12rem] md:text-[14rem] lg:text-[16rem] text-white"
            >
              ALBION
            </h1>
            
            {/* White line animation */}
            {showWhiteLine && animationPhase < 3 && (
              <div 
                className={`absolute top-1/2 left-0 bg-white transform -translate-y-1/2 w-[300vw] ${
                  animationPhase === 1 
                    ? 'h-[12rem] md:h-[14rem] lg:h-[16rem] animate-white-line-sweep' 
                    : animationPhase === 2
                    ? 'h-screen animate-white-line-expand'
                    : ''
                }`}
                style={{
                  // Fallback inline styles for production
                  animation: animationPhase === 1 
                    ? 'whiteLineSweep 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                    : animationPhase === 2
                    ? 'whiteLineExpand 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                    : 'none'
                }}
              />
            )}
          </div>

          {/* Downward arrow */}
          <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 ${
            animationPhase >= 1 ? 'opacity-0' : 'opacity-100'
          }`}>
            <button
              onClick={triggerWhiteLineAnimation}
              className="text-white hover:text-gray-300"
            >
              <svg 
                className="w-8 h-8" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${showMainSite ? 'animate-fade-in-main-site' : 'opacity-0'}`}>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm ${
        isScrolled ? 'border-b border-gray-200' : 'border-b border-transparent'
      } ${showMainSite ? 'animate-fade-in-nav' : ''}`}>
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-end">
            <div className="flex space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className={`text-lg md:text-xl military-font relative pb-1 ${
                  activeSection === 'hero' 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                HOME
                <div className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
                  activeSection === 'hero' 
                    ? 'w-full opacity-100' 
                    : 'w-0 opacity-0'
                }`} />
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`text-lg md:text-xl military-font relative pb-1 ${
                  activeSection === 'about' 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                ABOUT
                <div className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
                  activeSection === 'about' 
                    ? 'w-full opacity-100' 
                    : 'w-0 opacity-0'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className={`min-h-screen flex flex-col px-6 relative pt-24 ${showMainSite ? 'animate-fade-in-hero' : ''}`}>
        {/* Title - Full width across the page */}
        <div className="w-full py-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight uppercase text-left whitespace-nowrap overflow-hidden">
           THE REAWAKENING OF A NATION
          </h1>
        </div>
        
        <div className="w-full flex-1 flex items-center">
          <div className="w-full">
            <Image 
              src="/images/image1.jpg" 
              alt="Albion" 
              width={2940}
              height={500}
              className="w-full h-[500px] object-cover rounded-sm shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className={`min-h-screen flex items-center px-6 bg-gray-50 ${showMainSite ? 'animate-fade-in-about' : ''}`}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left side - Description */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">ABOUT</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Albion is a British think tank dedicated to the complete renewal of our national foundations. We bring together individuals from every discipline to rethink how Britain works, from its institutions and industries to its cultural and civic life. Our mission is to drive Britain into a more prosperous, anglofuturist age and your country needs you.
              </p>
            </div>
            
            {/* Right side - Quote */}
            <div className="w-full">
              <blockquote className="text-2xl md:text-3xl text-black leading-tight mb-4 p-0">
                &ldquo;We are a nation with a destiny, not a destiny that others shall impose upon us, but one that we shall make from our own intelligence, courage, and unflagging will to progress. The British people are not the shadows of their ancestors; they are the makers of the modern world.&rdquo; <span className="text-base text-gray-600">→ H.G. Wells</span>
              </blockquote>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className={`py-8 px-6 bg-black text-white ${showMainSite ? 'animate-fade-in-footer' : ''}`}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative overflow-hidden">
              <form onSubmit={handleEmailSubmit} className={`flex w-full border border-white rounded-lg overflow-hidden transition-transform duration-500 ${showThankYou ? 'transform -translate-y-full' : 'transform translate-y-0'}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Sign up to newsletter"
                  className="flex-1 px-4 py-2 border-0 focus:outline-none bg-black text-white placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <div className={`absolute top-0 left-0 w-full flex items-center justify-center px-4 py-2 bg-black text-white border border-white rounded-lg transition-transform duration-500 ${showThankYou ? 'transform translate-y-0' : 'transform translate-y-full'}`}>
                <span className="text-white">Thank you for your service</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm text-right">
              © {new Date().getFullYear()} Albion. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}