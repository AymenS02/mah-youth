'use client';

import React from 'react';

/**
 * SkeletonEvents Component
 * Displays 3 skeleton event cards while data is loading
 * Matches the layout and dimensions of real event cards
 */
const SkeletonEvents = () => {
  return (
    <>
      {/* Desktop Version - Hidden on mobile */}
      <section className="team hidden lg:block relative h-screen w-full pt-[8vh] pb-[1vh] px-[2rem] overflow-visible bg-gradient-to-b from-primary to-primary-light" style={{ zIndex: 100 }}>
        <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div 
              key={index} 
              className="team-member relative h-full border-2 border-dashed border-gray-500 rounded-2xl overflow-visible"
              style={{ zIndex: 4 - index }}
            >
              {/* Centered overlapping number - Behind cards */}
              <div className="team-member-name-initial absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                   style={{ zIndex: 0 }}>
                <h1 className='text-accent/20 text-[300px] font-bold animate-pulse'>{index}</h1>
              </div>

              {/* Main skeleton card */}
              <div 
                className='team-member-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] bg-gradient-to-br from-gray-900 to-black rounded-2xl flex flex-col items-center shadow-xl'
                style={{ zIndex: 10 + (4 - index) }}
              >
                {/* Skeleton Image */}
                <div className="max-h-1/2 relative overflow-hidden flex-shrink-0 m-[2rem] w-[calc(100%-4rem)] rounded-2xl border-2 border-accent-dark bg-gray-800 animate-pulse" style={{ height: '40%' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer"></div>
                </div>
                
                {/* Skeleton Content */}
                <div className="flex-1 p-6 w-full space-y-4">
                  {/* Title skeleton */}
                  <div className="h-8 bg-gray-800 rounded-lg animate-pulse w-3/4"></div>
                  
                  {/* Details skeleton */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-accent-light/50 rounded-full mr-3 flex-shrink-0"></span>
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-accent-light/50 rounded-full mr-3 flex-shrink-0"></span>
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-accent-light/50 rounded-full mr-3 flex-shrink-0"></span>
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>

                  {/* Description skeleton */}
                  <div className="border-t border-gray-800 pt-4 space-y-2">
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-5/6"></div>
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Version - Vertical Scroll Cards */}
      <section className="lg:hidden min-h-screen py-20 px-4 bg-gradient-to-b from-primary to-primary-light">
        {/* Mobile Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Upcoming Events
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-accent to-accent-light rounded-full"></div>
            <div className="w-2 h-2 bg-accent-light rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Mobile Skeleton Cards */}
        <div className="space-y-8 max-w-md mx-auto">
          {[1, 2, 3].map((index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Card Number Badge */}
              <div className="absolute -top-4 -left-4 z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/50 to-accent-light/50 rounded-full flex items-center justify-center shadow-lg border-4 border-primary animate-pulse">
                  <span className="text-2xl font-black text-white/50">{index}</span>
                </div>
              </div>

              {/* Skeleton Card */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
                {/* Skeleton Image Section */}
                <div className="relative h-48 bg-gray-800 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer"></div>
                </div>

                {/* Skeleton Content Section */}
                <div className="p-6">
                  {/* Event Details Skeleton */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-accent-light/30 rounded mr-3 animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-accent-light/30 rounded mr-3 animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-accent-light/30 rounded mr-3 animate-pulse"></div>
                      <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4"></div>

                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-5/6"></div>
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-4/5"></div>
                  </div>

                  {/* CTA Button Skeleton */}
                  <div className="w-full mt-6 h-12 bg-gradient-to-r from-accent/50 to-accent-light/50 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default SkeletonEvents;
