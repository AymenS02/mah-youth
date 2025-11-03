'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { Plus, Edit, Trash2, Calendar, Users, LogOut, TrendingUp, Activity, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    events: 0,
    users: 0
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
    
    const fetchStats = async () => {
      try {
        const [eventsRes, usersRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/accounts")
        ]);

        const [eventsData, usersData] = await Promise.all([
          eventsRes.json(),
          usersRes.json()
        ]);

        setStats({
          events: eventsData.pagination?.total || 0,
          users: usersData.pagination?.total || 0
        });

      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Events Stats */}
          <div className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700/50 hover:border-accent/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Total Events</p>
              <p className="text-5xl font-black text-white mb-2">{stats.events}</p>
              <p className="text-gray-500 text-sm">Events in your system</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => router.push('/pages/dashboard/events')}
                className="text-accent hover:text-accent-light transition-colors duration-300 font-medium flex items-center gap-2 group/link"
              >
                View all events
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Users Stats */}
          <div className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-purple-500" />
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">Total Users</p>
              <p className="text-5xl font-black text-white mb-2">{stats.users}</p>
              <p className="text-gray-500 text-sm">Registered users</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-purple-400 font-medium flex items-center gap-2">
                Active community members
              </p>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    <p className="text-white/80">{stats.events} total events</p>
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
                    onClick={() => router.push('/pages/dashboard/events/add')}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-accent to-accent-light text-white rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold group/btn"
                  >
                    <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover/btn:rotate-90" />
                    Add New Event
                  </button>
                  
                  <button
                    onClick={() => router.push('/pages/dashboard/events')}
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

            {/* Coming Soon Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 opacity-60">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <div className="flex items-center text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">User Management</h3>
                    <p className="text-white/80">Coming Soon</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  User management features are currently in development. Soon you'll be able to manage user accounts, permissions, and more.
                </p>
                
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
                  <Activity className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">Feature in development</p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-purple-400 font-medium">In Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}