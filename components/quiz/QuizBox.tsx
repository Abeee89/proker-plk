"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Confetti from "react-confetti";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizBoxProps {
  question: string;
  options: Option[];
  onCorrect: () => void;
}

export function QuizBox({ question, options, onCorrect }: QuizBoxProps) {
  const [answeredState, setAnsweredState] = useState<"unanswered" | "correct" | "incorrect">("unanswered");
  const [showConfetti, setShowConfetti] = useState(false);
  const controls = useAnimation();

  const handleOptionClick = async (option: Option) => {
    if (answeredState === "correct") return;

    if (option.isCorrect) {
      setAnsweredState("correct");
      setShowConfetti(true);
      onCorrect();
      
      setTimeout(() => setShowConfetti(false), 3000);
      
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, type: "spring" }
      });
    } else {
      setAnsweredState("incorrect");
      controls.start({
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
      setTimeout(() => setAnsweredState("unanswered"), 1000);
    }
  };

  return (
    <motion.div
      animate={controls}
      className={`relative w-full p-6 rounded-3xl shadow-lg border-4 transition-colors duration-300 ${
        answeredState === "correct" 
          ? "bg-green-100 border-green-400" 
          : answeredState === "incorrect"
          ? "bg-red-100 border-red-400"
          : "bg-white border-blue-200"
      }`}
    >
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none rounded-3xl overflow-hidden">
          <Confetti width={400} height={300} recycle={false} numberOfPieces={50} gravity={0.3} />
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-slate-700 mb-6 text-center">{question}</h3>
      
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionClick(option)}
            disabled={answeredState === "correct"}
            className={`w-full py-3 px-6 rounded-2xl font-bold text-lg transition-colors ${
              answeredState === "correct" && option.isCorrect
                ? "bg-green-500 text-white shadow-inner"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-100"
            }`}
          >
            {option.text}
          </motion.button>
        ))}
      </div>
      
      {answeredState === "correct" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 rounded-full w-12 h-12 flex items-center justify-center font-black text-xl shadow-lg border-2 border-white"
        >
          ⭐
        </motion.div>
      )}
    </motion.div>
  );
}
