import React, { useState, useEffect, useRef } from "react";
import ranaLogo from "../assets/images/rana_bike_cares_logo_1784714930624.jpg";
import { motion } from "motion/react";
import { Shield, CheckCircle2, Gauge, Volume2, VolumeX, FastForward } from "lucide-react";
import { IntroAudioManager } from "../utils/IntroAudioManager";

interface WebsiteInitialLoaderProps {
  onLoadingComplete: () => void;
}

export const WebsiteInitialLoader: React.FC<WebsiteInitialLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Kickstarting Engine Systems & Ignition...");
  const [isMuted, setIsMuted] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  
  const audioManagerRef = useRef<IntroAudioManager | null>(null);

  // Initialize Audio Manager on mount & setup global user gesture listeners for instant sound on reload
  useEffect(() => {
    const manager = new IntroAudioManager();
    audioManagerRef.current = manager;

    // Attempt sound playback immediately on mount
    manager.startEngine();
    manager.ensureAudioStarted().then((running) => {
      setAudioActive(running);
    });

    const tryActivateAudio = () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.ensureAudioStarted().then((running) => {
          if (running) {
            setAudioActive(true);
          }
        });
      }
    };

    // Programmatic auto-trigger on mount
    try {
      const simEvent = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
      document.dispatchEvent(simEvent);
      window.dispatchEvent(simEvent);
    } catch {}

    // Attach listeners
    const events = ["pointerdown", "touchstart", "touchmove", "touchend", "click", "keydown", "scroll", "mousemove", "pointermove", "wheel", "focus", "mouseenter"];
    events.forEach((evt) => {
      window.addEventListener(evt, tryActivateAudio, { passive: true });
      document.addEventListener(evt, tryActivateAudio, { passive: true });
    });

    const autoRetryInterval = setInterval(() => {
      if (audioManagerRef.current && !audioManagerRef.current.isAudioContextRunning()) {
        tryActivateAudio();
      } else if (audioManagerRef.current?.isAudioContextRunning()) {
        setAudioActive(true);
        clearInterval(autoRetryInterval);
      }
    }, 300);

    return () => {
      clearInterval(autoRetryInterval);
      events.forEach((evt) => {
        window.removeEventListener(evt, tryActivateAudio);
        document.removeEventListener(evt, tryActivateAudio);
      });
      manager.fadeAndStop(300);
      audioManagerRef.current = null;
    };
  }, []);

  const handleStartAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (audioManagerRef.current) {
      audioManagerRef.current.ensureAudioStarted().then((running) => {
        setAudioActive(running);
      });
      audioManagerRef.current.updateProgress(progress);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioManagerRef.current) {
      audioManagerRef.current.ensureAudioStarted();
      const muted = audioManagerRef.current.toggleMute();
      setIsMuted(muted);
      setAudioActive(!muted);
    }
  };

  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (audioManagerRef.current) {
      audioManagerRef.current.fadeAndStop(300);
    }
    onLoadingComplete();
  };

  // 7.5 Seconds Intro Loader Interval (75ms per tick x 100 steps = 7500ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (audioManagerRef.current) {
            audioManagerRef.current.updateProgress(100);
            audioManagerRef.current.fadeAndStop(400);
          }
          setTimeout(() => {
            onLoadingComplete();
          }, 350);
          return 100;
        }

        const next = prev + 1;

        // Synchronize engine sound state with loading progress
        if (audioManagerRef.current) {
          audioManagerRef.current.updateProgress(next);
          // Trigger accelerator throttle revs at key engine progress points (including maximum roar at 92%)
          if (next === 18 || next === 42 || next === 68 || next === 92) {
            audioManagerRef.current.triggerAccelerateRoar();
          }
        }

        if (next < 20) {
          setStatusText("Kickstarting Engine Systems & Ignition...");
        } else if (next < 45) {
          setStatusText("Warming up Heavy Engine & Throttle Rev...");
        } else if (next < 70) {
          setStatusText("Calibrating Clutch, Gears & Brake Hydraulics...");
        } else if (next < 90) {
          setStatusText("Tuning Exhaust Performance & Diagnostics...");
        } else {
          setStatusText("Workshop Ready! Engine Roaring...");
        }

        return next > 100 ? 100 : next;
      });
    }, 75);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onClick={handleStartAudio}
      className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none cursor-pointer"
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

      {/* Top Header Controls */}
      <div className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-white p-0.5 shadow-lg shadow-orange-950/50 border border-orange-500 overflow-hidden shrink-0">
            <img src={ranaLogo} alt="Rana Bike Care Official Logo" className="w-full h-full object-contain rounded-lg" />
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

        {/* Mute & Skip Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleMute}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition flex items-center space-x-1.5 text-xs font-bold cursor-pointer ${
              isMuted
                ? "bg-red-950/80 border-red-800 text-red-400"
                : "bg-slate-900/90 border-slate-700 text-amber-400 hover:bg-slate-800"
            }`}
            title={isMuted ? "Unmute Engine Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-amber-400 animate-pulse" />}
            <span className="hidden xs:inline">{isMuted ? "Muted" : "Sound ON"}</span>
          </button>

          <button
            onClick={handleSkip}
            className="px-3.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 border border-orange-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center space-x-1.5 cursor-pointer"
            title="Skip directly to website"
          >
            <span>Skip</span>
            <FastForward className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Center Stage: Prominent Animated Motorcycle GIF Container */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 my-auto space-y-5 sm:space-y-6 md:space-y-8 w-full max-w-5xl mx-auto">
        
        {/* PROMINENT 80s BIKE ANIMATION GIF FRAME */}
        <div className="relative max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl w-full rounded-3xl overflow-hidden border-2 border-amber-400/60 bg-slate-900 shadow-[0_0_60px_rgba(245,158,11,0.35)] p-2.5 sm:p-4 text-center transition-all duration-300">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[16/9] md:aspect-[16/9] flex items-center justify-center border border-slate-800">
            <img 
              src="https://media.tenor.com/PS35tEHgx3kAAAAM/bike-80s.gif" 
              alt="80s Motorcycle Riding Animation"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
            
            {/* Subtle Gradient vignette on edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

            {/* Live Audio Indicator Badge on GIF */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold text-amber-400 flex items-center space-x-2 shadow-lg">
              <Gauge className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400 animate-spin" />
              <span>
                {isMuted
                  ? "Audio Muted"
                  : audioActive
                  ? "Engine Sound Active"
                  : "Tap Screen for Sound"}
              </span>
            </div>
          </div>
        </div>

        {/* Tap Screen Sound Notification Banner if Audio Suspended by Browser Autoplay Policy */}
        {!audioActive && !isMuted && (
          <motion.button
            onClick={handleStartAudio}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase px-6 py-3 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.5)] border border-amber-300 flex items-center space-x-2.5 cursor-pointer hover:brightness-110 transition z-20"
          >
            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-950 animate-bounce" />
            <span>🔊 TAP / CLICK ANYWHERE TO START ENGINE SOUND</span>
          </motion.button>
        )}

        {/* Progress Display Box */}
        <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full mx-auto space-y-3.5 text-center px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between text-xs sm:text-sm md:text-base font-mono font-bold">
            <span className="text-amber-300 tracking-wider flex items-center space-x-2 sm:space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>{statusText}</span>
            </span>
            <span className="text-white text-lg sm:text-xl font-black">{progress}%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-3.5 sm:h-4 bg-slate-950 rounded-full p-0.5 border border-slate-800 relative overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-pulse" />
            </motion.div>
          </div>

          <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-slate-400 font-medium pt-1">
            <span className="flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
              <span>Multi-brand Specialist</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
              <span>Mob: 92724 96996</span>
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Footer info */}
      <div className="p-4 text-center text-[10px] sm:text-xs text-slate-400 font-mono tracking-widest relative z-10 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
        RANA AUTO GARAGE • DAPODI, PIMPRI CHINCHWAD, PUNE 411012 • TWO-WHEELER REPAIR & SPARES
      </div>
    </motion.div>
  );
};



