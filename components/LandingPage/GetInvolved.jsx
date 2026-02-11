'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const GetInvolved = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const router = useRouter();

  const handleClick = () => {
      router.push("/pages/contact"); 
      window.scrollTo(0, 0); // Then scroll to top
    };
  const opportunities = [
    {
      title: "Volunteer",
      description: "Help organize events and support our community programs",
      icon: "🤝",
      action: "Sign Up",
    },
    {
      title: "Join Leadership",
      description: "Become part of the youth leadership team and make an impact",
      icon: "⭐",
      action: "Apply Now",
    },
    {
      title: "Suggest Ideas",
      description: "Have an idea for an event or program? We want to hear it!",
      icon: "💡",
      action: "Share Ideas",
    },
  ];

  return (
    <section className="min-h-screen py-20 bg-gradient-to-b from-primary-dark to-primary-light relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Get Involved
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Be an active part of our thriving youth community and make a lasting impact
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-2xl transition-all duration-300 flex flex-col items-center border-2 border-gray-700 hover:border-white/20 transform hover:-translate-y-1 h-full">
                
                {/* Icon Container */}
                <div className="relative mb-6 z-10">
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300 shadow-lg">
                    <span className="text-5xl">
                      {opportunity.icon}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col items-center w-full">
                  <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {opportunity.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 flex-grow text-center leading-relaxed">
                    {opportunity.description}
                  </p>
                  
                  {/* CTA Button */}
                  <button onClick={handleClick} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    <span>{opportunity.action}</span>
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-12">
          <div onClick={handleClick} className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-6 shadow-xl">
            <p className="text-lg text-gray-300 mb-2">
              Not sure where to start?
            </p>
            <button className="text-xl font-bold text-white hover:text-gray-200 transition-all duration-300 inline-flex items-center gap-2 group">
              Contact us for guidance
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};

export default GetInvolved;