'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <div className="pt-[200px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:items-center py-6 flex-col md:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="max-md:py-6 flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.events}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Edit className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <div className="flex items-center text-white">
                <Calendar className="w-8 h-8 mr-3" />
                <div>
                  <h3 className="text-xl font-bold">Events</h3>
                  <p className="text-blue-100">{stats.events} events</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">Manage your events: add, edit, or delete upcoming events.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/pages/dashboard/events/add')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Event
                </button>
                
                <button
                  onClick={() => router.push('/pages/dashboard/events')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Manage Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
