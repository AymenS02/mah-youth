// src/animations/events.js
import { gsap } from "gsap";

/**
 * Initializes entrance animations for the Events page.
 * @param {Object} refs - Object containing React refs to animate.
 * @param {React.RefObject} refs.headerRef - Ref to the header section.
 * @param {React.RefObject} refs.eventsGridRef - Ref to the events grid.
 */

export const animateEventsPage = ({ headerRef, eventsGridRef }) => {
  if (!headerRef?.current || !eventsGridRef?.current) return;

  // Set initial state
  gsap.set([headerRef.current, eventsGridRef.current], { opacity: 0, y: 50 });

  // Animate in sequence
  const tl = gsap.timeline({ delay: 0.3 });
  tl.to(headerRef.current, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
  }).to(
    eventsGridRef.current,
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=0.4"
  );

  return tl; // Return so you can optionally kill() it on unmount
};
