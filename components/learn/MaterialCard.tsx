"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface MaterialCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  illustration: React.ReactNode;
}

export function MaterialCard({ title, description, icon: Icon, colorClass, illustration }: MaterialCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative w-full max-w-sm shrink-0 overflow-hidden rounded-[3rem] p-8 ${colorClass} shadow-2xl border-8 border-white/50 backdrop-blur-md flex flex-col items-center justify-between h-[500px]`}
    >
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white opacity-20 rounded-full blur-3xl" />
      
      <div className="flex flex-col items-center space-y-2 z-10">
        <div className="p-4 bg-white/30 rounded-2xl shadow-sm mb-2">
          <Icon size={40} className="text-white drop-shadow-md" strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black text-white tracking-widest drop-shadow-lg uppercase">
          {title}
        </h2>
      </div>

      <div className="flex-grow flex items-center justify-center w-full my-6 z-10">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full flex items-center justify-center drop-shadow-2xl"
        >
          {illustration}
        </motion.div>
      </div>

      <div className="bg-white/90 w-full rounded-3xl p-6 shadow-inner z-10">
        <p className="text-xl font-bold text-slate-700 text-center leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
