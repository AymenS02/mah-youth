'use client'

import React, { useEffect, useRef } from 'react'
import { MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ContactUsSection = () => {


  return (
    <div 
      className='relative min-h-screen overflow-hidden bg-primary'
    >
      {/* Elegant wave background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0D5EA6" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#EAA64D" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EAA64D" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#0D5EA6" stopOpacity="0.08"/>
            </linearGradient>
          </defs>
          
          <path
            d="M0,400 Q300,300 600,400 T1200,400 V800 H0 V400"
            fill="url(#wave1)"
            className="animate-wave-1"
          />
          <path
            d="M0,500 Q300,450 600,500 T1200,500 V800 H0 V500"
            fill="url(#wave2)"
            className="animate-wave-2"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className='relative z-10 px-6 sm:px-10 py-20 flex flex-col items-center justify-center min-h-screen text-center'>
        
        {/* Section Header with enhanced styling */}
          <div className="mb-12">
            <h2 
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
      </div>

    </div>
  )
}

export default ContactUsSection