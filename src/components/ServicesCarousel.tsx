import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Wrench, 
  Gauge, 
  Activity, 
  Bike, 
  Sparkles, 
  Sliders, 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { 
  workshopLiftImg, 
  clutchEngineImg, 
  suspensionImg, 
  foamWashImg, 
  engineOilImg 
} from "./garageData";

interface ServiceItem {
  id: string;
  title: string;
  bikeModel: string;
  img: string;
  desc: string;
  status: string;
  icon: React.ElementType;
}

interface ServicesCarouselProps {
  onSelectService: (serviceName: string) => void;
}

const FALLBACK_BIKE_IMAGE = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200";

const SERVICES_DATA: ServiceItem[] = [
  { 
    id: "s1",
    title: "General Maintenance", 
    bikeModel: "Hero Splendor / Honda Shine",
    img: engineOilImg,
    desc: "42-point safety checkup, oil dipstick level test, chain tension adjust, filter cleaning, clean spark plugs.", 
    status: "Included Work", 
    icon: Wrench 
  },
  { 
    id: "s2",
    title: "Engine & Clutch Repair", 
    bikeModel: "Royal Enfield Bullet 350",
    img: clutchEngineImg,
    desc: "Clutch basket friction plate assembly, valve lapping, piston rings replacement, synthetic oil flushing.", 
    status: "Expert Engine Bay", 
    icon: Gauge 
  },
  { 
    id: "s3",
    title: "Brakes & Shock Suspension", 
    bikeModel: "KTM Duke 200 / 390",
    img: suspensionImg,
    desc: "Rear shock absorber tuning, caliper cleaning, ceramic brake pads fitting, WP fork oil seal replacement.", 
    status: "Safety Checked", 
    icon: Activity 
  },
  { 
    id: "s4",
    title: "Scooter Hydraulic Lift Bay", 
    bikeModel: "Honda Activa / Jupiter / Vespa",
    img: workshopLiftImg,
    desc: "Elevated hydraulic lift servicing for scooters, variator belt checks, brake drum cleaning & oil change.", 
    status: "Lift Bay Active", 
    icon: Bike 
  },
  { 
    id: "s5",
    title: "Foam Snow Wash & Teflon", 
    bikeModel: "Vintage Cruiser / Street Bikes",
    img: foamWashImg,
    desc: "High-pressure active foam wash, microfiber wiping, tire gloss shine, buffer wax orbital Teflon polishing.", 
    status: "Gloss Finished", 
    icon: Sparkles 
  },
  { 
    id: "s6",
    title: "Battery & Electricals", 
    bikeModel: "TVS Apache / Pulsar",
    img: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=600&q=80",
    desc: "Exide battery load testing, wiring loom short diagnostics, solid-state starter relay fitting, bulb wraps.", 
    status: "Diagnostic Check", 
    icon: Sparkles 
  },
  { 
    id: "s7",
    title: "Chain & Drive Repair", 
    bikeModel: "Yamaha R15 V4 / MT-15",
    img: "https://images.unsplash.com/photo-1558981804-05561a35563a?auto=format&fit=crop&w=600&q=80",
    desc: "Gold O-ring heavy-duty drive chain installation, laser alignment, wheel tension checking.", 
    status: "Precision Setup", 
    icon: Sliders 
  },
  { 
    id: "s8",
    title: "Carburetor & ECU Tune", 
    bikeModel: "Kawasaki Ninja / Sports",
    img: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=600&q=80",
    desc: "Mikuni carb dismantling, sonic cleaning, float setups, fuel-map OBD flashing for maximum throttle response.", 
    status: "Tuning Bench", 
    icon: Cpu 
  }
];

export const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ onSelectService }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // Auto-scroll loop
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScrollLeft - 10) {
        // Reset to beginning smoothly
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll right by 310px
        el.scrollBy({ left: 310, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  // Update active card index on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const index = Math.round(el.scrollLeft / 310);
    setActiveCardIndex(Math.min(index, SERVICES_DATA.length - 1));
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Carousel Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-bold border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Single Row Animated Carousel ({SERVICES_DATA.length} Bike Services)</span>
          </span>
        </div>

        {/* Carousel Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold font-mono transition flex items-center space-x-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer"
            title={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-500" />
                <span>Auto-Scroll On</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-500" />
                <span>Paused</span>
              </>
            )}
          </button>

          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={scrollLeft}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center transition border border-slate-300 dark:border-slate-700 cursor-pointer active:scale-95 shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={scrollRight}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center transition border border-slate-300 dark:border-slate-700 cursor-pointer active:scale-95 shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* SINGLE ROW HORIZONTAL CAROUSEL TRACK */}
      <div 
        className="relative group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Fade Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none opacity-80" />
        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none opacity-80" />

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-nowrap overflow-x-auto space-x-5 py-3 px-1 scroll-smooth snap-x snap-mandatory no-scrollbar select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {SERVICES_DATA.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="w-[300px] sm:w-[320px] shrink-0 snap-start duo-card hover:border-spark-blue hover:shadow-[0_8px_20px_rgba(28,176,246,0.15)] transition-all duration-300 group/card relative overflow-hidden flex flex-col justify-between bg-white dark:bg-slate-900 text-charcoal dark:text-white rounded-2xl border-2 border-slate-200 dark:border-slate-800 cursor-pointer"
                onClick={() => onSelectService(service.title)}
              >
                {/* Bike Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950 shrink-0">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_BIKE_IMAGE;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Bike Model Badge */}
                  <span className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md border border-slate-700 shadow-md">
                    🏍️ {service.bikeModel}
                  </span>

                  {/* Icon badge */}
                  <div className="absolute bottom-2.5 left-3 p-2.5 bg-sky-50 text-spark-blue dark:bg-sky-950 dark:text-sky-300 border-2 border-sky-100 dark:border-sky-800 rounded-xl shrink-0 shadow-md">
                    <IconComp className="h-5 w-5" />
                  </div>

                  {/* Category Status pill */}
                  <span className="absolute bottom-3 right-3 text-[9px] font-mono font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 backdrop-blur-xs">
                    {service.status}
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="text-left space-y-1.5">
                    <h3 className="font-display font-black text-base text-slate-900 dark:text-white group-hover/card:text-spark-blue transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {service.desc}
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] flex items-center space-x-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Rana Guaranteed</span>
                    </span>
                    <span className="text-spark-blue font-black text-[11px] uppercase tracking-wide flex items-center space-x-1 group-hover/card:translate-x-1 transition-transform">
                      <span>Book Slot</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Dots Bar */}
      <div className="flex items-center justify-center space-x-1.5 pt-1">
        {SERVICES_DATA.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: idx * 310, behavior: "smooth" });
              }
            }}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              activeCardIndex === idx 
                ? "w-8 bg-spark-blue" 
                : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
            }`}
            aria-label={`Jump to service ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
