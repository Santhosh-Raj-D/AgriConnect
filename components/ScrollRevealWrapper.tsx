'use client';

import { useEffect } from 'react';

export default function ScrollRevealWrapper() {
  useEffect(() => {
    let observer: IntersectionObserver;

    const setupObserver = () => {
      const revealEls = document.querySelectorAll('.reveal, .step, .test-card, .perk');
      
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.15 }
      );

      revealEls.forEach((el) => observer.observe(el));
    };

    setupObserver();

    // Re-run setup on DOM mutations to capture client-side routed content or filters
    const mutationObserver = new MutationObserver(() => {
      // Re-observe if elements are added
      const revealEls = document.querySelectorAll('.reveal, .step, .test-card, .perk:not(.visible)');
      revealEls.forEach((el) => observer.observe(el));
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (observer) {
        observer.disconnect();
      }
      mutationObserver.disconnect();
    };
  }, []);

  return null; // This is a utility wrapper, doesn't render markup
}
