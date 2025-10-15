'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { FileText, Search, Filter, Calendar, MapPin, User } from 'lucide-react';
import Header from "/components/header/Header";
import Footer from "/components/footer/Footer";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef(null);
  const eventsGridRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // GSAP animation
    if (headerRef.current && eventsGridRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      gsap.set([headerRef.current, eventsGridRef.current], { opacity: 0, y: 50 });
      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(eventsGridRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
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
        setEvents(data.events);
      } else {
        console.error('Failed to fetch events:', data.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', 'Lecture', 'Workshop', 'Conference', 'Seminar', 'Community'];

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-light">
          <div className="text-gray-600">Loading events...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="py-20 min-h-screen bg-light pt-[200px]">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Header */}
          <div ref={headerRef} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="hidden md:block bg-blue-100 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
                Upcoming <span className="text-blue-600">Events</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse upcoming Islamic events, lectures, workshops, and community activities
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, locations, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>

          {/* Events Grid */}
          <div ref={eventsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <div key={event._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group">
                <div className="h-48 flex items-center justify-center relative overflow-hidden">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-16 h-16 text-gray-300" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">{event.category}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventsPage;
