'use client';
import { useState, useEffect } from 'react';
import Header from '/components/header/Header';
import { Repeat, Clock, MapPin, User, Calendar, ExternalLink, DollarSign, Users } from 'lucide-react';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/programs?active=true');
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

  const getRecurrenceDisplay = (program) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (program.recurrenceType === 'weekly') {
      return `Every ${days[program.dayOfWeek]}`;
    } else if (program.recurrenceType === 'bi-weekly') {
      const weekText = program.weekPattern === '1,3' ? '1st & 3rd' : '2nd & 4th';
      return `${weekText} ${days[program.dayOfWeek]} of every month`;
    } else if (program.recurrenceType === 'monthly') {
      return `Monthly on the ${program.dayOfMonth}${getOrdinalSuffix(program.dayOfMonth)}`;
    }
    return 'Custom schedule';
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

  const getRecurrenceColor = (type) => {
    switch (type) {
      case 'weekly':
        return 'from-blue-500 to-blue-600';
      case 'bi-weekly':
        return 'from-purple-500 to-purple-600';
      case 'monthly':
        return 'from-emerald-500 to-emerald-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-dark to-primary-light">
      <Header />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-emerald-500/30">
            <Repeat className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-500 tracking-wider uppercase">
              Recurring Programs
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Weekly Programs at MAH
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join us for our regular programs designed to engage, educate, and build community. 
            Programs run consistently throughout the year.
          </p>
        </div>

        {/* Programs List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 border-2 border-gray-700/50 text-center">
            <Repeat className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Programs Available</h3>
            <p className="text-gray-400">Check back soon for upcoming programs!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program._id}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 group"
              >
                {/* Program Image */}
                {program.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
                )}

                {/* Program Header */}
                <div className={`p-6 ${!program.imageUrl ? 'border-b border-gray-700' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors flex-1 pr-4">
                      {program.title}
                    </h2>
                  </div>

                  {/* Recurrence Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${getRecurrenceColor(program.recurrenceType)} text-white mb-4`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{getRecurrenceDisplay(program)}</span>
                  </div>
                </div>

                {/* Program Details */}
                <div className="p-6 pt-0">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {program.description}
                  </p>

                  {/* Info Grid */}
                  <div className="space-y-3 mb-4">
                    {/* Host */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <User className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                      <span className="font-medium text-white">Host:</span>
                      <span className="truncate">{program.host}</span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                      <span>{program.startTime} - {program.endTime}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                      <span className="truncate">{program.location}</span>
                    </div>

                    {/* Category */}
                    {program.category && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md font-medium">
                          {program.category}
                        </span>
                      </div>
                    )}

                    {/* Capacity */}
                    {program.capacity > 0 && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Users className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                        <span>Capacity: {program.capacity} people</span>
                      </div>
                    )}

                    {/* Price */}
                    {program.price > 0 && (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span>${program.price.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Notes */}
                  {program.notes && (
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                      <p className="text-gray-400 text-xs leading-relaxed">{program.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {program.registrationLink && (
                      <a
                        href={program.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 font-bold group/btn"
                      >
                        Register Now
                        <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                      </a>
                    )}

                    {program.contactInfo && (
                      <div className="text-center text-xs text-gray-400">
                        Contact: <span className="text-emerald-400">{program.contactInfo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className={`h-1 bg-gradient-to-r ${getRecurrenceColor(program.recurrenceType)}`}></div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {programs.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-2xl p-8 border border-emerald-500/30">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-3">Join Us!</h3>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                These programs run regularly at MAH. All are welcome to attend. 
                For more information or questions about any program, please contact us.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
