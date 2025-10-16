// /animations/weeklyprograms.js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function animateEventsPage() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const teamSection = document.querySelector(".team");
  const teamMembers = gsap.utils.toArray(".team-member");
  const teamMemberCards = gsap.utils.toArray(".team-member-card");

  let cardPlaceholderEntrance = null;
  let cardSlideInAnimation = null;

  function initTeamAnimations() {
    if (window.innerWidth < 1000) {
      if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
      if (cardSlideInAnimation) cardSlideInAnimation.kill();

      teamMembers.forEach((member) => {
        gsap.set(member, { clearProps: "all" });
        const teamMemberInitial = member.querySelector(
          ".team-member-name-initial h1"
        );
        gsap.set(teamMemberInitial, { clearProps: "all" });
      });

      teamMemberCards.forEach((card) => {
        gsap.set(card, { clearProps: "all" });
      });

      return;
    }
  }

};