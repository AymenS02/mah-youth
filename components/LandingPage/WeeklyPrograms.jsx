import { Users, Book, Heart } from "lucide-react";

const WeeklyPrograms = () => {
  const programs = [
    {
      day: "Friday",
      title: "Jumu'ah Youth Circle",
      time: "1:00 PM - 2:30 PM",
      description: "Post-Jumu'ah discussion circle and community building",
      icon: <Users className="w-8 h-8" />,
    },
    {
      day: "Saturday",
      title: "Quran Study Group",
      time: "10:00 AM - 11:30 AM",
      description: "Tafseer and memorization sessions for all levels",
      icon: <Book className="w-8 h-8" />,
    },
    {
      day: "Sunday",
      title: "Sports & Recreation",
      time: "3:00 PM - 5:00 PM",
      description: "Basketball, soccer, and other sports activities",
      icon: <Heart className="w-8 h-8" />,
    },
    {
      day: "Wednesday",
      title: "Youth Night",
      time: "7:00 PM - 9:00 PM",
      description: "Games, discussions, and social activities",
      icon: <Users className="w-8 h-8" />,
    },
  ];

  return (
    <section className="min-h-screen py-20 bg-[var(--bg-light)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--fg-primary)] mb-4">
            Weekly Programs
          </h2>
          <p className="text-xl text-[var(--fg-secondary)] max-w-2xl mx-auto">
            Regular activities to keep you engaged throughout the week
          </p>
        </div>

        {/* Program Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {programs.map((program, index) => (
            <div
              key={index}
              className="rounded-xl p-6 border-2 transition-all duration-300 
                         bg-gradient-to-br from-[var(--bg-light-alt)] to-[var(--bg-light)] 
                         border-[var(--border-color)] hover:border-[var(--border-accent)] 
                         hover:shadow-lg"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 
                              bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-fg)]">
                {program.icon}
              </div>

              {/* Day */}
              <div className="text-[var(--fg)] font-bold text-sm mb-2">
                {program.day}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
                {program.title}
              </h3>

              {/* Time */}
              <div className="text-[var(--fg-muted)] font-semibold mb-3">
                {program.time}
              </div>

              {/* Description */}
              <p className="text-[var(--fg-secondary)]">{program.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyPrograms;
