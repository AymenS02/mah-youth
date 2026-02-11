'use client';
// /LandingPage/Events.jsx
import React, { useEffect, useState } from 'react';
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
      {/* Desktop Version - Modern Card Design */}
      <section className="hidden lg:block relative min-h-[50vh] w-full py-20 px-8 bg-gradient-to-b from-primary to-primary-light">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4">
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

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div 
                key={index}
                className="group relative h-full"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-light rounded-3xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500"></div>
                
                {/* Main Card - Fixed Height with Flexbox */}
                <div className="relative h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-700 group-hover:border-accent/50 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-accent/20 flex flex-col">
                  
                  {/* Card Number Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                      <span className="text-2xl font-black text-white">{index + 1}</span>
                    </div>
                  </div>

                  {/* Image Container - Fixed Height */}
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                    
                  </div>

                  {/* Content Container - Flexible with consistent spacing */}
                  <div className="flex flex-col flex-1 p-6">
                    {/* Title - Fixed Height with 2 lines */}
                    <div className="h-16 mb-4 flex items-start">
                      <h3 className="text-2xl font-bold text-white line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent-light transition-all duration-300">
                        {event.title}
                      </h3>
                    </div>

                    {/* Event Details - Fixed Height */}
                    <div className="space-y-3 mb-6 flex-shrink-0">
                      <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 group-hover:bg-accent/20 flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300">
                          <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 group-hover:bg-accent/20 flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300">
                          <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium">{event.startTime}</p>
                      </div>

                      <div className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 group-hover:bg-accent/20 flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300">
                          <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium line-clamp-1">{event.location}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6 group-hover:via-accent/50 transition-colors duration-500 flex-shrink-0"></div>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-1"></div>

                    {/* CTA Button - Always at bottom */}
                    <div className='w-full flex gap-4'>
                    <Link href={`/pages/events/${event.id}/`} className="mt-auto">
                      <button className="w-full bg-primary-light text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                        <span>Learn More</span>
                      </button>
                    </Link>
                    <Link href={`/pages/events/${event.id}/register`} className="mt-auto">
                      <button className="w-full bg-gradient-to-r from-accent to-accent-light text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-accent/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                        <span>Register Now</span>
                        <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 flex items-center justify-center py-20">
              <p className="text-white text-xl">No events found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Version - Enhanced Card Design */}
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
                className="relative group active:scale-95 transition-transform duration-200"
              >
                {/* Card Number Badge */}
                <div className="absolute -top-4 -left-4 z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center shadow-lg border-4 border-primary">
                    <span className="text-2xl font-black text-white">{index + 1}</span>
                  </div>
                </div>

                {/* Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    {/* Title Overlay on Image - Fixed Height */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 h-24 flex items-end">
                      <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-300">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium">{event.startTime}</p>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-5 h-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium line-clamp-1">{event.location}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4"></div>

                    {/* CTA Button */}
                    <Link href={`/pages/events/${event.id}/`}>
                      <button className="w-full mt-6 bg-gradient-to-r from-accent to-accent-light text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95">
                        <span>Learn More</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </Link>
                    <Link href={`/pages/events/${event.id}/register`}>
                      <button className="w-full mt-6 bg-gradient-to-r from-accent to-accent-light text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95">
                        <span>Register Now</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </Link>
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