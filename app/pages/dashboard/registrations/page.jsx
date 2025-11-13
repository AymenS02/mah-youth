'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { Users, Calendar, Mail, Phone, Search, Filter, Download, ArrowLeft, Trash2 } from 'lucide-react';

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch registrations
      const regsRes = await fetch('/api/registrations');
      const regsData = await regsRes.json();
      
      console.log('Registrations response:', regsData);
      
      if (regsRes.ok) {
        const regs = regsData.registrations || [];
        console.log('Setting registrations:', regs.length);
        setRegistrations(regs);
        setFilteredRegistrations(regs);
      } else {
        console.error('Failed to fetch registrations:', regsData);
      }

      // Fetch events
      const eventsRes = await fetch('/api/events');
      const eventsData = await eventsRes.json();
      
      if (eventsRes.ok && eventsData.events) {
        setEvents(eventsData.events);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = registrations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reg =>
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm)
      );
    }

    // Filter by event
    if (selectedEvent !== 'all') {
      filtered = filtered.filter(reg => reg.event._id === selectedEvent);
    }

    setFilteredRegistrations(filtered);
  }, [searchTerm, selectedEvent, registrations]);

  const exportToCSV = () => {
    const headers = ['Event', 'Name', 'Email', 'Phone', 'Date Registered', 'Dietary Restrictions', 'Emergency Contact', 'Emergency Phone', 'Additional Notes', 'Status'];
    const rows = filteredRegistrations.map(reg => [
      reg.event.title,
      reg.fullName,
      reg.email,
      reg.phone,
      new Date(reg.registeredAt).toLocaleDateString(),
      reg.dietaryRestrictions || 'None',
      reg.emergencyContact || 'N/A',
      reg.emergencyPhone || 'N/A',
      reg.additionalNotes || 'None',
      reg.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (registrationId) => {
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setRegistrations(prev => prev.filter(reg => reg._id !== registrationId));
        setFilteredRegistrations(prev => prev.filter(reg => reg._id !== registrationId));
        alert('Registration deleted successfully');
      } else {
        const data = await response.json();
        alert(`Failed to delete registration: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('An error occurred while deleting the registration');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary-light">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                router.push('/pages/dashboard');
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
                  Registrations
                </h1>
                <p className="text-xl text-gray-300">
                  Manage all event registrations
                </p>
              </div>
              
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-accent to-accent-light text-white px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold flex items-center gap-2 justify-center group"
              >
                <Download className="w-5 h-5" />
                Export to CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-6 mb-8 border-2 border-gray-700/50">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all duration-300"
                />
              </div>

              {/* Event Filter */}
              <div className="relative lg:w-64">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none appearance-none cursor-pointer transition-all duration-300"
                >
                  <option value="all">All Events</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Showing <span className="text-accent font-semibold">{filteredRegistrations.length}</span> of <span className="text-white font-semibold">{registrations.length}</span> registrations
              </span>
              {(searchTerm || selectedEvent !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedEvent('all');
                  }}
                  className="text-accent hover:text-accent-light transition-colors duration-300"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Registrations Table */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Attendee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Additional Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((registration) => (
                      <tr key={registration._id} className="hover:bg-gray-800/30 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-white">
                                {registration.event.title}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(registration.event.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-gray-500">
                                {registration.event.startTime}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{registration.fullName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm text-gray-300">
                              <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{registration.email}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                              <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              {registration.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2 text-sm">
                            {registration.dietaryRestrictions && (
                              <div className="text-gray-300">
                                <span className="font-medium text-gray-400">Diet:</span> {registration.dietaryRestrictions}
                              </div>
                            )}
                            {registration.emergencyContact && (
                              <div className="text-gray-300">
                                <span className="font-medium text-gray-400">Emergency:</span> {registration.emergencyContact}
                                {registration.emergencyPhone && <span className="text-gray-500"> ({registration.emergencyPhone})</span>}
                              </div>
                            )}
                            {registration.additionalNotes && (
                              <div className="text-gray-300">
                                <span className="font-medium text-gray-400">Notes:</span> {registration.additionalNotes}
                              </div>
                            )}
                            {!registration.dietaryRestrictions && !registration.emergencyContact && !registration.additionalNotes && (
                              <span className="text-gray-500 text-xs">No additional info</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(registration.registeredAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            registration.status === 'confirmed' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : registration.status === 'cancelled'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {registration.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(registration._id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-300 flex items-center gap-1 font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No registrations found</p>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}