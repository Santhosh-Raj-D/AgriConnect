'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  target: number;
  suffix?: string;
}

export default function Counter({ target, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let current = 0;
          const duration = 1500; // Total duration in ms
          const stepTime = 25; // MS per step
          const totalSteps = duration / stepTime;
          const stepValue = target / totalSteps;

          const timer = setInterval(() => {
            current = Math.min(current + stepValue, target);
            setCount(current);
            if (current >= target) {
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [target]);

  return (
    <div ref={containerRef} className="stat-num">
      {Math.floor(count).toLocaleString('en-IN')}
      {suffix}
    </div>
  );
}
