import Header from "/components/header/Header";
import AboutUs from "../components/LandingPage/AboutUs";
import Hero from "../components/LandingPage/Hero";
import KnowledgeResources from "../components/LandingPage/KnowledgeResources";


export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <AboutUs />
      <KnowledgeResources />
    </>
  );
}
