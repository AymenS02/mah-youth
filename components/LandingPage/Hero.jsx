'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const logoRef = useRef(null)
  const arrowRef = useRef(null)
  const quoteRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const animationsRef = useRef([])

  useEffect(() => {
    // Check if it's mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // Changed to 1024 for better tablet support
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const logo = logoRef.current
    const arrow = arrowRef.current
    const quote = quoteRef.current

    // Clear previous animations
    animationsRef.current.forEach(anim => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill()
      anim.kill()
    })
    animationsRef.current = []

    if (!logo) return

    // Timeline for drop in + hover
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: logo,
        start: "top 80%",
        once: true
      }
    })

    // Drop in
    tl.fromTo(logo,
      { y: "-150%", opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
      }
    )

    // Hover loop after drop
    tl.to(logo, {
      y: -20,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    })

    animationsRef.current.push(tl)

    // Quote animation (desktop only)
    if (quote && !isMobile) {
      const quoteAnim = gsap.fromTo(quote,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.8,
          ease: "power2.out"
        }
      )
      animationsRef.current.push(quoteAnim)
    }

    // Arrow animation
    if (arrow) {
      const arrowAnim = gsap.fromTo(arrow,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1.5,
          ease: "power2.out"
        }
      )
      animationsRef.current.push(arrowAnim)

      // Bouncing arrow animation
      const arrowBounce = gsap.to(arrow, {
        y: 10,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.3
      })
      animationsRef.current.push(arrowBounce)
    }

    // Cleanup function
    return () => {
      animationsRef.current.forEach(anim => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill()
        anim.kill()
      })
      animationsRef.current = []
    }
  }, [isMobile])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Decorative corner elements - responsive sizing */}
      <div className="absolute top-24 left-4 sm:left-8 w-12 h-12 sm:w-20 sm:h-20 border-t-2 border-l-2 border-white/10 rounded-tl-2xl"></div>
      <div className="absolute top-24 right-4 sm:right-8 w-12 h-12 sm:w-20 sm:h-20 border-t-2 border-r-2 border-white/10 rounded-tr-2xl"></div>
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-20 sm:h-20 border-b-2 border-l-2 border-white/10 rounded-bl-2xl"></div>
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-20 sm:h-20 border-b-2 border-r-2 border-white/10 rounded-br-2xl"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-12 xl:gap-20 w-full max-w-7xl relative z-10">
        {/* Logo Section */}
        <div className='flex justify-center w-full lg:w-auto relative mb-8 lg:mb-0'>
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] xl:w-[550px] xl:h-[550px] bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative">
            <Image
              ref={logoRef}
              className="logo w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[500px] flex-shrink-0 drop-shadow-2xl"
              src="/logoA.png"
              alt="Hero Image"
              width={600}
              height={600}
              priority
            />
          </div>
        </div>

        {/* Quote Section - Hidden on mobile/tablet */}
        {!isMobile && (
          <div 
            ref={quoteRef}
            className="text-white flex flex-col items-start max-w-2xl xl:max-w-4xl relative opacity-0"
          >
            {/* Decorative quote mark */}
            <div className="absolute -top-6 -left-6 lg:-top-8 lg:-left-8 text-white/10 text-6xl lg:text-8xl font-serif">"</div>
            
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl">
              <p className="text-lg lg:text-2xl xl:text-4xl mb-6 leading-relaxed text-right font-arabic" style={{ fontFamily: 'var(--font-arabic, serif)' }}>
                إِنَّمَا ٱلۡمُؤۡمِنُونَ إِخۡوَةٞ فَأَصۡلِحُواْ بَيۡنَ أَخَوَيۡكُمۡۚ وَٱتَّقُواْ ٱللَّهَ لَعَلَّكُمۡ تُرۡحَمُونَ
              </p>
              
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
              
              <p className="text-base lg:text-lg xl:text-xl text-white/80 leading-relaxed italic">
                "The believers are but brothers, so make settlement between your brothers. And fear Allah that you may receive mercy."
              </p>

              {/* Surah reference */}
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <span className="text-xs text-white/70 font-medium">Surah Al-Hujurat (49:10)</span>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 lg:w-16 lg:h-16 border-b-2 border-r-2 border-white/20 rounded-br-2xl"></div>
            </div>
          </div>
        )}

        {/* Mobile Quote - Simplified version */}
        {isMobile && (
          <div 
            ref={quoteRef}
            className="text-white flex flex-col items-center max-w-md relative px-4"
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
              <p className="text-base sm:text-lg mb-4 leading-relaxed text-right font-arabic" style={{ fontFamily: 'var(--font-arabic, serif)' }}>
                إِنَّمَا ٱلۡمُؤۡمِنُونَ إِخۡوَةٞ
              </p>
              
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
              
              <p className="text-sm sm:text-base text-white/80 leading-relaxed italic text-center">
                "The believers are but brothers"
              </p>

              {/* Surah reference */}
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full mx-auto">
                <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                <span className="text-xs text-white/70 font-medium">Surah Al-Hujurat (49:10)</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced scroll down arrow */}
      <div 
        ref={arrowRef}
        className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <p className="text-xs text-white/50 uppercase tracking-wider font-medium group-hover:text-white/70 transition-colors">
          Scroll Down
        </p>
        <div className="relative flex flex-col items-center">
          {/* Animated line */}
          <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-transparent via-white/30 to-white/60 mb-2"></div>
          
          {/* Arrow icon with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-colors"></div>
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="sm:w-8 sm:h-8 text-white/70 group-hover:text-white transition-colors relative z-10"
            >
              <path 
                d="M7 10L12 15L17 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating particles (optional decorative elements) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}

export default Hero