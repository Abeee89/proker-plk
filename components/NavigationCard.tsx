"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface NavigationCardProps {
  title: string;
  href: string;
  icon: React.ReactNode;
  colorClass: string;
  delay?: number;
}

export function NavigationCard({ title, href, icon, colorClass, delay = 0 }: NavigationCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: delay 
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(href)}
      className={`relative overflow-hidden rounded-[2rem] p-8 ${colorClass} shadow-xl border-4 border-white/40 backdrop-blur-sm group cursor-pointer w-full max-w-sm mx-auto`}
    >
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
      
      <div className="flex flex-col items-center justify-center space-y-4 text-white">
        <motion.div
          animate={{ 
            y: [0, -8, 0],
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
          }}
          className="p-6 bg-white/20 rounded-full shadow-inner flex items-center justify-center [&>svg]:w-16 [&>svg]:h-16 [&>svg]:drop-shadow-md [&>svg]:text-white [&>svg]:stroke-[2.5px]"
        >
          {icon}
        </motion.div>
        
        <h2 className="text-3xl font-black tracking-wide drop-shadow-md">
          {title}
        </h2>
      </div>
    </motion.div>
  );
}
