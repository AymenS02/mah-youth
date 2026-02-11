'use client';
import { Users, Book, Heart, Calendar, MapPin, DollarSign, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

const WeeklyPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get icon based on category
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'education':
      case 'learning':
        return <Book className="w-full h-full" />;
      case 'community':
      case 'social':
        return <Users className="w-full h-full" />;
      case 'wellness':
      case 'health':
        return <Heart className="w-full h-full" />;
      default:
        return <Calendar className="w-full h-full" />;
    }
  };

  // Helper function to get color gradient based on category
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'education':
      case 'learning':
        return 'from-blue-500 to-blue-600';
      case 'community':
      case 'social':
        return 'from-purple-500 to-purple-600';
      case 'wellness':
      case 'health':
        return 'from-pink-500 to-pink-600';
      default:
        return 'from-accent to-accent-light';
    }
  };

  // Helper function to format recurrence text
  const getRecurrenceText = (program) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (program.recurrenceType === 'weekly' && program.dayOfWeek !== undefined) {
      return `Every ${days[program.dayOfWeek]}`;
    } else if (program.recurrenceType === 'bi-weekly' && program.dayOfWeek !== undefined) {
      const weekText = program.weekPattern === '1,2' ? 'First half' : program.weekPattern === '3,4' ? 'Second half' : '';
      return `${weekText} ${days[program.dayOfWeek]}s`;
    } else if (program.recurrenceType === 'monthly' && program.dayOfMonth) {
      const suffix = getOrdinalSuffix(program.dayOfMonth);
      return `Monthly on the ${program.dayOfMonth}${suffix}`;
    }
    return program.recurrenceType || 'Recurring';
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

  // Helper function to format time
  const formatTime = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  // 🔄 Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/programs');
        const data = await response.json();
        if (response.ok) {
          // Filter only active programs and sort by creation date or next occurrence
          const activePrograms = data.programs
            .filter(program => program.isActive)
            .slice(0, 6); // Show up to 6 programs
          setPrograms(activePrograms);
        } else {
          setError(data.error || 'Failed to fetch programs');
          console.error('Failed to fetch programs:', data.error);
        }
      } catch (error) {
        setError('Error loading programs');
        console.error('Error fetching programs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleContactUsClick = () => {
    window.location.href = '/pages/programs';
  };

  const handleRegistrationClick = (registrationLink) => {
    if (registrationLink) {
      window.open(registrationLink, '_blank');
    }
  };

  return (
    <section className="min-h-screen py-12 lg:py-20 bg-gradient-to-b from-primary-light to-primary-dark flex items-center justify-center px-4">
      <div className="boxScaler w-full max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-8 lg:py-10 bg-gradient-to-br from-gray-900 to-black border-2 border-accent/30 backdrop-blur-sm text-light rounded-2xl shadow-2xl">
        
        {/* Header Section */}
        <div className="mb-8 lg:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-4">
            Our Programs
          </h1>
          <div className="w-16 lg:w-24 h-1 bg-gradient-to-r from-accent to-accent-light mx-auto mb-4 lg:mb-6"></div>
          <p className="text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Join us for our engaging programs designed for youth development and community building.
          </p>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && programs.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">No active programs at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for upcoming programs!</p>
          </div>
        )}
        
        {/* Programs Grid */}
        {!isLoading && !error && programs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-12">
            {programs.map((program) => (
              <div
                key={program._id}
                className="box-member group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300 lg:hover:scale-105 hover:shadow-2xl"
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(program.category)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative p-4 sm:p-5 lg:p-6">
                  {/* Schedule Badge */}
                  <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
                    <span className="px-2 py-1 lg:px-3 lg:py-1 text-xs font-semibold bg-accent/20 text-accent rounded-full border border-accent/30">
                      {getRecurrenceText(program)}
                    </span>
                  </div>

                  {/* Icon and Title Section */}
                  <div className="flex items-start gap-3 lg:gap-4 mb-3 lg:mb-4 pr-16 lg:pr-24">
                    <div className={`bg-gradient-to-br ${getCategoryColor(program.category)} p-2.5 lg:p-3 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white w-6 h-6 lg:w-8 lg:h-8">
                        {getCategoryIcon(program.category)}
                      </div>
                    </div>
                    
                    <div className="text-left flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1.5 lg:mb-2 group-hover:text-accent transition-colors duration-300 break-words">
                        {program.title}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs lg:text-sm font-medium">{formatTime(program.startTime, program.endTime)}</p>
                      </div>
                      {program.host && (
                        <p className="text-xs text-gray-500">Hosted by {program.host}</p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-3 lg:my-4"></div>

                  {/* Description */}
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed text-left mb-3">
                    {program.description}
                  </p>

                  {/* Program Details */}
                  <div className="space-y-2 text-left">
                    {program.location && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{program.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs">
                      {program.capacity > 0 && (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{program.currentAttendees || 0}/{program.capacity} spots</span>
                        </div>
                      )}
                      
                      {program.price !== undefined && (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{program.price === 0 ? 'Free' : `$${program.price}`}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Registration Button */}
                  {program.registrationLink && (
                    <button
                      onClick={() => handleRegistrationClick(program.registrationLink)}
                      className="mt-4 w-full px-4 py-2 bg-accent/20 text-accent text-sm font-semibold rounded-lg hover:bg-accent/30 border border-accent/30 hover:border-accent/50 transition-all duration-300"
                    >
                      Register Now
                    </button>
                  )}

                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(program.category)} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-xs sm:text-sm mb-3 lg:mb-4 px-4">
            Want to learn more or register for a program?
          </p>
          <button 
            onClick={handleContactUsClick} 
            className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-accent to-accent-light text-white text-sm lg:text-base font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/50 transform hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Programs & Registration
          </button>
        </div>
      </div>
    </section>
  );
};

export default WeeklyPrograms;