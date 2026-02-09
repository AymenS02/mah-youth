'use client';
import { Users, Book, Heart } from "lucide-react";
import { useEffect } from "react";

const WeeklyPrograms = () => {

  const handleContactUsClick = () => {
    window.location.href = '/pages/contact';
  }

  const programs = [
    {
      day: "Friday",
      title: "Jumu'ah Youth Circle",
      time: "1:00 PM - 2:30 PM",
      description: "Post-Jumu'ah discussion circle and community building",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/20",
    },
    {
      day: "Saturday",
      title: "Quran Study Group",
      time: "10:00 AM - 11:30 AM",
      description: "Tafseer and memorization sessions for all levels",
      icon: <Book className="w-8 h-8" />,
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-500/20",
    },
    {
      day: "Sunday",
      title: "Sports & Recreation",
      time: "3:00 PM - 5:00 PM",
      description: "Basketball, soccer, and other sports activities",
      icon: <Heart className="w-8 h-8" />,
      color: "from-rose-500 to-rose-600",
      iconBg: "bg-rose-500/20",
    },
    {
      day: "Wednesday",
      title: "Youth Night",
      time: "7:00 PM - 9:00 PM",
      description: "Games, discussions, and social activities",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/20",
    },
  ];

  useEffect(() => {
  if (programs.length > 0) return;{
    const timer = setTimeout(() => {
      const cleanup = animateWeeklyPrograms(); // Get cleanup function
      
      // Return cleanup from the timer callback
      return cleanup;
    }, 100);

    // Return function that clears timer and runs cleanup
    return () => {
      clearTimeout(timer);
    };
  }
}, [programs]);

  return (
    <section className="min-h-screen py-12 lg:py-20 bg-gradient-to-b from-primary-light to-primary-dark flex items-center justify-center px-4">
      <div className="boxScaler w-full max-w-6xl text-center px-4 sm:px-6 lg:px-8 py-8 lg:py-10 bg-gradient-to-br from-gray-900 to-black border-2 border-accent/30 backdrop-blur-sm text-light rounded-2xl shadow-2xl">
        
        {/* Header Section */}
        <div className="mb-8 lg:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-4">
            Weekly Programs
          </h1>
          <div className="w-16 lg:w-24 h-1 bg-gradient-to-r from-accent to-accent-light mx-auto mb-4 lg:mb-6"></div>
          <p className="text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            Join us for our engaging weekly programs designed for youth
            development and community building.
          </p>
        </div>
        
        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-12">
          {programs.map((program, index) => (
            <div
              key={index}
              className="box-member group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300 lg:hover:scale-105 hover:shadow-2xl"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative p-4 sm:p-5 lg:p-6">
                {/* Day Badge */}
                <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
                  <span className="px-2 py-1 lg:px-3 lg:py-1 text-xs font-semibold bg-accent/20 text-accent rounded-full border border-accent/30">
                    {program.day}
                  </span>
                </div>

                {/* Icon and Title Section */}
                <div className="flex items-start gap-3 lg:gap-4 mb-3 lg:mb-4 pr-16 lg:pr-20">
                  <div className={`${program.iconBg} p-2.5 lg:p-3 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-accent w-6 h-6 lg:w-8 lg:h-8">
                      {program.icon}
                    </div>
                  </div>
                  
                  <div className="text-left flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1.5 lg:mb-2 group-hover:text-accent transition-colors duration-300 break-words">
                      {program.title}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs lg:text-sm font-medium">{program.time}</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-3 lg:my-4"></div>

                {/* Description */}
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed text-left">
                  {program.description}
                </p>

                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${program.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-xs sm:text-sm mb-3 lg:mb-4 px-4">
            Want to learn more or register for a program?
          </p>
          <button onClick={handleContactUsClick} className="px-6 lg:px-8 py-2.5 lg:py-3 bg-gradient-to-r from-accent to-accent-light text-white text-sm lg:text-base font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/50 transform hover:scale-105 transition-all duration-300 active:scale-95">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default WeeklyPrograms;