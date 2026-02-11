'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Calendar,
  Users,
  Mail, 
  Instagram,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const linksRef = useRef([]);
  const socialRef = useRef([]);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // Background animation
    if (backgroundRef.current) {
      gsap.to(backgroundRef.current, {
        rotate: 360,
        duration: 120,
        repeat: -1,
        ease: "none"
      });
    }

    // Animate footer elements on scroll
    if (footerRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          once: true
        }
      });

      // Set initial states
      gsap.set(linksRef.current, {
        opacity: 0,
        y: 30
      });

      gsap.set(socialRef.current, {
        opacity: 0,
        scale: 0.8,
        rotation: 180
      });

      // Animate links
      tl.to(linksRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1
      })
      // Animate social icons
      .to(socialRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.4)",
        stagger: 0.1
      }, "-=0.3");
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf([...linksRef.current, ...socialRef.current, backgroundRef.current]);
    };
  }, []);

  const addToLinksRefs = (el) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  const addToSocialRefs = (el) => {
    if (el && !socialRef.current.includes(el)) {
      socialRef.current.push(el);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    // { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const programLinks = [
    { name: 'Weekly Programs', href: '/pages/programs', icon: Calendar },
    { name: 'Youth Leadership', href: '/pages/contact', icon: Users },
    { name: 'Volunteer', href: '/pages/contact', icon: Users }
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/themahyouth', icon: Instagram },
  ];

  const contactInfo = [
    { icon: Mail, text: 'youth@hamiltonmosque.com', href: 'mailto:youth@hamiltonmosque.com' },
  ];

  return (
    <footer ref={footerRef} className="relative overflow-hidden" style={{background: 'var(--gradient-primary)'}}>
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group z-20"
        style={{
          background: 'var(--gradient-accent)',
          boxShadow: 'var(--shadow-accent)'
        }}
      >
        <ChevronUp className="w-6 h-6 group-hover:animate-bounce" style={{color: 'var(--color-primary)'}} />
      </button>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1" ref={addToLinksRefs}>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--color-light)'}}>
                MAH Youth
              </h3>
              <p className="leading-relaxed mb-6" style={{color: 'var(--color-light)', opacity: 0.8}}>
                Muslim Association of Hamilton Youth - Connecting and empowering young Muslims through faith, community, and service.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      ref={addToSocialRefs}
                      className="bg-accent w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                    >
                      <IconComponent 
                        className="bg-accent w-5 h-5 transition-colors duration-300"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1" ref={addToLinksRefs}>
            <h4 className="text-lg font-semibold mb-6 relative" style={{color: 'var(--color-light)'}}>
              Quick Links
              <div 
                className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full"
                style={{backgroundColor: 'var(--color-accent)'}}
              ></div>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-300 flex items-center group"
                    style={{color: 'var(--color-light)', opacity: 0.7}}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                  >
                    <span className="w-2 h-2 rounded-full mr-3 transition-all duration-300 group-hover:scale-125" style={{backgroundColor: 'var(--color-accent)', opacity: 0.5}}></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="lg:col-span-1" ref={addToLinksRefs}>
            <h4 className="text-lg font-semibold mb-6 relative" style={{color: 'var(--color-light)'}}>
              Programs
              <div 
                className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full"
                style={{backgroundColor: 'var(--color-accent)'}}
              ></div>
            </h4>
            <ul className="space-y-4">
              {programLinks.map((program, index) => {
                const IconComponent = program.icon;
                return (
                  <li key={index}>
                    <Link
                      href={program.href}
                      className="text-white transition-all duration-300 flex items-center group hover:translate-x-2"
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                    >
                      <div 
                        className="bg-accent w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300"
                      >
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span>{program.name}</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1" ref={addToLinksRefs}>
            <h4 className="text-lg font-semibold mb-6 relative" style={{color: 'var(--color-light)'}}>
              Get In Touch
              <div 
                className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full"
                style={{backgroundColor: 'var(--color-accent)'}}
              ></div>
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <li key={index}>
                    <Link
                      href={contact.href}
                      className="text-white transition-all duration-300 flex items-center group"
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                    >
                      <div 
                        className="bg-accent w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300"
                      >
                        <IconComponent className="w-4 h-4" style={{color: 'var(--color-accent-light)'}} />
                      </div>
                      <span className="text-sm leading-relaxed">{contact.text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8" style={{borderTop: '1px solid var(--border-light)'}}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm mb-4 md:mb-0 flex items-center" style={{color: 'var(--color-light)', opacity: 0.6}}>
              <span>© 2025 Muslim Association of Hamilton Youth. All rights reserved.</span>           
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;