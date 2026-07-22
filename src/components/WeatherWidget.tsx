import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, 
  CloudRain, 
  Cloud, 
  Flame, 
  Thermometer, 
  Wind, 
  Droplets, 
  MapPin, 
  Check, 
  AlertTriangle, 
  Bike, 
  ChevronRight,
  Info
} from "lucide-react";

interface WeatherState {
  condition: "sunny" | "rainy" | "cloudy" | "hot";
  temp: number; // in Celsius
  humidity: number; // percentage
  windSpeed: number; // km/h
  rainProb: number; // percentage
  status: string;
  recommendation: string;
  subAdvice: string;
  colorClass: string;
  icon: React.ReactNode;
}

const CITY_WEATHER: Record<string, Record<string, WeatherState>> = {
  Pune: {
    sunny: {
      condition: "sunny",
      temp: 28,
      humidity: 45,
      windSpeed: 12,
      rainProb: 5,
      status: "Excellent Riding & Tuning Weather",
      recommendation: "Perfect day for deep washing, fluid replacement, and engine tuning!",
      subAdvice: "No rain in sight. Roads are dry with 100% brake traction efficiency.",
      colorClass: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-500",
      icon: <Sun className="h-10 w-10 text-amber-500 animate-spin-slow" />
    },
    rainy: {
      condition: "rainy",
      temp: 22,
      humidity: 90,
      windSpeed: 24,
      rainProb: 85,
      status: "Heavy Monsoon Wet Conditions",
      recommendation: "Wet roads! Ideal for brake pad replacement, chain lubing, or booking our home pickup service.",
      subAdvice: "Riding might be slippery. Get chain tension calibrated to prevent slippage.",
      colorClass: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-400",
      icon: <CloudRain className="h-10 w-10 text-blue-400 animate-bounce" />
    },
    cloudy: {
      condition: "cloudy",
      temp: 24,
      humidity: 65,
      windSpeed: 15,
      rainProb: 30,
      status: "Cool & Pleasant Overcast",
      recommendation: "Great comfortable weather. No wait times on general maintenance visits!",
      subAdvice: "Breeze is mild. Ride in for instant throttle & cable lubrication checks.",
      colorClass: "from-slate-500/10 to-zinc-500/10 border-slate-400/30 text-slate-400",
      icon: <Cloud className="h-10 w-10 text-slate-400 animate-pulse" />
    },
    hot: {
      condition: "hot",
      temp: 37,
      humidity: 30,
      windSpeed: 18,
      rainProb: 0,
      status: "Extreme Heat Alert",
      recommendation: "Crucial day to check engine coolant levels, tire pressure, and engine oil viscosity.",
      subAdvice: "Schedule a service slot for early morning or evening to beat the afternoon heat.",
      colorClass: "from-red-500/10 to-orange-500/10 border-red-500/30 text-red-500",
      icon: <Flame className="h-10 w-10 text-red-500 animate-pulse" />
    }
  },
  Mumbai: {
    sunny: {
      condition: "sunny",
      temp: 32,
      humidity: 70,
      windSpeed: 14,
      rainProb: 10,
      status: "Warm & Humid Coastal Ride Day",
      recommendation: "Get air filter and battery terminals checked today to avoid coastal corroding.",
      subAdvice: "High relative humidity can degrade spark plugs. Make sure to schedule an inspection.",
      colorClass: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-500",
      icon: <Sun className="h-10 w-10 text-amber-500" />
    },
    rainy: {
      condition: "rainy",
      temp: 25,
      humidity: 95,
      windSpeed: 30,
      rainProb: 95,
      status: "High Tide Coastal Rainstorms",
      recommendation: "Waterlogged roads alert! Request our hydraulic lift home-pickup to protect your exhaust.",
      subAdvice: "Avoid riding if water depth is high. Get oil filter flushed if stalled.",
      colorClass: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-400",
      icon: <CloudRain className="h-10 w-10 text-blue-400 animate-bounce" />
    },
    cloudy: {
      condition: "cloudy",
      temp: 27,
      humidity: 80,
      windSpeed: 18,
      rainProb: 40,
      status: "Breezy Marine Overcast",
      recommendation: "Ideal time for carburetor cleaning and clutch cable adjustments.",
      subAdvice: "Mild humidity, perfect to apply a defensive anti-rust Teflon coating.",
      colorClass: "from-slate-500/10 to-zinc-500/10 border-slate-400/30 text-slate-400",
      icon: <Cloud className="h-10 w-10 text-slate-400" />
    },
    hot: {
      condition: "hot",
      temp: 36,
      humidity: 78,
      windSpeed: 15,
      rainProb: 0,
      status: "Oppressive Sweltering Humidity",
      recommendation: "Ensure engine oil isn't thin. Let's inspect air cooling fins/radiator blockages.",
      subAdvice: "Keep tire air pressure slightly below limit to allow expansion under hot tar.",
      colorClass: "from-red-500/10 to-orange-500/10 border-red-500/30 text-red-500",
      icon: <Flame className="h-10 w-10 text-red-500 animate-pulse" />
    }
  }
};

export const WeatherWidget: React.FC<{ isDarkMode?: boolean; onBookService?: () => void }> = ({ 
  isDarkMode = false,
  onBookService 
}) => {
  const [selectedCity, setSelectedCity] = useState<"Pune" | "Mumbai">("Pune");
  const [currentCondition, setCurrentCondition] = useState<"sunny" | "rainy" | "cloudy" | "hot">("sunny");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  const weather = CITY_WEATHER[selectedCity][currentCondition];

  // Convert Temp
  const displayTemp = tempUnit === "C" ? weather.temp : Math.round((weather.temp * 9/5) + 32);

  // Safety Score / Ride Recommendation percentage
  const getSafetyScore = () => {
    switch (currentCondition) {
      case "sunny": return { score: 98, level: "Excellent", color: "text-[#58cc02]", bg: "bg-[#58cc02]/10" };
      case "cloudy": return { score: 90, level: "Good", color: "text-[#1cb0f6]", bg: "bg-[#1cb0f6]/10" };
      case "hot": return { score: 75, level: "Moderate", color: "text-amber-500", bg: "bg-amber-500/10" };
      case "rainy": return { score: 45, level: "Caution Active", color: "text-red-500", bg: "bg-red-500/10" };
    }
  };

  const safety = getSafetyScore();

  return (
    <div className={`w-full max-w-4xl mx-auto p-5 sm:p-6 rounded-[24px] border-2 transition-all duration-300 ${
      isDarkMode 
        ? "bg-slate-950/80 border-slate-900/80 text-white shadow-2xl" 
        : "bg-white border-slate-100 text-slate-800 shadow-md"
    }`}>
      {/* Top Bar with Title & City Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-4 border-dashed border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-brand-50 rounded-xl dark:bg-slate-900 border border-brand-100 dark:border-slate-800">
            <Bike className="h-5 w-5 text-eager-green" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Ride & Service Assistant
            </h3>
            <h4 className="text-base sm:text-lg font-display font-black text-charcoal dark:text-white flex items-center gap-1.5">
              Two-Wheeler Weather Advisor
            </h4>
          </div>
        </div>

        {/* Dropdowns / Unit Selector */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          {/* City Selector */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as "Pune" | "Mumbai")}
              className={`text-xs font-bold py-1.5 px-3 rounded-lg border cursor-pointer outline-none transition-colors ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-800 text-white hover:bg-slate-800" 
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <option value="Pune">📍 Pune (Workshop)</option>
              <option value="Mumbai">📍 Mumbai Outpost</option>
            </select>
          </div>

          {/* Temp Unit Selector */}
          <button
            onClick={() => setTempUnit(prev => prev === "C" ? "F" : "C")}
            className={`text-xs font-bold py-1.5 px-2.5 rounded-lg border transition-colors ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800 hover:bg-slate-800" 
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            °{tempUnit}
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Interactive Mode Controller */}
        <div className="md:col-span-5 flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-2.5">
              Simulate Weather Condition
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentCondition("sunny")}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all duration-200 text-xs font-bold cursor-pointer ${
                  currentCondition === "sunny"
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500 hover:border-slate-300 dark:hover:border-slate-800"
                }`}
              >
                <Sun className="h-4 w-4 shrink-0" />
                <span>Sunny</span>
              </button>
              
              <button
                onClick={() => setCurrentCondition("rainy")}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all duration-200 text-xs font-bold cursor-pointer ${
                  currentCondition === "rainy"
                    ? "bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500 hover:border-slate-300 dark:hover:border-slate-800"
                }`}
              >
                <CloudRain className="h-4 w-4 shrink-0" />
                <span>Monsoon</span>
              </button>

              <button
                onClick={() => setCurrentCondition("cloudy")}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all duration-200 text-xs font-bold cursor-pointer ${
                  currentCondition === "cloudy"
                    ? "bg-slate-500/10 border-slate-400/40 text-slate-600 dark:text-slate-400 shadow-sm"
                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500 hover:border-slate-300 dark:hover:border-slate-800"
                }`}
              >
                <Cloud className="h-4 w-4 shrink-0" />
                <span>Overcast</span>
              </button>

              <button
                onClick={() => setCurrentCondition("hot")}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all duration-200 text-xs font-bold cursor-pointer ${
                  currentCondition === "hot"
                    ? "bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400 shadow-sm"
                    : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500 hover:border-slate-300 dark:hover:border-slate-800"
                }`}
              >
                <Flame className="h-4 w-4 shrink-0" />
                <span>Extreme Heat</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xl font-display font-black tracking-tight">
                {displayTemp}°{tempUnit}
              </span>
            </div>
            <div className="text-[10px] text-right font-mono text-slate-400 uppercase">
              Current Simulated temp
            </div>
          </div>
        </div>

        {/* Right Active Weather & Advice Panel */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCity}-${currentCondition}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="space-y-3.5"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="shrink-0">{weather.icon}</div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block leading-none">
                      Conditions State
                    </span>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 leading-tight block">
                      {weather.status}
                    </span>
                  </div>
                </div>

                {/* Safety Score Badge */}
                <div className={`px-2.5 py-1 rounded-lg text-right ${safety?.bg}`}>
                  <span className="text-[8px] font-mono tracking-wider uppercase block text-slate-400">
                    Riding Comfort
                  </span>
                  <span className={`text-xs font-black ${safety?.color}`}>
                    {safety?.score}% ({safety?.level})
                  </span>
                </div>
              </div>

              {/* Major Custom Recommendation Box */}
              <div className={`p-4 rounded-xl border-l-4 border ${weather.colorClass} flex items-start space-x-3`}>
                {currentCondition === "rainy" ? (
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                ) : (
                  <Info className="h-5 w-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider mb-1">
                    Recommended Actions
                  </h5>
                  <p className="text-xs font-bold leading-relaxed">
                    {weather.recommendation}
                  </p>
                </div>
              </div>

              {/* Sub-advice notes */}
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                💡 {weather.subAdvice}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Mini Weather stats and Quick Booking call-to-action */}
          <div className="grid grid-cols-3 gap-2 border-t pt-3.5 border-dashed border-slate-200/60 dark:border-slate-800/60">
            <div className="text-center bg-slate-50/50 dark:bg-slate-900/30 p-1.5 rounded-lg border border-slate-100/50 dark:border-slate-800/40">
              <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block">
                Rain Prob
              </span>
              <span className="text-xs font-black flex items-center justify-center gap-1 mt-0.5 text-slate-700 dark:text-slate-300">
                <Droplets className="h-3 w-3 text-blue-400" />
                {weather.rainProb}%
              </span>
            </div>

            <div className="text-center bg-slate-50/50 dark:bg-slate-900/30 p-1.5 rounded-lg border border-slate-100/50 dark:border-slate-800/40">
              <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block">
                Humidity
              </span>
              <span className="text-xs font-black flex items-center justify-center gap-1 mt-0.5 text-slate-700 dark:text-slate-300">
                <Droplets className="h-3 w-3 text-emerald-400" />
                {weather.humidity}%
              </span>
            </div>

            <div className="text-center bg-slate-50/50 dark:bg-slate-900/30 p-1.5 rounded-lg border border-slate-100/50 dark:border-slate-800/40">
              <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 block">
                Wind Speed
              </span>
              <span className="text-xs font-black flex items-center justify-center gap-1 mt-0.5 text-slate-700 dark:text-slate-300">
                <Wind className="h-3 w-3 text-teal-400" />
                {weather.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Conditional bottom banner button */}
      {currentCondition === "rainy" && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 rounded-xl text-xs font-bold flex items-center justify-between gap-2"
        >
          <div className="flex items-center space-x-2">
            <span className="inline-flex w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
            <span>Avoid wet rides: Our door-step pick up is currently discounted by 25%!</span>
          </div>
          {onBookService && (
            <button 
              onClick={onBookService}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <span>Book pickup</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};
