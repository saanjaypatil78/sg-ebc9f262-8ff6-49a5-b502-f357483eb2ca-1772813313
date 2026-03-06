import { useEffect, useState, RefObject } from 'react';

export interface ParallaxConfig {
  speed: number; // 0.5 = slower, 1.5 = faster
  direction?: 'up' | 'down' | 'left' | 'right';
  triggerPoint?: number; // 0-1, when to start (0 = top, 1 = bottom)
}

export function useScrollParallax(
  ref: RefObject<HTMLElement>,
  config: ParallaxConfig = { speed: 0.5 }
) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    const handleScroll = () => {
      if (!element || !isVisible) return;

      const rect = element.getBoundingClientRect();
      const scrollProgress = 1 - (rect.top + rect.height / 2) / window.innerHeight;
      const triggerPoint = config.triggerPoint || 0.5;

      if (scrollProgress >= triggerPoint) {
        const distance = (scrollProgress - triggerPoint) * 100 * config.speed;

        switch (config.direction) {
          case 'up':
            setOffset({ x: 0, y: -distance });
            break;
          case 'down':
            setOffset({ x: 0, y: distance });
            break;
          case 'left':
            setOffset({ x: -distance, y: 0 });
            break;
          case 'right':
            setOffset({ x: distance, y: 0 });
            break;
          default:
            setOffset({ x: 0, y: -distance });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, config.speed, config.direction, config.triggerPoint, isVisible]);

  return { offset, isVisible };
}