"use client";

import { useState, useCallback, useRef } from "react";
import { MissionControl } from "@/components/simulation/MissionControl";
import { Home, Trash2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

export type ComponentType = "battery" | "lamp" | "switch" | "resistor";

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  state?: boolean;
}

export interface Wire {
  id: string;
  fromId: string;
  fromTerminal: string;
  toId: string;
  toTerminal: string;
}

const MISSIONS = [
  {
    id: 1,
    title: "Misi 1: Nyalakan Lampunya!",
    description: "Hubungkan Baterai ke Lampu supaya lampunya menyala.",
    hint: "Tarik kabel dari + baterai ke lampu, lalu dari lampu ke - baterai.",
  },
  {
    id: 2,
    title: "Misi 2: Kendalikan Listriknya!",
    description: "Tambahkan Sakelar antara Baterai dan Lampu.",
    hint: "Pasang sakelar di tengah-tengah rangkaian, lalu nyalakan sakelarnya!",
  },
  {
    id: 3,
    title: "Misi 3: Lindungi Lampunya!",
    description: "Tambahkan Resistor untuk melindungi Lampu dari arus berlebih.",
    hint: "Pasang resistor sebelum lampu agar arusnya aman.",
  },
];

// Terminal positions relative to each component type
function getTerminalPos(comp: CanvasComponent, terminal: string): { x: number; y: number } {
  switch (comp.type) {
    case "battery":
      if (terminal === "pos") return { x: comp.x + 56, y: comp.y - 4 };
      return { x: comp.x + 56, y: comp.y + 148 };
    case "lamp":
      if (terminal === "in") return { x: comp.x + 16, y: comp.y + 120 };
      return { x: comp.x + 96, y: comp.y + 120 };
    case "switch":
      if (terminal === "in") return { x: comp.x - 8, y: comp.y + 36 };
      return { x: comp.x + 128, y: comp.y + 36 };
    case "resistor":
      if (terminal === "in") return { x: comp.x - 8, y: comp.y + 28 };
      return { x: comp.x + 128, y: comp.y + 28 };
    default:
      return { x: comp.x, y: comp.y };
  }
}

export default function Simulation() {
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [wiringFrom, setWiringFrom] = useState<{ compId: string; terminal: string } | null>(null);
  const [currentMission, setCurrentMission] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);
  const [showMissionMobile, setShowMissionMobile] = useState(false);
  const [dragInfo, setDragInfo] = useState<{ id: string; startX: number; startY: number; compX: number; compY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Add a component to canvas
  const addComponent = useCallback((type: ComponentType) => {
    const id = `${type}-${Date.now()}`;
    const offsetX = 100 + (components.length % 3) * 160;
    const offsetY = 80 + Math.floor(components.length / 3) * 120;
    setComponents(prev => [...prev, { 
      id, 
      type, 
      x: offsetX, 
      y: offsetY, 
      state: type === "switch" ? false : undefined 
    }]);
  }, [components.length]);

  // Drag handling via pointer events
  const handlePointerDown = useCallback((e: React.PointerEvent, compId: string) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return;
    e.preventDefault();
    e.stopPropagation();
    setDragInfo({ id: compId, startX: e.clientX, startY: e.clientY, compX: comp.x, compY: comp.y });
  }, [components]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragInfo) return;
    const dx = e.clientX - dragInfo.startX;
    const dy = e.clientY - dragInfo.startY;
    setComponents(prev => prev.map(c => 
      c.id === dragInfo.id ? { ...c, x: dragInfo.compX + dx, y: dragInfo.compY + dy } : c
    ));
  }, [dragInfo]);

  const handlePointerUp = useCallback(() => {
    setDragInfo(null);
  }, []);

  // Terminal click for wiring
  const handleTerminalClick = useCallback((compId: string, terminal: string) => {
    if (wiringFrom) {
      if (wiringFrom.compId !== compId) {
        setWires(prev => [...prev, {
          id: `wire-${Date.now()}`,
          fromId: wiringFrom.compId,
          fromTerminal: wiringFrom.terminal,
          toId: compId,
          toTerminal: terminal,
        }]);
      }
      setWiringFrom(null);
    } else {
      setWiringFrom({ compId, terminal });
    }
  }, [wiringFrom]);

  // Toggle switch
  const toggleSwitch = useCallback((id: string) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, state: !c.state } : c));
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    setComponents([]);
    setWires([]);
    setWiringFrom(null);
  }, []);

  // Check circuit
  const checkCircuit = useCallback(() => {
    const hasBattery = components.some(c => c.type === "battery");
    const hasLamp = components.some(c => c.type === "lamp");
    const hasSwitch = components.some(c => c.type === "switch");
    const hasResistor = components.some(c => c.type === "resistor");
    const mission = MISSIONS[currentMission];
    let passed = false;

    if (mission.id === 1 && hasBattery && hasLamp && wires.length >= 2) {
      passed = true;
    } else if (mission.id === 2 && hasBattery && hasLamp && hasSwitch && wires.length >= 3) {
      const sw = components.find(c => c.type === "switch");
      if (sw?.state === true) passed = true;
    } else if (mission.id === 3 && hasBattery && hasLamp && hasResistor && wires.length >= 3) {
      passed = true;
    }

    if (passed) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (currentMission < MISSIONS.length - 1) {
          setCurrentMission(prev => prev + 1);
          clearCanvas();
        }
      }, 4000);
    } else {
      setShowFailMessage(true);
      setTimeout(() => setShowFailMessage(false), 2500);
    }
  }, [components, wires, currentMission, clearCanvas]);

  // Render SVG wires
  const renderWires = () => {
    return wires.map(wire => {
      const fromComp = components.find(c => c.id === wire.fromId);
      const toComp = components.find(c => c.id === wire.toId);
      if (!fromComp || !toComp) return null;
      const from = getTerminalPos(fromComp, wire.fromTerminal);
      const to = getTerminalPos(toComp, wire.toTerminal);
      // Bezier curve
      const midY = (from.y + to.y) / 2;
      const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
      return (
        <path
          key={wire.id}
          d={d}
          stroke={isSuccess ? "#fbbf24" : "#ef4444"}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          className={isSuccess ? "animate-pulse" : ""}
        />
      );
    });
  };

  // Terminal dot
  const Terminal = ({ compId, terminal, x, y, color }: { compId: string; terminal: string; x: number; y: number; color: string }) => {
    const isActive = wiringFrom?.compId === compId && wiringFrom?.terminal === terminal;
    return (
      <div
        className={`absolute w-7 h-7 rounded-full border-[3px] cursor-crosshair flex items-center justify-center transition-all duration-150 z-30 touch-none ${
          isActive 
            ? "bg-yellow-400 border-white scale-150 shadow-[0_0_16px_rgba(250,204,21,0.9)]" 
            : `${color} border-white hover:scale-125 shadow-md`
        }`}
        style={{ left: x - 14, top: y - 14 }}
        onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); handleTerminalClick(compId, terminal); }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    );
  };

  return (
    <main className="flex flex-col lg:flex-row h-[100dvh] w-full bg-slate-100 overflow-hidden">
      {isSuccess && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} />
        </div>
      )}

      {/* Top Bar for Mobile */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("/")}
          className="p-3 bg-white rounded-full shadow-lg text-slate-600 flex items-center gap-2 pointer-events-auto"
        >
          <Home size={24} strokeWidth={3} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMissionMobile(true)}
          className="lg:hidden px-5 py-3 bg-indigo-600 text-white rounded-full shadow-lg flex items-center gap-2 font-bold pointer-events-auto"
        >
          📋 Lihat Misi
        </motion.button>
      </div>

      {/* Workbench - Left Side */}
      <div className="flex-1 h-full flex flex-col relative min-h-0">
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] overflow-hidden touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* SVG Wires layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {renderWires()}
          </svg>

          {/* Components */}
          {components.map(comp => {
            const tPos = (t: string) => getTerminalPos(comp, t);
            return (
              <div key={comp.id} className="absolute" style={{ left: 0, top: 0 }}>
                {/* Component body */}
                <div
                  className="absolute cursor-grab active:cursor-grabbing z-10 touch-none"
                  style={{ left: comp.x, top: comp.y }}
                  onPointerDown={(e) => handlePointerDown(e, comp.id)}
                >
                  {comp.type === "battery" && (
                    <div className="w-28 h-36 bg-gradient-to-b from-emerald-300 to-emerald-500 rounded-2xl shadow-xl flex flex-col items-center border-4 border-emerald-600 select-none">
                      <div className="w-10 h-3 bg-emerald-700 rounded-t-md absolute -top-3 left-1/2 -translate-x-1/2" />
                      <div className="text-3xl font-black mt-3 text-white drop-shadow">+</div>
                      <div className="flex-grow flex items-center justify-center">
                        <span className="text-lg font-black tracking-widest text-white/80 rotate-90">BATERAI</span>
                      </div>
                      <div className="text-3xl font-black mb-3 text-white drop-shadow">−</div>
                    </div>
                  )}
                  {comp.type === "lamp" && (
                    <div className={`w-28 h-28 rounded-full shadow-xl flex items-center justify-center border-4 transition-all duration-500 select-none ${
                      isSuccess 
                        ? "bg-yellow-300 border-yellow-500 shadow-[0_0_40px_rgba(253,224,71,0.8)]" 
                        : "bg-slate-200 border-slate-400"
                    }`}>
                      <div className="absolute -bottom-8 w-14 h-8 bg-slate-400 rounded-b-xl border-2 border-slate-500" />
                      <span className="text-3xl">{isSuccess ? "💡" : "🔌"}</span>
                    </div>
                  )}
                  {comp.type === "switch" && (
                    <div
                      className="w-32 h-18 bg-purple-200 rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-purple-400 select-none cursor-pointer px-3 py-2"
                      onClick={(e) => { e.stopPropagation(); toggleSwitch(comp.id); }}
                    >
                      <span className="text-xs font-bold text-purple-700 mb-1">{comp.state ? "NYALA" : "MATI"}</span>
                      <div className={`w-14 h-7 rounded-full transition-colors duration-300 flex items-center px-1 ${comp.state ? "bg-green-500 justify-end" : "bg-slate-400 justify-start"}`}>
                        <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                      </div>
                    </div>
                  )}
                  {comp.type === "resistor" && (
                    <div className="w-32 h-14 bg-amber-100 rounded-xl shadow-xl flex items-center justify-center border-4 border-amber-400 select-none gap-1">
                      <div className="w-3 h-full bg-red-500 rounded-sm" />
                      <div className="w-3 h-full bg-amber-600 rounded-sm" />
                      <div className="w-3 h-full bg-orange-500 rounded-sm" />
                      <div className="w-3 h-full bg-amber-800 rounded-sm" />
                    </div>
                  )}
                </div>

                {/* Terminals */}
                {comp.type === "battery" && (
                  <>
                    <Terminal compId={comp.id} terminal="pos" x={tPos("pos").x} y={tPos("pos").y} color="bg-green-500" />
                    <Terminal compId={comp.id} terminal="neg" x={tPos("neg").x} y={tPos("neg").y} color="bg-red-500" />
                  </>
                )}
                {comp.type === "lamp" && (
                  <>
                    <Terminal compId={comp.id} terminal="in" x={tPos("in").x} y={tPos("in").y} color="bg-slate-600" />
                    <Terminal compId={comp.id} terminal="out" x={tPos("out").x} y={tPos("out").y} color="bg-slate-600" />
                  </>
                )}
                {(comp.type === "switch" || comp.type === "resistor") && (
                  <>
                    <Terminal compId={comp.id} terminal="in" x={tPos("in").x} y={tPos("in").y} color="bg-slate-600" />
                    <Terminal compId={comp.id} terminal="out" x={tPos("out").x} y={tPos("out").y} color="bg-slate-600" />
                  </>
                )}
              </div>
            );
          })}

          {/* Wiring indicator */}
          <AnimatePresence>
            {wiringFrom && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full font-bold text-lg shadow-xl z-50"
              >
                🔌 Klik terminal lain untuk menghubungkan kabel!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fail message */}
          <AnimatePresence>
            {showFailMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl z-50"
              >
                ❌ Rangkaian belum lengkap. Coba lagi ya!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
              >
                <div className="bg-green-500/90 text-white px-12 py-8 rounded-[3rem] shadow-2xl text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <div className="text-4xl font-black">Misi Berhasil!</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Toolbox */}
        <div className="h-28 w-full bg-slate-800 flex items-center px-4 overflow-x-auto hide-scrollbar z-40 border-t-4 border-slate-700 shrink-0">
          <div className="flex gap-4 mx-auto min-w-max items-center h-full">
            {([
              { type: "battery" as const, label: "Baterai", emoji: "🔋", color: "bg-emerald-500" },
              { type: "lamp" as const, label: "Lampu", emoji: "💡", color: "bg-yellow-400" },
              { type: "switch" as const, label: "Sakelar", emoji: "🔘", color: "bg-purple-500" },
              { type: "resistor" as const, label: "Resistor", emoji: "⚡", color: "bg-red-500" },
            ]).map(item => (
              <motion.button
                key={item.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addComponent(item.type)}
                className={`flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-20 rounded-2xl ${item.color} shadow-lg text-white border-4 border-white/20 select-none shrink-0`}
              >
                <span className="text-xl sm:text-2xl">{item.emoji}</span>
                <span className="font-bold text-[10px] sm:text-xs mt-1">{item.label}</span>
              </motion.button>
            ))}

            <div className="w-px h-16 bg-slate-600 mx-1 sm:mx-2 shrink-0" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCanvas}
              className="flex flex-col items-center justify-center w-16 h-20 sm:w-20 sm:h-20 rounded-2xl bg-slate-600 shadow-lg text-white border-4 border-white/10 select-none shrink-0"
            >
              <Trash2 size={20} className="sm:w-6 sm:h-6" />
              <span className="font-bold text-[10px] sm:text-xs mt-1">Hapus</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWiringFrom(null)}
              className="flex flex-col items-center justify-center w-16 h-20 sm:w-20 sm:h-20 rounded-2xl bg-slate-600 shadow-lg text-white border-4 border-white/10 select-none shrink-0"
            >
              <RotateCcw size={20} className="sm:w-6 sm:h-6" />
              <span className="font-bold text-[10px] sm:text-xs mt-1">Reset</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mission Control Panel (Responsive Drawer/Sidebar) */}
      <div className={`
        fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none lg:static lg:inset-auto
        ${showMissionMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}
        transition-opacity lg:transition-none
      `}>
        <div className={`
          absolute bottom-0 left-0 w-full h-[85dvh] bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transition-transform duration-300 flex flex-col overflow-hidden
          lg:static lg:w-[340px] lg:h-full lg:rounded-none lg:shadow-2xl lg:translate-y-0 lg:shrink-0 lg:border-l-4 lg:border-slate-200
          ${showMissionMobile ? "translate-y-0" : "translate-y-full"}
        `}>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setShowMissionMobile(false)}
            className="lg:hidden absolute top-4 right-4 z-[70] p-2 bg-indigo-500/50 hover:bg-indigo-500 text-white rounded-full transition-colors"
          >
            ❌
          </button>
          
          <MissionControl
            mission={MISSIONS[currentMission]}
            missionIndex={currentMission}
            totalMissions={MISSIONS.length}
            onCheckCircuit={checkCircuit}
            isSuccess={isSuccess}
          />
        </div>
      </div>
    </main>
  );
}
