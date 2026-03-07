import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { StaticPulsingLogo } from "./StaticPulsingLogo";

/**
 * 3D Parallax Hero with After Effects-Style Cinematic Transitions
 * Full-screen width, depth layers, clickable CTAs
 */

interface Hero3DParallaxProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
}

export function Hero3DParallax({
  title = "Transform Your Financial Future",
  subtitle = "Join 184+ investors earning 200%+ returns with India's most transparent investment platform",
  primaryCTA = { text: "Start Investing Now", href: "/invest" },
  secondaryCTA = { text: "Shop with Earning", href: "/shop" },
}: Hero3DParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothScrollY = useSpring(scrollYProgress, springConfig);

  // 3D depth layers (foreground → background)
  const layer1Y = useTransform(smoothScrollY, [0, 1], [0, -100]);
  const layer2Y = useTransform(smoothScrollY, [0, 1], [0, -200]);
  const layer3Y = useTransform(smoothScrollY, [0, 1], [0, -300]);
  const layer4Y = useTransform(smoothScrollY, [0, 1], [0, -400]);
  const layer5Y = useTransform(smoothScrollY, [0, 1], [0, -500]);

  // 3D rotation based on scroll
  const rotateX = useTransform(smoothScrollY, [0, 1], [0, 20]);
  const rotateY = useTransform(smoothScrollY, [0, 1], [0, -10]);

  // Opacity fades
  const opacityFade = useTransform(smoothScrollY, [0, 0.5], [1, 0]);
  const opacityFadeDelay = useTransform(smoothScrollY, [0, 0.7], [1, 0]);

  // Scale effects
  const scaleEffect = useTransform(smoothScrollY, [0, 1], [1, 0.8]);

  // Mouse parallax (3D tilt effect)
  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20; // -10 to 10
      const y = (clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isClient]);

  if (!isClient) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-slate-300">{subtitle}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      style={{ perspective: 1000 }}
    >
      {/* Particle Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* 3D Depth Layer 5 - Furthest Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: layer5Y,
          opacity: 0.3,
          rotateX: mousePosition.y * 0.05,
          rotateY: mousePosition.x * 0.05,
        }}
      >
        <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl" />
      </motion.div>

      {/* 3D Depth Layer 4 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: layer4Y,
          opacity: 0.4,
          rotateX: mousePosition.y * 0.1,
          rotateY: mousePosition.x * 0.1,
        }}
      >
        <div className="absolute bottom-1/4 left-1/4 w-[700px] h-[700px] bg-cyan-500/15 rounded-full blur-3xl" />
      </motion.div>

      {/* 3D Depth Layer 3 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: layer3Y,
          opacity: 0.5,
          rotateX: mousePosition.y * 0.15,
          rotateY: mousePosition.x * 0.15,
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-3xl" />
      </motion.div>

      {/* 3D Depth Layer 2 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: layer2Y,
          opacity: 0.6,
          rotateX: mousePosition.y * 0.2,
          rotateY: mousePosition.x * 0.2,
        }}
      >
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-amber-500/25 rounded-full blur-3xl" />
      </motion.div>

      {/* 3D Depth Layer 1 - Foreground Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: layer1Y,
          opacity: opacityFade,
          scale: scaleEffect,
          rotateX: mousePosition.y * 0.3,
          rotateY: mousePosition.x * 0.3,
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-orange-500/30 via-cyan-500/20 to-transparent blur-2xl" />
      </motion.div>

      {/* Main Content - Foreground */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        style={{
          y: layer2Y,
          opacity: opacityFadeDelay,
          rotateX,
          rotateY,
        }}
      >
        {/* Cinematic Logo Entrance */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 1.5,
          }}
        >
          <StaticPulsingLogo />
        </motion.div>

        {/* Title - Cinematic Fade & Slide */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 1,
            ease: [0.22, 1, 0.36, 1], // After Effects-style easing
          }}
        >
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
            {title}
          </span>
        </motion.h1>

        {/* Subtitle - Staggered Fade */}
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.8,
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons - Cinematic Scale & Glow */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ y: 50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            delay: 1.2,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Primary CTA - Orange Gradient */}
          <Link href={primaryCTA.href}>
            <motion.button
              className="group relative px-8 py-4 text-lg font-semibold text-white rounded-xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 animate-gradient-x" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center gap-2">
                {primaryCTA.text}
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>
          </Link>

          {/* Secondary CTA - Cyan Outline */}
          <Link href={secondaryCTA.href}>
            <motion.button
              className="group relative px-8 py-4 text-lg font-semibold text-cyan-400 rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm overflow-hidden shadow-xl"
              whileHover={{ scale: 1.05, y: -5, borderColor: "rgba(6, 182, 212, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center gap-2">
                {secondaryCTA.text}
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </motion.svg>
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust Indicators - Staggered Entrance */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {[
            { icon: "👥", label: "184+ Investors" },
            { icon: "💰", label: "₹12 Cr Invested" },
            { icon: "📈", label: "15% Monthly ROI" },
            { icon: "🔒", label: "100% Transparent" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7 + i * 0.1 }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Animated */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="flex flex-col items-center gap-2 text-cyan-400">
          <span className="text-sm font-medium">Scroll to explore</span>
          <motion.svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </div>
      </motion.div>
    </section>
  );
}