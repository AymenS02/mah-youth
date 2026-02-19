'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { GraduationCap, ArrowLeft, Search, Mail, Phone, Calendar, User, Users } from 'lucide-react';

export default function VolunteerHoursApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
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

    fetchApplicants();
  }, [router]);

  useEffect(() => {
    filterApplicants();
  }, [searchTerm, filterStatus, applicants]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/volunteering/volunteer-hours');
      const data = await response.json();

      if (response.ok) {
        setApplicants(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = applicants;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm) ||
        app.highSchool.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplicants(filtered);
  };

  const statusCounts = {
    all: applicants.length,
    pending: applicants.filter(a => a.status === 'pending').length,
    approved: applicants.filter(a => a.status === 'approved').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading applicants...</p>
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
            onClick={() => {
              window.scrollTo(0, 0);
              router.push('/pages/dashboard/volunteering');
            }}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Volunteering Dashboard
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white">Volunteer Hours Team</h1>
              <p className="text-gray-300 text-lg mt-2">{applicants.length} total students</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-3 overflow-x-auto">
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-800 border-2 border-gray-700 text-gray-300 hover:border-emerald-500/50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-6">
          {filteredApplicants.length === 0 ? (
            <div className="bg-gray-900/50 border-2 border-gray-700 rounded-3xl p-12 text-center">
              <GraduationCap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No applicants match your filters.' 
                  : 'No applicants yet.'}
              </p>
            </div>
          ) : (
            filteredApplicants.map(applicant => (
              <div
                key={applicant._id}
                className="bg-gray-900/50 border-2 border-gray-700 rounded-2xl p-6 md:p-8 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="flex flex-col gap-6">
                  {/* Student Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold text-white">
                        {applicant.firstName} {applicant.lastName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        applicant.status === 'approved' 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : applicant.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {applicant.status}
                      </span>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
                      <p className="text-emerald-200 text-sm font-bold mb-2">Student Information</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail className="w-4 h-4 text-emerald-400" />
                          <span>{applicant.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>{applicant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <User className="w-4 h-4 text-emerald-400" />
                          <span>Age: {applicant.age} • {applicant.gender}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <GraduationCap className="w-4 h-4 text-emerald-400" />
                          <span>{applicant.highSchool}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-emerald-400" />
                          <span>Applied {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parent/Guardian Info */}
                  <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4">
                    <p className="text-gray-400 text-sm font-bold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Parent/Guardian Information
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="text-gray-300">
                        <span className="text-gray-500">Name:</span> {applicant.parentFirstName} {applicant.parentLastName}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-gray-500">Email:</span> {applicant.parentEmail}
                      </div>
                      <div className="text-gray-300">
                        <span className="text-gray-500">Phone:</span> {applicant.parentPhone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
