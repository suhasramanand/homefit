
import gsap from 'gsap';

/**
 * Animation utility functions that can be used throughout the app
 */
export const animations = {
  /**
   * Fade in animation
   * @param element Element reference or selector
   * @param delay Optional delay before animation starts
   * @param duration Optional animation duration
   */
  fadeIn: (element: gsap.TweenTarget, delay = 0, duration = 0.6) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration, delay, ease: "power3.out" }
    );
  },

  /**
   * Fade out animation
   * @param element Element reference or selector
   * @param delay Optional delay before animation starts
   * @param duration Optional animation duration
   */
  fadeOut: (element: gsap.TweenTarget, delay = 0, duration = 0.4) => {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration,
      delay,
      ease: "power3.in"
    });
  },

  /**
   * Stagger animation for lists of items
   * @param elements Elements to animate in sequence
   * @param delay Optional base delay before the sequence starts
   */
  stagger: (elements: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1, 
        duration: 0.5, 
        delay, 
        ease: "back.out(1.7)" 
      }
    );
  },

  /**
   * Scale animation for emphasis
   * @param element Element to scale
   * @param delay Optional delay before animation starts
   */
  popIn: (element: gsap.TweenTarget, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, delay, ease: "back.out(1.7)" }
    );
  },

  /**
   * Hover animation for interactive elements
   * @param element Element to animate on hover
   */
  hover: (element: HTMLElement) => {
    const enter = () => {
      gsap.to(element, {
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        duration: 0.2
      });
    };

    const leave = () => {
      gsap.to(element, {
        y: 0,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        duration: 0.2
      });
    };

    element.addEventListener('mouseenter', enter);
    element.addEventListener('mouseleave', leave);

    // Return cleanup function
    return () => {
      element.removeEventListener('mouseenter', enter);
      element.removeEventListener('mouseleave', leave);
    };
  }
};
