'use client';

import React from 'react';

/**
 * SkeletonEvents Component
 * Displays 3 skeleton event cards with cool loading animations
 * Features:
 * - Pulsing animated background gradients
 * - Shimmer effect for visual interest
 * - Staggered animation delays for each card
 * - Floating elements for dynamic feel
 */
const SkeletonEvents = () => {
  return (
    <>
      {/* Desktop Version - Hidden on mobile */}
      <section className="team hidden lg:block relative h-screen w-full pt-[8vh] pb-[1vh] px-[2rem] overflow-visible bg-gradient-to-b from-primary to-primary-light" style={{ zIndex: 100 }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-light/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        {/* Loading Text */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-accent-light rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-white/70 font-medium">Loading events...</span>
          </div>
        </div>

        <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {[1, 2, 3].map((index) => (
            <div 
              key={index} 
              className="team-member relative h-full border-2 border-dashed border-accent/30 rounded-2xl overflow-visible"
              style={{ 
                zIndex: 4 - index,
                animation: `fadeInScale 0.6s ease-out forwards`,
                animationDelay: `${index * 0.15}s`,
                opacity: 0,
              }}
            >
              {/* Animated background number with glow */}
              <div className="team-member-name-initial absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                   style={{ zIndex: 0 }}>
                <h1 
                  className='text-accent text-[150px] font-bold'
                  style={{
                    animation: `pulseGlow 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.3}s`,
                    opacity: 0.15,
                    transform: 'scale(2)',
                  }}
                >
                  {index}
                </h1>
              </div>

              {/* Main skeleton card with gradient animation */}
              <div 
                className='team-member-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl flex flex-col items-center shadow-xl overflow-hidden'
                style={{ zIndex: 10 + (4 - index) }}
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-shimmer-slow"></div>

                {/* Skeleton Image with wave effect */}
                <div className="max-h-1/2 relative overflow-hidden flex-shrink-0 m-[2rem] w-[calc(100%-4rem)] rounded-2xl border-2 border-accent-dark/50 bg-gradient-to-br from-gray-800 to-gray-900" style={{ height: '40%' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-light/20 to-transparent animate-shimmer"></div>
                  {/* Loading icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-accent/50 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                
                {/* Skeleton Content with staggered animations */}
                <div className="flex-1 p-6 w-full space-y-4">
                  {/* Title skeleton with wave */}
                  <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                  </div>
                  
                  {/* Details skeleton with progressive loading effect */}
                  <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-accent-light/50 rounded-full mr-3 flex-shrink-0 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                        <div className="relative h-4 bg-gray-800 rounded overflow-hidden" style={{ width: `${60 - i * 10}%` }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent animate-shimmer" style={{ animationDelay: `${i * 0.15}s` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description skeleton with multiple bars */}
                  <div className="border-t border-gray-800 pt-4 space-y-2">
                    {[100, 85, 75].map((width, i) => (
                      <div key={i} className="relative h-3 bg-gray-800 rounded overflow-hidden" style={{ width: `${width}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent animate-shimmer" style={{ animationDelay: `${0.3 + i * 0.1}s` }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Version - Vertical Scroll Cards */}
      <section className="lg:hidden min-h-screen py-20 px-4 bg-gradient-to-b from-primary to-primary-light relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-accent-light/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        {/* Mobile Header with animated loading */}
        <div className="text-center mb-12 relative">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Upcoming Events
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-16 h-1 bg-gradient-to-r from-accent to-accent-light rounded-full">
              <div className="h-full bg-white/50 rounded-full animate-shimmer-fast"></div>
            </div>
            <div className="w-2 h-2 bg-accent-light rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <p className="text-white/70 text-sm mt-4">Loading exciting events for you...</p>
        </div>

        {/* Mobile Skeleton Cards with enhanced animations */}
        <div className="space-y-8 max-w-md mx-auto relative">
          {[1, 2, 3].map((index) => (
            <div 
              key={index}
              className="relative group"
              style={{
                animation: `fadeInUp 0.6s ease-out forwards`,
                animationDelay: `${index * 0.15}s`,
                opacity: 0,
              }}
            >
              {/* Card Number Badge with pulse */}
              <div className="absolute -top-4 -left-4 z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/60 to-accent-light/60 rounded-full flex items-center justify-center shadow-lg border-4 border-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  <span className="text-2xl font-black text-white/70 relative z-10">{index}</span>
                </div>
              </div>

              {/* Skeleton Card with gradient animation */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 relative">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-shimmer-slow pointer-events-none z-10"></div>

                {/* Skeleton Image Section with wave */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-light/20 to-transparent animate-shimmer"></div>
                  {/* Center loading spinner */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-accent/50 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>

                {/* Skeleton Content Section */}
                <div className="p-6 relative">
                  {/* Event Details Skeleton with staggered animation */}
                  <div className="space-y-3 mb-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-5 h-5 bg-accent-light/30 rounded mr-3 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 0.2}s` }}></div>
                        <div className="relative h-4 bg-gray-800 rounded overflow-hidden flex-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent animate-shimmer" style={{ animationDelay: `${i * 0.15}s` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-shimmer-fast"></div>
                  </div>

                  {/* Description Skeleton with wave effect */}
                  <div className="space-y-2">
                    {[100, 85, 75].map((width, i) => (
                      <div key={i} className="relative h-3 bg-gray-800 rounded overflow-hidden" style={{ width: `${width}%` }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent animate-shimmer" style={{ animationDelay: `${0.2 + i * 0.1}s` }}></div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button Skeleton with shimmer */}
                  <div className="relative w-full mt-6 h-12 bg-gradient-to-r from-accent/40 to-accent-light/40 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

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

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.1;
            filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
          }
          50% {
            opacity: 0.2;
            filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5));
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(1.1);
          }
          66% {
            transform: translate(20px, -20px) scale(0.9);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-shimmer-slow {
          animation: shimmer 3s infinite;
        }

        .animate-shimmer-fast {
          animation: shimmer 1.5s infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default SkeletonEvents;
