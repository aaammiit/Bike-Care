import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Wrench, 
  Gauge, 
  ShieldCheck, 
  Zap, 
  RotateCw, 
  CircleDot, 
  Sparkles, 
  ClipboardCheck, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { SafeImage } from "./SafeImage";

// Import authentic local garage images
import regularServiceImg from "../assets/images/regular_bike_service_1785392002803.jpg";
import engineRepairImg from "../assets/images/engine_repair_service_1785392016029.jpg";
import brakeServiceImg from "../assets/images/brake_pad_service_1785392030526.jpg";
import batteryElectricalImg from "../assets/images/battery_electrical_service_1785392046998.jpg";
import chainClutchImg from "../assets/images/chain_clutch_service_1785392059464.jpg";
import tyrePunctureImg from "../assets/images/tyre_puncture_service_1785392071114.jpg";
import bikeWashImg from "../assets/images/bike_wash_polish_1785392083459.jpg";
import generalInspectionImg from "../assets/images/general_bike_inspection_1785392095824.jpg";

export interface ServiceCardData {
  id: string;
  title: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  img: string;
  description: string;
  buttonText: string;
  bikeModels: string;
  icon: React.ElementType;
}

export const RANA_GARAGE_SERVICES: ServiceCardData[] = [
  {
    id: "card-1",
    title: "Regular Bike Service",
    badge: "Most Popular",
    badgeBg: "bg-orange-500",
    badgeText: "text-white",
    img: regularServiceImg,
    description: "Engine oil replacement, oil filter cleaning, chain lubrication, clutch adjustment, brake inspection, and complete service.",
    buttonText: "Book Service",
    bikeModels: "Hero Splendor • Honda Shine • Passion",
    icon: Wrench
  },
  {
    id: "card-2",
    title: "Engine Repair",
    badge: "Engine Work",
    badgeBg: "bg-slate-900 dark:bg-slate-800",
    badgeText: "text-orange-400",
    img: engineRepairImg,
    description: "Engine noise diagnosis, piston work, timing chain replacement, gasket replacement, and complete engine repair.",
    buttonText: "Book Service",
    bikeModels: "Bajaj Pulsar • Honda Unicorn • Apache",
    icon: Gauge
  },
  {
    id: "card-3",
    title: "Brake Service",
    badge: "Safety Check",
    badgeBg: "bg-emerald-600",
    badgeText: "text-white",
    img: brakeServiceImg,
    description: "Brake pad replacement, disc inspection, brake oil replacement, cable adjustment, and brake testing.",
    buttonText: "Book Service",
    bikeModels: "TVS Apache • Honda Shine • Pulsar 150",
    icon: ShieldCheck
  },
  {
    id: "card-4",
    title: "Battery & Electrical",
    badge: "Electrical",
    badgeBg: "bg-amber-500",
    badgeText: "text-slate-950",
    img: batteryElectricalImg,
    description: "Battery replacement, horn repair, light repair, wiring issues, self-start problems, charging system inspection.",
    buttonText: "Book Service",
    bikeModels: "TVS Raider • Pulsar • All Commuters",
    icon: Zap
  },
  {
    id: "card-5",
    title: "Chain & Clutch",
    badge: "Maintenance",
    badgeBg: "bg-blue-600",
    badgeText: "text-white",
    img: chainClutchImg,
    description: "Chain cleaning, lubrication, sprocket inspection, clutch adjustment, cable replacement.",
    buttonText: "Book Service",
    bikeModels: "Hero Passion • Platina • HF Deluxe",
    icon: RotateCw
  },
  {
    id: "card-6",
    title: "Tyre & Puncture Repair",
    badge: "Quick Service",
    badgeBg: "bg-teal-600",
    badgeText: "text-white",
    img: tyrePunctureImg,
    description: "Tube replacement, tubeless puncture repair, tyre fitting, wheel balancing, air pressure check.",
    buttonText: "Book Service",
    bikeModels: "Honda Unicorn • SP125 • Activa",
    icon: CircleDot
  },
  {
    id: "card-7",
    title: "Bike Washing & Polish",
    badge: "Cleaning",
    badgeBg: "bg-cyan-600",
    badgeText: "text-white",
    img: bikeWashImg,
    description: "Foam wash, chain cleaning, polishing, dashboard cleaning, final wipe before delivery.",
    buttonText: "Book Service",
    bikeModels: "All Commuter & Street Bikes",
    icon: Sparkles
  },
  {
    id: "card-8",
    title: "General Inspection",
    badge: "Final Check",
    badgeBg: "bg-emerald-700",
    badgeText: "text-white",
    img: generalInspectionImg,
    description: "Complete check of brakes, tyres, suspension, lights, engine, chain, battery, and road test.",
    buttonText: "Book Service",
    bikeModels: "Pre-Purchase & Highway Checkup",
    icon: ClipboardCheck
  }
];

interface ServicesCarouselProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ onSelectService }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // Auto-scroll effect: advances by one card width (330px) every 3.2s
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScrollLeft - 15) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 330, behavior: "smooth" });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const index = Math.min(Math.max(Math.round(el.scrollLeft / 330), 0), RANA_GARAGE_SERVICES.length - 1);
    setActiveCardIndex((prev) => (prev === index ? prev : index));
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
    <div className="space-y-5">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/50 text-[#ff6b00] dark:text-orange-400 rounded-full font-bold border border-orange-200 dark:border-orange-800/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-pulse" />
            <span>Honest & Reliable Garage Care ({RANA_GARAGE_SERVICES.length} Services)</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold font-mono transition-all flex items-center space-x-2 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer active:scale-95"
            title={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-[#ff6b00]" />
                <span>Auto-Scroll On</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-600" />
                <span>Paused</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={scrollLeft}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 text-slate-800 dark:text-white flex items-center justify-center transition-all border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-95 shadow-xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-600 text-slate-800 dark:text-white flex items-center justify-center transition-all border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-95 shadow-xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL TRACK */}
      <div 
        className="relative group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-nowrap overflow-x-auto space-x-6 py-4 px-1.5 scroll-smooth snap-x snap-mandatory no-scrollbar select-none touch-pan-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {RANA_GARAGE_SERVICES.map((service) => {
            const IconComp = service.icon;
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-[300px] sm:w-[325px] shrink-0 snap-start bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-500/50 transition-all duration-300 group flex flex-col justify-between overflow-hidden cursor-pointer"
                onClick={() => onSelectService(service.title)}
              >
                {/* Image & Badge Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0">
                  <SafeImage 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                  
                  {/* Badge */}
                  <span className={`absolute top-3 left-3 ${service.badgeBg} ${service.badgeText} text-[11px] font-mono font-extrabold px-3 py-1 rounded-full shadow-md tracking-wide`}>
                    {service.badge}
                  </span>

                  {/* Icon floating badge */}
                  <div className="absolute bottom-3 left-3 p-2.5 bg-white/95 dark:bg-slate-900/95 text-[#ff6b00] border border-orange-200 dark:border-slate-700 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110">
                    <IconComp className="h-5 w-5 stroke-[2.2]" />
                  </div>

                  {/* Bike suitability tag */}
                  <span className="absolute bottom-3 right-3 text-[10px] font-sans font-bold text-slate-200 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-slate-700/60 truncate max-w-[170px]">
                    {service.bikeModels}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-lg text-slate-900 dark:text-white group-hover:text-[#ff6b00] transition-colors leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-[11px] flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>Rana Guaranteed</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectService(service.title);
                      }}
                      className="px-4 py-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                    >
                      <span>{service.buttonText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="flex items-center justify-center space-x-1.5 pt-1">
        {RANA_GARAGE_SERVICES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ left: idx * 330, behavior: "smooth" });
              }
            }}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              activeCardIndex === idx 
                ? "w-8 bg-[#ff6b00]" 
                : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
            }`}
            aria-label={`Jump to service ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
