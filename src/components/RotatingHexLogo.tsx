"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface RotatingHexLogoProps {
  size?: number;
  showTicking?: boolean;
  enableSound?: boolean;
}

export function RotatingHexLogo({ 
  size = 200, 
  showTicking = true,
  enableSound = true 
}: RotatingHexLogoProps) {
  const [rotation, setRotation] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Rotate outer ring 6 degrees per second (60 seconds = 360 degrees)
    const interval = setInterval(() => {
      setRotation(prev => (prev + 6) % 360);
      setTick(prev => (prev + 1) % 60);

      // Play tick sound (optional)
      if (enableSound && typeof window !== 'undefined') {
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBg==');
          audio.volume = 0.1;
          audio.play().catch(() => {
            // Ignore autoplay restrictions
          });
        } catch (e) {
          // Ignore audio errors
        }
      }
    }, 1000); // Every 1 second

    return () => clearInterval(interval);
  }, [enableSound]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Static inner logo (arrow + cart) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/bravecom-logo-favicon.png"
          alt="BRAVECOM Logo"
          width={size}
          height={size}
          className="object-contain"
          priority
        />
      </div>

      {/* Rotating outer hexagonal ring (black layer only) */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: rotation }}
        transition={{ duration: 0, ease: "linear" }}
        style={{
          transformOrigin: "center center",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal outer ring (black segments) */}
          <g opacity="0.9">
            {/* Top segment */}
            <path
              d="M100 20 L140 40 L140 60 L100 40 Z"
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth="1"
            />
            {/* Top-right segment */}
            <path
              d="M140 40 L170 70 L170 90 L140 60 Z"
              fill="#2a2a2a"
              stroke="#333"
              strokeWidth="1"
            />
            {/* Bottom-right segment */}
            <path
              d="M170 90 L170 130 L140 140 L140 110 Z"
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth="1"
            />
            {/* Bottom segment */}
            <path
              d="M140 140 L100 160 L60 140 L100 160 Z"
              fill="#2a2a2a"
              stroke="#333"
              strokeWidth="1"
            />
            {/* Bottom-left segment */}
            <path
              d="M60 140 L30 130 L30 90 L60 110 Z"
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth="1"
            />
            {/* Top-left segment */}
            <path
              d="M30 90 L30 70 L60 40 L60 60 Z"
              fill="#2a2a2a"
              stroke="#333"
              strokeWidth="1"
            />
          </g>

          {/* Small tick markers (optional visual feedback) */}
          {showTicking && (
            <g>
              {[...Array(60)].map((_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="15"
                  x2="100"
                  y2={i % 5 === 0 ? "22" : "20"}
                  stroke={i === tick ? "#F97316" : "#444"}
                  strokeWidth={i % 5 === 0 ? "2" : "1"}
                  transform={`rotate(${i * 6} 100 100)`}
                />
              ))}
            </g>
          )}
        </svg>
      </motion.div>

      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{
          background: `radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}