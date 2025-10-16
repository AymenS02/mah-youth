'use client';
// /LandingPage/Events.jsx
import React, { useEffect, useState } from 'react';
import { animateEventsPage } from '../animations/events'; // Adjust path as needed

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

  // 🎬 Initialize animations after events are loaded
  useEffect(() => {
    if (!isLoading && events.length > 0) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        animateEventsPage();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, events]);

  // 🧭 Render
  if (isLoading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="team relative h-screen w-full pt-[8vh] pb-[1vh] px-[2rem] overflow-visible bg-gradient-to-b from-primary to-primary-light z-100">
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
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-300">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                      <p className="text-sm">{event.date}</p>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 flex-shrink-0"></span>
                      <p className="text-sm">{event.time}</p>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-3 flex-shrink-0"></span>
                      <p className="text-sm">{event.location}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </section>
  );
};

export default EventsPage;