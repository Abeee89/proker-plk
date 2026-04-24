"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Flag, Zap } from "lucide-react";

interface MissionControlProps {
  mission: {
    id: number;
    title: string;
    description: string;
    hint: string;
  };
  missionIndex: number;
  totalMissions: number;
  onCheckCircuit: () => void;
  isSuccess: boolean;
}

/*
 * Kid-friendly circuit diagrams that visually match the actual
 * draggable components on the canvas.
 * - Battery = green rounded rectangle with + and −
 * - Lamp = grey circle with 🔌
 * - Switch = purple rounded rectangle with toggle
 * - Resistor = amber rounded rectangle with color stripes
 * - Terminals = small colored circles (green/red/grey)
 * - Wires = thick red curved lines
 */
function CircuitDiagram({ missionId }: { missionId: number }) {
  /* ═══════ SHARED MINI-COMPONENTS ═══════ */

  // Battery: green rounded box matching the canvas version
  const BatteryIcon = ({ x, y }: { x: number; y: number }) => (
    <g>
      {/* Body */}
      <rect x={x} y={y} width="48" height="64" rx="10" fill="url(#batteryGrad)" stroke="#059669" strokeWidth="3"/>
      {/* Top nub */}
      <rect x={x + 16} y={y - 5} width="16" height="6" rx="2" fill="#065f46"/>
      {/* + label */}
      <text x={x + 24} y={y + 18} textAnchor="middle" fill="white" fontSize="14" fontWeight="900">+</text>
      {/* 🔋 emoji */}
      <text x={x + 24} y={y + 40} textAnchor="middle" fontSize="16">🔋</text>
      {/* − label */}
      <text x={x + 24} y={y + 58} textAnchor="middle" fill="white" fontSize="14" fontWeight="900">−</text>
      {/* Terminal dots */}
      <circle cx={x + 24} cy={y - 8} r="6" fill="#22c55e" stroke="white" strokeWidth="2"/>
      <circle cx={x + 24} cy={y + 70} r="6" fill="#ef4444" stroke="white" strokeWidth="2"/>
      {/* Label */}
      <text x={x + 24} y={y + 86} textAnchor="middle" fill="#334155" fontSize="11" fontWeight="800">Baterai</text>
    </g>
  );

  // Lamp: grey circle matching the canvas version
  const LampIcon = ({ x, y }: { x: number; y: number }) => (
    <g>
      {/* Circle body */}
      <circle cx={x} cy={y} r="28" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3"/>
      {/* Base */}
      <rect x={x - 14} y={y + 24} width="28" height="12" rx="4" fill="#94a3b8" stroke="#64748b" strokeWidth="2"/>
      {/* Emoji */}
      <text x={x} y={y + 8} textAnchor="middle" fontSize="22">🔌</text>
      {/* Terminal dots */}
      <circle cx={x - 18} cy={y + 36} r="6" fill="#475569" stroke="white" strokeWidth="2"/>
      <circle cx={x + 18} cy={y + 36} r="6" fill="#475569" stroke="white" strokeWidth="2"/>
      {/* Label */}
      <text x={x} y={y + 58} textAnchor="middle" fill="#334155" fontSize="11" fontWeight="800">Lampu</text>
    </g>
  );

  // Switch: purple rounded box matching the canvas version
  const SwitchIcon = ({ x, y }: { x: number; y: number }) => (
    <g>
      {/* Body */}
      <rect x={x} y={y} width="56" height="36" rx="10" fill="#e9d5ff" stroke="#a855f7" strokeWidth="3"/>
      {/* Toggle track */}
      <rect x={x + 14} y={y + 14} width="28" height="12" rx="6" fill="#a78bfa"/>
      {/* Toggle knob (off position) */}
      <circle cx={x + 22} cy={y + 20} r="5" fill="white" stroke="#7c3aed" strokeWidth="1"/>
      {/* Label text */}
      <text x={x + 28} y={y + 10} textAnchor="middle" fill="#7c3aed" fontSize="7" fontWeight="800">MATI</text>
      {/* Terminal dots */}
      <circle cx={x - 6} cy={y + 18} r="6" fill="#475569" stroke="white" strokeWidth="2"/>
      <circle cx={x + 62} cy={y + 18} r="6" fill="#475569" stroke="white" strokeWidth="2"/>
      {/* Label */}
      <text x={x + 28} y={y + 52} textAnchor="middle" fill="#334155" fontSize="11" fontWeight="800">Sakelar</text>
    </g>
  );

  // Resistor: amber rounded box with color stripes matching the canvas version
  const ResistorIcon = ({ x, y }: { x: number; y: number }) => (
    <g>
      {/* Body */}
      <rect x={x} y={y} width="56" height="28" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3"/>
      {/* Color stripes */}
      <rect x={x + 10} y={y + 3} width="6" height="22" rx="1" fill="#ef4444"/>
      <rect x={x + 20} y={y + 3} width="6" height="22" rx="1" fill="#d97706"/>
      <rect x={x + 30} y={y + 3} width="6" height="22" rx="1" fill="#f97316"/>
      <rect x={x + 40} y={y + 3} width="6" height="22" rx="1" fill="#92400e"/>
      {/* Terminal dots */}
      <circle cx={x - 6} cy={y + 14} r="6" fill="#475569" stroke="white" strokeWidth="2"/>
      <circle cx={x + 62} cy={y + 14} r="6" fill="#475569" stroke="white" strokeWidth="2"/>
      {/* Label */}
      <text x={x + 28} y={y + 44} textAnchor="middle" fill="#334155" fontSize="11" fontWeight="800">Resistor</text>
    </g>
  );

  /* ═══════ GRADIENT DEFS ═══════ */
  const Defs = () => (
    <defs>
      <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6ee7b7"/>
        <stop offset="100%" stopColor="#10b981"/>
      </linearGradient>
    </defs>
  );

  /* ═══════ WIRE (thick red dashed) ═══════ */
  const Wire = ({ d }: { d: string }) => (
    <path d={d} stroke="#ef4444" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="8 4"/>
  );

  /* ═══════ ARROW LABEL ═══════ */
  const FlowArrow = ({ x, y, label }: { x: number; y: number; label: string }) => (
    <g>
      <text x={x} y={y} textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="900">→</text>
      <text x={x} y={y + 14} textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="700">{label}</text>
    </g>
  );

  /* ═══════ MISSION 1: Battery → Lamp ═══════ */
  if (missionId === 1) {
    return (
      <svg viewBox="0 0 260 200" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <Defs />

        {/* Wires connecting battery → lamp in a loop */}
        {/* Top wire: battery pos → lamp left terminal */}
        <Wire d="M 80 12 C 120 -10, 140 -10, 152 74" />
        {/* Bottom wire: lamp right terminal → battery neg */}
        <Wire d="M 188 74 C 220 150, 50 150, 80 90" />

        {/* Battery at left */}
        <BatteryIcon x={56} y={20} />

        {/* Lamp at right */}
        <LampIcon x={170} y={40} />

        {/* Flow arrows */}
        <FlowArrow x={130} y={8} label="kabel" />
        <FlowArrow x={130} y={150} label="kabel" />

        {/* Step numbers */}
        <g>
          <circle cx="20" cy="18" r="12" fill="#3b82f6"/>
          <text x="20" y="22" textAnchor="middle" fill="white" fontSize="12" fontWeight="900">1</text>
        </g>
        <g>
          <circle cx="20" cy="160" r="12" fill="#3b82f6"/>
          <text x="20" y="164" textAnchor="middle" fill="white" fontSize="12" fontWeight="900">2</text>
        </g>
        <text x="36" y="22" fill="#3b82f6" fontSize="8" fontWeight="700">+ ke Lampu</text>
        <text x="36" y="164" fill="#3b82f6" fontSize="8" fontWeight="700">Lampu ke −</text>
      </svg>
    );
  }

  /* ═══════ MISSION 2: Battery → Switch → Lamp ═══════ */
  if (missionId === 2) {
    return (
      <svg viewBox="0 0 300 220" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <Defs />

        {/* Wires */}
        {/* battery pos → switch left */}
        <Wire d="M 50 12 C 70 -10, 100 -5, 108 48" />
        {/* switch right → lamp left */}
        <Wire d="M 176 48 C 190 40, 200 50, 202 84" />
        {/* lamp right → battery neg */}
        <Wire d="M 238 84 C 260 170, 20 170, 50 90" />

        {/* Battery at left */}
        <BatteryIcon x={26} y={20} />

        {/* Switch at top-center */}
        <SwitchIcon x={114} y={30} />

        {/* Lamp at right */}
        <LampIcon x={220} y={50} />

        {/* Flow arrows */}
        <FlowArrow x={85} y={16} label="kabel" />
        <FlowArrow x={195} y={46} label="kabel" />
        <FlowArrow x={140} y={172} label="kabel" />

        {/* Steps */}
        <g>
          <circle cx="16" cy="180" r="10" fill="#3b82f6"/>
          <text x="16" y="184" textAnchor="middle" fill="white" fontSize="10" fontWeight="900">!</text>
        </g>
        <text x="30" y="184" fill="#3b82f6" fontSize="8" fontWeight="700">Nyalakan sakelar!</text>
      </svg>
    );
  }

  /* ═══════ MISSION 3: Battery → Resistor → Lamp ═══════ */
  if (missionId === 3) {
    return (
      <svg viewBox="0 0 300 220" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <Defs />

        {/* Wires */}
        {/* battery pos → resistor left */}
        <Wire d="M 50 12 C 70 -10, 100 -5, 108 44" />
        {/* resistor right → lamp left */}
        <Wire d="M 176 44 C 190 40, 200 50, 202 84" />
        {/* lamp right → battery neg */}
        <Wire d="M 238 84 C 260 170, 20 170, 50 90" />

        {/* Battery at left */}
        <BatteryIcon x={26} y={20} />

        {/* Resistor at top-center */}
        <ResistorIcon x={114} y={30} />

        {/* Lamp at right */}
        <LampIcon x={220} y={50} />

        {/* Flow arrows */}
        <FlowArrow x={85} y={16} label="kabel" />
        <FlowArrow x={195} y={46} label="kabel" />
        <FlowArrow x={140} y={172} label="kabel" />
      </svg>
    );
  }

  return null;
}

export function MissionControl({ mission, missionIndex, totalMissions, onCheckCircuit, isSuccess }: MissionControlProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-5 shadow-md relative z-10">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-wide">
          <Flag size={28} />
          Pusat Misi
        </h2>
        <p className="text-indigo-200 font-semibold text-sm mt-1">
          Misi {missionIndex + 1} dari {totalMissions}
        </p>
      </div>

      {/* Mission Details */}
      <div className="p-5 flex-grow flex flex-col gap-5 relative z-10 overflow-y-auto hide-scrollbar">
        <motion.div 
          key={mission.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white p-5 rounded-2xl shadow-lg border-4 border-indigo-100"
        >
          <h3 className="text-xl font-bold text-indigo-700 mb-2">
            {mission.title}
          </h3>
          <p className="text-base text-slate-600 font-semibold leading-relaxed">
            {mission.description}
          </p>
        </motion.div>

        {/* Circuit Diagram Blueprint */}
        <motion.div
          key={`diagram-${mission.id}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-2xl shadow-lg border-4 border-blue-200"
        >
          <h4 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
            🗺️ Contoh Rangkaian
          </h4>
          <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-100">
            <CircuitDiagram missionId={mission.id} />
          </div>
          <p className="text-sm text-blue-600 font-semibold mt-3 italic text-center">
            👆 Buat seperti gambar ini ya!
          </p>
        </motion.div>

        {/* Hint */}
        <div className="bg-amber-50 p-4 rounded-2xl shadow-md border-4 border-amber-200">
          <h4 className="text-base font-bold text-amber-700 mb-2">💡 Petunjuk:</h4>
          <p className="text-amber-900 font-semibold text-sm leading-relaxed">
            {mission.hint}
          </p>
        </div>

        {/* How to Play */}
        <div className="bg-green-50 p-4 rounded-2xl shadow-md border-4 border-green-200">
          <h4 className="text-base font-bold text-green-700 mb-2">🎮 Cara Bermain:</h4>
          <ul className="space-y-2 text-green-900 font-semibold text-sm">
            <li>1. Klik tombol komponen di bawah.</li>
            <li>2. Geser komponen di kanvas.</li>
            <li>3. Klik titik bulat untuk menghubungkan kabel.</li>
            <li>4. Tekan &quot;Cek Rangkaian&quot;!</li>
          </ul>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-5 bg-white border-t-4 border-slate-200 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCheckCircuit}
          disabled={isSuccess}
          className={`w-full py-5 rounded-full text-xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-colors ${
            isSuccess 
              ? "bg-green-500 shadow-green-500/50" 
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/50"
          }`}
        >
          {isSuccess ? (
            <>
              <CheckCircle2 size={28} />
              Misi Berhasil! 🎉
            </>
          ) : (
            <>
              <Zap size={28} />
              Cek Rangkaian
            </>
          )}
        </motion.button>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-50 z-0" />
    </div>
  );
}
