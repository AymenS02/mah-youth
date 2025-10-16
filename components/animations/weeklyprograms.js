// /animations/weeklyprograms.js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function animateWeeklyPrograms() {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  
  const lenisRAF = (time) => {
    lenis.raf(time * 1000);
  };
  
  gsap.ticker.add(lenisRAF);
  gsap.ticker.lagSmoothing(0);

  const boxSection = document.querySelector(".boxScaler");
  const boxMembers = gsap.utils.toArray(".box-member");

  if (!boxSection) {
    // Cleanup if section doesn't exist
    lenis.destroy();
    gsap.ticker.remove(lenisRAF);
    return () => {};
  }

  let expansionAnimation = null;
  let hasAnimated = false;
  let observer = null;

  function initBoxAnimations() {
    if (window.innerWidth < 1000) {
      if (expansionAnimation) expansionAnimation.kill();

      // Reset to normal on mobile
      gsap.set(boxSection, { clearProps: "all" });
      boxMembers.forEach((member) => {
        gsap.set(member, { clearProps: "all" });
      });

      return;
    }

    if (expansionAnimation) expansionAnimation.kill();

    const fullWidth = boxSection.scrollWidth;
    const fullHeight = boxSection.scrollHeight;

    // Initial collapsed state
    gsap.set(boxSection, {
      width: "400px",
      height: "120px",
      overflow: "hidden",
      margin: "0 auto",
    });

    boxMembers.forEach((member) => {
      gsap.set(member, { opacity: 0, y: 20, scale: 0.9 });
    });

    // Expansion animation on scroll
    expansionAnimation = ScrollTrigger.create({
      trigger: boxSection,
      start: "top 80%",
      end: "top 60%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const startWidth = 400;
        const startHeight = 120;
        const endWidth = fullWidth;
        const endHeight = fullHeight;

        const currentWidth = startWidth + (endWidth - startWidth) * progress;
        const currentHeight = startHeight + (endHeight - startHeight) * progress;

        gsap.set(boxSection, {
          width: `${currentWidth}px`,
          height: `${currentHeight}px`,
        });

        // Fade in cards
        boxMembers.forEach((member, index) => {
          const cardDelay = 0.15;
          const cardDuration = 0.4;
          const cardStart = 0.3 + index * cardDelay;
          const cardEnd = Math.min(cardStart + cardDuration, 1);

          if (progress >= cardStart && progress <= cardEnd) {
            const cardProgress = (progress - cardStart) / (cardEnd - cardStart);
            gsap.set(member, {
              opacity: cardProgress,
              y: 20 - cardProgress * 20,
              scale: 0.9 + cardProgress * 0.1,
            });
          } else if (progress > cardEnd) {
            gsap.set(member, { opacity: 1, y: 0, scale: 1 });
          } else {
            gsap.set(member, { opacity: 0, y: 20, scale: 0.9 });
          }
        });
      },
    });
  }

  // Trigger only when visible
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          initBoxAnimations();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  if (boxSection) {
    observer.observe(boxSection);
  }

  let resizeTimer;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (hasAnimated) {
        initBoxAnimations();
        ScrollTrigger.refresh();
      }
    }, 250);
  };

  window.addEventListener("resize", handleResize);

  // 🧹 CLEANUP FUNCTION
  return () => {
    // Disconnect observer
    if (observer) {
      observer.disconnect();
    }

    // Remove event listeners
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimer);

    // Kill animations
    if (expansionAnimation) expansionAnimation.kill();

    // Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Stop Lenis
    lenis.destroy();

    // Remove GSAP ticker
    gsap.ticker.remove(lenisRAF);

    // Clear inline styles
    if (boxSection) {
      gsap.set(boxSection, { clearProps: "all" });
    }
    
    boxMembers.forEach((member) => {
      gsap.set(member, { clearProps: "all" });
    });
  };
}