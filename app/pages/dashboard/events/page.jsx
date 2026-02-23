'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { CalendarDays, Plus, Trash2, Search, Filter, ArrowLeft, Clock, MapPin, Users, Infinity, DollarSign, Tag, ClipboardList } from 'lucide-react';

export default function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }

    fetchEvents();
  }, [router]);

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

  const handleDelete = async (eventId) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
          setEvents(events.filter(event => event._id !== eventId));
        } else {
          alert('Failed to delete event: ' + data.error);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'upcoming' && new Date(event.date) > new Date()) ||
      (filterStatus === 'past' && new Date(event.date) <= new Date());

    return matchesSearch && matchesFilter;
  });

  const upcomingCount = events.filter(e => new Date(e.date) > new Date()).length;
  const pastCount = events.filter(e => new Date(e.date) <= new Date()).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />

      <div className="pt-32 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/pages/dashboard')}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <CalendarDays className="w-8 h-8 text-accent" />
                </div>
                Events Management
              </h1>
              <p className="text-xl text-gray-300">Manage your upcoming and past events</p>
            </div>

            <button
              onClick={() => router.push('/pages/dashboard/events/add')}
              className="bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold flex items-center gap-2 justify-center group transform hover:scale-105"
            >
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              Add New Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50 hover:border-accent/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Events</p>
                <p className="text-4xl font-black text-white">{events.length}</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl">
                <CalendarDays className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Upcoming</p>
                <p className="text-4xl font-black text-white">{upcomingCount}</p>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-xl">
                <Clock className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50 hover:border-gray-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Past Events</p>
                <p className="text-4xl font-black text-white">{pastCount}</p>
              </div>
              <div className="p-4 bg-gray-500/10 rounded-xl">
                <CalendarDays className="w-8 h-8 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-6 mb-8 border-2 border-gray-700/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative lg:w-64">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none appearance-none cursor-pointer transition-all duration-300"
              >
                <option value="all" className="bg-gray-900">All Events</option>
                <option value="upcoming" className="bg-gray-900">Upcoming Events</option>
                <option value="past" className="bg-gray-900">Past Events</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-4 text-sm text-gray-400">
            Showing <span className="text-accent font-semibold">{filteredEvents.length}</span> of <span className="text-white font-semibold">{events.length}</span> events
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const isUpcoming = new Date(event.date) > new Date();
            const isUnlimitedCapacity = event.capacity === 0;
            const spotsRemaining = isUnlimitedCapacity ? null : event.capacity - (event.registeredAttendees || 0);
            
            return (
              <div
                key={event._id}
                className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-accent/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-gray-800">
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
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDays className="w-20 h-20 text-gray-700" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-4 py-1.5 rounded-full backdrop-blur-sm font-bold text-xs uppercase tracking-wide ${
                      isUpcoming
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-gray-500/90 text-white'
                    }`}>
                      {isUpcoming ? 'Upcoming' : 'Past'}
                    </div>
                  </div>

                  {/* Category Badge */}
                  {event.category && (
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 rounded-full bg-accent/90 backdrop-blur-sm font-semibold text-xs text-white flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {event.category}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-sm">
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </p>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-accent" />
                        </div>
                        <p className="text-sm truncate">{event.location}</p>
                      </div>
                    )}

                    {/* Capacity Info */}
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {isUnlimitedCapacity ? (
                          <Infinity className="w-5 h-5 text-accent" />
                        ) : (
                          <Users className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <p className="text-sm">
                        {isUnlimitedCapacity ? (
                          <span className="text-emerald-400 font-medium">Unlimited capacity</span>
                        ) : (
                          <>
                            <span className="text-white font-medium">{event.registeredAttendees || 0}</span>
                            <span className="text-gray-400"> / </span>
                            <span className="text-white font-medium">{event.capacity}</span>
                            <span className="text-gray-400"> registered</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Price Info */}
                    {event.price !== undefined && event.price > 0 && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-5 h-5 text-accent" />
                        </div>
                        <p className="text-sm">
                          <span className="text-white font-medium">${event.price.toFixed(2)}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6"></div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/pages/dashboard/events/${event._id}/registrations`)}
                      className="flex-1 bg-accent/10 border border-accent/50 text-accent py-3 px-4 rounded-xl hover:bg-accent hover:text-white transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 group/btn"
                    >
                      <ClipboardList className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
                      Registrations
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex-1 bg-red-500/10 border border-red-500/50 text-red-400 py-3 px-4 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 group/btn"
                    >
                      <Trash2 className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-gray-700/50 p-16 text-center">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-12 h-12 text-accent" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No events found</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first event.'}
            </p>
            <button
              onClick={() => router.push('/pages/dashboard/events/add')}
              className="bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}