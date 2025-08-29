'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const logoRef = useRef(null)
  const arrowRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if it's mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // 640px is the 'sm' breakpoint in Tailwind
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const logo = logoRef.current
    const arrow = arrowRef.current

    // Timeline for drop in + hover
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: logo,        // watch the logo
        start: "top 80%",     // when top of logo is 80% down the viewport
        once: true            // only trigger once
      }
    })

    // Drop in
    tl.fromTo(logo,
      { y: "-150%", opacity: 0 }, // start far above its natural position
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

    // Arrow animation - starts after logo animation
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
  }, [])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-8 lg:p-12 relative">
      <div className="flex items-center justify-center lg:gap-20 flex-wrap">
        <div className=''>
          <Image
            ref={logoRef}
            className="logo w-[300px] sm:w-[150px] md:w-[250px] lg:w-[350px] xl:w-[500px] flex-shrink-0"
            src={isMobile ? "/logoB.png" : "/caliO.png"}
            alt="Hero Image"
            width={600}
            height={600}
          />
        </div>
        {!isMobile && (
          <div className="text-white flex flex-col items-start max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-shadow-sm/20">
              Ar Ribat
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-4xl mt-10 text-shadow-sm/20 leading-relaxed">
              يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱصْبِرُوا۟ وَصَابِرُوا۟ وَرَابِطُوا۟
              وَٱتَّقُوا۟ ٱللَّهَ لَعَلَّكُمْ تُفْلِحُونَ
            </p>
            <p>"O you who have believed, persevere and endure and remain stationed and fear Allāh that you may be successful."</p>
          </div>
        )}
      </div>
      
      {/* Scroll down arrow */}
      <div 
        ref={arrowRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-white/70 hover:text-white transition-colors cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <path 
            d="M7 10L12 15L17 10" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-xs text-white/50 mt-1 text-center">scroll</p>
      </div>
    </div>
  )
}

export default Hero