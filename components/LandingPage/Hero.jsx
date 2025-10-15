'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const logoRef = useRef(null)
  const arrowRef = useRef(null)
  const quoteRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if it's mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const logo = logoRef.current
    const arrow = arrowRef.current
    const quote = quoteRef.current

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
        ease: "ease.inOut",
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

    // Quote animation (desktop only)
    if (quote && !isMobile) {
      gsap.fromTo(quote,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.8,
          ease: "power2.out"
        }
      )
    }

    // Arrow animation
    if (arrow) {
      gsap.fromTo(arrow,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1.5,
          ease: "power2.out"
        }
      )

      // Bouncing arrow animation
      gsap.to(arrow, {
        y: 10,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.3
      })
    }
  }, [isMobile])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-white/10 rounded-tl-2xl"></div>
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-2xl"></div>
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-white/10 rounded-bl-2xl"></div>
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-white/10 rounded-br-2xl"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="flex items-center justify-center lg:gap-20 flex-wrap relative z-10">
        <div className='flex justify-center w-full relative'>
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[350px] h-[350px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] xl:w-[550px] xl:h-[550px] bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative">
            <Image
              ref={logoRef}
              className="logo w-[300px] sm:w-[150px] md:w-[250px] lg:w-[350px] xl:w-[500px] flex-shrink-0 drop-shadow-2xl"
              src={isMobile ? "/logoA.png" : "/logoA.png"}
              alt="Hero Image"
              width={600}
              height={600}
            />
          </div>
        </div>

        {!isMobile && (
          <div 
            ref={quoteRef}
            className="text-white flex flex-col items-start max-w-4xl relative"
          >
            {/* Decorative quote mark */}
            <div className="absolute -top-8 -left-8 text-white/10 text-8xl font-serif">"</div>
            
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
              <p className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-4xl mb-6 leading-relaxed text-right font-arabic" style={{ fontFamily: 'var(--font-arabic, serif)' }}>
                إِنَّمَا ٱلۡمُؤۡمِنُونَ إِخۡوَةٞ فَأَصۡلِحُواْ بَيۡنَ أَخَوَيۡكُمۡۚ وَٱتَّقُواْ ٱللَّهَ لَعَلَّكُمۡ تُرۡحَمُونَ
              </p>
              
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-relaxed italic">
                "The believers are but brothers, so make settlement between your brothers. And fear Allah that you may receive mercy."
              </p>

              {/* Surah reference */}
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <span className="text-xs text-white/70 font-medium">Surah Al-Hujurat (49:10)</span>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-white/20 rounded-br-2xl"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced scroll down arrow */}
      <div 
        ref={arrowRef}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <p className="text-xs text-white/50 uppercase tracking-wider font-medium group-hover:text-white/70 transition-colors">
          Scroll Down
        </p>
        <div className="relative flex flex-col items-center">
          {/* Animated line */}
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-white/60 mb-2"></div>
          
          {/* Arrow icon with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md group-hover:bg-white/30 transition-colors"></div>
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white/70 group-hover:text-white transition-colors relative z-10"
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