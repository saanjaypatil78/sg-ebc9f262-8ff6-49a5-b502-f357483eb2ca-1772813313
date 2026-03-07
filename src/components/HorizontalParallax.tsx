import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HorizontalParallaxProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}

export function HorizontalParallax({
  children,
  direction = "right",
  speed = 1,
  className = "",
}: HorizontalParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "right" 
      ? [-100 * speed, 100 * speed]
      : [100 * speed, -100 * speed]
  );
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ x, opacity }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Artistic Layered Parallax Container
 */
interface ArtisticParallaxProps {
  children: ReactNode;
  layers?: number;
  className?: string;
}

export function ArtisticParallax({
  children,
  layers = 3,
  className = "",
}: ArtisticParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  return (
    <div ref={ref} className={`relative min-h-screen ${className}`}>
      {/* Horizontal parallax layers */}
      {[...Array(layers)].map((_, i) => {
        const x = useTransform(
          scrollYProgress,
          [0, 1],
          i % 2 === 0 ? [-50 * (i + 1), 50 * (i + 1)] : [50 * (i + 1), -50 * (i + 1)]
        );
        
        const opacity = useTransform(
          scrollYProgress,
          [0, 0.2, 0.8, 1],
          [0.2, 0.6, 0.6, 0.2]
        );
        
        return (
          <motion.div
            key={i}
            className="absolute inset-0 pointer-events-none"
            style={{
              x,
              opacity,
              zIndex: layers - i,
            }}
          >
            <div
              className={`absolute top-1/2 ${
                i % 2 === 0 ? 'left-0' : 'right-0'
              } w-[600px] h-[400px] bg-gradient-to-br ${
                i === 0 ? 'from-orange-500/20 to-amber-500/10' :
                i === 1 ? 'from-cyan-500/20 to-blue-500/10' :
                'from-purple-500/20 to-pink-500/10'
              } rounded-full blur-3xl -translate-y-1/2`}
            />
          </motion.div>
        );
      })}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}