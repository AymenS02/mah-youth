'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FileText, BookOpen, Play, Image } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const KnowledgeResources = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // Check if we're on mobile to disable heavy animations
    const isMobile = window.innerWidth < 768;
    
    // Only run animations if all refs are available
    if (titleRef.current && cardsRef.current.length > 0) {
      // Background animation - disabled on mobile for performance
      if (!isMobile && backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          rotate: 360,
          duration: 60,
          repeat: -1,
          ease: "none"
        });
      }

      // GSAP Animation Timeline - simplified for mobile
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%", // Changed from 80% to 85% for better mobile trigger
          once: true,
          refreshPriority: -1 // Lower priority for mobile performance
        }
      });

      if (isMobile) {
        // Simplified mobile animations
        gsap.set([titleRef.current], {
          opacity: 0,
          y: 30
        });

        gsap.set(cardsRef.current, {
          opacity: 0,
          y: 40
        });

        // Simple fade-in animations for mobile
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        })
        .to(cardsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1
        }, "-=0.4");
      } else {
        // Full desktop animations
        gsap.set([titleRef.current], {
          opacity: 0,
          y: 80,
          scale: 0.8
        });

        gsap.set(cardsRef.current, {
          opacity: 0,
          y: 120,
          rotationY: 15,
          transformPerspective: 1000
        });

        // Animate title with bounce
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.6)"
        })
        // Animate cards with 3D stagger effect
        .to(cardsRef.current, {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 1,
          ease: "power3.out",
          stagger: {
            each: 0.2,
            from: "start"
          }
        }, "-=0.8");
      }
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf([titleRef.current, ...cardsRef.current, backgroundRef.current]);
    };
  }, []);

  const addToCardRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const resources = [
    {
      title: "PDF Books",
      description: "Free Islamic books and educational materials for download",
      icon: FileText,
      link: "/pages/books",
      primaryColor: "#0D5EA6",
      pattern: "dots"
    },
    {
      title: "Articles & Blog", 
      description: "In-depth articles on Islamic topics and contemporary issues",
      icon: BookOpen,
      link: "/pages/articles",
      primaryColor: "#EAA64D",
      pattern: "lines"
    },
    {
      title: "Videos",
      description: "Educational YouTube videos and Islamic lectures",
      icon: Play,
      link: "/pages/videos",
      primaryColor: "#0D5EA6",
      pattern: "waves"
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-12 sm:py-16 lg:py-20 xl:py-24 relative w-full min-h-screen flex items-center" 
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
        overflow: 'visible' // Changed from overflow-hidden to visible
      }}
    >
      {/* Animated geometric background - Only on desktop */}
      <div ref={backgroundRef} className="absolute inset-0 opacity-5 hidden md:block">
        <svg width="100%" height="100%" viewBox="0 0 800 600" className="absolute inset-0">
          <defs>
            <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon points="30,2 54,15 54,39 30,52 6,39 6,15" fill="none" stroke="#0D5EA6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPattern)"/>
        </svg>
      </div>

      {/* Floating elements - Reduced on mobile */}
      <div className="absolute top-16 left-4 sm:top-20 sm:left-10 w-3 h-3 sm:w-6 sm:h-6 rounded-full opacity-10 sm:opacity-20 animate-bounce" style={{backgroundColor: '#EAA64D', animationDelay: '0s', animationDuration: '3s'}}></div>
      <div className="absolute top-32 right-4 sm:top-40 sm:right-20 w-2 h-2 sm:w-4 sm:h-4 rounded-full opacity-10 sm:opacity-20 animate-bounce" style={{backgroundColor: '#0D5EA6', animationDelay: '1s', animationDuration: '4s'}}></div>
      <div className="absolute bottom-24 left-1/4 w-2 h-2 sm:w-5 sm:h-5 rounded-full opacity-10 sm:opacity-20 animate-bounce" style={{backgroundColor: '#EAA64D', animationDelay: '2s', animationDuration: '3.5s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full opacity-10 sm:opacity-20 animate-bounce" style={{backgroundColor: '#0D5EA6', animationDelay: '0.5s', animationDuration: '2.8s'}}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div ref={titleRef} className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 sm:mb-4 lg:mb-6 relative inline-block px-2 sm:px-4">
              <span className="relative z-10" style={{color: '#1a202c'}}>
                Knowledge{' '}
                <span 
                  className="relative block sm:inline mt-1 sm:mt-0"
                  style={{
                    background: 'linear-gradient(135deg, #0D5EA6 0%, #EAA64D 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Resources
                </span>
              </span>
              {/* Decorative underline - responsive width */}
              <div 
                className="absolute -bottom-0.5 sm:-bottom-1 lg:-bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 sm:h-1 lg:h-2 rounded-full"
                style={{
                  width: '90%',
                  background: 'linear-gradient(90deg, transparent 0%, #EAA64D 20%, #0D5EA6 50%, #EAA64D 80%, transparent 100%)'
                }}
              ></div>
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl mx-auto font-medium px-2 sm:px-4 leading-relaxed">
              Explore our comprehensive collection of Islamic educational materials
            </p>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 max-w-6xl mx-auto">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <Link
                key={index}
                href={resource.link}
                className="group relative block w-full"
              >
                <div 
                  className="relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-300 sm:duration-700 hover:scale-[1.02] sm:hover:scale-105 border-2 border-transparent hover:border-opacity-20 overflow-hidden w-full"
                  ref={addToCardRefs}
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    '--hover-border': resource.primaryColor,
                    minHeight: '200px' // Ensure minimum height on mobile
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth > 768) { // Only on desktop
                      e.currentTarget.style.borderColor = resource.primaryColor + '33';
                      e.currentTarget.style.boxShadow = `0 20px 60px ${resource.primaryColor}22`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth > 768) { // Only on desktop
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                    }
                  }}
                >
                  {/* Background pattern - Hidden on mobile for performance */}
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 opacity-5 overflow-hidden hidden md:block">
                    {resource.pattern === 'dots' && (
                      <div className="grid grid-cols-4 gap-1 sm:gap-2 p-2 sm:p-4">
                        {Array.from({length: 16}).map((_, i) => (
                          <div key={i} className="w-1 h-1 sm:w-2 sm:h-2 rounded-full" style={{backgroundColor: resource.primaryColor}}></div>
                        ))}
                      </div>
                    )}
                    {resource.pattern === 'lines' && (
                      <div className="space-y-1 sm:space-y-2 p-2 sm:p-4 transform rotate-45">
                        {Array.from({length: 8}).map((_, i) => (
                          <div key={i} className="h-0.5 sm:h-1 rounded-full" style={{backgroundColor: resource.primaryColor}}></div>
                        ))}
                      </div>
                    )}
                    {resource.pattern === 'waves' && (
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M0,50 Q25,25 50,50 T100,50" stroke={resource.primaryColor} fill="none" strokeWidth="1"/>
                        <path d="M0,70 Q25,45 50,70 T100,70" stroke={resource.primaryColor} fill="none" strokeWidth="1"/>
                      </svg>
                    )}
                  </div>

                  {/* Icon container with morphing background */}
                  <div className="relative mb-4 sm:mb-6 lg:mb-8">
                    <div 
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center relative mx-auto group-hover:rounded-xl sm:group-hover:rounded-2xl lg:group-hover:rounded-3xl transition-all duration-300 sm:duration-500"
                      style={{backgroundColor: resource.primaryColor + '15'}}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg sm:rounded-xl lg:rounded-2xl group-hover:rounded-xl sm:group-hover:rounded-2xl lg:group-hover:rounded-3xl transition-all duration-300 sm:duration-500 opacity-0 group-hover:opacity-100"
                        style={{background: `linear-gradient(135deg, ${resource.primaryColor}22, ${resource.primaryColor}11)`}}
                      ></div>
                      <IconComponent 
                        className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 relative z-10 transition-all duration-300 group-hover:scale-110" 
                        style={{color: resource.primaryColor}}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4 group-hover:text-gray-900 transition-colors duration-300">
                      {resource.title}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 px-1">
                      {resource.description}
                    </p>
                  </div>

                  {/* Interactive arrow - Hidden on mobile */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hidden sm:block">
                    <div 
                      className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center"
                      style={{backgroundColor: resource.primaryColor + '15'}}
                    >
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4" style={{color: resource.primaryColor}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Shimmer effect - Desktop only */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 hidden md:block">
                    <div 
                      className="absolute inset-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${resource.primaryColor}15, transparent)`,
                        width: '50%'
                      }}
                    ></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom decorative element */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <div 
            className="inline-block w-8 sm:w-12 lg:w-16 h-0.5 sm:h-1 rounded-full mx-1 sm:mx-2"
            style={{background: 'linear-gradient(90deg, #0D5EA6, #EAA64D)'}}
          ></div>
          <div className="inline-block w-1 h-1 sm:w-2 sm:h-2 rounded-full mx-0.5 sm:mx-1" style={{backgroundColor: '#EAA64D'}}></div>
          <div 
            className="inline-block w-8 sm:w-12 lg:w-16 h-0.5 sm:h-1 rounded-full mx-1 sm:mx-2"
            style={{background: 'linear-gradient(90deg, #EAA64D, #0D5EA6)'}}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeResources;