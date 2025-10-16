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
      
    </section>
  );
};

export default WeeklyPrograms;
