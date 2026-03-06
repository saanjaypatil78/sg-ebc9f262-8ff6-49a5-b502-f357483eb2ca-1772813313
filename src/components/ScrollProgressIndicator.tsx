"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* BRAVECOM Logo Indicator */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="relative w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-500/30 flex items-center justify-center"
          style={{ scale: useSpring(scrollYProgress, { stiffness: 200, damping: 20 }) }}
        >
          <TrendingUp className="w-6 h-6 text-orange-400" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-500"
            style={{ 
              clipPath: `polygon(0 0, ${scrollYProgress.get() * 100}% 0, ${scrollYProgress.get() * 100}% 100%, 0 100%)` 
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}