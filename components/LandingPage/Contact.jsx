'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, ArrowRight, Send } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ContactUsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const ctaButtonRef = useRef(null);
  const contactCardsRef = useRef([]);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // Background animation
    if (backgroundRef.current) {
      gsap.to(backgroundRef.current, {
        rotate: 360,
        duration: 80,
        repeat: -1,
        ease: "none"
      });
    }

    // Only run animations if all refs are available
    if (titleRef.current && contentRef.current && ctaButtonRef.current) {
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
        y: 60,
        scale: 0.9
      });

      gsap.set([contentRef.current], {
        opacity: 0,
        y: 40
      });

      gsap.set([ctaButtonRef.current], {
        opacity: 0,
        y: 30,
        scale: 0.8
      });

      gsap.set(contactCardsRef.current, {
        opacity: 0,
        x: -50,
        rotationY: -15,
        transformPerspective: 1000
      });

      // Animate title
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      })
      // Animate content
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      // Animate contact cards
      .to(contactCardsRef.current, {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1
      }, "-=0.6")
      // Animate CTA button
      .to(ctaButtonRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)"
      }, "-=0.4");
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf([titleRef.current, contentRef.current, ctaButtonRef.current, ...contactCardsRef.current, backgroundRef.current]);
    };
  }, []);

  const addToContactCardsRefs = (el) => {
    if (el && !contactCardsRef.current.includes(el)) {
      contactCardsRef.current.push(el);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      label: "Email Us",
      value: "info@example.com",
      description: "Send us a message anytime"
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+1 (555) 123-4567",
      description: "Speak with our team"
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: "123 Main St, City",
      description: "Come see us in person"
    }
  ];

  return (
    <section ref={sectionRef} className="bg-primary py-20 relative overflow-hidden" >
      {/* Animated geometric background */}
      <div ref={backgroundRef} className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 800 600" className="absolute inset-0">
          <defs>
            <pattern id="contactHexPattern" x="0" y="0" width="80" height="70" patternUnits="userSpaceOnUse">
              <polygon points="40,5 65,22.5 65,57.5 40,75 15,57.5 15,22.5" fill="none" stroke="#EAA64D" strokeWidth="1.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contactHexPattern)"/>
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute top-20 left-10 w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: '#EAA64D', animationDelay: '0s'}}></div>
      <div className="absolute top-40 right-20 w-4 h-4 rounded-full animate-pulse" style={{backgroundColor: '#EAA64D', animationDelay: '2s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#EAA64D', animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-1/3 w-5 h-5 rounded-full animate-pulse" style={{backgroundColor: '#EAA64D', animationDelay: '3s'}}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-12">
            <h2 
              ref={titleRef}
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Let's Get In{' '}
              <span 
                className="relative"
                style={{
                  background: 'linear-gradient(135deg, #EAA64D 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Touch
              </span>
            </h2>
            
            <div 
              ref={contentRef}
              className="space-y-4"
            >
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Have questions about our resources or need assistance? We're here to help you on your learning journey.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link href="/pages/contact">
              <button
                ref={ctaButtonRef}
                className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #EAA64D 0%, #f59e0b 100%)',
                  boxShadow: '0 10px 30px rgba(234, 166, 77, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(234, 166, 77, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(234, 166, 77, 0.3)';
                }}
              >
                <MessageCircle className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                Contact Us Today
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                
                {/* Button shine effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div 
                    className="absolute inset-0 rounded-2xl transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      width: '50%'
                    }}
                  ></div>
                </div>
              </button>
            </Link>
            
            <p className="text-blue-200 text-sm mt-6 max-w-md mx-auto">
              We typically respond within 24 hours. Your questions and feedback are important to us.
            </p>
          </div>

          {/* Decorative bottom element */}
          <div className="mt-16 flex justify-center items-center space-x-4">
            <div className="w-12 h-0.5 rounded-full" style={{backgroundColor: '#EAA64D'}}></div>
            <Send className="w-5 h-5" style={{color: '#EAA64D'}} />
            <div className="w-12 h-0.5 rounded-full" style={{backgroundColor: '#EAA64D'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;