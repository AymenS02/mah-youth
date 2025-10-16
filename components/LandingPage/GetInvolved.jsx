'use client';

import React, { useState } from "react";

const GetInvolved = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const opportunities = [
    {
      title: "Volunteer",
      description: "Help organize events and support our community programs",
      icon: "🤝",
      action: "Sign Up",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-500/20 to-blue-600/20",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Join Leadership",
      description: "Become part of the youth leadership team and make an impact",
      icon: "⭐",
      action: "Apply Now",
      gradient: "from-amber-500 to-amber-600",
      hoverGradient: "from-amber-500/20 to-amber-600/20",
      iconBg: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
    },
    {
      title: "Suggest Ideas",
      description: "Have an idea for an event or program? We want to hear it!",
      icon: "💡",
      action: "Share Ideas",
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "from-emerald-500/20 to-emerald-600/20",
      iconBg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
  ];

  return (
    <section className="min-h-screen py-24 bg-gradient-to-b from-primary-dark via-primary to-primary-light relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-light/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent-light/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-accent/30 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            <span className="text-sm font-bold text-accent tracking-wider uppercase">
              Join Our Community
            </span>
          </div>

          {/* Title */}
          <h2 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Get Involved
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Be an active part of our thriving youth community and make a lasting impact
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <div className="w-24 h-1 bg-gradient-to-r from-accent via-accent-light to-accent rounded-full"></div>
            <div className="w-2 h-2 bg-accent-light rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto mb-20">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              {/* Outer Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${opportunity.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700`}></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 shadow-2xl hover:shadow-accent/20 transition-all duration-500 flex flex-col items-center border-2 border-gray-700/50 hover:border-accent/50 transform hover:-translate-y-2 h-full">
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${opportunity.hoverGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Icon Container */}
                <div className="relative mb-8 z-10">
                  {/* Icon Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${opportunity.gradient} rounded-full blur-2xl scale-150 opacity-0 group-hover:opacity-40 transition-all duration-700`}></div>
                  
                  {/* Icon Circle */}
                  <div className={`relative w-28 h-28 flex items-center justify-center rounded-full ${opportunity.iconBg} border-2 ${opportunity.borderColor} group-hover:border-accent transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg`}>
                    <span className="text-6xl transform transition-all duration-500 group-hover:scale-125">
                      {opportunity.icon}
                    </span>
                  </div>

                  {/* Orbital Ring */}
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed ${opportunity.borderColor} opacity-0 group-hover:opacity-30 scale-150 group-hover:scale-[1.7] transition-all duration-1000`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col items-center w-full">
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">
                    {opportunity.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-8 flex-grow text-center leading-relaxed">
                    {opportunity.description}
                  </p>
                  
                  {/* CTA Button */}
                  <button className={`relative w-full bg-gradient-to-r ${opportunity.gradient} text-white px-8 py-4 rounded-xl font-bold text-lg mt-auto flex items-center justify-center gap-3 group/btn overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105`}>
                    <span className="relative z-10">{opportunity.action}</span>
                    <svg 
                      className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>

                {/* Corner Accent Decoration */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${opportunity.gradient} rounded-bl-full opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${opportunity.gradient} rounded-tr-full opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                {/* Sparkle Effect */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-accent-light rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl px-10 py-6 shadow-2xl">
            <p className="text-xl text-gray-300 mb-2">
              Not sure where to start?
            </p>
            <button className="text-2xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent hover:from-accent-light hover:to-accent transition-all duration-300 inline-flex items-center gap-2 group">
              Contact us for guidance
              <svg className="w-6 h-6 text-accent transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;