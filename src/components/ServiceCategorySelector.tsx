import React from "react";
import { motion } from "motion/react";
import {
  Wrench,
  Gauge,
  Disc,
  Zap,
  Settings,
  ShieldAlert,
  CircleDot,
  Sparkles,
  Droplet,
  Flame,
  CheckCircle2
} from "lucide-react";

export interface CategoryOption {
  id: string;
  name: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: string;
  color: string;
}

export const BOOKING_CATEGORIES: CategoryOption[] = [
  {
    id: "General Maintenance",
    name: "General Maintenance",
    shortLabel: "General Checkup",
    icon: Wrench,
    badge: "Popular",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: "Engine Repair",
    name: "Engine Repair",
    shortLabel: "Engine Overhaul",
    icon: Gauge,
    badge: "Expert",
    color: "from-orange-500 to-amber-600"
  },
  {
    id: "Brake Overhaul",
    name: "Brake Overhaul",
    shortLabel: "Brake & Pads",
    icon: Disc,
    color: "from-rose-500 to-red-600"
  },
  {
    id: "Oil & Filter Change",
    name: "Oil & Filter Change",
    shortLabel: "Oil Swap",
    icon: Droplet,
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "Battery & Electrical",
    name: "Battery & Electrical",
    shortLabel: "Battery & Wiring",
    icon: Zap,
    color: "from-yellow-500 to-amber-500"
  },
  {
    id: "Chain Lube & Clean",
    name: "Chain Lube & Clean",
    shortLabel: "Chain & Lube",
    icon: Settings,
    color: "from-indigo-500 to-purple-600"
  },
  {
    id: "Suspension Repair",
    name: "Suspension Repair",
    shortLabel: "Fork & Shocks",
    icon: ShieldAlert,
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "Tyre & Puncture",
    name: "Tyre & Puncture",
    shortLabel: "Tyres & Alignment",
    icon: CircleDot,
    color: "from-slate-500 to-zinc-600"
  },
  {
    id: "Washing & Polishing",
    name: "Washing & Polishing",
    shortLabel: "Foam Wash",
    icon: Sparkles,
    color: "from-sky-400 to-blue-500"
  },
  {
    id: "Custom Repair",
    name: "Custom Repair",
    shortLabel: "Custom Restorations",
    icon: Flame,
    badge: "Custom",
    color: "from-fuchsia-500 to-pink-600"
  }
];

interface ServiceCategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  theme?: "dark" | "light";
}

export const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  theme = "dark"
}) => {
  return (
    <div className="space-y-3">
      {/* Visual Category Cards Grid with Hover Scale & Rotate Micro-Animations */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {BOOKING_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected =
            selectedCategory === cat.id ||
            selectedCategory.toLowerCase().includes(cat.name.toLowerCase());

          return (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative group p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center ${
                isSelected
                  ? theme === "dark"
                    ? "bg-emerald-950/90 border-emerald-400 text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/80"
                    : "bg-orange-50/90 dark:bg-orange-950/30 border-[#F97316] text-slate-900 dark:text-white shadow-md ring-1 ring-[#F97316]"
                  : theme === "dark"
                  ? "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${
                      theme === "dark" ? "text-emerald-400" : "text-[#F97316]"
                    }`}
                  />
                </div>
              )}

              {/* Service Category Icon with Hover-Based Scale & Rotate Micro-Animations */}
              <motion.div
                whileHover={{ scale: 1.22, rotate: 12 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className={`p-2 rounded-xl mb-1.5 transition-colors duration-200 ${
                  isSelected
                    ? theme === "dark"
                      ? "bg-emerald-500 text-slate-950 shadow-sm"
                      : "bg-[#F97316] text-white shadow-sm"
                    : theme === "dark"
                    ? "bg-slate-700/80 text-emerald-400 group-hover:bg-slate-700 group-hover:text-emerald-300"
                    : "bg-slate-200 dark:bg-slate-800 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              </motion.div>

              <span className="text-[11px] font-bold tracking-tight line-clamp-1">
                {cat.shortLabel}
              </span>

              {cat.badge && !isSelected && (
                <span className="mt-0.5 text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-slate-700/60 dark:bg-slate-800 text-slate-400 font-semibold uppercase">
                  {cat.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
