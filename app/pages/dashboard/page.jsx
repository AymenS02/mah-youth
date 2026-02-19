'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { Plus, Edit, Calendar, LogOut, Activity, ArrowRight, Users, Eye, Repeat, BarChart3, Heart } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    totalPrograms: 0,
    totalVolunteerApplicants: 0
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      // Fetch events
      const eventsRes = await fetch("/api/events");
      const eventsData = await eventsRes.json();

      // Fetch registrations
      const regsRes = await fetch("/api/registrations");
      const regsData = await regsRes.json();

      // Fetch programs
      const programsRes = await fetch("/api/programs");
      const programsData = await programsRes.json();

      // Fetch volunteer applicants
      const youthRes = await fetch("/api/volunteering/youth-committee");
      const youthData = await youthRes.json();
      const hoursRes = await fetch("/api/volunteering/volunteer-hours");
      const hoursData = await hoursRes.json();
      const totalVolunteers = (youthData.success ? youthData.count : 0) + (hoursData.success ? hoursData.count : 0);

      if (eventsRes.ok && eventsData.events) {
        const now = new Date();
        const upcoming = eventsData.events.filter(event => new Date(event.date) >= now);
        
        // Get actual registration count from registrations API
        const totalRegs = regsData.success ? regsData.count : 0;
        
        // Get program count
        const totalProgs = programsData.success ? programsData.count : 0;

        console.log("📊 Dashboard Stats:", {
          totalEvents: eventsData.events.length,
          upcomingEvents: upcoming.length,
          totalRegistrations: totalRegs,
          totalPrograms: totalProgs,
          totalVolunteerApplicants: totalVolunteers
        });

        setStats({
          totalEvents: eventsData.events.length,
          upcomingEvents: upcoming.length,
          totalRegistrations: totalRegs,
          totalPrograms: totalProgs,
          totalVolunteerApplicants: totalVolunteers
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.scrollTo(0, 0);
    router.push('/pages/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />
      
      {/* Dashboard Header */}
      <div className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent-light/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-accent/30">
                <Activity className="w-5 h-5 text-accent" />
                <span className="text-sm font-bold text-accent tracking-wider uppercase">
                  Admin Panel
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3">
                Dashboard
              </h1>
              <p className="text-xl text-gray-300">
                Welcome back, <span className="text-accent font-bold">{user.name}</span>
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-500/10 border-2 border-red-500/50 text-red-400 px-8 py-4 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 font-bold flex items-center gap-2 justify-center group"
            >
              <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Events */}
          <div className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700/50 hover:border-accent/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Total Events</p>
              <p className="text-5xl font-black text-white mb-2">{stats.totalEvents}</p>
              <p className="text-gray-500 text-sm">All events in system</p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Upcoming Events</p>
              <p className="text-5xl font-black text-white mb-2">{stats.upcomingEvents}</p>
              <p className="text-gray-500 text-sm">Future scheduled events</p>
            </div>
          </div>

          {/* Total Registrations */}
          <div className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Total Registrations</p>
              <p className="text-5xl font-black text-white mb-2">{stats.totalRegistrations}</p>
              <p className="text-gray-500 text-sm">Across all events</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Activity className="w-6 h-6 text-accent" />
            </div>
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Events Management Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-accent/50 transition-all duration-500 group">
              {/* Header */}
              <div className="bg-gradient-to-r from-accent to-accent-light p-6">
                <div className="flex items-center text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Events Management</h3>
                    <p className="text-white/80">{stats.totalEvents} total events</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Create, edit, and manage all your community events in one place. Keep your audience engaged with up-to-date event information.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      router.push('/pages/dashboard/events/add');
                    }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-accent to-accent-light text-white rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold group/btn"
                  >
                    <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover/btn:rotate-90" />
                    Add New Event
                  </button>
                  
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      router.push('/pages/dashboard/events');
                    }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-accent/50 hover:text-white transition-all duration-300 font-bold group/btn"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Manage All Events
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Last updated</span>
                  <span className="text-accent font-medium">Just now</span>
                </div>
              </div>
            </div>

            {/* Registrations Management Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 group">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <div className="flex items-center text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Registrations</h3>
                    <p className="text-white/80">{stats.totalRegistrations} total registrations</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  View and manage all event registrations. Track attendees, check capacity, and export registration data.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      router.push('/pages/dashboard/registrations');
                    }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-bold group/btn"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View All Registrations
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                  
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Average per event</span>
                      <span className="text-purple-400 font-bold text-lg">
                        {stats.totalEvents > 0 ? Math.round(stats.totalRegistrations / stats.totalEvents) : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-purple-400 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Programs Management Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500 group">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
                <div className="flex items-center text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <Repeat className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Recurring Programs</h3>
                    <p className="text-white/80">{stats.totalPrograms} total programs</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Manage recurring programs that happen weekly, bi-weekly, or monthly at MAH.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      router.push('/pages/dashboard/programs/add');
                    }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 font-bold group/btn"
                  >
                    <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover/btn:rotate-90" />
                    Add New Program
                  </button>
                  
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      router.push('/pages/dashboard/programs');
                    }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-emerald-500/50 hover:text-white transition-all duration-300 font-bold group/btn"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Manage All Programs
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Active programs</span>
                  <span className="text-emerald-400 font-medium">{stats.totalPrograms}</span>
                </div>
              </div>
            </div>

            {/* Analytics Dashboard Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 group">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Analytics</h3>
                    <p className="text-white/80">Data insights & trends</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  View comprehensive analytics with charts, graphs, and insights. Track demographics, trends, and event performance.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      router.push('/pages/dashboard/analytics');
                    }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 font-bold group/btn"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                  
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Features</span>
                      <span className="text-blue-400 font-bold text-lg">Charts & Filters</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Real-time data</span>
                  <span className="text-blue-400 font-medium">Live</span>
                </div>
              </div>
            </div>

            {/* Volunteering Management Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-pink-500/50 transition-all duration-500 group">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6">
                <div className="flex items-center text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <Heart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Volunteering</h3>
                    <p className="text-white/80">{stats.totalVolunteerApplicants} total applicants</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Manage volunteer positions, exec team applications, youth committee, and volunteer hours team.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      router.push('/pages/dashboard/volunteering');
                    }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 font-bold group/btn"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Manage Volunteering
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                  
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Total Applicants</span>
                      <span className="text-pink-400 font-bold text-lg">{stats.totalVolunteerApplicants}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-pink-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}