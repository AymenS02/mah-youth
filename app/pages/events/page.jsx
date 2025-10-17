'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { FileText, Search, Filter, Calendar, MapPin, Clock, Tag, ArrowRight } from 'lucide-react';
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

  // Category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Lecture': 'from-blue-500 to-blue-600',
      'Workshop': 'from-emerald-500 to-emerald-600',
      'Conference': 'from-purple-500 to-purple-600',
      'Seminar': 'from-amber-500 to-amber-600',
      'Community': 'from-rose-500 to-rose-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-light to-primary">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading events...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary-light to-primary pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

          {/* Header Section */}
          <div ref={headerRef} className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent-light/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-accent/30 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-sm font-bold text-accent tracking-wider uppercase">
                Browse Events
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Upcoming Events
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Explore Islamic events, lectures, workshops, and community activities
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-accent via-accent-light to-accent rounded-full"></div>
              <div className="w-2 h-2 bg-accent-light rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-6 mb-12 border-2 border-gray-700/50 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, locations, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
                />
              </div>

              {/* Category Filter */}
              <div className="relative lg:w-64">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none appearance-none cursor-pointer transition-all duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-900">
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Showing <span className="text-accent font-semibold">{filteredEvents.length}</span> of <span className="text-white font-semibold">{events.length}</span> events
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-accent hover:text-accent-light transition-colors duration-300"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Events Grid */}
          <div ref={eventsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event._id}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-accent/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(event.category)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  {event.imageUrl ? (
                    <>
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <Calendar className="w-20 h-20 text-gray-700" />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`bg-gradient-to-r ${getCategoryColor(event.category)} px-4 py-1.5 rounded-full backdrop-blur-sm`}>
                      <span className="text-white text-xs font-bold uppercase tracking-wide">{event.category}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative p-6">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    {/* Date & Time */}
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-sm flex-1 min-w-0 truncate">{event.location}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                    {event.description}
                  </p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* No Results State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-gray-700/50 p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No events found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-gradient-to-r from-accent to-accent-light text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventsPage;