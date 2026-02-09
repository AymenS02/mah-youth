'use client';
// /LandingPage/Events.jsx
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { animateEventsPage } from '../animations/events';
import Link from 'next/link';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Fetch events from API
  useEffect(() => {
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

    fetchEvents();
  }, []);

  // 🎬 Initialize animations - USE LAYOUT EFFECT for synchronous cleanup
  useLayoutEffect(() => {
    if (!isLoading && events.length > 0) {
      console.log("🔵 [COMPONENT] Setting up animations...");
      
      let cleanupFn;
      const timer = setTimeout(() => {
        cleanupFn = animateEventsPage();
        console.log("✅ [COMPONENT] Animation setup complete");
      }, 100);

      // This cleanup runs SYNCHRONOUSLY during React's commit phase
      return () => {
        console.log("🔴 [COMPONENT] useLayoutEffect cleanup - BEFORE React removes DOM");
        clearTimeout(timer);
        
        if (cleanupFn) {
          cleanupFn();
        }
        
        console.log("✅ [COMPONENT] useLayoutEffect cleanup finished");
      };
    }
  }, [isLoading, events]);

  // 🧭 Render
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary to-primary-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary to-primary-light">
        <div className="text-center px-4">
          <p className="text-red-400 text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Version - Hidden on mobile */}
      <section className="team hidden lg:block relative h-screen w-full pt-[8vh] pb-[1vh] px-[2rem] overflow-visible bg-gradient-to-b from-primary to-primary-light" style={{ zIndex: 100 }}>
        <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div 
                key={index} 
                className="team-member relative h-full border-2 border-dashed border-gray-500 rounded-2xl overflow-visible"
                style={{ zIndex: events.length - index }}
              >
                
                {/* Centered overlapping number - Behind cards */}
                <div className="team-member-name-initial absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                     style={{ zIndex: 0 }}>
                  <h1 className='text-accent text-[300px] font-bold'>{index + 1}</h1>
                </div>

                {/* Main content - Above everything with stacking */}
                <div 
                  className='team-member-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+4px)] h-[calc(100%+4px)] bg-gradient-to-br from-gray-900 to-black rounded-2xl flex flex-col items-center shadow-xl'
                  style={{ zIndex: 10 + (events.length - index) }}
                >
                  <div className="team-member-img max-h-1/2 relative overflow-hidden flex-shrink-0 m-[2rem] rounded-2xl border-2 border-accent-dark">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="h-full object-contain rounded-2xl" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  
                  <div className="team-member-info flex-1 p-6 overflow-y-auto">
                    <h3 className="text-2xl font-bold mb-4 text-white break-words">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex flex-wrap items-center text-gray-300">
                        <span className="w-1.5 h-1.5 bg-accent-light rounded-full mr-3 flex-shrink-0"></span>
                        <p className="text-sm break-all">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center text-gray-300">
                        <span className="w-1.5 h-1.5 bg-accent-light rounded-full mr-3 flex-shrink-0"></span>
                        <p className="text-sm break-all">{event.startTime}</p>
                      </div>
                      <div className="flex flex-wrap items-center text-gray-300">
                        <span className="w-1.5 h-1.5 bg-accent-light rounded-full mr-3 flex-shrink-0"></span>
                        <p className="text-sm break-all">{event.location}</p>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 flex items-center justify-center">
              <p className="text-white text-xl">No events found.</p>
            </div>
          )}
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

        {/* Mobile Cards */}
        <div className="space-y-8 max-w-md mx-auto">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div 
                key={index}
                className="relative group"
              >
                {/* Card Number Badge */}
                <div className="absolute -top-4 -left-4 z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center shadow-lg border-4 border-primary">
                    <span className="text-2xl font-black text-white">{index + 1}</span>
                  </div>
                </div>

                {/* Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 hover:border-accent/50 transition-all duration-300">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    {/* Title Overlay on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-2xl font-bold text-white leading-tight">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 text-accent-light mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 text-accent-light mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">{event.startTime}</p>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 text-accent-light mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium">{event.location}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4"></div>

                    {/* CTA Button */}
                    <button className="w-full mt-6 bg-gradient-to-r from-accent to-accent-light text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 flex items-center justify-center gap-2">
                      <Link href={`/pages/events/${event.id}/register`}>Register</Link>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-white text-lg">No events found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default EventsPage;