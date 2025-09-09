'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  Play, 
  Mail, 
  Twitter, 
  Youtube,
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
    { name: 'Contact', href: '/pages/contact' },
  ];

  const resourceLinks = [
    { name: 'PDF Books', href: '/pages/books', icon: FileText },
    { name: 'Articles & Blog', href: '/pages/articles', icon: BookOpen },
    { name: 'Videos', href: '/pages/videos', icon: Play }
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://x.com/RibatFoundation', icon: Twitter },
    { name: 'YouTube', href: 'https://www.youtube.com/@RibatFoundation', icon: Youtube }
  ];

  const contactInfo = [
    { icon: Mail, text: 'ar-ribat@tuta.com', href: 'mailto:ar-ribat@tuta.com' },
  ];

  return (
    <footer ref={footerRef} className="relative overflow-hidden" style={{background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #1a202c 100%)'}}>
      {/* Animated background pattern */}
      <div ref={backgroundRef} className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 800 600">
          <defs>
            <pattern id="footerPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="25" fill="none" stroke="#EAA64D" strokeWidth="1" opacity="0.3"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="#0D5EA6" strokeWidth="1" opacity="0.4"/>
              <circle cx="50" cy="50" r="5" fill="#EAA64D" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerPattern)"/>
        </svg>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-4 h-4 rounded-full animate-pulse" style={{backgroundColor: '#EAA64D', animationDelay: '0s', opacity: 0.6}}></div>
      <div className="absolute top-20 right-20 w-6 h-6 rounded-full an=mate-pulse" style={{backgroundColor: '#0D5EA6', animationDelay: '2s', opacity: 0.4}}></div>
      <div className="absolute bottom-20 left-1/4 w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: '#EAA64D', animationDelay: '1s', opacity: 0.5}}></div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group z-20"
        style={{
          background: 'linear-gradient(135deg, #EAA64D 0%, #f59e0b 100%)',
          boxShadow: '0 4px 20px rgba(234, 166, 77, 0.3)'
        }}
      >
        <ChevronUp className="w-6 h-6 text-white group-hover:animate-bounce" />
      </button>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1" ref={addToLinksRefs}>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Islamic
                <span 
                  style={{
                    background: 'linear-gradient(135deg, #EAA64D 0%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Knowledge
                </span>
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Dedicated to spreading authentic Islamic knowledge through accessible educational resources and materials.
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
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 group"
                      style={{backgroundColor: '#0D5EA6' + '22'}}
                    >
                      <IconComponent 
                        className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" 
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1" ref={addToLinksRefs}>
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Quick Links
              <div 
                className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full"
                style={{backgroundColor: '#EAA64D'}}
              ></div>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 rounded-full mr-3 transition-all duration-300 group-hover:scale-125" style={{backgroundColor: '#EAA64D', opacity: 0.5}}></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-1" ref={addToLinksRefs}>
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Resources
              <div 
                className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full"
                style={{backgroundColor: '#EAA64D'}}
              ></div>
            </h4>
            <ul className="space-y-4">
              {resourceLinks.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <li key={index}>
                    <Link
                      href={resource.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group hover:translate-x-2"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300"
                        style={{backgroundColor: '#0D5EA6' + '22'}}
                      >
                        <IconComponent className="w-4 h-4" style={{color: '#EAA64D'}} />
                      </div>
                      <span>{resource.name}</span>
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1" ref={addToLinksRefs}>
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Get In Touch
              <div 
                className="absolute -bottom-2 left-0 w-12 h-0.5 rounded-full"
                style={{backgroundColor: '#EAA64D'}}
              ></div>
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <li key={index}>
                    <Link
                      href={contact.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 flex items-start group"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300"
                        style={{backgroundColor: '#EAA64D' + '22'}}
                      >
                        <IconComponent className="w-4 h-4" style={{color: '#0D5EA6'}} />
                      </div>
                      <span className="text-sm leading-relaxed">{contact.text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Newsletter Signup */}
            {/* <div className="mt-8 p-4 rounded-xl" style={{backgroundColor: '#0D5EA6' + '11', border: '1px solid ' + '#0D5EA6' + '22'}}>
              <h5 className="text-white font-semibold mb-3">Stay Updated</h5>
              <p className="text-gray-300 text-sm mb-4">Subscribe to our newsletter for the latest resources and updates.</p>
              <Link
                href="/newsletter"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 hover:scale-105"
                style={{background: 'linear-gradient(135deg, #EAA64D 0%, #f59e0b 100%)'}}
              >
                Subscribe Now
                <Mail className="w-4 h-4 ml-2" />
              </Link>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center">
              <span>© 2025 Islamic Knowledge Platform.</span>           
            </div>
            
            {/* <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Sitemap
              </Link>
            </div> */}
          </div>

          {/* Decorative bottom line */}
          <div className="mt-6 flex justify-center">
            <div 
              className="w-32 h-1 rounded-full"
              style={{background: 'linear-gradient(90deg, transparent 0%, #EAA64D 20%, #0D5EA6 50%, #EAA64D 80%, transparent 100%)'}}
            ></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;