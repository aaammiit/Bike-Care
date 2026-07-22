import React, { useEffect, useState, useRef } from "react";

interface Procedure {
  id: "engine" | "suspension" | "brakes" | "chain" | "ecu" | "wash";
  title: string;
  badge: string;
  icon: string;
  color: string;
  steps: string[];
  scientificFormula: string;
  currentStatusText: string;
}

const garageProcedures: Procedure[] = [
  {
    id: "engine",
    title: "Engine & Valve Decarbonization",
    badge: "CYLINDER RESTORE",
    icon: "🔥",
    color: "#EF4444",
    steps: [
      "Remove spark plugs & inspect carbon scaling.",
      "Inject chemical carbon breakdown solvent.",
      "Scrub carbon crust off valve seats.",
      "Test cylinder compression (Achieved 135 PSI)."
    ],
    scientificFormula: "CH3-C6H5 + Solvent → CO2 + H2O + C (Restored)",
    currentStatusText: "SCRUBBING VALVES"
  },
  {
    id: "suspension",
    title: "USD Fork Seal & Damper Service",
    badge: "SUSPENSION RE-DAMP",
    icon: "⚡",
    color: "#3B82F6",
    steps: [
      "Drain oxidized damper fluid & inspect stanchion tubes.",
      "Install high-pressure NOK double lip fork seals.",
      "Refill high-performance Motul 10W suspension fluid.",
      "Bleed micro-air bubbles & adjust rebound clickers."
    ],
    scientificFormula: "Viscosity (μ) = 15.4 cSt @ 40°C Calibrated",
    currentStatusText: "BLEEDING AIR"
  },
  {
    id: "brakes",
    title: "Hydraulic Caliper & Pad Bleeding",
    badge: "BRAKE HYDRAULICS",
    icon: "🛑",
    color: "#EC4899",
    steps: [
      "Flush contaminated DOT-4 brake fluid lines.",
      "Clean brake caliper pistons & lube sliders.",
      "Mount copper-free premium ceramic brake pads.",
      "Bleed hydraulics to lock zero-air piston response."
    ],
    scientificFormula: "Pascal's Law: F1/A1 = F2/A2 (Perfect Hydraulic Seal)",
    currentStatusText: "LEVER PRESSURE MATCHING"
  },
  {
    id: "chain",
    title: "DID O-Ring Tension & Laser Align",
    badge: "DRIVETRAIN ALIGN",
    icon: "⚙️",
    color: "#10B981",
    steps: [
      "Scrub grease sludge off rear sprocket & chain links.",
      "Clamp line-alignment diagnostic laser onto the rear cog.",
      "Calibrate wheel axle slide brackets (Deviation < 0.2mm).",
      "Apply high-adhesion synthetic white lithium lube spray."
    ],
    scientificFormula: "Chain Slack = 25.0mm / Alignment Delta < 0.4°",
    currentStatusText: "LASER ALIGNING"
  },
  {
    id: "ecu",
    title: "EFI Mapping & Ignition Calibration",
    badge: "ECU CALIBRATION",
    icon: "💻",
    color: "#F59E0B",
    steps: [
      "Plug OBD-II diagnostic tool into main wiring harness.",
      "Read real-time sensor fuel trim & oxygen offset logs.",
      "Flash stock 2026 fuel-injection mapping code.",
      "Recalibrate electronic throttle feedback & warm idle."
    ],
    scientificFormula: "Stoichiometric Air-Fuel Ratio (AFR) = 14.7:1",
    currentStatusText: "FLASHING EFI CODES"
  },
  {
    id: "wash",
    title: "Snow Foam Wash & Teflon Detail",
    badge: "AESTHETIC DETAIL",
    icon: "🧼",
    color: "#06B6D4",
    steps: [
      "Power rinse thick abrasive dirt off chassis lower rails.",
      "Spray active cling snow foam compound over body.",
      "Deep-clean wheel spokes and radiator gills with brushes.",
      "Microfiber hand dry & polish protective Teflon coat."
    ],
    scientificFormula: "Hydrophobic Contact Angle = 112° Teflon Shield",
    currentStatusText: "TEFLON BUFFING"
  }
];

const playBeep = (freq: number = 800, duration: number = 100, volume: number = 0.08) => {
  if (volume <= 0) return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) {
    // Silently handle auto-play blockages
  }
};

const stepTools: Record<string, { name: string; actionText: string; icon: string; soundFreq: number; desc: string }> = {
  engine_0: { name: "Spark Plug Feeler Gauge", actionText: "Measure & Calibrate Plug Gap", icon: "📏", soundFreq: 520, desc: "Check electrode wear and gap width (target 0.8mm)." },
  engine_1: { name: "Carbon Solvent Injector", actionText: "Inject Chemical Solvent Foam", icon: "🧪", soundFreq: 380, desc: "Spray chemical carbon breakdown foaming solvent into chambers." },
  engine_2: { name: "Sonic Decarbonizer Scrub", actionText: "Engage Ultrasonic Valve Scrubber", icon: "⚙️", soundFreq: 1100, desc: "Shatter hardened carbon off valve seats using high-frequency acoustics." },
  engine_3: { name: "Digital Compression Tester", actionText: "Test Chamber Combustion Pressure", icon: "⏱️", soundFreq: 680, desc: "Cycle the engine starter to seal chamber and verify PSI." },

  suspension_0: { name: "Damper Drainage Valve", actionText: "Drain Contaminated Damper Fluid", icon: "🛢️", soundFreq: 300, desc: "Open low-speed compression clicker port to bleed old sludge." },
  suspension_1: { name: "NOK Seals Press Sleeve", actionText: "Press Double-Lip NOK Fork Seals", icon: "🛠️", soundFreq: 450, desc: "Seat the high-pressure rubber seals into stanchion sliders." },
  suspension_2: { name: "Motul 10W Fluid Funnel", actionText: "Refill 10W High-Performance Oil", icon: "🧴", soundFreq: 600, desc: "Pour measured 420ml oil into stanchion tubes to restore damping force." },
  suspension_3: { name: "Pneumatic Rebound Dial", actionText: "Adjust Hydraulic Clickers", icon: "🔄", soundFreq: 850, desc: "Set compression rebound damping to +14 clicks for high stability." },

  brakes_0: { name: "Vacuum Bleeder Hose", actionText: "Flush Brake Hydraulics", icon: "🔌", soundFreq: 320, desc: "Flush old moisture-heavy DOT-4 fluid until lines are crystal clear." },
  brakes_1: { name: "Piston Brake Cleanser", actionText: "Clean & Lubricate Pistons", icon: "🧼", soundFreq: 480, desc: "Remove road grit and apply synthetic silicone grease to caliper slides." },
  brakes_2: { name: "Piston Compressor clamp", actionText: "Compress Brake Caliper Pistons", icon: "🔩", soundFreq: 580, desc: "Retract pistons to install premium thick ceramic brake pads." },
  brakes_3: { name: "Brake Lever Pressure Pump", actionText: "Pump Brake Lever", icon: "✊", soundFreq: 750, desc: "Pump several times to seat brake pads against steel rotors." },

  chain_0: { name: "Sprocket Grit Brush", actionText: "Scrub Off Old Road Sludge", icon: "🧹", soundFreq: 400, desc: "Clean old sticky sand and road debris off chain rollers and cog teeth." },
  chain_1: { name: "Alignment Laser Bracket", actionText: "Mount Axle Alignment Laser", icon: "🚨", soundFreq: 1200, desc: "Cast high-precision red laser beam along the belt-line sprocket plane." },
  chain_2: { name: "Slide Spanner Bracket Wrench", actionText: "Torque Axle Slack Adjusters", icon: "🔧", soundFreq: 500, desc: "Turn adjustment bolts to restore slack to precise 25.0mm tolerances." },
  chain_3: { name: "Lithium White Lube Spray", actionText: "Apply White Lithium Chain Lube", icon: "💨", soundFreq: 350, desc: "Spray high-adhesion synthetic lubricant over chain links." },

  ecu_0: { name: "OBD-II Diagnostic Interface", actionText: "Connect OBD-II Wire Harness", icon: "🔌", soundFreq: 950, desc: "Plug standard CAN-bus cable into main onboard computer port." },
  ecu_1: { name: "Fuel Trim Offset Scanner", actionText: "Query EFI Sensor Log Files", icon: "📊", soundFreq: 880, desc: "Scan real-time oxygen levels and exhaust temp values." },
  ecu_2: { name: "EPROM Firmware Flasher", actionText: "Upload Stock 2026 Stoich Mapping", icon: "💾", soundFreq: 1300, desc: "Compile and flash new fuel delivery ratios (target 14.7:1 AFR)." },
  ecu_3: { name: "Throttle Calibration TPS", actionText: "Recalibrate Throttle TPS", icon: "🎮", soundFreq: 1050, desc: "Re-zero the drive-by-wire electronic throttle plates." },

  wash_0: { name: "High-Pressure Jet Lance", actionText: "Rinse Off Heavy Grime", icon: "🔫", soundFreq: 420, desc: "Blast off stuck sand, mud, and dust using 120-bar water pressure." },
  wash_1: { name: "Active Foam Snow Gun", actionText: "Coat Chassis with Snow Foam", icon: "💭", soundFreq: 310, desc: "Spray thick alkaline cling agent to dissolve road tar and grease." },
  wash_2: { name: "Wheel & Radiator Detailing Brush", actionText: "Detail Spokes & Radiator Gills", icon: "🖌️", soundFreq: 490, desc: "Gently agitate spokes, caliper crevices, and radiator core." },
  wash_3: { name: "Teflon Microfiber Buff Pad", actionText: "Buff Protective Teflon Sealant", icon: "✨", soundFreq: 920, desc: "Apply and buff thin coat of premium hydrophobic Teflon protectant." }
};

interface BikeStyle {
  name: string;
  brandText: string;
  primaryColor: string;
  secondaryColor: string;
  strokeColor: string;
  engineColor: string;
  fenderColor: string;
  seatColor: string;
  exhaustColor: string;
  glowColor: string;
  wheelStyle: "spokes" | "stars" | "solid" | "neon-ring" | "retro-disc";
  headlightColor: string;
  dustColor: string;
}

const bikeModels: BikeStyle[] = [
  {
    name: "Classic Cruiser",
    brandText: "R",
    primaryColor: "#F97316",      // Orange
    secondaryColor: "#cbd5e1",    // Chrome
    strokeColor: "#ea580c",       // Dark Orange
    engineColor: "#334155",       // Slate Engine
    fenderColor: "#475569",       // Medium Slate
    seatColor: "#1e293b",         // Dark Slate
    exhaustColor: "#e2e8f0",      // Chrome Exhaust
    glowColor: "#F97316",         // Orange Glow
    wheelStyle: "spokes",
    headlightColor: "#fef08a",
    dustColor: "#F97316"
  },
  {
    name: "Apex Cyber-Racer",
    brandText: "X",
    primaryColor: "#22C55E",      // Neon Green
    secondaryColor: "#10B981",    // Emerald Accent
    strokeColor: "#15803D",       // Dark Green
    engineColor: "#0f172a",       // Stealth black engine
    fenderColor: "#1e293b",       // Dark fender
    seatColor: "#0f172a",         // Cyber black seat
    exhaustColor: "#334155",      // Dark exhaust
    glowColor: "#22C55E",         // Lime glow
    wheelStyle: "neon-ring",
    headlightColor: "#86EFAC",
    dustColor: "#22C55E"
  },
  {
    name: "Imperial Bobber",
    brandText: "M",
    primaryColor: "#DC2626",      // Royal Crimson
    secondaryColor: "#fca5a5",    // Light red
    strokeColor: "#991B1B",       // Dark Crimson
    engineColor: "#27272a",       // Graphite engine
    fenderColor: "#3f3f46",       // Dark gray fender
    seatColor: "#78350F",         // Vintage Brown Leather seat
    exhaustColor: "#e4e4e7",      // Polish Chrome
    glowColor: "#DC2626",         // Crimson glow
    wheelStyle: "stars",
    headlightColor: "#fecdd3",
    dustColor: "#DC2626"
  },
  {
    name: "Electric Scrambler",
    brandText: "B",
    primaryColor: "#3B82F6",      // Electric Blue
    secondaryColor: "#60A5FA",    // Light blue
    strokeColor: "#1D4ED8",       // Deep blue
    engineColor: "#18181b",       // Dark carbon engine
    fenderColor: "#3f3f46",       // Dark fender
    seatColor: "#27272a",         // Grey seat
    exhaustColor: "#94a3b8",      // Silver/grey exhaust
    glowColor: "#3B82F6",         // Blue glow
    wheelStyle: "retro-disc",
    headlightColor: "#BFDBFE",
    dustColor: "#3B82F6"
  },
  {
    name: "Stealth Gold Edition",
    brandText: "S",
    primaryColor: "#D97706",      // Warm Gold
    secondaryColor: "#FEF08A",    // Bright Yellow
    strokeColor: "#B45309",       // Dark Bronze
    engineColor: "#111827",       // Pitch black engine
    fenderColor: "#1e293b",       // Dark fender
    seatColor: "#111827",         // Dark black leather seat
    exhaustColor: "#cbd5e1",      // Chrome exhaust
    glowColor: "#D97706",         // Gold glow
    wheelStyle: "solid",
    headlightColor: "#FEF08A",
    dustColor: "#D97706"
  },
  {
    name: "Pink Fury Streetfighter",
    brandText: "V",
    primaryColor: "#EC4899",      // Hot Pink
    secondaryColor: "#F472B6",    // Pink accent
    strokeColor: "#BE185D",       // Dark Pink
    engineColor: "#1e1e1e",       // Charcoal engine
    fenderColor: "#2e2e2e",       // Charcoal fender
    seatColor: "#111111",         // Black seat
    exhaustColor: "#e2e8f0",      // Light silver exhaust
    glowColor: "#EC4899",         // Pink glow
    wheelStyle: "spokes",
    headlightColor: "#FBCFE8",
    dustColor: "#EC4899"
  }
];

export const AnimatedMotorcycle: React.FC = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  // Dynamic state for random motorcycle selection on mount/refresh
  const [selectedBike, setSelectedBike] = useState<number>(0);

  // Day/Night environment state, default determined by local system hour
  const [isNight, setIsNight] = useState<boolean>(() => {
    const hour = new Date().getHours();
    return hour < 6 || hour > 18;
  });

  // Enable/disable automatic cycling transitions
  const [autoCycle, setAutoCycle] = useState<boolean>(true);

  // Immersive Garage Service Procedures state
  const [selectedProcedure, setSelectedProcedure] = useState<"engine" | "suspension" | "brakes" | "chain" | "ecu" | "wash" | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [metricFluctuation, setMetricFluctuation] = useState<number>(0);

  // Interaction & Audio HUD states
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [volumeLevel, setVolumeLevel] = useState<number>(30); // 0 to 100
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  
  // Compliance tracking and hands-on calibration progress
  const [handsOnShine, setHandsOnShine] = useState<number>(65); 
  const [calibrationPrecision, setCalibrationPrecision] = useState<number>(70); 
  const [toolActiveLoading, setToolActiveLoading] = useState<boolean>(false);
  const [toolLoadingProgress, setToolLoadingProgress] = useState<number>(0);
  const [activeEffector, setActiveEffector] = useState<string | null>(null);
  
  // Custom manual action click completions and terminal overrides
  const [manualStepCompletions, setManualStepCompletions] = useState<Record<string, boolean>>({});
  const [manualLogs, setManualLogs] = useState<string[]>([]);

  const triggerBeep = (freq: number = 800, duration: number = 100) => {
    if (soundMuted || volumeLevel <= 0) return;
    const gainVal = (volumeLevel / 100) * 0.12; // Safety capped gain limit
    playBeep(freq, duration, gainVal);
  };

  const triggerHandsOnTool = () => {
    if (!selectedProcedure) return;
    const toolKey = `${selectedProcedure}_${activeStep}`;
    const tool = stepTools[toolKey];
    if (!tool) return;

    triggerBeep(tool.soundFreq, 150);
    setToolActiveLoading(true);
    setToolLoadingProgress(0);
    setActiveEffector(selectedProcedure);

    let prog = 0;
    const progInterval = setInterval(() => {
      prog += 20;
      if (prog <= 100) {
        setToolLoadingProgress(prog);
        triggerBeep(tool.soundFreq + prog * 4, 40);
      } else {
        clearInterval(progInterval);
        setToolActiveLoading(false);
        
        setManualStepCompletions((prev) => ({ ...prev, [toolKey]: true }));
        setCalibrationPrecision((prev) => Math.min(100, prev + 8));
        if (selectedProcedure === "wash") {
          setHandsOnShine((prev) => Math.min(100, prev + 10));
        }

        triggerBeep(1200, 180);
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setManualLogs((prev) => [
          `[${timestamp}] HANDS_ON: [${tool.name.toUpperCase()}] calibrating complete. Tolerance bounds delta aligned.`,
          ...prev.slice(0, 15)
        ]);

        setTimeout(() => {
          setActiveEffector(null);
        }, 1200);
      }
    }, 120);
  };

  // Fluctuating real-time diagnostics sensors
  useEffect(() => {
    const timer = setInterval(() => {
      setMetricFluctuation(Math.random() - 0.5);
    }, 250);
    return () => clearInterval(timer);
  }, []);

  // Step-by-step procedure simulation progress
  useEffect(() => {
    if (!selectedProcedure || !isSimulating) {
      if (!selectedProcedure) setActiveStep(0);
      return;
    }

    setActiveStep(0);
    triggerBeep(650, 100);

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 3) {
          const nextStep = prev + 1;
          triggerBeep(650 + nextStep * 120, 100);
          return nextStep;
        }
        return 3;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [selectedProcedure, isSimulating]);

  const handleNextProcedure = () => {
    triggerBeep(900, 70);
    const order: ("engine" | "suspension" | "brakes" | "chain" | "ecu" | "wash" | null)[] = [
      null, "engine", "suspension", "brakes", "chain", "ecu", "wash"
    ];
    const currentIndex = order.indexOf(selectedProcedure);
    const nextIndex = (currentIndex + 1) % order.length;
    setSelectedProcedure(order[nextIndex]);
  };

  useEffect(() => {
    // Select a random bike index on mount (every refresh changes the bike style)
    const randomIndex = Math.floor(Math.random() * bikeModels.length);
    setSelectedBike(randomIndex);
  }, []);

  // Set up intervals to handle automatic day/night toggling and bike cycling
  useEffect(() => {
    if (!autoCycle) return;

    // Cycle bike design automatically every 6 seconds
    const bikeInterval = setInterval(() => {
      setSelectedBike((prev) => (prev + 1) % bikeModels.length);
    }, 6000);

    // Toggle day/night backdrop automatically every 12 seconds
    const environmentInterval = setInterval(() => {
      setIsNight((prev) => !prev);
    }, 12000);

    return () => {
      clearInterval(bikeInterval);
      clearInterval(environmentInterval);
    };
  }, [autoCycle]);

  const handleNextBike = () => {
    setSelectedBike((prev) => (prev + 1) % bikeModels.length);
  };

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Listeners removed to keep layout unified and fully integrated

  if (reduceMotion) {
    return (
      <div className="relative w-full h-72 sm:h-96 bg-slate-900/40 rounded-3xl border border-slate-800/50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 bottom-8 h-[2.5px] bg-slate-800" />
        <p className="text-xs text-slate-500 font-mono font-bold uppercase tracking-widest">
          [Motion paused due to device accessibility preference]
        </p>
      </div>
    );
  }

  const currentBike = bikeModels[selectedBike];
  const headlightGradColor = currentBike.glowColor;
  const headlightOpacityFactor = isNight ? 1.0 : 0.25;
  const groundDashColor = isNight ? currentBike.primaryColor : "#F97316";

  // Active procedure data extraction helper
  const activeProc = garageProcedures.find(p => p.id === selectedProcedure);

  // Dynamic sensor values derivation based on active step and metric fluctuations
  let sensorName1 = "OBD_VOLTAGE";
  let sensorVal1 = `${(13.8 + metricFluctuation * 0.2).toFixed(1)} V`;
  let sensorName2 = "COOLANT_TEMP";
  let sensorVal2 = `${Math.round(82 + metricFluctuation * 2)} °C`;

  if (selectedProcedure === "engine") {
    sensorName1 = "CYLINDER_COMPRESSION";
    sensorVal1 = `${Math.round(124 + metricFluctuation * 4 + (activeStep >= 3 ? 11 : 0))} PSI`;
    sensorName2 = "VALVE_CARBON_CRUST_RATIO";
    sensorVal2 = `${Math.round(Math.max(0, 85 - activeStep * 28 + metricFluctuation * 2))}%`;
  } else if (selectedProcedure === "suspension") {
    sensorName1 = "DAMPER_VISCOSITY";
    sensorVal1 = `${(15.4 + metricFluctuation * 0.12).toFixed(2)} cSt`;
    sensorName2 = "SEAL_AIR_PRESSURE";
    sensorVal2 = `${(1.2 + metricFluctuation * 0.05 + (activeStep >= 1 ? 0.8 : 0)).toFixed(2)} Bar`;
  } else if (selectedProcedure === "brakes") {
    sensorName1 = "DOT4_MOISTURE_LEVEL";
    sensorVal1 = `${(Math.max(0.1, 4.2 - activeStep * 1.35 + metricFluctuation * 0.1)).toFixed(2)}%`;
    sensorName2 = "HYDRAULIC_FORCE_COEFF";
    sensorVal2 = `${(0.45 + activeStep * 0.16 + metricFluctuation * 0.02).toFixed(2)} μ`;
  } else if (selectedProcedure === "chain") {
    sensorName1 = "CHAIN_LINKS_SLACK";
    sensorVal1 = `${(38.0 - activeStep * 4.2 + metricFluctuation * 0.5).toFixed(1)} mm`;
    sensorName2 = "SPROCKET_ALIGNMENT_DELTA";
    sensorVal2 = `±${(Math.max(0.02, 1.25 - activeStep * 0.4 + metricFluctuation * 0.05)).toFixed(2)} mm`;
  } else if (selectedProcedure === "ecu") {
    sensorName1 = "AIR_FUEL_RATIO_TARGET";
    sensorVal1 = `${(13.2 + activeStep * 0.5 + metricFluctuation * 0.15).toFixed(1)}:1`;
    sensorName2 = "DIAGNOSTIC_OBD_ERRORS";
    sensorVal2 = activeStep >= 3 ? "0 (CLEARED)" : `${4 - activeStep} DETECTED`;
  } else if (selectedProcedure === "wash") {
    sensorName1 = "FOAM_VISUAL_DENSITY";
    sensorVal1 = `${Math.round(12 + activeStep * 26 + metricFluctuation * 3)}%`;
    sensorName2 = "CHASSIS_GLOSS_REFLECTION";
    sensorVal2 = `${Math.round(52 + activeStep * 14 + metricFluctuation * 1)} GU`;
  }

  const getTerminalLogs = () => {
    const logs = [];
    const timestampBase = "12:49:";
    
    logs.push(`[${timestampBase}01] SENSOR_ARRAY_INIT_OK: Connected to central OBD diagnostic frame.`);
    logs.push(`[${timestampBase}02] BIKE_DETECTION: Sourced premium model signature [${currentBike.brandText}].`);
    
    if (activeStep >= 0) {
      logs.push(`[${timestampBase}03] PHASE_0: Accessing target chamber. Removing chassis protection guard components.`);
      logs.push(`[${timestampBase}04] SYSTEM_LOG: Triggering real-time feedback calibration loop...`);
    }
    if (activeStep >= 1) {
      logs.push(`[${timestampBase}07] PHASE_1: Cleared debris. Chemical treatment / seals extracted safely.`);
      logs.push(`[${timestampBase}09] ANALYSIS_OK: Material wear levels measured at ±15.8% limits.`);
    }
    if (activeStep >= 2) {
      logs.push(`[${timestampBase}12] PHASE_2: Torqueing joint collars to direct factory spec parameters.`);
      logs.push(`[${timestampBase}14] RE-FLUID: Pressure chambers refilled with certified lubricants.`);
    }
    if (activeStep >= 3) {
      logs.push(`[${timestampBase}18] PHASE_3: Mechanical vacuum pressure stabilized. High RPM test initiated.`);
      logs.push(`[${timestampBase}20] STATUS_SUCCESS: Re-calibrated fully. Diagnostics green.`);
    }
    return logs;
  };
  const terminalLogs = getTerminalLogs();

  return (
    <div className="relative w-full overflow-hidden select-none transition-all duration-300 h-64 xs:h-72 sm:h-80 md:h-96 bg-slate-950/20 rounded-3xl border border-slate-900/60 shadow-2xl flex flex-col">
      {/* 1. CSS Keyframes and styling rules */}
      <style>{`
        /* Ground scrolling */
        @keyframes scroll-dashed {
          0% { background-position-x: 0px; }
          100% { background-position-x: -200px; }
        }
        .scrolling-ground {
          background-size: 40px 3px;
          animation: scroll-dashed 1.2s linear infinite;
        }

        /* Bike riding across the screen from left to right */
        @keyframes bike-ride-path {
          0% {
            left: -320px;
          }
          100% {
            left: 110%;
          }
        }

        /* Unified Responsive Sizing & Scaling */
        .skyline-silhouette-container {
          bottom: 30px !important;
          height: 80px !important;
          opacity: 0.15 !important;
        }
        .highway-line-primary {
          bottom: 24px !important;
          height: 2px !important;
        }
        .highway-line-scrolling {
          bottom: 10px !important;
          height: 4px !important;
        }
        .bike-rider-unit {
          position: absolute;
          bottom: 14px !important;
          width: 140px;
          height: 85px;
          animation: bike-ride-path 11s linear infinite;
          will-change: left;
          transform-origin: bottom center;
          transform: scale(1.1) !important;
        }

        @media (min-width: 640px) {
          .skyline-silhouette-container {
            bottom: 40px !important;
            height: 110px !important;
          }
          .highway-line-primary {
            bottom: 34px !important;
            height: 2.5px !important;
          }
          .highway-line-scrolling {
            bottom: 16px !important;
            height: 5px !important;
          }
          .bike-rider-unit {
            bottom: 20px !important;
            transform: scale(1.4) !important;
          }
        }

        @media (min-width: 768px) {
          .skyline-silhouette-container {
            bottom: 50px !important;
            height: 140px !important;
          }
          .highway-line-primary {
            bottom: 44px !important;
            height: 3px !important;
          }
          .highway-line-scrolling {
            bottom: 20px !important;
            height: 6px !important;
          }
          .bike-rider-unit {
            bottom: 26px !important;
            transform: scale(1.6) !important;
          }
        }

        @media (min-width: 1024px) {
          .skyline-silhouette-container {
            bottom: 60px !important;
            height: 170px !important;
          }
          .highway-line-primary {
            bottom: 52px !important;
            height: 3.5px !important;
          }
          .highway-line-scrolling {
            bottom: 24px !important;
            height: 7px !important;
          }
          .bike-rider-unit {
            bottom: 30px !important;
            transform: scale(1.9) !important;
          }
        }

        @media (min-width: 1280px) {
          .skyline-silhouette-container {
            bottom: 70px !important;
            height: 200px !important;
          }
          .highway-line-primary {
            bottom: 62px !important;
            height: 4px !important;
          }
          .highway-line-scrolling {
            bottom: 28px !important;
            height: 8px !important;
          }
          .bike-rider-unit {
            bottom: 36px !important;
            transform: scale(2.2) !important;
          }
        }

        /* Suspension vertical bouncing */
        @keyframes suspension-bounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          20% {
            transform: translateY(-2px) rotate(0.4deg);
          }
          40% {
            transform: translateY(1.5px) rotate(-0.4deg);
          }
          65% {
            transform: translateY(-1.2px) rotate(0.2deg);
          }
          85% {
            transform: translateY(1px) rotate(-0.2deg);
          }
        }
        .bike-chassis {
          animation: suspension-bounce 0.8s ease-in-out infinite;
        }

        /* Rotating wheel animation */
        @keyframes rotate-wheel-spokes {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .spinning-wheel {
          animation: rotate-wheel-spokes 0.15s linear infinite;
          transform-origin: center;
        }

        /* Exhaust smoke rings fading out behind the bike */
        @keyframes puff-exhaust {
          0% {
            transform: translate(0, 0) scale(0.4);
            opacity: 0.9;
          }
          40% {
            transform: translate(-18px, -12px) scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: translate(-38px, -24px) scale(1.6);
            opacity: 0;
          }
        }
        .smoke-puff {
          position: absolute;
          background: rgba(226, 232, 240, 0.4);
          backdrop-filter: blur(1px);
          border-radius: 50%;
          animation: puff-exhaust 0.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .smoke-puff-2 {
          animation-delay: 0.2s;
        }
        .smoke-puff-3 {
          animation-delay: 0.4s;
        }

        /* Tire dust blowing up behind the rear wheel */
        @keyframes dirt-kickback {
          0% {
            transform: translate(0, 0) scale(0.2);
            opacity: 0;
          }
          20% {
            opacity: 0.75;
          }
          100% {
            transform: translate(-28px, 6px) scale(1.3);
            opacity: 0;
          }
        }
        .dust-spec {
          position: absolute;
          border-radius: 50%;
          animation: dirt-kickback 0.45s ease-out infinite;
        }
        .dust-spec-2 {
          animation-delay: 0.15s;
        }
        .dust-spec-3 {
          animation-delay: 0.3s;
        }

        /* Headlight light cone subtle flicker */
        @keyframes cone-flicker {
          0%, 100% {
            opacity: 0.35;
          }
          30% {
            opacity: 0.28;
          }
          65% {
            opacity: 0.45;
          }
          90% {
            opacity: 0.32;
          }
        }
        .headlight-glow-cone {
          animation: cone-flicker 0.4s ease-in-out infinite;
        }

        /* Floating Cloud elements */
        @keyframes float-cloud {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(calc(100vw + 150px)); }
        }
        .cloud-element {
          position: absolute;
          animation: float-cloud 45s linear infinite;
          opacity: 0.6;
          pointer-events: none;
        }
        .cloud-element-1 {
          animation-duration: 35s;
          animation-delay: -5s;
        }
        .cloud-element-2 {
          animation-duration: 48s;
          animation-delay: -18s;
        }
        .cloud-element-3 {
          animation-duration: 58s;
          animation-delay: -32s;
        }

        /* Sun glow breathing animation */
        @keyframes sun-glow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(253, 224, 71, 0.6)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 28px rgba(253, 224, 71, 0.9)); }
        }
        .sun-element {
          animation: sun-glow 5s ease-in-out infinite;
        }

        /* Moon glow breathing animation */
        @keyframes moon-glow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(254, 240, 138, 0.3)); }
          50% { filter: drop-shadow(0 0 25px rgba(254, 240, 138, 0.6)); }
        }
        .moon-element {
          animation: moon-glow 6s ease-in-out infinite;
        }

        /* Twinkling star particle animation */
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .star-particle {
          animation: twinkle 1.8s ease-in-out infinite;
        }

      `}</style>

      {/* Visual Simulation Stage Container */}
      <div className="relative overflow-hidden transition-all duration-500 w-full h-full flex-1">
          {/* 2. Scenic background elements - Blending Sky Gradient */}
          <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            isNight 
              ? "bg-gradient-to-b from-[#020617] via-[#0b1329] to-[#1e293b]" 
              : "bg-gradient-to-b from-[#bae6fd] via-[#e0f2fe] to-[#ffedd5]"
          }`} />
      
      {/* 2.1. DAY TIME EXCLUSIVES: Floating Clouds & Breathing Sun */}
      {!isNight && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none animate-fadeIn">
          {/* Pulsating Glowing Sun */}
          <div className="absolute top-8 right-[20%] w-11 h-11 rounded-full bg-yellow-300 sun-element border border-yellow-200 shadow-[0_0_35px_#fef08a]" />
          
          {/* Interactive Cloud SVGs */}
          <div className="cloud-element cloud-element-1 top-4">
            <svg className="w-16 h-8 text-white/80 fill-current" viewBox="0 0 64 32">
              <path d="M16 16c0-4.4 3.6-8 8-8 1 0 2 .2 3 .5C28.5 5.3 32.1 3 36.5 3c6.4 0 11.5 5.1 11.5 11.5 0 .4 0 .8-.1 1.2 5.1.7 9.1 5.1 9.1 10.3 0 5.8-4.7 10.5-10.5 10.5H16c-5.5 0-10-4.5-10-10 0-4.8 3.4-8.8 8-9.8.1-.6.2-1.1.2-1.7" />
            </svg>
          </div>
          <div className="cloud-element cloud-element-2 top-10">
            <svg className="w-24 h-12 text-white/65 fill-current" viewBox="0 0 64 32">
              <path d="M16 16c0-4.4 3.6-8 8-8 1 0 2 .2 3 .5C28.5 5.3 32.1 3 36.5 3c6.4 0 11.5 5.1 11.5 11.5 0 .4 0 .8-.1 1.2 5.1.7 9.1 5.1 9.1 10.3 0 5.8-4.7 10.5-10.5 10.5H16c-5.5 0-10-4.5-10-10 0-4.8 3.4-8.8 8-9.8.1-.6.2-1.1.2-1.7" />
            </svg>
          </div>
          <div className="cloud-element cloud-element-3 top-6">
            <svg className="w-12 h-6 text-white/75 fill-current" viewBox="0 0 64 32">
              <path d="M16 16c0-4.4 3.6-8 8-8 1 0 2 .2 3 .5C28.5 5.3 32.1 3 36.5 3c6.4 0 11.5 5.1 11.5 11.5 0 .4 0 .8-.1 1.2 5.1.7 9.1 5.1 9.1 10.3 0 5.8-4.7 10.5-10.5 10.5H16c-5.5 0-10-4.5-10-10 0-4.8 3.4-8.8 8-9.8.1-.6.2-1.1.2-1.7" />
            </svg>
          </div>
        </div>
      )}

      {/* 2.2. NIGHT TIME EXCLUSIVES: Twinkling Stars & Crescent Moon */}
      {isNight && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none animate-fadeIn">
          {/* Stable Starfield Coordinates */}
          {[...Array(14)].map((_, i) => {
            const top = (i * 7 + 13) % 40; 
            const left = (i * 13 + 7) % 95; 
            const delay = (i * 0.25).toFixed(2);
            const size = i % 3 === 0 ? "w-1 h-1" : i % 3 === 1 ? "w-1.5 h-1.5" : "w-0.5 h-0.5";
            return (
              <div
                key={i}
                className={`absolute ${size} bg-slate-100 rounded-full star-particle`}
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  opacity: 0.8
                }}
              />
            );
          })}

          {/* Golden Crescent Moon */}
          <div className="absolute top-8 right-[18%] w-10 h-10 rounded-full moon-element flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-100/90 fill-current" viewBox="0 0 24 24">
              <path d="M12.3 22h-.1c-5.5-.2-9.9-4.8-9.7-10.3C2.7 6.4 7.2 2 12.7 2c.5 0 1 .1 1.5.2-.6.8-1 1.8-1 2.8 0 3 2.5 5.5 5.5 5.5 1 0 2-.4 2.8-1 .1.5.2 1 .2 1.5 0 5.5-4.4 10-10 10-.1 0-.3 0-.4 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Background mountains/skyline silhouettes */}
      <div className={`absolute bottom-10 left-0 right-0 h-24 sm:h-32 flex items-end justify-around pointer-events-none skyline-silhouette-container transition-all duration-1000 ${
        isNight ? "opacity-10" : "opacity-25"
      }`}>
        <div className={`w-36 h-16 sm:w-48 sm:h-24 rounded-t-full shrink-0 transition-colors duration-1000 ${isNight ? "bg-[#F8FAFC]" : "bg-emerald-600/20"}`} />
        <div className={`w-56 h-24 sm:w-72 sm:h-32 rounded-t-full shrink-0 transition-colors duration-1000 ${isNight ? "bg-[#F8FAFC]" : "bg-teal-600/15"}`} />
        <div className={`w-40 h-14 sm:w-56 sm:h-20 rounded-t-full shrink-0 transition-colors duration-1000 ${isNight ? "bg-[#F8FAFC]" : "bg-emerald-600/20"}`} />
        <div className={`w-60 h-20 sm:w-80 sm:h-28 rounded-t-full shrink-0 transition-colors duration-1000 ${isNight ? "bg-[#F8FAFC]" : "bg-teal-600/15"}`} />
      </div>

      {/* 3. The Highway lines */}
      <div className="absolute inset-x-0 bottom-8 h-[2.5px] bg-slate-800 dark:bg-slate-700 highway-line-primary transition-all" />
      <div 
        className={`absolute inset-x-0 bottom-3.5 h-1.5 scrolling-ground highway-line-scrolling transition-all ${
          selectedProcedure ? "paused" : ""
        }`} 
        style={{ 
          backgroundImage: `linear-gradient(to right, ${groundDashColor} 50%, transparent 50%)`,
          opacity: isNight ? 0.75 : 0.45
        }}
      />

      {/* 4. Active Motorcycle Rider Group */}
      <div className={`bike-rider-unit ${selectedProcedure ? "docked" : ""}`}>
        
        {/* Exhaust Smoke Generators */}
        <div className="absolute left-[8px] bottom-[16px] w-2 h-2">
          <div className="smoke-puff smoke-puff-1 w-3.5 h-3.5" />
          <div className="smoke-puff smoke-puff-2 w-2.5 h-2.5" />
          <div className="smoke-puff smoke-puff-3 w-3 h-3" />
        </div>

        {/* Tire Dust Generators */}
        <div className="absolute left-[18px] bottom-[2px] w-3 h-3">
          <div 
            className="dust-spec dust-spec-1 w-2.5 h-1.5 transition-colors duration-300" 
            style={{ backgroundColor: currentBike.dustColor }} 
          />
          <div 
            className="dust-spec dust-spec-2 w-2 h-1 transition-colors duration-300" 
            style={{ backgroundColor: currentBike.dustColor }} 
          />
          <div 
            className="dust-spec dust-spec-3 w-1.5 h-1.5 transition-colors duration-300" 
            style={{ backgroundColor: currentBike.dustColor }} 
          />
        </div>

        {/* Dynamic Headlight cone */}
        <svg className="absolute left-[105px] top-[14px] w-[150px] h-[70px] pointer-events-none" viewBox="0 0 150 70">
          <polygon 
            points="0,22 150,0 150,65 0,28" 
            fill="url(#dynamic-headlight-grad)" 
            className="headlight-glow-cone"
          />
          <defs>
            <linearGradient id="dynamic-headlight-grad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor={headlightGradColor} stopOpacity={0.85 * headlightOpacityFactor} />
              <stop offset="35%" stopColor={headlightGradColor} stopOpacity={0.4 * headlightOpacityFactor} />
              <stop offset="100%" stopColor={headlightGradColor} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* SVG Detailed Motorcycle */}
        <div className={`bike-chassis w-full h-full relative ${activeEffector === "suspension" ? "shudder-effect" : ""}`}>
          
          {/* Main frame SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 140 85">
            {/* Handlebars */}
            <path d="M102,18 L114,24" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M112,24 L120,24" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <circle cx="102" cy="18" r="1.5" fill={currentBike.primaryColor} />
            
            {/* Front Forks & Shock absorber */}
            <line x1="102" y1="20" x2="116" y2="60" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="100" y1="24" x2="114" y2="60" stroke={currentBike.secondaryColor} strokeWidth="1.5" />

            {/* Rear Shock frame */}
            <line x1="32" y1="58" x2="55" y2="44" stroke={currentBike.strokeColor} strokeWidth="2" />
            
            {/* Engine block detail */}
            <rect x="52" y="44" width="28" height="20" rx="3" fill={currentBike.engineColor} />
            <line x1="55" y1="48" x2="77" y2="48" stroke="#64748b" strokeWidth="1.5" />
            <line x1="55" y1="52" x2="77" y2="52" stroke="#64748b" strokeWidth="1.5" />
            <line x1="55" y1="56" x2="77" y2="56" stroke="#64748b" strokeWidth="1.5" />

            {/* Spark plug node */}
            <circle cx="68" cy="41" r="2" fill="#e2e8f0" />
            <line x1="68" y1="41" x2="62" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
            
            {/* Exhaust pipe */}
            <path d="M60,60 L24,60 C20,60 16,56 12,50" fill="none" stroke={currentBike.exhaustColor} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="50" r="1.5" fill="#0f172a" />

            {/* Petrol tank - Dynamic color according to model */}
            <path d="M72,26 Q92,24 100,34 L100,44 Q85,46 72,44 Z" fill={currentBike.primaryColor} stroke={currentBike.strokeColor} strokeWidth="1" />
            {/* Custom Brand label */}
            <text x="83" y="38" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="monospace">{currentBike.brandText}</text>

            {/* Rider's seat */}
            <path d="M42,34 C44,34 68,34 72,44 C65,42 46,42 42,34 Z" fill={currentBike.seatColor} />
            
            {/* Rear Mudguard fender */}
            <path d="M16,42 Q28,34 38,44" fill="none" stroke={currentBike.fenderColor} strokeWidth="3" strokeLinecap="round" />

            {/* Headlight lamp and glow point */}
            <rect x="100" y="24" width="10" height="8" rx="2" fill="#334155" />
            <ellipse cx="109" cy="28" rx="2" ry="4" fill={currentBike.headlightColor} />
            <circle 
              cx="109" 
              cy="28" 
              r="3" 
              fill={currentBike.glowColor} 
              className="animate-ping" 
              style={{ animationDuration: isNight ? '1s' : '2s', opacity: isNight ? 1 : 0.4 }} 
            />

            {/* Reflected chrome chassis connectors */}
            <path d="M32,58 L52,44" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M78,58 L116,60" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Immersive Garage Procedures SVG Overlay Annotations */}
            {selectedProcedure === "engine" && (
              <>
                {/* Engine area glowing pulse */}
                <circle cx="66" cy="54" r="16" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" style={{ animationDuration: "1.2s" }} />
                <circle cx="66" cy="54" r="10" fill="none" stroke="#EF4444" strokeWidth="2" className="animate-pulse" />
                {/* Spark plug high ignition spark arc */}
                {activeStep >= 1 && (
                  <circle cx="68" cy="41" r="3.5" fill="#EF4444" className="animate-bounce" />
                )}
                {activeStep >= 2 && (
                  <line x1="68" y1="41" x2="65" y2="47" stroke="#FBBF24" strokeWidth="2" className="animate-pulse" />
                )}
              </>
            )}

            {selectedProcedure === "suspension" && (
              <>
                {/* Gleaming USD forks fluid levels and seals */}
                <line x1="102" y1="20" x2="116" y2="60" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" className="animate-pulse" strokeDasharray="4, 4" style={{ animationDuration: "0.8s" }} />
                {activeStep >= 1 && (
                  <circle cx="109" cy="40" r="4.5" fill="none" stroke="#60A5FA" strokeWidth="1.5" className="animate-ping" />
                )}
                {activeStep >= 2 && (
                  <circle cx="112" cy="50" r="2.5" fill="#3B82F6" className="animate-bounce" />
                )}
              </>
            )}

            {selectedProcedure === "brakes" && (
              <>
                {/* Pulsing caliper targets and levers */}
                <circle cx="116" cy="60" r="10" fill="none" stroke="#EC4899" strokeWidth="2" className="animate-pulse" />
                <circle cx="116" cy="60" r="15" fill="none" stroke="#EC4899" strokeWidth="1" strokeDasharray="3, 3" className="animate-ping" style={{ animationDuration: "1.5s" }} />
                {activeStep >= 1 && (
                  <path d="M102,18 L94,14" stroke="#EC4899" strokeWidth="2" className="animate-bounce" />
                )}
              </>
            )}

            {selectedProcedure === "chain" && (
              <>
                {/* Horizontal laser guides and rear sprocket aligners */}
                <line x1="32" y1="58" x2="66" y2="58" stroke="#10B981" strokeWidth="2.5" className="animate-pulse" />
                <line x1="28" y1="58" x2="120" y2="58" stroke="#10B981" strokeWidth="0.5" strokeDasharray="1, 2" opacity="0.6" />
                <circle cx="32" cy="58" r="8" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="2, 2" />
                {activeStep >= 2 && (
                  <circle cx="32" cy="58" r="14" fill="none" stroke="#10B981" strokeWidth="1.5" className="animate-ping" />
                )}
              </>
            )}

            {selectedProcedure === "ecu" && (
              <>
                {/* Battery computer core area flashing glow */}
                <rect x="44" y="38" width="10" height="8" fill="#F59E0B" className="animate-pulse" opacity="0.8" />
                {/* High tech cyber diagnostic feedback waves connecting frame nodes */}
                <path d="M48,42 Q60,30 102,18" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3, 3" className="animate-pulse" />
                <path d="M48,42 L66,54" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="2, 2" className="animate-pulse" />
                {activeStep >= 1 && (
                  <circle cx="75" cy="30" r="3" fill="#F59E0B" className="animate-ping" />
                )}
              </>
            )}

            {selectedProcedure === "wash" && (
              <>
                {/* Falling thick white foam snow particles scattered over main chassis */}
                <circle cx="50" cy="24" r="3.5" fill="#FFFFFF" opacity="0.9" className="animate-bounce" />
                <circle cx="80" cy="22" r="5" fill="#FFFFFF" opacity="0.8" className="animate-bounce" style={{ animationDelay: "0.2s" }} />
                <circle cx="104" cy="26" r="4" fill="#FFFFFF" opacity="0.95" className="animate-bounce" style={{ animationDelay: "0.4s" }} />
                <circle cx="32" cy="28" r="4.5" fill="#FFFFFF" opacity="0.75" className="animate-bounce" style={{ animationDelay: "0.1s" }} />
                {activeStep >= 2 && (
                  <>
                    <circle cx="68" cy="48" r="3" fill="#67E8F9" className="animate-ping" />
                    <circle cx="92" cy="40" r="2.5" fill="#22D3EE" className="animate-ping" />
                  </>
                )}
              </>
            )}
          </svg>

          {/* SPINNING REAR WHEEL */}
          <div className="absolute left-[16px] bottom-[10px] w-8 h-8">
            <svg className="spinning-wheel w-full h-full" viewBox="0 0 32 32">
              {currentBike.wheelStyle === "spokes" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#0f172a" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="11" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="16" y1="2" x2="16" y2="30" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="2" y1="16" x2="30" y2="16" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="6" y1="6" x2="26" y2="26" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="6" y1="26" x2="26" y2="6" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="16" cy="16" r="4.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                </>
              )}
              {currentBike.wheelStyle === "stars" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="11" fill="none" stroke={currentBike.primaryColor} strokeWidth="1" />
                  <path d="M16,16 L16,4 M16,16 L27,11 M16,16 L23,25 M16,16 L9,25 M16,16 L5,11" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="16" cy="16" r="5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                </>
              )}
              {currentBike.wheelStyle === "solid" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="11.5" fill="#334155" stroke="#475569" strokeWidth="1" />
                  <circle cx="16" cy="16" r="7" fill="#1e293b" />
                  <circle cx="16" cy="7" r="1" fill="#cbd5e1" />
                  <circle cx="16" cy="25" r="1" fill="#cbd5e1" />
                  <circle cx="7" cy="16" r="1" fill="#cbd5e1" />
                  <circle cx="25" cy="16" r="1" fill="#cbd5e1" />
                  <circle cx="16" cy="16" r="3.5" fill="#64748b" />
                </>
              )}
              {currentBike.wheelStyle === "neon-ring" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#020617" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="12" fill="none" stroke={currentBike.primaryColor} strokeWidth="2" className="animate-pulse" />
                  <circle cx="16" cy="16" r="10" fill="none" stroke="#020617" strokeWidth="1.5" />
                  <path d="M16,16 L16,5 M16,16 L25,21 M16,16 L7,21" stroke={currentBike.primaryColor} strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="3.5" fill={currentBike.primaryColor} />
                </>
              )}
              {currentBike.wheelStyle === "retro-disc" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#0f172a" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="12" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="6" fill="#475569" />
                  <circle cx="16" cy="16" r="2" fill="#1e293b" />
                </>
              )}
            </svg>
          </div>

          {/* SPINNING FRONT WHEEL */}
          <div className="absolute right-[8px] bottom-[10px] w-8 h-8">
            <svg className="spinning-wheel w-full h-full" viewBox="0 0 32 32">
              {currentBike.wheelStyle === "spokes" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#0f172a" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="11" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="16" y1="2" x2="16" y2="30" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="2" y1="16" x2="30" y2="16" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="6" y1="6" x2="26" y2="26" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="6" y1="26" x2="26" y2="6" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="16" cy="16" r="4" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                </>
              )}
              {currentBike.wheelStyle === "stars" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="11" fill="none" stroke={currentBike.primaryColor} strokeWidth="1" />
                  <path d="M16,16 L16,4 M16,16 L27,11 M16,16 L23,25 M16,16 L9,25 M16,16 L5,11" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="16" cy="16" r="5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                </>
              )}
              {currentBike.wheelStyle === "solid" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#1e293b" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="11.5" fill="#334155" stroke="#475569" strokeWidth="1" />
                  <circle cx="16" cy="16" r="7" fill="#1e293b" />
                  <circle cx="16" cy="7" r="1" fill="#cbd5e1" />
                  <circle cx="16" cy="25" r="1" fill="#cbd5e1" />
                  <circle cx="7" cy="16" r="1" fill="#cbd5e1" />
                  <circle cx="25" cy="16" r="1" fill="#cbd5e1" />
                  <circle cx="16" cy="16" r="3.5" fill="#64748b" />
                </>
              )}
              {currentBike.wheelStyle === "neon-ring" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#020617" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="12" fill="none" stroke={currentBike.primaryColor} strokeWidth="2" className="animate-pulse" />
                  <circle cx="16" cy="16" r="10" fill="none" stroke="#020617" strokeWidth="1.5" />
                  <path d="M16,16 L16,5 M16,16 L25,21 M16,16 L7,21" stroke={currentBike.primaryColor} strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="3.5" fill={currentBike.primaryColor} />
                </>
              )}
              {currentBike.wheelStyle === "retro-disc" && (
                <>
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#0f172a" strokeWidth="3.5" />
                  <circle cx="16" cy="16" r="12" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="6" fill="#475569" />
                  <circle cx="16" cy="16" r="2" fill="#1e293b" />
                </>
              )}
            </svg>
          </div>

        {/* --- DYNAMIC HANDS-ON EFFECTOR OVERLAYS --- */}
        {activeEffector === "wash" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
            {[...Array(16)].map((_, i) => {
              const left = (i * 7 + 10) % 100;
              const size = (i * 3 % 8) + 4;
              const delay = (i * 0.1).toFixed(1);
              return (
                <div
                  key={i}
                  className="foam-drip-bubble"
                  style={{
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${delay}s`,
                    top: `${(i * 12 % 30) + 10}px`
                  }}
                />
              );
            })}
          </div>
        )}

        {activeEffector === "engine" && (
          <div className="absolute left-[66px] top-[54px] w-2 h-2 pointer-events-none z-40">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const dist = 15 + Math.random() * 20;
              const tx = `${Math.cos(angle) * dist}px`;
              const ty = `${Math.sin(angle) * dist}px`;
              return (
                <div
                  key={i}
                  className="engine-spark-particle"
                  style={{
                    "--tx": tx,
                    "--ty": ty,
                    width: "3px",
                    height: "3px",
                    animationDelay: `${(i * 0.02).toFixed(2)}s`
                  } as any}
                />
              );
            })}
          </div>
        )}

        {activeEffector === "brakes" && (
          <div className="absolute left-[118px] top-[60px] w-6 h-6 -ml-3 -mt-3 pointer-events-none z-40 flex items-center justify-center">
            <div className="brake-ring-wave w-full h-full" />
          </div>
        )}

        {/* --- INTERACTIVE DIGITAL TWIN HUD HOTSPOTS --- */}
        {showHotspots && (
          <div className="absolute inset-0 z-30 pointer-events-auto">
            {[
              { id: "engine", label: "Engine Valves", x: 66, y: 54, color: "red" },
              { id: "suspension", label: "USD Forks", x: 108, y: 36, color: "blue" },
              { id: "brakes", label: "Front Hydraulics", x: 118, y: 60, color: "pink" },
              { id: "chain", label: "Drivetrain Cog", x: 28, y: 56, color: "emerald" },
              { id: "ecu", label: "EFI ECU Board", x: 48, y: 32, color: "amber" },
              { id: "wash", label: "Aesthetic Shell", x: 86, y: 24, color: "cyan" }
            ].map((spot) => {
              const isActive = selectedProcedure === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerBeep(900, 100);
                    setSelectedProcedure(spot.id as any);
                    setActiveStep(0);
                  }}
                  style={{ left: `${spot.x}px`, top: `${spot.y}px` }}
                  className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none animate-pulse"
                  title={`Analyze ${spot.label}`}
                >
                  {/* Outer ping indicator */}
                  <span className={`absolute inline-flex h-4 w-4 rounded-full opacity-75 animate-ping -left-2 -top-2 ${
                    isActive ? "bg-orange-400" : "bg-slate-300"
                  }`} />
                  {/* Central target core */}
                  <span className={`relative block w-2.5 h-2.5 rounded-full border border-white shadow-md transition-all ${
                    isActive ? "bg-[#F97316] scale-125" : "bg-slate-400 group-hover:bg-[#F97316]"
                  }`} />
                  
                  {/* Floating tooltip label */}
                  <span className="absolute left-1/2 top-4 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all origin-top whitespace-nowrap text-[6px] font-mono font-black tracking-widest uppercase bg-slate-950/95 border border-slate-800 text-white px-1.5 py-0.5 rounded shadow-lg pointer-events-none z-50">
                    {spot.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        </div>
      </div>

      {/* Floating Highway Speed line streaks above */}
      <div className={`absolute top-6 left-[10%] w-12 h-0.5 opacity-20 animate-[pulse_1.5s_infinite] transition-colors duration-1000 ${isNight ? "bg-slate-700" : "bg-white"}`} />
      <div className={`absolute top-12 left-[55%] w-20 h-0.5 opacity-20 animate-[pulse_2s_infinite] transition-colors duration-1000 ${isNight ? "bg-slate-700" : "bg-white"}`} />
      <div className={`absolute top-20 left-[35%] w-14 h-0.5 opacity-20 animate-[pulse_1.8s_infinite] transition-colors duration-1000 ${isNight ? "bg-slate-700" : "bg-white"}`} />
      <div className={`absolute top-28 left-[75%] w-16 h-0.5 opacity-20 animate-[pulse_2.2s_infinite] transition-colors duration-1000 ${isNight ? "bg-slate-700" : "bg-white"}`} />
      <div className={`absolute top-36 left-[25%] w-24 h-0.5 opacity-15 animate-[pulse_1.3s_infinite] transition-colors duration-1000 ${isNight ? "bg-slate-700" : "bg-white"}`} />

      {/* Centered Brand Overlay Signboard */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none transition-all duration-500 hidden xs:block top-5 scale-100 animate-pulse">
        <h2 className="text-sm sm:text-base md:text-xl font-display font-black text-white tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          Rana <span className="text-[#F97316]">Bike Care</span>
        </h2>
        <div className="flex items-center justify-center gap-1.5 mt-1 opacity-90">
          <span className="w-1.5 h-1.5 rounded-full bg-[#58cc02] animate-pulse" />
          <p className="text-[7px] sm:text-[8px] font-mono tracking-widest text-slate-200 uppercase leading-none">
            Pune's Premium Garage Sandbox
          </p>
        </div>
      </div>

      {/* Interactive Garage Control Dashboard on the top left */}
      <div className="absolute top-5 left-5 z-20 flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-950/85 text-white pl-4 pr-1.5 py-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-sm transition-all duration-300 shadow-2xl max-w-[85%] md:max-w-none">
        {/* Active model label (hidden on small viewports) */}
        <div className="flex flex-col text-left pr-3 border-r border-slate-800/80 hidden sm:flex">
          <span className="text-[7px] font-mono font-black text-slate-400 uppercase tracking-widest leading-none">BIKE STYLE</span>
          <span className="text-xs font-black text-[#F97316] leading-tight mt-0.5 whitespace-nowrap">
            {currentBike.name}
          </span>
        </div>

        {/* Automatic Cycle Mode switch */}
        <button
          onClick={() => setAutoCycle((prev) => !prev)}
          className={`border px-2.5 py-1.5 rounded-xl text-[9px] font-mono tracking-widest uppercase font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
            autoCycle 
              ? "bg-emerald-950/40 border-emerald-800/70 text-[#58cc02] shadow-[0_0_10px_rgba(88,204,2,0.15)]" 
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title={autoCycle ? "Pause automatic cycling transitions" : "Enable automatic cycling transitions"}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${autoCycle ? "bg-[#58cc02] animate-pulse" : "bg-slate-500"}`} />
          <span>{autoCycle ? "Auto: On" : "Auto: Off"}</span>
        </button>

        {/* Shuffle/Cycle Bike trigger */}
        <button
          onClick={handleNextBike}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800/60 text-[#F97316] px-2.5 py-1.5 rounded-xl text-[9px] font-mono tracking-widest uppercase font-black transition-all flex items-center space-x-1.5 cursor-pointer group"
          title="Switch to next premium motorcycle model"
        >
          <span className="group-hover:rotate-12 transition-transform">🏍️</span>
          <span className="hidden xs:inline">Next Bike</span>
        </button>

        {/* Cycle Procedure trigger */}
        <button
          onClick={handleNextProcedure}
          className={`border px-2.5 py-1.5 rounded-xl text-[9px] font-mono tracking-widest uppercase font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
            selectedProcedure 
              ? "bg-amber-950/40 border-amber-800/70 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]" 
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
          title="Toggle and cycle live service procedure overlays"
        >
          <span>🛠️</span>
          <span>{selectedProcedure ? `Proc: ${selectedProcedure.toUpperCase()}` : "Procedure HUD"}</span>
        </button>

        {/* Day / Night Environment Toggle Switch */}
        <div className="flex items-center bg-slate-900 border border-slate-800/60 p-0.5 rounded-xl">
          <button
            onClick={() => setIsNight(false)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-widest uppercase font-black transition-all cursor-pointer ${
              !isNight
                ? "bg-[#58cc02] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-300"
            }`}
            title="Switch to Daylight scenery"
          >
            <span>☀️</span>
            <span className="hidden md:inline">Day</span>
          </button>
          <button
            onClick={() => setIsNight(true)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-widest uppercase font-black transition-all cursor-pointer ${
              isNight
                ? "bg-[#1cb0f6] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-300"
            }`}
            title="Switch to Night sky simulation"
          >
            <span>🌙</span>
            <span className="hidden md:inline">Night</span>
          </button>
        </div>
      </div>

      {/* Mini Diagnostic Floating HUD (Visible in all sizes, fully integrated) */}
      {selectedProcedure && (
        <div className="absolute left-5 right-5 z-20 flex items-center justify-between bg-slate-950/90 text-slate-100 border border-slate-800/80 p-3 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-300 bottom-5">
          <div className="flex items-center space-x-3 truncate">
            <span className="text-base shrink-0 animate-bounce">
              {activeProc?.icon}
            </span>
            <div className="flex flex-col text-left truncate">
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="text-[7px] font-mono font-black tracking-widest text-[#F97316] uppercase">ACTIVE HUD DIAGNOSTIC</span>
                <span className={`text-[6px] font-mono px-1 py-0.5 rounded font-black tracking-wider uppercase bg-slate-900 leading-none ${
                  activeStep >= 3 ? "text-[#58cc02]" : "text-amber-500 animate-pulse"
                }`}>
                  {activeStep >= 3 ? "CALIBRATED" : `STEP ${activeStep + 1}/4`}
                </span>
              </div>
              <span className="text-[10px] font-black text-white mt-0.5 uppercase truncate">
                {activeProc?.title}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Compact Hands-On Calibration Trigger */}
            <button
              onClick={() => {
                triggerHandsOnTool();
              }}
              disabled={toolActiveLoading}
              className={`text-[9px] font-mono font-black tracking-wider uppercase px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition cursor-pointer ${
                toolActiveLoading
                  ? "bg-amber-950/40 border-amber-800/40 text-amber-500 cursor-not-allowed"
                  : "bg-amber-950/20 border-amber-800/40 text-amber-400 hover:bg-amber-900/40 shadow-[0_0_8px_rgba(245,158,11,0.1)]"
              }`}
              title="Calibrate this step manually"
            >
              <span>⚙️</span>
              <span>{toolActiveLoading ? "Calibrating" : "Calibrate"}</span>
            </button>

            <span className="text-[9px] font-mono font-bold text-[#58cc02] bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 leading-none">
              {sensorVal1}
            </span>
            <button
              onClick={() => {
                triggerBeep(450, 75);
                setSelectedProcedure(null);
              }}
              className="text-slate-500 hover:text-white transition p-1 cursor-pointer leading-none font-bold"
              title="Clear active procedure"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  </div>
);
};
