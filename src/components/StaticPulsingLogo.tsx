import { motion } from "framer-motion";
import Image from "next/image";

export function StaticPulsingLogo() {
  return (
    <div className="relative w-20 h-20">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/40 via-amber-500/30 to-yellow-500/20 rounded-2xl blur-xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-8 bg-gradient-to-t from-orange-500/50 to-transparent rounded-full blur-lg"
        animate={{
          opacity: [0.35, 0.75, 0.35],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950/40"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/sunray-logo.jpg"
          alt="Sunray Logo"
          fill
          sizes="80px"
          className="object-cover"
          priority
        />
      </motion.div>

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