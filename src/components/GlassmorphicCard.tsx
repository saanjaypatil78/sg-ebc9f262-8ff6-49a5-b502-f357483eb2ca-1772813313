import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassmorphicCard({ 
  children, 
  className, 
  hover = true,
  glow = false 
}: GlassmorphicCardProps) {
  return (
    <div 
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl",
        hover && "transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-3xl",
        glow && "shadow-purple-500/20 hover:shadow-purple-500/40",
        className
      )}
    >
      {children}
    </div>
  );
}