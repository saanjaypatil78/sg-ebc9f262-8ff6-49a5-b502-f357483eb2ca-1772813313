import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxHeroProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  height?: string;
  intensity?: number;
}

export function ParallaxHero({
  children,
  backgroundColor = "bg-slate-950",
  height = "min-h-screen",
  intensity = 1,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Ultra-strong parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -800 * intensity]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 600 * intensity]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -500 * intensity]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 300 * intensity]);

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.9, 0.7, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.95]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 5, -10]);

  return (
    <div
      ref={containerRef}
      className={`relative ${height} ${backgroundColor} overflow-hidden`}
    >
      {/* Parallax Background Layers */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          style={{ y: y1, rotate, scale }}
          className="absolute -top-[40%] -right-[20%] w-[900px] h-[900px] rounded-full bg-orange-700/20 blur-[180px]"
        />
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute top-[60%] -left-[20%] w-[800px] h-[800px] rounded-full bg-amber-600/15 blur-[160px]"
        />
        <motion.div
          style={{ y: y3, scale }}
          className="absolute top-[15%] right-[15%] w-[700px] h-[700px] rounded-full bg-yellow-500/10 blur-[140px]"
        />
        <motion.div
          style={{ y: y4, opacity }}
          className="absolute top-[70%] right-[30%] w-[600px] h-[600px] rounded-full bg-slate-500/10 blur-[120px]"
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-t from-orange-900/20 via-slate-800/20 to-transparent blur-[120px]" />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}