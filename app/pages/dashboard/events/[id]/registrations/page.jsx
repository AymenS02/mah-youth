'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '/components/header/Header';
import {
  Users, ArrowLeft, Search, Mail, Phone, User, Calendar,
  CheckCircle, Filter, ChevronDown, ChevronUp, UserCheck, Clock
} from 'lucide-react';

export default function EventRegistrationsPage({ params }) {
  const { id: eventId } = use(params);
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }
    fetchData();
  }, [router, eventId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [eventRes, regsRes] = await Promise.all([
        fetch(`/api/events/${eventId}`),
        fetch(`/api/registrations?eventId=${eventId}`),
      ]);

      if (eventRes.ok) {
        const eventData = await eventRes.json();
        setEvent(eventData.event);
      }

      if (regsRes.ok) {
        const regsData = await regsRes.json();
        setRegistrations(regsData.registrations || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheckIn = async (registration) => {
    const newCheckedIn = !registration.checkedIn;
    setUpdatingId(registration._id);
    try {
      const response = await fetch(`/api/registrations/${registration._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkedIn: newCheckedIn }),
      });

      if (response.ok) {
        setRegistrations(prev =>
          prev.map(r =>
            r._id === registration._id
              ? { ...r, checkedIn: newCheckedIn, checkedInAt: newCheckedIn ? new Date().toISOString() : null }
              : r
          )
        );
      } else {
        const data = await response.json();
        alert('Failed to update check-in: ' + data.error);
      }
    } catch (error) {
      console.error('Error toggling check-in:', error);
      alert('Failed to update check-in. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const applyFilters = (regs) => {
    return regs.filter(reg => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        reg.fullName.toLowerCase().includes(term) ||
        reg.email.toLowerCase().includes(term) ||
        reg.phone.includes(searchTerm) ||
        (reg.gender && reg.gender.toLowerCase().includes(term)) ||
        (reg.dietaryRestrictions && reg.dietaryRestrictions.toLowerCase().includes(term)) ||
        (reg.additionalNotes && reg.additionalNotes.toLowerCase().includes(term));

      const matchesGender = filterGender === 'all' || reg.gender === filterGender;
      const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
      const matchesAgeMin = !ageMin || reg.age >= parseInt(ageMin, 10);
      const matchesAgeMax = !ageMax || reg.age <= parseInt(ageMax, 10);

      return matchesSearch && matchesGender && matchesStatus && matchesAgeMin && matchesAgeMax;
    });
  };

  const checkedIn = applyFilters(registrations.filter(r => r.checkedIn));
  const notCheckedIn = applyFilters(registrations.filter(r => !r.checkedIn));
  const totalCheckedIn = registrations.filter(r => r.checkedIn).length;

  const RegistrationCard = ({ reg }) => (
    <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-accent/50 transition-all duration-300">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-white font-semibold">
          <User className="w-4 h-4 text-accent shrink-0" />
          <span className="truncate">{reg.fullName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Mail className="w-4 h-4 text-accent shrink-0" />
          <span className="truncate">{reg.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Phone className="w-4 h-4 text-accent shrink-0" />
          <span>{reg.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <User className="w-4 h-4 text-accent shrink-0" />
          <span>Age {reg.age} · {reg.gender}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Calendar className="w-4 h-4 text-accent shrink-0" />
          <span>{new Date(reg.registeredAt).toLocaleDateString()}</span>
        </div>
        {reg.checkedIn && reg.checkedInAt && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Checked in {new Date(reg.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
        {reg.dietaryRestrictions && (
          <div className="sm:col-span-2 lg:col-span-3 text-gray-400 text-xs">
            <span className="font-medium text-gray-300">Dietary:</span> {reg.dietaryRestrictions}
          </div>
        )}
      </div>

      <button
        onClick={() => toggleCheckIn(reg)}
        disabled={updatingId === reg._id}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shrink-0 ${
          reg.checkedIn
            ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400'
            : 'bg-accent/10 border-2 border-accent/50 text-accent hover:bg-accent hover:text-white'
        }`}
      >
        {updatingId === reg._id ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : reg.checkedIn ? (
          <UserCheck className="w-4 h-4" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        {reg.checkedIn ? 'Checked In' : 'Check In'}
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />

      <div className="pt-32 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.push('/pages/dashboard/events')}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Back to Events</span>
          </button>

          <div className="flex items-start gap-4 mb-2">
            <div className="p-3 bg-accent/10 rounded-xl shrink-0">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {event ? event.title : 'Event'} — Registrations
              </h1>
              {event && (
                <p className="text-gray-400 mt-1">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {event.location && ` · ${event.location}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-5 border border-gray-700/50">
            <p className="text-gray-400 text-sm mb-1">Total Registered</p>
            <p className="text-3xl font-black text-white">{registrations.length}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-5 border border-emerald-500/30">
            <p className="text-gray-400 text-sm mb-1">Checked In</p>
            <p className="text-3xl font-black text-emerald-400">{totalCheckedIn}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-5 border border-gray-700/50">
            <p className="text-gray-400 text-sm mb-1">Awaiting Check-in</p>
            <p className="text-3xl font-black text-white">{registrations.length - totalCheckedIn}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700/50 p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, gender..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-2 px-5 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-accent transition-all font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-700/50">
              {/* Gender Filter */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm"
                >
                  <option value="all" className="bg-gray-900">All Genders</option>
                  <option value="Male" className="bg-gray-900">Male</option>
                  <option value="Female" className="bg-gray-900">Female</option>
                  <option value="Non-binary" className="bg-gray-900">Non-binary</option>
                  <option value="Prefer not to say" className="bg-gray-900">Prefer not to say</option>
                  <option value="Other" className="bg-gray-900">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">Registration Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm"
                >
                  <option value="all" className="bg-gray-900">All Statuses</option>
                  <option value="confirmed" className="bg-gray-900">Confirmed</option>
                  <option value="waitlist" className="bg-gray-900">Waitlist</option>
                  <option value="cancelled" className="bg-gray-900">Cancelled</option>
                </select>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">Min Age</label>
                <input
                  type="number"
                  placeholder="e.g. 13"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-medium mb-2">Max Age</label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-accent outline-none text-sm"
                />
              </div>

              {/* Clear filters */}
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterGender('all');
                    setFilterStatus('all');
                    setAgeMin('');
                    setAgeMax('');
                  }}
                  className="text-sm text-gray-400 hover:text-accent transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Awaiting Check-in Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            Awaiting Check-in
            <span className="text-gray-400 font-normal text-base">({notCheckedIn.length})</span>
          </h2>
          {notCheckedIn.length === 0 ? (
            <div className="bg-gray-900/40 border border-gray-700/50 rounded-xl p-8 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-gray-400">
                {registrations.filter(r => !r.checkedIn).length === 0
                  ? 'Everyone has been checked in!'
                  : 'No results match your filters.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notCheckedIn.map(reg => <RegistrationCard key={reg._id} reg={reg} />)}
            </div>
          )}
        </div>

        {/* Checked-in Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            Checked In
            <span className="text-gray-400 font-normal text-base">({checkedIn.length})</span>
          </h2>
          {checkedIn.length === 0 ? (
            <div className="bg-gray-900/40 border border-gray-700/50 rounded-xl p-8 text-center">
              <UserCheck className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No one has been checked in yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {checkedIn.map(reg => <RegistrationCard key={reg._id} reg={reg} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
