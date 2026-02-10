'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '/components/header/Header';
import { Calendar, Plus, Edit, Trash2, ArrowLeft, Search, Filter, Clock, MapPin, User, Repeat } from 'lucide-react';

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }

    fetchPrograms();
  }, [router]);

  useEffect(() => {
    filterProgramsList();
  }, [programs, searchTerm, filterActive]);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/programs');
      const data = await response.json();

      if (data.success) {
        setPrograms(data.programs);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProgramsList = () => {
    let filtered = [...programs];

    // Filter by active status
    if (filterActive === 'active') {
      filtered = filtered.filter(p => p.isActive);
    } else if (filterActive === 'inactive') {
      filtered = filtered.filter(p => !p.isActive);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.host.toLowerCase().includes(search) ||
        p.location.toLowerCase().includes(search)
      );
    }

    setFilteredPrograms(filtered);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this program?')) {
      return;
    }

    try {
      const response = await fetch(`/api/programs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchPrograms();
      } else {
        alert('Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Error deleting program');
    }
  };

  const getRecurrenceDisplay = (program) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    if (program.recurrenceType === 'weekly') {
      return `Every ${days[program.dayOfWeek]}`;
    } else if (program.recurrenceType === 'bi-weekly') {
      const weekText = program.weekPattern === '1,3' ? '1st & 3rd' : '2nd & 4th';
      return `${weekText} ${days[program.dayOfWeek]}`;
    } else if (program.recurrenceType === 'monthly') {
      return `Monthly on ${program.dayOfMonth}${getOrdinalSuffix(program.dayOfMonth)}`;
    }
    return 'Custom';
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              router.push('/pages/dashboard');
            }}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-xl">
                <Repeat className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white">
                  Recurring Programs
                </h1>
                <p className="text-xl text-gray-300 mt-2">
                  {programs.length} program{programs.length !== 1 ? 's' : ''} total
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                window.scrollTo(0, 0);
                router.push('/pages/dashboard/programs/add');
              }}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 font-bold flex items-center gap-2 justify-center group transform hover:scale-105"
            >
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              Add New Program
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Programs</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Programs List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading programs...</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 border-2 border-gray-700/50 text-center">
            <Repeat className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Programs Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterActive !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first recurring program'}
            </p>
            {!searchTerm && filterActive === 'all' && (
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  router.push('/pages/dashboard/programs/add');
                }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Program
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => (
              <div
                key={program._id}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 group"
              >
                {/* Program Header */}
                <div className={`p-6 ${program.isActive ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10' : 'bg-gray-800/30'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {program.title}
                      </h3>
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <Repeat className="w-4 h-4" />
                        <span>{getRecurrenceDisplay(program)}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      program.isActive 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                    }`}>
                      {program.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Program Details */}
                <div className="p-6">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-white">Host:</span>
                      <span>{program.host}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{program.startTime} - {program.endTime}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => {
                        window.scrollTo(0, 0);
                        router.push(`/pages/dashboard/programs/${program._id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all duration-300 font-bold group/btn"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(program._id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-bold group/btn"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
