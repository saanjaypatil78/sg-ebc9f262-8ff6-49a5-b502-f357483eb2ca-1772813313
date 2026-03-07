import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  glow?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
  delay?: number;
}

export function GlassmorphicCard({
  children,
  className = "",
  gradient = false,
  glow = false,
  blur = 'xl',
  animation = 'fade',
  delay = 0,
}: GlassmorphicCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.6, delay },
    },
    slide: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, delay },
    },
    bounce: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      transition: { type: "spring", stiffness: 100, damping: 10, delay },
    },
  };

  return (
    <motion.div
      {...animations[animation]}
      className={`
        relative overflow-hidden rounded-2xl
        bg-slate-900/50 ${blurClasses[blur]}
        border border-slate-700/50
        ${gradient ? 'bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover glow effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${glow ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-cyan-500/20 blur-xl" />
      </div>
    </motion.div>
  );
}