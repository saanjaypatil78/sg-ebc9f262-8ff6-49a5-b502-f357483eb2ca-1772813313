import { useEffect, useState, useRef } from 'react';

/**
 * Advanced Window Scroll Parallax Hook
 * Based on bravecom.info implementation
 * No SSR hydration issues - window-based scrolling
 */

export interface ParallaxConfig {
  speed?: number;        // Transform speed multiplier (0.5 = slower, 2 = faster)
  direction?: 'up' | 'down' | 'left' | 'right';
  startY?: number;       // Start offset
  endY?: number;         // End offset
  opacity?: boolean;     // Enable opacity transformation
  scale?: boolean;       // Enable scale transformation
  rotate?: boolean;      // Enable rotation
}

export function useScrollParallax(config: ParallaxConfig = {}) {
  const {
    speed = 1,
    direction = 'up',
    startY = 0,
    endY = 1000,
    opacity = false,
    scale = false,
    rotate = false,
  } = config;

  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  if (!isClient) {
    return {
      ref: elementRef,
      style: {},
    };
  }

  // Calculate transformations
  const progress = Math.max(0, Math.min(1, (scrollY - startY) / (endY - startY)));
  
  let translateY = 0;
  let translateX = 0;
  
  switch (direction) {
    case 'up':
      translateY = -scrollY * speed;
      break;
    case 'down':
      translateY = scrollY * speed;
      break;
    case 'left':
      translateX = -scrollY * speed;
      break;
    case 'right':
      translateX = scrollY * speed;
      break;
  }

  const opacityValue = opacity ? 1 - progress : 1;
  const scaleValue = scale ? 1 - progress * 0.3 : 1;
  const rotateValue = rotate ? progress * 360 : 0;

  const transform = `
    translate3d(${translateX}px, ${translateY}px, 0)
    scale(${scaleValue})
    rotate(${rotateValue}deg)
  `;

  return {
    ref: elementRef,
    style: {
      transform,
      opacity: opacityValue,
      willChange: 'transform, opacity',
    },
  };
}

/**
 * Section-based parallax (for full-page sections)
 */
export function useSectionParallax(sectionIndex: number) {
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, 1 - (rect.top / window.innerHeight)));
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  return {
    ref: sectionRef,
    progress: scrollY,
    isInView: scrollY > 0 && scrollY < 1,
  };
}