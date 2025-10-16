'use client';

import React, { useEffect, useState } from 'react';

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
  if (isLoading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="h-[calc(100vh-8vh)] w-full p-4 overflow-hidden">
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} className="h-full border-2 border-dashed border-gray-500 rounded-2xl overflow-hidden">
              <div className='h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl flex flex-col overflow-hidden shadow-xl'>
                <div className="h-1/2 min-h-0 relative overflow-hidden flex-shrink-0">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                <div className="flex-1 min-h-0 p-6 overflow-y-auto">
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