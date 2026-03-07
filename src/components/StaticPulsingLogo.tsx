import { motion } from "framer-motion";

export function StaticPulsingLogo() {
  return (
    <div className="relative w-20 h-20">
      {/* Pulsing glow from background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/40 via-amber-500/30 to-yellow-500/20 rounded-2xl blur-xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Bottom glow */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-8 bg-gradient-to-t from-orange-500/50 to-transparent rounded-full blur-lg"
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Static logo (no rotation) */}
      <div className="relative z-10 w-full h-full">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          {/* Hexagonal shape */}
          <path
            d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
            fill="url(#logoGradient)"
            stroke="url(#strokeGradient)"
            strokeWidth="2"
          />
          
          {/* Inner hexagon */}
          <path
            d="M50 20 L75 32.5 L75 67.5 L50 80 L25 67.5 L25 32.5 Z"
            fill="rgba(15, 23, 42, 0.9)"
            stroke="rgba(251, 146, 60, 0.3)"
            strokeWidth="1"
          />
          
          {/* Tick symbol */}
          <motion.path
            d="M38 50 L45 58 L62 40"
            stroke="#fb923c"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Ambient glow particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-orange-400 rounded-full blur-sm"
          style={{
            top: `${30 + i * 20}%`,
            left: `${20 + i * 30}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}