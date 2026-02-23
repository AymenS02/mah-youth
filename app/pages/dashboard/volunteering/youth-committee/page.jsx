'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { Users, ArrowLeft, Search, Mail, Phone, Calendar, User, CheckCircle, XCircle } from 'lucide-react';

export default function YouthCommitteeApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
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
      const response = await fetch('/api/volunteering/youth-committee');
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

    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm)
      );
    }

    setFilteredApplicants(filtered);
  };

  const updateStatus = async (applicantId, newStatus) => {
    setUpdatingId(applicantId);
    try {
      const response = await fetch(`/api/volunteering/youth-committee/${applicantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplicants(prev =>
          prev.map(a => a._id === applicantId ? { ...a, status: newStatus } : a)
        );
      } else {
        const data = await response.json();
        alert('Failed to update status: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
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
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white">Youth Committee Applicants</h1>
              <p className="text-gray-300 text-lg mt-2">{applicants.length} total applicants</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
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
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 border-2 border-gray-700 text-gray-300 hover:border-purple-500/50'
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
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
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
                className="bg-gray-900/50 border-2 border-gray-700 rounded-2xl p-6 md:p-8 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <span>{applicant.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Phone className="w-5 h-5 text-purple-400" />
                        <span>{applicant.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <User className="w-5 h-5 text-purple-400" />
                        <span>Age: {applicant.age} • {applicant.gender}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <span>Applied {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <p className="text-purple-200 text-sm">
                        <strong>Note:</strong> Remember to add this applicant to the WhatsApp group!
                      </p>
                    </div>
                  </div>

                  {/* Approve / Reject Actions */}
                  <div className="flex flex-row md:flex-col gap-3 shrink-0">
                    <button
                      onClick={() => updateStatus(applicant._id, 'approved')}
                      disabled={applicant.status === 'approved' || updatingId === applicant._id}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                        applicant.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 cursor-default'
                          : 'bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(applicant._id, 'rejected')}
                      disabled={applicant.status === 'rejected' || updatingId === applicant._id}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                        applicant.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400 border-2 border-red-500/40 cursor-default'
                          : 'bg-red-500/10 border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    {applicant.status !== 'pending' && (
                      <button
                        onClick={() => updateStatus(applicant._id, 'pending')}
                        disabled={updatingId === applicant._id}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-yellow-500/10 border-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-white transition-all duration-300"
                      >
                        Reset
                      </button>
                    )}
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
