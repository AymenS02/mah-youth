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
    // Cleanup if section doesn't exist
    lenis.destroy();
    gsap.ticker.remove(lenisRAF);
    return () => {};
  }

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
        if (teamMemberInitial) {
          gsap.set(teamMemberInitial, { clearProps: "all" });
        }
      });

      teamMemberCards.forEach((card) => {
        gsap.set(card, { clearProps: "all" });
      });

      return;
    }

    if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
    if (cardSlideInAnimation) cardSlideInAnimation.kill();

    teamMembers.forEach((member, index) => {
      // Start cards below the viewport
      gsap.set(member, { y: "125%" });
      
      // Find and hide the number initially
      const teamMemberInitial = member.querySelector(".team-member-name-initial h1");
      if (teamMemberInitial) {
        gsap.set(teamMemberInitial, { scale: 0 });
      }
    });

    teamMemberCards.forEach((card, index) => {
      // Position cards off-screen to the right with rotation
      const cardInitialX = 350 - index * 50;
      gsap.set(card, {
        x: `${cardInitialX}%`,
        rotation: 20,
        scale: 0.75
      });
    });

    cardPlaceholderEntrance = ScrollTrigger.create({
      trigger: teamSection,
      start: "top bottom",
      end: "top top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        teamMembers.forEach((member, index) => {
          const entranceDelay = 0.15;
          const entranceDuration = 0.7;
          const entranceStart = index * entranceDelay;
          const entranceEnd = entranceStart + entranceDuration;

          if (progress >= entranceStart && progress <= entranceEnd) {
            const memberEntranceProgress =
              (progress - entranceStart) / entranceDuration;

            const entranceY = 125 - memberEntranceProgress * 125;
            gsap.set(member, { y: `${entranceY}%` });

            const teamMemberInitial = member.querySelector(
              ".team-member-name-initial h1"
            );
            if (teamMemberInitial) {
              const initialLetterScaleDelay = 0.4;
              const initialLetterScaleProgress = Math.max(
                0,
                (memberEntranceProgress - initialLetterScaleDelay) /
                  (1 - initialLetterScaleDelay)
              );
              gsap.set(teamMemberInitial, { scale: initialLetterScaleProgress });
            }
          } else if (progress > entranceEnd) {
            gsap.set(member, { y: `0%` });
            const teamMemberInitial = member.querySelector(
              ".team-member-name-initial h1"
            );
            if (teamMemberInitial) {
              gsap.set(teamMemberInitial, { scale: 1 });
            }
          }
        });
      },
    });

    cardSlideInAnimation = ScrollTrigger.create({
      trigger: teamSection,
      start: "top top",
      end: `+=${window.innerHeight * 3}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        teamMemberCards.forEach((card, index) => {
          const slideInStagger = 0.075;
          const xRotationDuration = 0.2;
          const xRotationStart = index * slideInStagger;
          const xRotationEnd = xRotationStart + xRotationDuration;

          if (progress >= xRotationStart && progress <= xRotationEnd) {
            const cardProgress =
              (progress - xRotationStart) / xRotationDuration;

            const cardInitialX = 350 - index * 50;
            const cardTargetX = 0;
            const cardSlideInX =
              cardInitialX + cardProgress * (cardTargetX - cardInitialX);

            const cardSlideInRotation = 20 - cardProgress * 20;

            gsap.set(card, {
              x: `${cardSlideInX}%`,
              rotation: cardSlideInRotation,
            });
          } else if (progress > xRotationEnd) {
            gsap.set(card, {
              x: `0%`,
              rotation: 0,
            });
          }

          const cardScaleStagger = 0.12;
          const cardScaleStart = 0.4 + index * cardScaleStagger;
          const cardScaleEnd = 1;

          if (progress >= cardScaleStart && progress <= cardScaleEnd) {
            const scaleProgress =
              (progress - cardScaleStart) / (cardScaleEnd - cardScaleStart);
            const scaleValue = 0.75 + scaleProgress * 0.25;

            gsap.set(card, {
              scale: scaleValue,
            });
          } else if (progress > cardScaleEnd) {
            gsap.set(card, {
              scale: 1,
            });
          }
        });
      },
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

  // 🧹 CLEANUP FUNCTION - Return this!
  return () => {
    // Remove event listeners
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimer);

    // Kill ScrollTrigger instances
    if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
    if (cardSlideInAnimation) cardSlideInAnimation.kill();

    // Kill ALL ScrollTriggers to be safe
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Stop Lenis
    lenis.destroy();

    // Remove GSAP ticker
    gsap.ticker.remove(lenisRAF);

    // Clear inline styles
    teamMembers.forEach((member) => {
      gsap.set(member, { clearProps: "all" });
      const teamMemberInitial = member.querySelector(".team-member-name-initial h1");
      if (teamMemberInitial) {
        gsap.set(teamMemberInitial, { clearProps: "all" });
      }
    });

    teamMemberCards.forEach((card) => {
      gsap.set(card, { clearProps: "all" });
    });
  };
}