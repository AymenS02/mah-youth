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
    <section className="min-h-screen py-20 bg-gradient-to-b from-primary-light to-primary-dark">
    
      <div className="flex flex-col max-w-5xl mx-auto px-4">
        <div className="mx-auto text-center mb-16 px-20 bg-primary/10 border-2 backdrop-blur-sm border-accent/20 text-light p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl">Weekly Programs!</h1>
        </div>

        <div>
          <ul>
            {programs.map((program, index) => (
              <li key={index}>
                <h1>{program.title}</h1>
                <p>{program.day} | {program.time}</p>
                <p>{program.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
};

export default WeeklyPrograms;
