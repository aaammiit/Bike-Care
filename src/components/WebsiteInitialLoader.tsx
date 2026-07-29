import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Wrench, Shield, CheckCircle2 } from "lucide-react";

interface WebsiteInitialLoaderProps {
  onLoadingComplete: () => void;
}

export const WebsiteInitialLoader: React.FC<WebsiteInitialLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Engine Systems...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 300);
          return 100;
        }

        const next = prev + 2;
        if (next < 30) {
          setStatusText("Warming up Engine & Dyno Systems...");
        } else if (next < 65) {
          setStatusText("Calibrating Clutch & Hydraulic Brakes...");
        } else if (next < 90) {
          setStatusText("Attaching Rana Bike Care Trail Banner...");
        } else {
          setStatusText("Workshop Fully Ready! Starting Engine...");
        }

        return next > 100 ? 100 : next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://media.tenor.com/PS35tEHgx3kAAAAM/bike-80s.gif"
          alt="Rana Bike Care Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover blur-sm scale-110"
        />
      </div>

      {/* Top Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-900/50">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wrench className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-wider text-white font-sans uppercase">
              राणा बाइक केयर
            </h1>
            <p className="text-[10px] sm:text-xs font-extrabold tracking-widest text-amber-400 uppercase">
              Rana Bike Care
            </p>
          </div>
        </div>

        <button
          onClick={onLoadingComplete}
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 border border-slate-700 hover:border-amber-400 px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg"
        >
          Skip Intro →
        </button>
      </div>

      {/* Center Stage: Prominent Animated Motorcycle GIF Container */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 my-auto space-y-5 sm:space-y-6">
        
        {/* Live Badge */}
        <div className="bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white border border-red-400/50 shadow-xl flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
          <span>Rana Bike Care Loading Engine...</span>
        </div>

        {/* PROMINENT 80s BIKE ANIMATION GIF FRAME */}
        <div className="relative max-w-lg w-full rounded-3xl overflow-hidden border-2 border-amber-400/60 bg-slate-900 shadow-[0_0_50px_rgba(245,158,11,0.3)] p-2 sm:p-3 text-center">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
            <img 
              src="https://media.tenor.com/PS35tEHgx3kAAAAM/bike-80s.gif" 
              alt="80s Motorcycle Riding Animation"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
            
            {/* Subtle Gradient vignette on edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Progress Display Box */}
        <div className="max-w-md w-full mx-auto space-y-3 text-center px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold">
            <span className="text-amber-300 tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{statusText}</span>
            </span>
            <span className="text-white text-lg font-black">{progress}%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-3 bg-slate-950 rounded-full p-0.5 border border-slate-800 relative overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-pulse" />
            </motion.div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-400 font-medium pt-1">
            <span className="flex items-center space-x-1">
              <Shield className="h-3.5 w-3.5 text-amber-400" />
              <span>Multi-brand Specialist</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Mob: 9766881194</span>
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Footer info */}
      <div className="p-4 text-center text-[10px] sm:text-xs text-slate-400 font-mono tracking-widest relative z-10 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
        RANA AUTO GARAGE • PUNE • TWO-WHEELER REPAIR & SPARES
      </div>
    </motion.div>
  );
};
