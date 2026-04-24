"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MaterialCard } from "@/components/learn/MaterialCard";
import { Battery, Lightbulb, Zap, ToggleRight, ArrowRight, ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const materials = [
  {
    id: "battery",
    title: "Baterai",
    description: "Bos Energi! Dia mendorong listrik mengalir melalui kabel.",
    icon: Battery,
    colorClass: "bg-gradient-to-br from-green-400 to-emerald-600",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="20" width="40" height="70" rx="10" fill="#fcd34d" />
        <rect x="40" y="10" width="20" height="10" rx="4" fill="#64748b" />
        <circle cx="40" cy="45" r="4" fill="#000" />
        <circle cx="60" cy="45" r="4" fill="#000" />
        <path d="M40 60 Q50 70 60 60" stroke="#000" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M45 80 L55 80 M50 75 L50 85" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        <path d="M45 25 L55 25" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: "lamp",
    title: "Lampu",
    description: "Si Pembuat Cahaya! Dia bersinar terang saat listrik mengalir.",
    icon: Lightbulb,
    colorClass: "bg-gradient-to-br from-yellow-400 to-amber-500",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="40" r="30" fill="#fef08a" />
        <path d="M40 65 L60 65 L55 85 L45 85 Z" fill="#94a3b8" />
        <path d="M48 85 L52 85 L52 95 L48 95 Z" fill="#475569" />
        <circle cx="40" cy="35" r="4" fill="#000" />
        <circle cx="60" cy="35" r="4" fill="#000" />
        <path d="M45 50 Q50 55 55 50" stroke="#000" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: "resistor",
    title: "Resistor",
    description: "Polisi Lalu Lintas! Dia memperlambat listrik agar aman.",
    icon: Zap,
    colorClass: "bg-gradient-to-br from-red-400 to-rose-600",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="35" width="50" height="30" rx="15" fill="#fca5a5" />
        <rect x="35" y="35" width="10" height="30" fill="#dc2626" />
        <rect x="55" y="35" width="10" height="30" fill="#991b1b" />
        <path d="M10 50 L25 50 M75 50 L90 50" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="45" r="3" fill="#000" />
        <circle cx="60" cy="45" r="3" fill="#000" />
        <path d="M45 55 Q50 60 55 55" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: "switch",
    title: "Sakelar",
    description: "Jembatan! Dia menghubungkan atau memutus jalan listrik.",
    icon: ToggleRight,
    colorClass: "bg-gradient-to-br from-violet-400 to-purple-600",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="60" height="40" rx="10" fill="#c4b5fd" />
        <rect x="50" y="35" width="25" height="30" rx="8" fill="#8b5cf6" />
        <circle cx="35" cy="45" r="3" fill="#000" />
        <circle cx="65" cy="45" r="3" fill="#000" />
        <path d="M45 55 Q50 60 55 55" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="35" cy="50" r="10" fill="#a78bfa" opacity="0.5" />
      </svg>
    )
  }
];

export default function Learn() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === materials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? materials.length - 1 : prev - 1));
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden relative">
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 p-4 bg-white rounded-full shadow-lg text-indigo-600 z-50 flex items-center gap-2"
      >
        <Home size={28} strokeWidth={3} />
        <span className="hidden sm:inline font-bold text-xl">Beranda</span>
      </motion.button>

      <div className="absolute top-20 sm:top-8 text-center w-full z-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 pb-2">
          Keajaiban Listrik ✨
        </h1>
      </div>

      <div className="relative w-full max-w-5xl flex items-center justify-center mt-24 sm:mt-16">
        <motion.button 
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute left-2 sm:left-10 z-20 p-3 sm:p-6 bg-white/80 backdrop-blur rounded-full shadow-xl text-blue-500 hover:text-blue-600 hover:bg-white"
        >
          <ArrowLeft strokeWidth={4} className="w-6 h-6 sm:w-10 sm:h-10" />
        </motion.button>

        <div className="w-full flex justify-center items-center px-12 sm:px-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 100, opacity: 0, rotateY: 45 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: -100, opacity: 0, rotateY: -45 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <MaterialCard {...materials[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button 
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute right-2 sm:right-10 z-20 p-3 sm:p-6 bg-white/80 backdrop-blur rounded-full shadow-xl text-blue-500 hover:text-blue-600 hover:bg-white"
        >
          <ArrowRight strokeWidth={4} className="w-6 h-6 sm:w-10 sm:h-10" />
        </motion.button>
      </div>

      <div className="flex gap-4 mt-12 z-10">
        {materials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-4 rounded-full transition-all duration-500 ${
              idx === currentIndex ? "w-16 bg-blue-500" : "w-4 bg-blue-200"
            }`}
            aria-label={`Ke slide ${idx + 1}`}
          />
        ))}
      </div>
    </main>
  );
}
