"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface RotatingHexLogoProps {
  size?: number;
  showTick?: boolean;
  playSound?: boolean;
}

export function RotatingHexLogo({ 
  size = 200, 
  showTick = true,
  playSound = false 
}: RotatingHexLogoProps) {
  const [tick, setTick] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Create audio element for tick sound
    if (typeof window !== 'undefined' && playSound) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.15;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [playSound]);
  
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      setTick(prev => (prev + 1) % 60);
      
      // Play tick sound
      if (playSound && audioRef.current) {
        // Generate simple tick sound using Web Audio API
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.05);
        } catch (error) {
          // Fallback: silent if audio context fails
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isMounted, playSound]);
  
  if (!isMounted) return null;
  
  const rotation = (tick % 60) * 6;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Rotating Outer Black Ring */}
      <motion.div
        className="absolute inset-0 z-10"
        animate={{ 
          rotate: rotation,
          scale: tick % 1 === 0 ? 1.02 : 1
        }}
        transition={{
          rotate: { duration: 0, ease: "linear" },
          scale: { duration: 0.1, ease: "easeOut" }
        }}
        style={{
          filter: `drop-shadow(0 0 ${tick % 1 === 0 ? 20 : 10}px rgba(249, 115, 22, ${tick % 1 === 0 ? 0.6 : 0.3}))`
        }}
      >
        <Image
          src="/bravecom-logo-favicon.png"
          alt="BRAVECOM Rotating Logo"
          width={size}
          height={size}
          className="hexagonal-mask"
          priority
        />
      </motion.div>
      
      {/* Static Inner Content */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="text-center">
          <div className="text-xs text-slate-400 font-mono">
            {showTick && `${tick}s`}
          </div>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 -z-10 blur-2xl opacity-40"
        style={{
          background: `radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}