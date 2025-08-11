// app/pages/dashboard/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { BookOpen, FileText, Video, Plus, Edit, Trash2, Users, BarChart3, Settings } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    books: 0,
    articles: 0,
    videos: 0,
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
    
    // TODO: Fetch actual stats from your APIs
    // This is mock data - replace with real API calls
    setStats({
      books: 24,
      articles: 156,
      videos: 42,
      users: 1250
    });
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

  const contentSections = [
    {
      title: 'Books',
      icon: BookOpen,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      count: stats.books,
      description: 'Manage your book collection',
      actions: [
        { label: 'Add Book', path: '/pages/dashboard/books/add', icon: Plus },
        { label: 'Manage Books', path: '/pages/dashboard/books', icon: Edit },
      ]
    },
    {
      title: 'Articles',
      icon: FileText,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      count: stats.articles,
      description: 'Manage your articles',
      actions: [
        { label: 'Add Article', path: '/pages/dashboard/articles/add', icon: Plus },
        { label: 'Manage Articles', path: '/pages/dashboard/articles', icon: Edit },
      ]
    },
    {
      title: 'Videos',
      icon: Video,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      count: stats.videos,
      description: 'Manage your videos',
      actions: [
        { label: 'Add Videos', path: '/pages/dashboard/videos/add', icon: Plus },
        { label: 'Manage Videos', path: '/pages/dashboard/videos', icon: Edit },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <div className="pt-[200px] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/pages/dashboard/settings')}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition duration-200"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.books}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.articles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {contentSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.title} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`${section.color} px-6 py-4`}>
                  <div className="flex items-center text-white">
                    <IconComponent className="w-8 h-8 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold">{section.title}</h3>
                      <p className="text-blue-100">{section.count} items</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{section.description}</p>
                  
                  <div className="space-y-3">
                    {section.actions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() => router.push(action.path)}
                          className={`w-full flex items-center justify-center px-4 py-3 ${section.color} text-white rounded-md ${section.hoverColor} transition duration-200 font-medium`}
                        >
                          <ActionIcon className="w-5 h-5 mr-2" />
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            <div className="flex items-center py-3 px-4 bg-blue-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">New book "Advanced JavaScript" added</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center py-3 px-4 bg-green-50 rounded-lg">
              <FileText className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Article "React Best Practices" updated</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center py-3 px-4 bg-purple-50 rounded-lg">
              <Video className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Video "Database Design" published</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
}