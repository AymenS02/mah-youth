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
      gradient: "from-blue-500/10 to-purple-500/10",
      accentColor: "group-hover:text-blue-600"
    },
    {
      title: "Join Leadership",
      description: "Become part of the youth leadership team and make an impact",
      icon: "⭐",
      action: "Apply Now",
      gradient: "from-amber-500/10 to-orange-500/10",
      accentColor: "group-hover:text-amber-600"
    },
    {
      title: "Suggest Ideas",
      description: "Have an idea for an event or program? We want to hear it!",
      icon: "💡",
      action: "Share Ideas",
      gradient: "from-green-500/10 to-emerald-500/10",
      accentColor: "group-hover:text-green-600"
    },
  ];

  return (
    <section className="min-h-screen py-24 bg-gradient-to-b from-[var(--bg-light-alt)] to-[var(--bg-light)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--border-accent)]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--btn-primary-bg)]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[var(--btn-primary-bg)]/10 backdrop-blur-sm px-5 py-2 rounded-full mb-6 border border-[var(--border-accent)]/20">
            <span className="w-2 h-2 bg-[var(--btn-primary-bg)] rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-[var(--fg-primary)] tracking-wide uppercase">
              Join Our Community
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-[var(--fg-primary)] mb-6 tracking-tight">
            Get Involved
          </h2>
          <p className="text-xl text-[var(--fg-secondary)] max-w-2xl mx-auto leading-relaxed">
            Be an active part of our thriving youth community
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-[var(--border-accent)] rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-[var(--border-accent)] to-[var(--btn-primary-bg)] rounded-full"></div>
            <div className="w-2 h-2 bg-[var(--btn-primary-bg)] rounded-full"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {opportunities.map((opportunity, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--border-accent)] to-[var(--btn-primary-bg)] rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              
              <div className="relative bg-[var(--bg-light)] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col items-center border border-[var(--border-accent)]/20 hover:border-[var(--border-accent)]/40 transform hover:-translate-y-3 h-full">
                {/* Icon container with animated background */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${opportunity.gradient} rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--border-accent)]/10 to-[var(--btn-primary-bg)]/10 border-2 border-[var(--border-accent)]/20 group-hover:border-[var(--border-accent)]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <span className="text-5xl transform transition-transform duration-500 group-hover:scale-110">
                      {opportunity.icon}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[var(--fg-primary)] mb-4 group-hover:text-[var(--btn-primary-bg)] transition-colors duration-300">
                  {opportunity.title}
                </h3>
                
                <p className="text-[var(--fg-secondary)] mb-8 flex-grow text-center leading-relaxed">
                  {opportunity.description}
                </p>
                
                <button className="relative w-full bg-gradient-to-r from-[var(--btn-primary-bg)] to-[var(--btn-primary-hover)] text-[var(--btn-primary-fg)] px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold mt-auto flex items-center justify-center gap-2 group/btn overflow-hidden">
                  <span className="relative z-10">{opportunity.action}</span>
                  <svg 
                    className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--btn-primary-hover)] to-[var(--btn-primary-bg)] translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"></div>
                </button>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--border-accent)]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action text */}
        <div className="text-center mt-16">
          <p className="text-lg text-[var(--fg-secondary)] mb-4">
            Not sure where to start? 
            <span className="text-[var(--btn-primary-bg)] font-semibold ml-2 hover:underline cursor-pointer">
              Contact us for guidance
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;