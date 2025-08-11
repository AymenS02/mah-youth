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

  useEffect(() => {
    // Only run animations if all refs are available
    if (titleRef.current && cardsRef.current.length > 0 && ctaRef.current) {
      // GSAP Animation Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });

      // Set initial states
      gsap.set([titleRef.current, ctaRef.current], {
        opacity: 0,
        y: 50
      });

      gsap.set(cardsRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.8
      });

      // Animate title
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      // Animate cards with stagger
      .to(cardsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.2)",
        stagger: 0.15
      }, "-=0.4")
      // Animate CTA button
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3");
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf([titleRef.current, ctaRef.current, ...cardsRef.current]);
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
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Articles & Blog",
      description: "In-depth articles on Islamic topics and contemporary issues",
      icon: BookOpen,
      link: "/pages/articles",
      gradient: "from-emerald-500 to-accent",
      hoverGradient: "from-accent to-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-accent"
    },
    {
      title: "Videos",
      description: "Educational YouTube videos and Islamic lectures",
      icon: Play,
      link: "/pages/videos",
      gradient: "from-red-500 to-red-600",
      hoverGradient: "from-red-600 to-red-700",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-200 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 text-shadow-2xs/10"
          >
            Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-accent">Resources</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-accent mx-auto rounded-full"></div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <Link
                key={index}
                href={resource.link}
                className="group relative overflow-hidden"
              >
                <div 
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
                  ref={addToCardRefs}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                  
                  {/* Icon */}
                  <div className={`${resource.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    <IconComponent className={`w-8 h-8 ${resource.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700">
                      {resource.description}
                    </p>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/resources"
            ref={ctaRef}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-accent hover:from-blue-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <span className="text-lg">Explore All Resources</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeResources;