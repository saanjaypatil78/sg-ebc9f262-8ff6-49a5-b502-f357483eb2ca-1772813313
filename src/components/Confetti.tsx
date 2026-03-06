"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  colors?: string[];
}

export function Confetti({ trigger, duration = 3000, colors = ["#A855F7", "#06B6D4", "#10B981"] }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger, duration, colors]);

  return null;
}