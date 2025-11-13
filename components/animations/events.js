// /animations/events.js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function animateEventsPage() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);

  const lenisRAF = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(lenisRAF);
  gsap.ticker.lagSmoothing(0);

  const teamSection = document.querySelector(".team");
  const teamMembers = gsap.utils.toArray(".team-member");
  const teamMemberCards = gsap.utils.toArray(".team-member-card");

  if (!teamSection) {
    lenis.destroy();
    gsap.ticker.remove(lenisRAF);
    return () => {};
  }

  let placeholderTimeline = null;
  let slideInTimeline = null;

  function initTeamAnimations() {
    if (window.innerWidth < 1000) {
      if (placeholderTimeline) placeholderTimeline.kill();
      if (slideInTimeline) slideInTimeline.kill();

      teamMembers.forEach((member) => {
        gsap.set(member, { clearProps: "all" });
        const teamMemberInitial = member.querySelector(
          ".team-member-name-initial h1"
        );
        if (teamMemberInitial) gsap.set(teamMemberInitial, { clearProps: "all" });
      });

      teamMemberCards.forEach((card) => {
        gsap.set(card, { clearProps: "all" });
      });

      return;
    }

    if (placeholderTimeline) placeholderTimeline.kill();
    if (slideInTimeline) slideInTimeline.kill();

    // ✅ Initial setup
    teamMembers.forEach((member) => {
      gsap.set(member, { y: "125%" });
      const teamMemberInitial = member.querySelector(".team-member-name-initial h1");
      if (teamMemberInitial) {
        gsap.set(teamMemberInitial, { scale: 0 });
      }
    });

    teamMemberCards.forEach((card, index) => {
      const cardInitialX = 350 - index * 50;
      gsap.set(card, {
        x: `${cardInitialX}%`,
        rotation: 20,
        scale: 1,
      });
    });

    // ✅ Placeholder entrance animation (plays once, doesn't reverse)
    placeholderTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: teamSection,
        start: "top bottom",
        end: "top top",
        toggleActions: "play none none none", // Play once, never reverse
      }
    });

    teamMembers.forEach((member, index) => {
      placeholderTimeline.to(
        member,
        {
          y: "0%",
          duration: 0.7,
          ease: "power2.out"
        },
        index * 0.15
      );

      const teamMemberInitial = member.querySelector(".team-member-name-initial h1");
      if (teamMemberInitial) {
        placeholderTimeline.to(
          teamMemberInitial,
          {
            scale: 1,
            duration: 0.42, // 60% of 0.7
            ease: "back.out(1.7)"
          },
          index * 0.15 + 0.28 // 40% delay into the parent animation
        );
      }
    });

    // ✅ Card slide-in animation (plays once, doesn't reverse)
    // Calculate the total animation duration
    const lastCardIndex = teamMemberCards.length - 1;
    const totalAnimationDuration = (lastCardIndex * 0.075) + 0.2; // stagger + animation duration
    const pinDuration = totalAnimationDuration * 1000; // Convert to pixels (adjust multiplier as needed)
    
    slideInTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: teamSection,
        start: "top top",
        end: `+=${pinDuration}`, // Match the animation duration
        pin: true,
        toggleActions: "play none none none", // Play once, never reverse
      }
    });

    teamMemberCards.forEach((card, index) => {
      const cardInitialX = 350 - index * 50;
      
      slideInTimeline.to(
        card,
        {
          x: "0%",
          rotation: 0,
          duration: 0.2,
          ease: "power2.out"
        },
        index * 0.075
      );
    });
  }

  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initTeamAnimations();
      ScrollTrigger.refresh();
    }, 250);
  };

  window.addEventListener("resize", handleResize);
  initTeamAnimations();

  // 🧹 Cleanup
  return () => {
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimer);
    
    // Kill animations first
    if (placeholderTimeline) {
      placeholderTimeline.scrollTrigger?.kill();
      placeholderTimeline.kill();
    }
    if (slideInTimeline) {
      slideInTimeline.scrollTrigger?.kill();
      slideInTimeline.kill();
    }
    
    // Kill all ScrollTriggers and revert any pinning
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill(true);
    });
    
    // Refresh to clean up any remaining state
    ScrollTrigger.refresh();
    
    // Clean up Lenis
    lenis.destroy();
    gsap.ticker.remove(lenisRAF);
  };
}