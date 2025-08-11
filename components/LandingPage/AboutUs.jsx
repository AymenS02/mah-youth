'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

const AboutUs = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const missionTextRef = useRef(null);
  const logoRef = useRef(null);
  const decorativeElementsRef = useRef([]);
  const highlightWordsRef = useRef([]);

  useEffect(() => {
    // Create GSAP timeline for coordinated animations
    const tl = gsap.timeline({ delay: 0.3 });
    
    // Set initial states
    gsap.set([titleRef.current, missionTextRef.current, logoRef.current], {
      opacity: 0,
      y: 50
    });
    
    gsap.set(decorativeElementsRef.current, {
      scale: 0,
      rotation: 45
    });

    // Set initial color for highlight words
    gsap.set(highlightWordsRef.current, {
      color: "#374151", // gray-700 equivalent
      textShadow: "none"
    });

    // Animate title
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    // Animate mission text
    .to(missionTextRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.3")
    // Animate logo with bounce
    .to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.5")
    // Animate decorative elements
    .to(decorativeElementsRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1
    }, "-=0.8");

    // Highlight key words animation
    const highlightTl = gsap.timeline({ repeat: -1, delay: 2 });
    
    highlightTl.to(highlightWordsRef.current, {
      color: "#EAA64D",
      textShadow: "0 0 10px rgba(234, 166, 77, 0.3)",
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.3,
    })
    .to(highlightWordsRef.current, {
      color: "#374151",
      textShadow: "none",
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.3,
    }, "+=0.5");

    // Floating animation for logo
    gsap.to(logoRef.current, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 3
    });

    // Cleanup function
    return () => {
      tl.kill();
      highlightTl.kill();
      gsap.killTweensOf(logoRef.current);
    };
  }, []);

  const addToRefs = (el, refsArray) => {
    if (el && !refsArray.current.includes(el)) {
      refsArray.current.push(el);
    }
  };

  return (
    <div className='pt-20 relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div 
          ref={el => addToRefs(el, decorativeElementsRef)}
          className='hidden sm:block absolute top-20 left-20 w-32 h-32 bg-emerald-200 rounded-full opacity-20'
        ></div>
        <div 
          ref={el => addToRefs(el, decorativeElementsRef)}
          className='hidden sm:block absolute top-40 right-32 w-24 h-24 bg-blue-200 rounded-full opacity-20'
        ></div>
        <div 
          ref={el => addToRefs(el, decorativeElementsRef)}
          className='absolute bottom-32 left-40 w-20 h-20 bg-purple-200 rounded-full opacity-20'
        ></div>
        <div 
          ref={el => addToRefs(el, decorativeElementsRef)}
          className='absolute bottom-20 right-20 w-28 h-28 bg-yellow-200 rounded-full opacity-20'
        ></div>
      </div>

      <div ref={containerRef} className='relative z-10 flex flex-col xl:flex-row items-center justify-around gap-12 px-8 w-full lg:mx-[200px]'>
        
        {/* Mission Content */}
        <div className='flex-1 text-center lg:text-left max-w-2xl'>
          <h1 
            ref={titleRef}
            className='text-5xl lg:text-6xl font-bold text-gray-800 mb-8 leading-tight'
          >
            Our <span className='text-accent'>Mission</span>
          </h1>
          
          <div 
            ref={missionTextRef} 
            className='text-xl lg:text-2xl text-gray-700 leading-relaxed space-y-2'
          >
            <p>
              To <span ref={el => addToRefs(el, highlightWordsRef)} className='font-semibold'>awaken</span> and <span ref={el => addToRefs(el, highlightWordsRef)} className='font-semibold'>empower</span> Muslim youth to firmly uphold and defend their religion on all fronts, combating deviations, doubts, and innovations while manifesting <span ref={el => addToRefs(el, highlightWordsRef)} className='font-semibold'>knowledge</span> into <span ref={el => addToRefs(el, highlightWordsRef)} className='font-semibold'>action</span> through purposeful initiatives.
            </p>
          </div>

          {/* Mission pillars */}
          <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='text-primary text-3xl mb-3'>🌟</div>
              <h3 className='font-bold text-gray-800 mb-2'>Awaken</h3>
              <p className='text-gray-600 text-sm'>Inspiring consciousness and awareness</p>
            </div>
            <div className='bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='text-primary text-3xl mb-3'>💪</div>
              <h3 className='font-bold text-gray-800 mb-2'>Empower</h3>
              <p className='text-gray-600 text-sm'>Building strength and capability</p>
            </div>
            <div className='bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2'>
              <div className='text-primary text-3xl mb-3'>⚡</div>
              <h3 className='font-bold text-gray-800 mb-2'>Action</h3>
              <p className='text-gray-600 text-sm'>Transforming knowledge into impact</p>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className='flex-shrink-0'>
          <div 
            ref={logoRef}
            className='relative group cursor-pointer'
          >
            {/* Glowing background effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 scale-110'></div>
            
            {/* Logo container */}
            <div className='relative bg-white/90 backdrop-blur-sm p-8 rounded-full shadow-2xl border-4 border-white/50 group-hover:border-blue-200 transition-all duration-300 group-hover:shadow-primary'>
              <Image 
                width={2000}
                height={2000}
                src="/logo.png" 
                alt="Logo" 
                className='w-[20vw] object-contain transition-transform duration-300 group-hover:scale-110 rounded-full'
              />
            </div>

            {/* Orbiting elements */}
            <div className='absolute top-0 left-1/2 w-4 h-4 bg-emerald-400 rounded-full -translate-x-1/2 -translate-y-2 opacity-60 animate-pulse'></div>
            <div className='absolute bottom-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full -translate-x-1/2 translate-y-2 opacity-60 animate-pulse' style={{animationDelay: '1s'}}></div>
            <div className='absolute top-1/2 left-0 w-3 h-3 bg-purple-400 rounded-full -translate-y-1/2 -translate-x-2 opacity-60 animate-pulse' style={{animationDelay: '2s'}}></div>
            <div className='absolute top-1/2 right-0 w-4 h-4 bg-yellow-400 rounded-full -translate-y-1/2 translate-x-2 opacity-60 animate-pulse' style={{animationDelay: '3s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;