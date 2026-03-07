import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

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

interface ParallaxLayerProps {
  scrollYProgress: MotionValue<number>;
  index: number;
  totalLayers: number;
}

function ParallaxLayer({ scrollYProgress, index, totalLayers }: ParallaxLayerProps) {
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    index % 2 === 0 ? [-50 * (index + 1), 50 * (index + 1)] : [50 * (index + 1), -50 * (index + 1)]
  );
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.2, 0.6, 0.6, 0.2]
  );

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        x,
        opacity,
        zIndex: totalLayers - index,
      }}
    >
      <div
        className={`absolute top-1/2 ${
          index % 2 === 0 ? 'left-0' : 'right-0'
        } w-[600px] h-[400px] bg-gradient-to-br ${
          index === 0 ? 'from-orange-500/20 to-amber-500/10' :
          index === 1 ? 'from-cyan-500/20 to-blue-500/10' :
          'from-purple-500/20 to-pink-500/10'
        } rounded-full blur-3xl -translate-y-1/2`}
      />
    </motion.div>
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
      {[...Array(layers)].map((_, i) => (
        <ParallaxLayer key={i} scrollYProgress={scrollYProgress} index={i} totalLayers={layers} />
      ))}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}