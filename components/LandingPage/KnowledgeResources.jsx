'use client'

import React, { useEffect, useRef } from 'react'
import { FileText, BookOpen, Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const KnowledgeResources = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Simple background animation - no particle effects needed
  }, []);

  const resources = [
    {
      title: "PDF Books",
      description: "Free Islamic books and educational materials for download",
      icon: FileText,
      link: "/pages/books",
      iconBg: "bg-blue-50"
    },
    {
      title: "Articles & Blog", 
      description: "In-depth articles on Islamic topics and contemporary issues",
      icon: BookOpen,
      link: "/pages/articles",
      iconBg: "bg-amber-50"
    },
    {
      title: "Videos",
      description: "Educational YouTube videos and Islamic lectures",
      icon: Play,
      link: "/pages/videos",
      iconBg: "bg-blue-50"
    },
  ];

  return (
    <div 
      ref={containerRef}
      className='relative min-h-screen overflow-hidden bg-gray-100'
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
        <div className="text-center mb-16 sm:mb-20">
          <div className="relative">            
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Discover</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 relative inline-block">
                <span className="relative z-10 text-gray-800">
                  Knowledge{' '}
                </span>
                <span className="relative block sm:inline mt-2 sm:mt-0 bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                  Resources
                </span>
                
                {/* Simple underline */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full"></div>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
                Explore our comprehensive collection of Islamic educational materials designed to enlighten and inspire
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Resource Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full'>
          {resources.map((resource, index) => (
            <div
              key={index}
              className='group relative'
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <Link
                href={resource.link}
                className='relative block p-8 sm:p-10 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 group-hover:-translate-y-2'
              >
                {/* Icon container */}
                <div className="mb-6">
                  <div className={`w-16 h-16 ${resource.iconBg} rounded-2xl mx-auto flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm`}>
                    <resource.icon className='h-8 w-8 text-blue-600 transition-transform duration-300 group-hover:scale-105' />
                  </div>
                </div>
                
                <h3 className='text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-700 transition-colors duration-300'>
                  {resource.title}
                </h3>
                
                <p className='text-gray-600 leading-relaxed mb-6'>
                  {resource.description}
                </p>
                
                {/* Clean CTA */}
                <div className="flex items-center justify-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-all duration-300">
                  <span className="mr-2">Explore Now</span>
                  <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Simple bottom decorative element */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-0.5 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-12 h-0.5 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes wave-1 {
          0%, 100% { 
            d: path("M0,400 Q300,300 600,400 T1200,400 V800 H0 V400");
          }
          50% { 
            d: path("M0,450 Q300,350 600,450 T1200,450 V800 H0 V450");
          }
        }
        
        @keyframes wave-2 {
          0%, 100% { 
            d: path("M0,500 Q300,450 600,500 T1200,500 V800 H0 V500");
          }
          50% { 
            d: path("M0,480 Q300,430 600,480 T1200,480 V800 H0 V480");
          }
        }
        
        .animate-wave-1 {
          animation: wave-1 8s ease-in-out infinite;
        }
        
        .animate-wave-2 {
          animation: wave-2 10s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  )
}

export default KnowledgeResources