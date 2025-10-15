'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const headerRef = useRef(null);
  const eventsGridRef = useRef(null);

  useEffect(() => {
    if (headerRef.current && eventsGridRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      gsap.set([headerRef.current, eventsGridRef.current], { opacity: 0, y: 50 });
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to(eventsGridRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');
      return () => tl.kill();
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      if (response.ok) {
        const sortedEvents = data.events
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);
        setEvents(sortedEvents);
      } else {
        console.error('Failed to fetch events:', data.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f8feff] via-white to-[#f8feff] relative overflow-hidden px-4">
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#c1945e]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#0a1e39]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="text-center relative z-10">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#c1945e]/20 rounded-full absolute inset-0 animate-ping"></div>
              <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#c1945e] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-[#0a1e39] font-bold text-lg md:text-xl mb-2">Loading Events</div>
            <div className="text-[#0a1e39]/60 text-sm">Please wait while we fetch the latest updates...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#f8feff] via-white to-[#f8feff] min-h-screen pt-24 sm:pt-32 md:pt-40 lg:pt-48 relative overflow-hidden">
        {/* Enhanced decorative background elements */}
        <div className="absolute top-20 left-0 w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-[#c1945e]/5 rounded-full blur-3xl -translate-x-1/2 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 right-0 w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-[#0a1e39]/5 rounded-full blur-3xl translate-x-1/2 animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(#0a1e39 1px, transparent 1px), linear-gradient(90deg, #0a1e39 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>

        {/* Floating decorative elements - hidden on mobile */}
        <div className="hidden md:block absolute top-40 right-20 w-2 h-2 bg-[#c1945e]/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="hidden md:block absolute top-60 left-40 w-2 h-2 bg-[#c1945e]/30 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="hidden md:block absolute bottom-40 left-1/3 w-2 h-2 bg-[#0a1e39]/30 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div ref={headerRef} className="text-center mb-12 md:mb-16 lg:mb-20">
            {/* Enhanced badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c1945e]/10 to-[#a67c4a]/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full mb-6 md:mb-8 border border-[#c1945e]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#c1945e] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-[#0a1e39] tracking-wider">WHAT'S HAPPENING</span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#c1945e] animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#0a1e39] mb-4 md:mb-6 tracking-tight px-4">
              Upcoming Events
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#0a1e39]/60 max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8 px-4">
              Stay connected with exciting events and activities happening in our community
            </p>
            
            {/* Enhanced divider */}
            <div className="flex items-center justify-center gap-2 md:gap-3 mt-6 md:mt-10">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#c1945e] rounded-full animate-pulse"></div>
              <div className="w-16 md:w-24 h-1 md:h-1.5 bg-gradient-to-r from-[#c1945e] via-[#a67c4a] to-[#c1945e] rounded-full shadow-lg"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#c1945e] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          <div ref={eventsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {events.map((event, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative"
              >
                {/* Enhanced glow effect on hover - reduced on mobile */}
                <div className="hidden md:block absolute -inset-1 bg-gradient-to-r from-[#c1945e] via-[#d4a574] to-[#a67c4a] rounded-3xl blur-lg opacity-0 group-hover:opacity-25 transition-opacity duration-700"></div>
                
                <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col border-2 border-[#c1945e]/20 hover:border-[#c1945e]/50 md:transform md:hover:-translate-y-3 md:hover:scale-[1.02]">
                  {/* Image / header with enhanced overlay */}
                  <div className="h-44 sm:h-48 md:h-52 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0a1e39]/5 to-[#c1945e]/5">
                    {event.imageUrl ? (
                      <>
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 md:group-hover:scale-125 md:group-hover:rotate-2"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e39]/80 via-[#0a1e39]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#c1945e]/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                        <FileText className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#c1945e]/40 relative z-10 transition-all duration-700 group-hover:scale-110 md:group-hover:scale-125 group-hover:text-[#c1945e] md:group-hover:rotate-12" />
                      </div>
                    )}
                    
                    {/* Enhanced date badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 bg-white/98 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 rounded-xl md:rounded-2xl shadow-2xl border-2 border-[#c1945e]/30 md:group-hover:scale-110 transition-transform duration-500">
                      <div className="text-xs font-bold text-[#c1945e] uppercase tracking-wider">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-[#0a1e39] leading-none">
                        {new Date(event.date).getDate()}
                      </div>
                    </div>

                    {/* Corner decoration - hidden on mobile */}
                    <div className="hidden md:block absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/30 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="p-5 sm:p-6 md:p-7 flex flex-col flex-1 relative">
                    {/* Subtle top border decoration */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 md:w-16 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-[#c1945e]/50 to-transparent"></div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-[#0a1e39] mb-4 md:mb-5 group-hover:text-[#c1945e] transition-colors duration-500 leading-tight">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
                      {event.time && (
                        <div className="flex items-center text-[#0a1e39]/70 group-hover:text-[#0a1e39] transition-all duration-300">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#c1945e]/10 to-[#c1945e]/20 flex items-center justify-center mr-3 sm:mr-3.5 group-hover:bg-gradient-to-br group-hover:from-[#c1945e]/20 group-hover:to-[#c1945e]/30 transition-all duration-300 md:group-hover:scale-110 md:group-hover:rotate-3 flex-shrink-0">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#c1945e]" />
                          </div>
                          <span className="font-semibold text-sm sm:text-base">{event.time}</span>
                        </div>
                      )}
                      <div className="flex items-center text-[#0a1e39]/70 group-hover:text-[#0a1e39] transition-all duration-300">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#c1945e]/10 to-[#c1945e]/20 flex items-center justify-center mr-3 sm:mr-3.5 group-hover:bg-gradient-to-br group-hover:from-[#c1945e]/20 group-hover:to-[#c1945e]/30 transition-all duration-300 md:group-hover:scale-110 md:group-hover:rotate-3 flex-shrink-0">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#c1945e]" />
                        </div>
                        <span className="font-semibold text-sm sm:text-base">{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm sm:text-base text-[#0a1e39]/60 mb-5 md:mb-7 flex-1 leading-relaxed">
                      {event.description}
                    </p>
                    
                    {/* Enhanced button */}
                    <button className="w-full bg-gradient-to-r from-[#c1945e] via-[#d4a574] to-[#a67c4a] text-white py-3 sm:py-4 rounded-xl md:rounded-2xl hover:shadow-2xl transition-all duration-500 font-bold text-sm sm:text-base mt-auto flex items-center justify-center gap-2 sm:gap-3 group/btn overflow-hidden relative border-2 border-transparent hover:border-[#c1945e]/30">
                      <span className="relative z-10 tracking-wide">Learn More</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-500 group-hover/btn:translate-x-2" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#a67c4a] via-[#d4a574] to-[#c1945e] translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-16 sm:py-20 md:py-24 px-4">
              <div className="relative inline-block mb-6 md:mb-8">
                <div className="absolute inset-0 bg-[#c1945e]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#c1945e]/10 to-[#a67c4a]/10 p-6 md:p-8 rounded-full border-2 border-[#c1945e]/20">
                  <Calendar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#c1945e]/50 relative z-10" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0a1e39] mb-3 md:mb-4">No Events Found</h3>
              <p className="text-base sm:text-lg md:text-xl text-[#0a1e39]/60 mb-6 md:mb-8 max-w-md mx-auto">Check back soon for exciting upcoming events!</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[#c1945e]/50 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#c1945e]/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#c1945e]/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EventsPage;