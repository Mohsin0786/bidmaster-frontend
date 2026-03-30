"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix: string;
}

export default function AnimatedCounter({ value, suffix }: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState<number>(() =>
    typeof IntersectionObserver === "undefined" ? value : 0
  );
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // SSR / old browser fallback
    if (typeof IntersectionObserver === "undefined") {
      setDisplayed(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const duration = 1200; // ms
        const start = performance.now();

        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayed(Math.round(eased * value));

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {displayed}
      {suffix}
    </span>
  );
}

