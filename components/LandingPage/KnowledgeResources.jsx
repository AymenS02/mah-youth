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
    // Only run animations if all refs are available
    if (titleRef.current && cardsRef.current.length > 0) {
      // Background animation
      gsap.to(backgroundRef.current, {
        rotate: 360,
        duration: 60,
        repeat: -1,
        ease: "none"
      });

      // GSAP Animation Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });

      // Set initial states
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)'}}>
      {/* Animated geometric background */}
      <div ref={backgroundRef} className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 800 600" className="absolute inset-0">
          <defs>
            <pattern id="hexPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon points="30,2 54,15 54,39 30,52 6,39 6,15" fill="none" stroke="#0D5EA6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPattern)"/>
        </svg>
      </div>

      {/* Floating elements - Smaller on mobile */}
      <div className="absolute top-16 left-4 sm:top-20 sm:left-10 w-4 h-4 sm:w-6 sm:h-6 rounded-full opacity-20 animate-bounce" style={{backgroundColor: '#EAA64D', animationDelay: '0s', animationDuration: '3s'}}></div>
      <div className="absolute top-32 right-4 sm:top-40 sm:right-20 w-3 h-3 sm:w-4 sm:h-4 rounded-full opacity-20 animate-bounce" style={{backgroundColor: '#0D5EA6', animationDelay: '1s', animationDuration: '4s'}}></div>
      <div className="absolute bottom-24 left-1/4 w-3 h-3 sm:w-5 sm:h-5 rounded-full opacity-20 animate-bounce" style={{backgroundColor: '#EAA64D', animationDelay: '2s', animationDuration: '3.5s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 sm:w-3 sm:h-3 rounded-full opacity-20 animate-bounce" style={{backgroundColor: '#0D5EA6', animationDelay: '0.5s', animationDuration: '2.8s'}}></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div ref={titleRef} className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 relative inline-block px-4">
              <span className="relative z-10" style={{color: '#1a202c'}}>
                Knowledge{' '}
                <span 
                  className="relative block sm:inline"
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
                className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 h-1 sm:h-2 rounded-full"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, #EAA64D 20%, #0D5EA6 50%, #EAA64D 80%, transparent 100%)'
                }}
              ></div>
            </h2>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-medium px-4">
              Explore our comprehensive collection of Islamic educational materials
            </p>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <Link
                key={index}
                href={resource.link}
                className="group relative block"
              >
                <div 
                  className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-700 hover:scale-105 border-2 border-transparent hover:border-opacity-20 overflow-hidden"
                  ref={addToCardRefs}
                  style={{
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    '--hover-border': resource.primaryColor
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
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  {/* Background pattern - Hidden on mobile for performance */}
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-5 overflow-hidden hidden sm:block">
                    {resource.pattern === 'dots' && (
                      <div className="grid grid-cols-4 gap-2 p-4">
                        {Array.from({length: 16}).map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full" style={{backgroundColor: resource.primaryColor}}></div>
                        ))}
                      </div>
                    )}
                    {resource.pattern === 'lines' && (
                      <div className="space-y-2 p-4 transform rotate-45">
                        {Array.from({length: 8}).map((_, i) => (
                          <div key={i} className="h-1 rounded-full" style={{backgroundColor: resource.primaryColor}}></div>
                        ))}
                      </div>
                    )}
                    {resource.pattern === 'waves' && (
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M0,50 Q25,25 50,50 T100,50" stroke={resource.primaryColor} fill="none" strokeWidth="2"/>
                        <path d="M0,70 Q25,45 50,70 T100,70" stroke={resource.primaryColor} fill="none" strokeWidth="2"/>
                      </svg>
                    )}
                  </div>

                  {/* Icon container with morphing background */}
                  <div className="relative mb-6 sm:mb-8">
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center relative mx-auto group-hover:rounded-2xl sm:group-hover:rounded-3xl transition-all duration-500"
                      style={{backgroundColor: resource.primaryColor + '15'}}
                    >
                      <div 
                        className="absolute inset-0 rounded-xl sm:rounded-2xl group-hover:rounded-2xl sm:group-hover:rounded-3xl transition-all duration-500 opacity-0 group-hover:opacity-100"
                        style={{background: `linear-gradient(135deg, ${resource.primaryColor}22, ${resource.primaryColor}11)`}}
                      ></div>
                      <IconComponent 
                        className="w-8 h-8 sm:w-10 sm:h-10 relative z-10 transition-all duration-300 group-hover:scale-110" 
                        style={{color: resource.primaryColor}}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-gray-900 transition-colors duration-300">
                      {resource.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {resource.description}
                    </p>
                  </div>

                  {/* Interactive arrow - Hidden on mobile */}
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hidden sm:block">
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                      style={{backgroundColor: resource.primaryColor + '15'}}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" style={{color: resource.primaryColor}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Shimmer effect - Desktop only */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 hidden sm:block">
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
        <div className="text-center mt-12 sm:mt-16">
          <div 
            className="inline-block w-12 sm:w-16 h-1 rounded-full mx-2"
            style={{background: 'linear-gradient(90deg, #0D5EA6, #EAA64D)'}}
          ></div>
          <div className="inline-block w-2 h-2 rounded-full mx-1" style={{backgroundColor: '#EAA64D'}}></div>
          <div 
            className="inline-block w-12 sm:w-16 h-1 rounded-full mx-2"
            style={{background: 'linear-gradient(90deg, #EAA64D, #0D5EA6)'}}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeResources;