"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";

export function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // FOMO Timer: Countdown to Mar 1, 2026
    const targetDate = new Date('2026-03-01T00:00:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          backgroundImage: `
            linear-gradient(to right, rgb(148, 163, 184) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148, 163, 184) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem'
        }}
      />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" 
           style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" 
           style={{ transform: `translateY(${-parallaxOffset * 0.3}px)` }} />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* FOMO Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 backdrop-blur-sm animate-pulse"
            style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
          >
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-semibold">
              Limited Time: Early Investor Slots Closing Soon
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className="text-6xl md:text-8xl font-bold tracking-tight"
            style={{ transform: `translateY(${parallaxOffset * 0.1}px)` }}
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              You'll Never Get
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              A Second Chance
            </span>
            <br />
            <span className="text-white">To Be Early</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            style={{ transform: `translateY(${parallaxOffset * 0.15}px)` }}
          >
            Join India's most transparent investment ecosystem. 
            <span className="text-purple-400 font-semibold"> 15% monthly returns</span> backed by 
            <span className="text-cyan-400 font-semibold"> ₹12 Crore corpus</span>. 
            Only <span className="text-red-400 font-bold">28 slots</span> available.
          </p>

          {/* Countdown Timer */}
          <div 
            className="flex justify-center gap-4 md:gap-8 py-8"
            style={{ transform: `translateY(${parallaxOffset * 0.12}px)` }}
          >
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((unit, i) => (
              <div 
                key={unit.label}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 min-w-[100px] shadow-2xl"
              >
                <div className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-white to-purple-300 bg-clip-text text-transparent">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-slate-400 mt-2 uppercase tracking-wider">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ transform: `translateY(${parallaxOffset * 0.08}px)` }}
          >
            <Link href="/auth/register?role=investor">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-purple-500/80"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Secure Your Slot Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#transparency">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/20 backdrop-blur-xl bg-white/5 hover:bg-white/10 text-white text-lg px-8 py-6 rounded-xl transition-all hover:scale-105"
              >
                <Shield className="mr-2 h-5 w-5" />
                View Public Ledger
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div 
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10"
            style={{ transform: `translateY(${parallaxOffset * 0.05}px)` }}
          >
            {[
              { icon: Users, value: '₹12 Cr', label: 'Total Corpus' },
              { icon: TrendingUp, value: '15%', label: 'Monthly Returns' },
              { icon: Shield, value: '100%', label: 'Transparency' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        style={{ transform: `translateX(-50%) translateY(${parallaxOffset * 0.3}px)` }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}