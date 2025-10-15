'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { CalendarDays, Plus, Trash2, Search, Filter, ArrowLeft, Clock } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-600">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-[200px] min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 flex-col md:flex-row space-y-4 md:space-y-0">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/pages/dashboard')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="max-md:hidden text-3xl font-bold text-gray-900 flex items-center">
                <CalendarDays className="w-8 h-8 mr-3 text-blue-600" />
                Events Management
              </h1>
              <p className="text-gray-600">Manage your upcoming and past events</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/pages/dashboard/events/add')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 font-medium flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Event
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>

                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    new Date(event.date) > new Date()
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                  </span>

                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first event.'}
            </p>
            <button
              onClick={() => router.push('/pages/dashboard/events/add')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              Add Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
