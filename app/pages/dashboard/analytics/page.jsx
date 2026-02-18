'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { 
  BarChart3, Users, Calendar, TrendingUp, Filter, X, ChevronDown,
  Activity, ArrowLeft, PieChart, UserCheck, Target, Award
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Analytics() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAnalytics, setEventAnalytics] = useState(null);
  const [loadingEventAnalytics, setLoadingEventAnalytics] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const router = useRouter();

  // Filter states
  const [filters, setFilters] = useState({
    gender: 'all',
    minAge: '',
    maxAge: '',
    startDate: '',
    endDate: '',
    category: 'all',
    status: 'all'
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchAnalytics();
    fetchAllEvents();
  }, [router]);

  const fetchAnalytics = async (customFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (customFilters.gender && customFilters.gender !== 'all') {
        params.append('gender', customFilters.gender);
      }
      if (customFilters.minAge) {
        params.append('minAge', customFilters.minAge);
      }
      if (customFilters.maxAge) {
        params.append('maxAge', customFilters.maxAge);
      }
      if (customFilters.startDate) {
        params.append('startDate', customFilters.startDate);
      }
      if (customFilters.endDate) {
        params.append('endDate', customFilters.endDate);
      }
      if (customFilters.category && customFilters.category !== 'all') {
        params.append('category', customFilters.category);
      }
      if (customFilters.status && customFilters.status !== 'all') {
        params.append('status', customFilters.status);
      }

      const res = await fetch(`/api/analytics?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) {
        setAllEvents(data.events || []);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchEventAnalytics = async (eventId) => {
    setLoadingEventAnalytics(true);
    try {
      const res = await fetch(`/api/analytics/event?eventId=${eventId}`);
      const data = await res.json();

      if (data.success) {
        setEventAnalytics(data.eventAnalytics);
      }
    } catch (err) {
      console.error("Error fetching event analytics:", err);
    } finally {
      setLoadingEventAnalytics(false);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    fetchEventAnalytics(event._id);
  };

  const handleBackToOverview = () => {
    setSelectedEvent(null);
    setEventAnalytics(null);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    fetchAnalytics(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const resetFilters = {
      gender: 'all',
      minAge: '',
      maxAge: '',
      startDate: '',
      endDate: '',
      category: 'all',
      status: 'all'
    };
    setFilters(resetFilters);
    fetchAnalytics(resetFilters);
    setShowFilters(false);
  };

  // Chart colors
  const COLORS = ['#00E5FF', '#7C4DFF', '#FF4081', '#FFAB00', '#00E676', '#FF6E40', '#536DFE', '#FFD740'];

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />
      
      {/* Analytics Header */}
      <div className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  router.push('/pages/dashboard');
                }}
                className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent-light/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-accent/30">
                <BarChart3 className="w-5 h-5 text-accent" />
                <span className="text-sm font-bold text-accent tracking-wider uppercase">
                  Analytics Dashboard
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
                Event Analytics
              </h1>
              <p className="text-xl text-gray-300">
                Comprehensive insights into your events and registrations
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-accent/10 border-2 border-accent/50 text-accent px-8 py-4 rounded-xl hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 font-bold flex items-center gap-2 justify-center group"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-accent/30 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Filter className="w-6 h-6 text-accent" />
                  Filter Options
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close filters panel"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Age</label>
                  <input
                    type="number"
                    value={filters.minAge}
                    onChange={(e) => handleFilterChange('minAge', e.target.value)}
                    placeholder="e.g., 18"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Age</label>
                  <input
                    type="number"
                    value={filters.maxAge}
                    onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                    placeholder="e.g., 35"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="waitlist">Waitlist</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="all">All Categories</option>
                    <option value="social">Social</option>
                    <option value="educational">Educational</option>
                    <option value="sports">Sports</option>
                    <option value="religious">Religious</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-gradient-to-r from-accent to-accent-light text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors font-bold"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {analytics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <MetricCard
              icon={<Calendar className="w-8 h-8" />}
              title="Total Events"
              value={analytics.summary.totalEvents}
              subtitle="All events"
              color="accent"
            />
            <MetricCard
              icon={<Users className="w-8 h-8" />}
              title="Total Registrations"
              value={analytics.summary.totalRegistrations}
              subtitle="All registrations"
              color="purple"
            />
            <MetricCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Avg Attendance"
              value={analytics.summary.averageAttendance}
              subtitle="Per event"
              color="emerald"
            />
            <MetricCard
              icon={<Target className="w-8 h-8" />}
              title="Capacity Used"
              value={`${analytics.summary.capacityUtilization}%`}
              subtitle={`of ${analytics.summary.totalCapacity} total`}
              color="orange"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Registration Trends */}
            <ChartCard title="Registration Trends" subtitle="Last 6 months">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.trends.registrationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#00E5FF" strokeWidth={3} dot={{ fill: '#00E5FF', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Gender Distribution */}
            <ChartCard title="Gender Distribution" subtitle="Registration demographics">
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={Object.entries(analytics.distributions.gender).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(analytics.distributions.gender).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Age Distribution */}
            <ChartCard title="Age Distribution" subtitle="Age ranges of attendees">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(analytics.distributions.age).map(([range, count]) => ({ range, count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#7C4DFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Event Performance */}
            <ChartCard title="Event Performance" subtitle="Capacity vs registrations (Latest 10 events)">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.eventPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="title" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Bar dataKey="capacity" fill="#FF6E40" name="Capacity" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="registrations" fill="#00E676" name="Registrations" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Top Performing Events */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Top Performing Events</h3>
                <p className="text-gray-400">Events ranked by registration count</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Rank</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Event</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Category</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Registrations</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Capacity</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topEvents.length > 0 ? (
                    analytics.topEvents.map((event, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white font-medium">{event.title}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                            {event.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-4 text-emerald-400 font-bold text-lg">{event.registrations}</td>
                        <td className="py-4 px-4 text-gray-300">{event.capacity}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-gradient-to-r from-accent to-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(event.utilizationPercentage, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-medium min-w-[50px]">{event.utilizationPercentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-400">
                        No events found with the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Per-Event Analytics Section */}
          <div className="mt-12 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Event-Specific Analytics</h3>
                <p className="text-gray-400">Click on any event to view detailed analytics</p>
              </div>
            </div>

            {selectedEvent ? (
              <EventAnalyticsDetail 
                event={selectedEvent}
                eventAnalytics={eventAnalytics}
                loading={loadingEventAnalytics}
                onBack={handleBackToOverview}
                COLORS={COLORS}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allEvents.length > 0 ? (
                  allEvents.map((event) => (
                    <button
                      key={event._id}
                      onClick={() => handleEventClick(event)}
                      className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 hover:border-accent transition-all duration-300 rounded-xl p-6 text-left group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                          {event.category}
                        </span>
                        <Activity className="w-5 h-5 text-gray-500 group-hover:text-accent transition-colors" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <div className="text-sm">
                          <span className="text-gray-400">Registrations: </span>
                          <span className="text-emerald-400 font-bold">{event.registeredAttendees || 0}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Capacity: </span>
                          <span className="text-white font-bold">{event.capacity || 0}</span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    No events found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Event Analytics Detail Component
function EventAnalyticsDetail({ event, eventAnalytics, loading, onBack, COLORS }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">Loading event analytics...</p>
      </div>
    );
  }

  if (!eventAnalytics) {
    return (
      <div className="text-center py-12 text-gray-400">
        Failed to load event analytics
      </div>
    );
  }

  const { summary, distributions, timeline } = eventAnalytics;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to All Events</span>
      </button>

      {/* Event Header */}
      <div className="bg-gradient-to-r from-accent/10 to-accent-light/10 rounded-xl p-6 mb-8 border border-accent/30">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-3xl font-black text-white mb-2">{eventAnalytics.event.title}</h3>
            <p className="text-gray-300 mb-4">{eventAnalytics.event.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-gray-300">
                  {new Date(eventAnalytics.event.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-300">
                  {eventAnalytics.event.startTime} - {eventAnalytics.event.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full font-medium">
                  {eventAnalytics.event.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 border-2 border-emerald-500/50">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-white" />
            <p className="text-white/80 text-sm font-medium uppercase">Total Registrations</p>
          </div>
          <p className="text-3xl font-black text-white">{summary.totalRegistrations}</p>
        </div>

        <div className="bg-gradient-to-br from-accent to-accent-light rounded-xl p-5 border-2 border-accent/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-white" />
            <p className="text-white/80 text-sm font-medium uppercase">Confirmed</p>
          </div>
          <p className="text-3xl font-black text-white">{summary.confirmedRegistrations}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 border-2 border-orange-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-white" />
            <p className="text-white/80 text-sm font-medium uppercase">Turnout Rate</p>
          </div>
          <p className="text-3xl font-black text-white">{summary.turnoutRate}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 border-2 border-purple-500/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-white" />
            <p className="text-white/80 text-sm font-medium uppercase">Spots Remaining</p>
          </div>
          <p className="text-3xl font-black text-white">{summary.spotsRemaining}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gender Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-xl font-bold text-white mb-4">Gender Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={Object.entries(distributions.gender).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(distributions.gender).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-xl font-bold text-white mb-4">Age Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(distributions.age).map(([range, count]) => ({ range, count }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="range" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#7C4DFF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Registration Timeline */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-xl font-bold text-white mb-4">Registration Timeline</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="count" stroke="#00E5FF" strokeWidth={3} dot={{ fill: '#00E5FF', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-xl font-bold text-white mb-4">Registration Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={Object.entries(distributions.status).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#00E676" /> {/* confirmed */}
                <Cell fill="#FFAB00" /> {/* waitlist */}
                <Cell fill="#FF4081" /> {/* cancelled */}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-xl font-bold text-white mb-4">Additional Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Average Age</p>
            <p className="text-2xl font-bold text-white">{summary.averageAge} years</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Capacity Utilization</p>
            <p className="text-2xl font-bold text-white">
              {eventAnalytics.event.capacity > 0 
                ? `${((summary.confirmedRegistrations / eventAnalytics.event.capacity) * 100).toFixed(1)}%`
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Dietary Restrictions</p>
            <p className="text-2xl font-bold text-white">{eventAnalytics.insights.dietaryRestrictionsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Metric Card Component
function MetricCard({ icon, title, value, subtitle, color }) {
  const colorClasses = {
    accent: 'from-accent to-accent-light border-accent/50 shadow-accent/20',
    purple: 'from-purple-500 to-purple-600 border-purple-500/50 shadow-purple-500/20',
    emerald: 'from-emerald-500 to-emerald-600 border-emerald-500/50 shadow-emerald-500/20',
    orange: 'from-orange-500 to-orange-600 border-orange-500/50 shadow-orange-500/20'
  };

  return (
    <div className={`group bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border-2 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wide">{title}</p>
        <p className="text-4xl font-black text-white mb-1">{value}</p>
        <p className="text-white/60 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// Reusable Chart Card Component
function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50 hover:border-accent/30 transition-all duration-500">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
