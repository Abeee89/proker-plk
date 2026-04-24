"use client";

import { useState } from "react";
import { QuizBox } from "@/components/quiz/QuizBox";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const quizQuestions = [
  {
    id: 1,
    question: "Komponen mana yang disebut 'Bos Energi'?",
    options: [
      { id: "1a", text: "Kabel", isCorrect: false },
      { id: "1b", text: "Baterai", isCorrect: true },
      { id: "1c", text: "Sakelar", isCorrect: false },
    ]
  },
  {
    id: 2,
    question: "Apa yang membuat cahaya saat listrik mengalir?",
    options: [
      { id: "2a", text: "Lampu", isCorrect: true },
      { id: "2b", text: "Resistor", isCorrect: false },
      { id: "2c", text: "Baterai", isCorrect: false },
    ]
  },
  {
    id: 3,
    question: "Yang mana berperan seperti 'Polisi Lalu Lintas'?",
    options: [
      { id: "3a", text: "Sakelar", isCorrect: false },
      { id: "3b", text: "Lampu", isCorrect: false },
      { id: "3c", text: "Resistor", isCorrect: true },
    ]
  },
  {
    id: 4,
    question: "Apa yang menghubungkan komponen seperti jalan?",
    options: [
      { id: "4a", text: "Kabel", isCorrect: true },
      { id: "4b", text: "Baterai", isCorrect: false },
      { id: "4c", text: "Sakelar", isCorrect: false },
    ]
  },
  {
    id: 5,
    question: "Komponen mana yang bisa menghidupkan dan mematikan rangkaian?",
    options: [
      { id: "5a", text: "Sakelar", isCorrect: true },
      { id: "5b", text: "Resistor", isCorrect: false },
      { id: "5c", text: "Kabel", isCorrect: false },
    ]
  },
  {
    id: 6,
    question: "Kalau rangkaian 'terputus', apakah lampunya menyala?",
    options: [
      { id: "6a", text: "Ya", isCorrect: false },
      { id: "6b", text: "Tidak", isCorrect: true },
      { id: "6c", text: "Mungkin", isCorrect: false },
    ]
  },
  {
    id: 7,
    question: "Listrik mengalir dari baterai bagian...",
    options: [
      { id: "7a", text: "Positif ke Negatif", isCorrect: true },
      { id: "7b", text: "Negatif ke Positif", isCorrect: false },
      { id: "7c", text: "Tidak mengalir", isCorrect: false },
    ]
  },
  {
    id: 8,
    question: "Kenapa kita pakai resistor?",
    options: [
      { id: "8a", text: "Supaya lebih cepat", isCorrect: false },
      { id: "8b", text: "Memperlambat listrik agar aman", isCorrect: true },
      { id: "8c", text: "Untuk mematikan lampu", isCorrect: false },
    ]
  },
  {
    id: 9,
    question: "Apa yang terjadi kalau + baterai langsung ke - nya?",
    options: [
      { id: "9a", text: "Hubung Pendek! (Berbahaya)", isCorrect: true },
      { id: "9b", text: "Menyalakan lampu", isCorrect: false },
      { id: "9c", text: "Tidak terjadi apa-apa", isCorrect: false },
    ]
  },
  {
    id: 10,
    question: "Berapa kabel yang dibutuhkan untuk menghubungkan baterai ke lampu?",
    options: [
      { id: "10a", text: "Satu", isCorrect: false },
      { id: "10b", text: "Dua", isCorrect: true },
      { id: "10c", text: "Tiga", isCorrect: false },
    ]
  }
];

export default function Quiz() {
  const [stars, setStars] = useState(0);
  const router = useRouter();

  const handleCorrectAnswer = () => {
    setStars(prev => prev + 1);
  };

  return (
    <main className="flex-grow flex flex-col items-center min-h-screen p-4 sm:p-8 bg-gradient-to-b from-green-50 to-teal-100">
      <div className="w-full max-w-7xl relative flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("/")}
          className="p-4 bg-white rounded-full shadow-lg text-green-600 flex items-center gap-2 self-start sm:self-auto"
        >
          <Home size={28} strokeWidth={3} />
          <span className="hidden sm:inline font-bold text-xl">Beranda</span>
        </motion.button>

        <motion.div 
          key={stars}
          initial={{ scale: 1.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl border-4 border-yellow-400 flex items-center gap-3 sm:gap-4"
        >
          <span className="text-2xl sm:text-3xl">⭐</span>
          <span className="text-xl sm:text-2xl font-black text-slate-700">
            {stars} / {quizQuestions.length} Bintang
          </span>
        </motion.div>
      </div>

      <div className="text-center mb-8 sm:mb-12 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 pb-2 drop-shadow-sm leading-tight">
          Kuis Listrik Seru!
        </h1>
        <p className="text-lg sm:text-xl font-bold text-slate-600 mt-2 sm:mt-4">
          Jawab pertanyaan untuk mengumpulkan semua bintang!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl pb-20">
        {quizQuestions.map((q) => (
          <QuizBox 
            key={q.id} 
            question={q.question} 
            options={q.options} 
            onCorrect={handleCorrectAnswer} 
          />
        ))}
      </div>
    </main>
  );
}
