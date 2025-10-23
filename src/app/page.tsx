'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [showLanding, setShowLanding] = useState(false);
  const [showWhiteLine, setShowWhiteLine] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showMainSite, setShowMainSite] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileLoading, setShowMobileLoading] = useState(false);
  const [mobileLoadingFade, setMobileLoadingFade] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [wasDesktop, setWasDesktop] = useState(false);

  const aboutRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Check if mobile on initial load only
    if (!hasInitialized) {
      const checkMobile = () => {
        const width = window.innerWidth;
        const mobile = width < 1250;
        setIsMobile(mobile);
        setWasDesktop(!mobile);
        
        if (mobile) {
          setShowMobileLoading(true);
          // Show mobile loading for 1 second, then fade out for 0.15 seconds
          setTimeout(() => {
            setMobileLoadingFade(true);
            setTimeout(() => {
              setShowMobileLoading(false);
              setShowLanding(false);
              setShowMainSite(true);
            }, 150); // Fade duration
          }, 1000); // Display duration
        } else {
          // Desktop - show black landing page
          setShowLanding(true);
        }
      };
      
      checkMobile();
      setHasInitialized(true);
    }

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

    const handleResize = () => {
      // Only handle resize if we're on the landing page and started on desktop
      if (showLanding && wasDesktop && !showMainSite) {
        const width = window.innerWidth;
        const mobile = width < 1250;
        
        if (mobile && !isMobile) {
          // Transitioning from desktop to mobile while on landing page
          setIsMobile(true);
          setShowMobileLoading(true);
          // Show mobile loading for 1 second, then fade out for 0.15 seconds
          setTimeout(() => {
            setMobileLoadingFade(true);
            setTimeout(() => {
              setShowMobileLoading(false);
              setShowLanding(false);
              setShowMainSite(true);
            }, 150); // Fade duration
          }, 1000); // Display duration
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
    };
  }, [showLanding, animationPhase, hasInitialized, wasDesktop, isMobile, showMainSite]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Set active section immediately when button is clicked
      setActiveSection(sectionId);
      
      if (sectionId === 'about' && window.innerWidth < 1250) {
        // On mobile, scroll to position the about title at the top
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top - 100; // 100px offset from top
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
      // Phase 2: White line expand (0.25s) - expansion to 100vh
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
    }, 1000); // Start expansion slightly before sweep finishes (1.0s)
  };


  // Mobile loading screen
  if (showMobileLoading) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-150 ${
        mobileLoadingFade ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="text-center">
          <h1 className="keep-calm-style text-black font-bold leading-none" 
              style={{ fontSize: 'clamp(3rem, 15vw, 8rem)' }}>
            ALBION
          </h1>
          <p className="text-black font-bold uppercase mt-4" 
             style={{ fontSize: 'clamp(0.8rem, 3vw, 1.2rem)' }}>
            Rethinking Britain from First Principles
          </p>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative w-full h-full flex items-center justify-start pl-8 md:pl-16 lg:pl-24">
            <div className="relative inline-block">
              <h1 
                ref={heroTextRef}
                className="keep-calm-style text-[12rem] md:text-[14rem] lg:text-[16rem] text-white"
              >
                ALBION
              </h1>
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
        
        {/* White line animation - positioned over the ALBION text */}
        {showWhiteLine && animationPhase < 3 && (
          <div className={`fixed left-0 bg-white w-[300vw] z-[60] ${
            animationPhase === 1 
              ? 'h-[12rem] md:h-[14rem] lg:h-[16rem] animate-white-line-sweep' 
              : animationPhase === 2
              ? 'animate-white-line-expand'
              : ''
          }`} 
          style={{
            top: 'calc(50vh - 6.5rem)',
            left: '0',
            transform: 'translateY(-50%)',
            position: 'fixed',
            width: '300vw',
            zIndex: 60,
            height: animationPhase === 2 ? '100vh' : animationPhase === 1 ? '13rem' : '13rem'
          }}
          />
        )}
      </>
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
                className={`text-lg md:text-xl military-font relative pb-2 ${
                  activeSection === 'hero' 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                HOME
                <div 
                  className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ease-in-out`}
                  style={{ 
                    width: '100%', 
                    transformOrigin: 'left',
                    transform: activeSection === 'hero' ? 'scaleX(1)' : 'scaleX(0)'
                  }} 
                />
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`text-lg md:text-xl military-font relative pb-2 ${
                  activeSection === 'about' 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                ABOUT
                <div 
                  className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ease-in-out`}
                  style={{ 
                    width: '100%', 
                    transformOrigin: 'left',
                    transform: activeSection === 'about' ? 'scaleX(1)' : 'scaleX(0)'
                  }} 
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className={`min-h-screen flex flex-col px-6 relative pt-24 ${showMainSite ? 'animate-fade-in-hero' : ''}`}>
        {/* Title - Full width across the page */}
        <div className="w-full py-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight uppercase text-left">
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