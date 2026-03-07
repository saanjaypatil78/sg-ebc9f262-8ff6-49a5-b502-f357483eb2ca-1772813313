import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface CameraParallaxProps {
  children: ReactNode;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  scale?: boolean;
  rotate?: boolean;
  className?: string;
}

/**
 * Camera-Style Parallax Component
 * Inspired by bravecom.info cinematic transitions
 * Features:
 * - Smooth depth-based scrolling
 * - Camera dolly effect
 * - Performance optimized with springs
 * - Lazy rendering
 */
export function CameraParallax({
  children,
  speed = 50,
  direction = "up",
  scale = false,
  rotate = false,
  className = "",
}: CameraParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth spring physics for camera-like movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Call all hooks at the top level unconditionally
  const yUp = useTransform(smoothProgress, [0, 1], [-speed, speed]);
  const yDown = useTransform(smoothProgress, [0, 1], [speed, -speed]);
  const xLeft = useTransform(smoothProgress, [0, 1], [-speed, speed]);
  const xRight = useTransform(smoothProgress, [0, 1], [speed, -speed]);
  
  const scaleTransform = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotateTransform = useTransform(smoothProgress, [0, 1], [-2, 2]);

  // Apply conditional logic to the values, not the hooks
  const y = direction === "up" ? yUp : direction === "down" ? yDown : 0;
  const x = direction === "left" ? xLeft : direction === "right" ? xRight : 0;
  
  const scaleValue = scale ? scaleTransform : 1;
  const rotateValue = rotate ? rotateTransform : 0;

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        x,
        scale: scaleValue,
        rotateZ: rotateValue,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Camera Fade Component
 * Smooth fade in/out with parallax
 */
interface CameraFadeProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function CameraFade({ children, delay = 0, className = "" }: CameraFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
      }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Camera Zoom Component
 * Dolly zoom effect (object stays same size, background zooms)
 */
interface CameraZoomProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export function CameraZoom({ children, intensity = 0.2, className = "" }: CameraZoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 - intensity, 1, 1 - intensity]
  );

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Camera Depth Layers
 * Multi-layer depth effect
 */
interface LayerConfig {
  speed: number;
  content: ReactNode;
  className?: string;
}

interface CameraDepthProps {
  layers: LayerConfig[];
  className?: string;
}

export function CameraDepth({ layers, className = "" }: CameraDepthProps) {
  return (
    <div className={`relative ${className}`}>
      {layers.map((layer, index) => (
        <CameraParallax
          key={index}
          speed={layer.speed}
          className={layer.className}
        >
          {layer.content}
        </CameraParallax>
      ))}
    </div>
  );
}