"use client";

import { NavigationCard } from "@/components/NavigationCard";
import { BookOpen, Gamepad2, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 md:p-24 bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000" />
      
      <div className="relative z-10 flex flex-col items-center space-y-8 md:space-y-12 w-full max-w-5xl">
        <div className="text-center space-y-4 px-2">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 drop-shadow-sm pb-2 leading-tight">
            Hai, Aku Sparky! ⚡
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-slate-600 max-w-2xl mx-auto">
            Siap belajar keajaiban listrik? Pilih petualanganmu di bawah ini!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full px-4">
          <NavigationCard 
            title="Ayo Belajar!" 
            href="/learn" 
            icon={<BookOpen />} 
            colorClass="bg-gradient-to-br from-blue-400 to-blue-600"
            delay={0.1}
          />
          <NavigationCard 
            title="Kuis Seru!" 
            href="/quiz" 
            icon={<Gamepad2 />} 
            colorClass="bg-gradient-to-br from-green-400 to-green-600"
            delay={0.2}
          />
          <NavigationCard 
            title="Buat Menyala!" 
            href="/simulation" 
            icon={<Zap />} 
            colorClass="bg-gradient-to-br from-amber-400 to-orange-500"
            delay={0.3}
          />
        </div>
      </div>
    </main>
  );
}
