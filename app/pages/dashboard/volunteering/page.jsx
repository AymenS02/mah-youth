'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "/components/header/Header";
import { Users, Briefcase, Heart, GraduationCap, ArrowLeft, ArrowRight, Plus, Eye } from 'lucide-react';

export default function VolunteeringDashboard() {
  const [stats, setStats] = useState({
    execPositions: 0,
    execApplications: 0,
    youthCommitteeApplicants: 0,
    volunteerHoursApplicants: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch exec positions
      const positionsRes = await fetch('/api/volunteering/exec-positions');
      const positionsData = await positionsRes.json();
      
      // Fetch exec applications
      const execAppsRes = await fetch('/api/volunteering/exec-applications');
      const execAppsData = await execAppsRes.json();
      
      // Fetch youth committee applications
      const youthRes = await fetch('/api/volunteering/youth-committee');
      const youthData = await youthRes.json();
      
      // Fetch volunteer hours applications
      const hoursRes = await fetch('/api/volunteering/volunteer-hours');
      const hoursData = await hoursRes.json();

      setStats({
        execPositions: positionsData.success ? positionsData.count : 0,
        execApplications: execAppsData.success ? execAppsData.count : 0,
        youthCommitteeApplicants: youthData.success ? youthData.count : 0,
        volunteerHoursApplicants: hoursData.success ? hoursData.count : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading volunteering dashboard...</p>
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
              router.push('/pages/dashboard');
            }}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-accent to-accent-light rounded-2xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white">Volunteering Management</h1>
              <p className="text-gray-300 text-lg mt-2">Manage volunteer positions and applications</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50 hover:border-accent/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-8 h-8 text-accent" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Exec Positions</p>
            <p className="text-4xl font-black text-white">{stats.execPositions}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Exec Applications</p>
            <p className="text-4xl font-black text-white">{stats.execApplications}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Youth Committee</p>
            <p className="text-4xl font-black text-white">{stats.youthCommitteeApplicants}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <GraduationCap className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">Volunteer Hours</p>
            <p className="text-4xl font-black text-white">{stats.volunteerHoursApplicants}</p>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exec Positions Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-accent/50 transition-all duration-500 group">
            <div className="bg-gradient-to-r from-accent to-accent-light p-6">
              <div className="flex items-center text-white">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Exec Team Positions</h3>
                  <p className="text-white/80">{stats.execPositions} active positions</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Create and manage job postings for the exec team. Add custom questions to gather information from applicants.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    router.push('/pages/dashboard/volunteering/exec-positions');
                  }}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-accent to-accent-light text-white rounded-xl hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-bold group/btn"
                >
                  <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover/btn:rotate-90" />
                  Manage Positions
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Applications received</span>
                <span className="text-accent font-medium">{stats.execApplications}</span>
              </div>
            </div>
          </div>

          {/* Youth Committee Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 group">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div className="flex items-center text-white">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Youth Committee</h3>
                  <p className="text-white/80">{stats.youthCommitteeApplicants} applicants</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6 leading-relaxed">
                View and manage youth committee applications. These members help plan and organize community activities.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    router.push('/pages/dashboard/volunteering/youth-committee');
                  }}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-bold group/btn"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Applicants
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total applicants</span>
                <span className="text-purple-400 font-medium">{stats.youthCommitteeApplicants}</span>
              </div>
            </div>
          </div>

          {/* Volunteer Hours Card */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500 group lg:col-span-2">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
              <div className="flex items-center text-white">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Volunteer Hours Team</h3>
                  <p className="text-white/80">{stats.volunteerHoursApplicants} students registered</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 mb-6 leading-relaxed">
                View and manage volunteer hours applications from high school students. Track parent/guardian information and coordinate with schools.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    router.push('/pages/dashboard/volunteering/volunteer-hours');
                  }}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 font-bold group/btn"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Applicants
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="bg-gray-800/30 px-6 py-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total students</span>
                <span className="text-emerald-400 font-medium">{stats.volunteerHoursApplicants}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
