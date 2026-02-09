import Header from "/components/header/Header";
import Hero from "../components/LandingPage/Hero.jsx";
import UpcomingEventsSection from "../components/LandingPage/UpcomingEventsSection.jsx";
import WeeklyPrograms from "../components/LandingPage/WeeklyPrograms.jsx";
import GetInvolved from "../components/LandingPage/GetInvolved.jsx";
import Newsletter from "../components/LandingPage/Newsletter.jsx";
import Footer from "../components/footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <UpcomingEventsSection />
      <WeeklyPrograms />
      <GetInvolved />
      <Newsletter />
      <Footer />
    </>
  );
}