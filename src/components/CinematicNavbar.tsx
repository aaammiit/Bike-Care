import React, { useState, useEffect, useRef } from "react";
import { Wrench, Phone, Menu, X, Sun, Moon, Cpu, MessageSquare, AlertTriangle, Bike } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CinematicNavbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  activeSection: string;
  onNavigateToRole: (role: "Customer" | "Admin" | "Mechanic") => void;
  onOpenBooking: () => void;
  onOpenUsers?: () => void;
}

export const CinematicNavbar: React.FC<CinematicNavbarProps> = ({
  isDarkMode,
  setIsDarkMode,
  activeSection,
  onNavigateToRole,
  onOpenBooking,
  onOpenUsers,
}) => {
  // Ensure the interactive navbar with all links is immediately visible on page load
  const [introStage, setIntroStage] = useState<"intro" | "interactive">("interactive");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Active Link Riding Motorcycle Tracking
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isRidingRight, setIsRidingRight] = useState(true);
  const navItemRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const lastActiveLeft = useRef<number>(0);

  const navLinks = [
    { id: "services", label: "Services" },
    { id: "gallery", label: "Gallery" },
    { id: "reviews", label: "Reviews" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "users", label: "Mechanic 🔑" },
  ];

  // Track Scrolling for Glassmorphism & Shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Complete Intro Timeline after 3.8 seconds
  useEffect(() => {
    if (introStage === "intro") {
      const timer = setTimeout(() => {
        setIntroStage("interactive");
        sessionStorage.setItem("rana_navbar_intro_complete", "true");
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [introStage]);

  // Update Riding Motorcycle Underline Indicator
  useEffect(() => {
    if (introStage !== "interactive") return;
    
    // Find active element
    const activeEl = navItemRefs.current[activeSection];
    if (activeEl) {
      const left = activeEl.offsetLeft;
      const width = activeEl.offsetWidth;
      
      setIsRidingRight(left >= lastActiveLeft.current);
      lastActiveLeft.current = left;
      
      setIndicatorStyle({
        left,
        width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection, introStage]);

  // Handle active section change manually on link click
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (id === "users") {
      if (onOpenUsers) onOpenUsers();
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Stagger links animation settings
  const staggerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        type: "spring",
        stiffness: 140,
        damping: 14,
      },
    }),
  };

  return (
    <>
      {/* CSS Styles for Cinematic Elements */}
      <style>{`
        /* Cinematic Entrance Bike Ride */
        @keyframes bike-intro-ride-left {
          0% {
            left: 105%;
            transform: scale(1) rotate(0deg);
          }
          40% {
            left: 20%;
            transform: scale(1) rotate(0.5deg);
          }
          /* Slight braking/slowing over the logo area */
          55% {
            left: 12%;
            transform: scale(1) rotate(-1deg);
          }
          /* Tiny drift skid on the left */
          65% {
            left: 6%;
            transform: scale(1.05) rotate(-6deg) translateY(-2px);
          }
          75% {
            left: 5%;
            transform: scale(1) rotate(2deg) translateY(1px);
          }
          /* Accelerate out of the screen left */
          100% {
            left: -180px;
            transform: scale(0.95) rotate(0deg);
          }
        }

        .intro-bike-rider {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 75px;
          height: 48px;
          animation: bike-intro-ride-left 3.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          will-change: left;
        }

        /* Spinning Wheels during intro ride */
        @keyframes intro-spin {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .intro-spinning-wheel {
          animation: intro-spin 0.08s linear infinite;
          transform-origin: center;
        }

        /* Front skid smoke/dust particles */
        @keyframes dust-burst {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: translate(-30px, -15px) scale(1.8); opacity: 0; }
        }
        .intro-skid-dust {
          animation: dust-burst 0.5s ease-out infinite;
          animation-delay: 2.2s; /* Triggers during drift */
        }

        /* Tyre mark paint glow trail reveal */
        @keyframes tyre-trail-reveal {
          0% { clip-path: inset(0 0 0 100%); }
          100% { clip-path: inset(0 0 0 0); }
        }
        .tyre-trail-painted {
          animation: tyre-trail-reveal 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-delay: 1.6s; /* Synchronized with bike transit over logo */
        }

        /* Glowing Orange Brush paint tip */
        @keyframes paint-tip-move {
          0% { left: 100%; opacity: 0; }
          5% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 0%; opacity: 0; }
        }
        .paint-trail-tip {
          animation: paint-tip-move 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-delay: 1.6s;
        }

        /* Gentle shake for Call button */
        @keyframes gentle-shake {
          0%, 100%, 90% { transform: rotate(0) scale(1); }
          92% { transform: rotate(4deg) scale(1.05); }
          94% { transform: rotate(-4deg) scale(1.05); }
          96% { transform: rotate(3deg) scale(1.05); }
          98% { transform: rotate(-3deg) scale(1.05); }
        }
        .btn-call-shaker {
          animation: gentle-shake 15s ease-in-out infinite;
        }

        /* Engine vibration on logo hover */
        @keyframes engine-vibrate {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-0.8px) translateX(0.8px); }
          50% { transform: translateY(0.8px) translateX(-0.8px); }
          75% { transform: translateY(-0.8px) translateX(-0.8px); }
        }
        .logo-engine-vibrate {
          animation: engine-vibrate 0.1s linear infinite;
        }

        /* Underline growth from center hover effect */
        .hover-underline-grow {
          position: relative;
        }
        .hover-underline-grow::after {
          content: '';
          position: absolute;
          width: 0px;
          height: 2px;
          bottom: -4px;
          left: 50%;
          background: #F97316;
          box-shadow: 0 0 6px rgba(249, 115, 22, 0.6);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .hover-underline-grow:hover::after {
          width: 80%;
        }

        /* Ambient Glassmorphism styles */
        .glass-navbar-scrolled-dark {
          background-color: rgba(9, 15, 30, 0.85);
          backdrop-filter: blur(16px) saturate(130%);
          border-bottom: 1px solid rgba(249, 115, 22, 0.15);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
        }
        .glass-navbar-scrolled-light {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px) saturate(120%);
          border-bottom: 1px solid rgba(249, 115, 22, 0.1);
          box-shadow: 0 10px 35px -12px rgba(249, 115, 22, 0.08), 0 1px 0 rgba(255, 255, 255, 0.8) inset;
        }

        /* Particle effects for intro trail */
        @keyframes puff-smoke {
          0% { transform: scale(0.4) translate(0, 0); opacity: 0.6; }
          100% { transform: scale(1.4) translate(15px, -15px); opacity: 0; }
        }
        .intro-smoke-particle {
          animation: puff-smoke 0.6s ease-out infinite;
        }

        /* Active Navigation Riding Bike Exhaust Smoke Animation */
        @keyframes nav-exhaust-smoke {
          0% {
            transform: translate(0, 0) scale(0.3);
            opacity: 0.95;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translate(-12px, -8px) scale(1.8);
            opacity: 0;
          }
        }
        .nav-exhaust-smoke-particle {
          animation: nav-exhaust-smoke 0.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Main Navbar Header wrapper */}
      <header
        className={`fixed top-0 left-0 z-[100] w-full text-charcoal transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-2.5 border-b-4 border-slate-300/90 shadow-[0_5px_0_0_#e2e8f0,0_12px_24px_-4px_rgba(0,0,0,0.15)]"
            : "bg-white py-4 border-b-2 border-slate-200 shadow-[0_2px_0_0_#f1f5f9]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
          
          {/* =========================================================
              STAGE 1: CINEMATIC LOGO INTRO ANIMATION OVERLAY
              ========================================================= */}
          {introStage === "intro" && (
            <div className="absolute inset-0 z-50 flex items-center justify-between pointer-events-none">
              
              {/* Painted Logo reveal container (travels from right to left, revealed in mask) */}
              <div className="flex items-center space-x-3.5 pl-4 sm:pl-6 relative h-full">
                {/* Visual Tyremarks Paint Trail Glowing Cover */}
                <div className="absolute inset-y-0 left-[-10px] w-[260px] tyre-trail-painted z-10 overflow-hidden flex items-center">
                  <div className="flex items-center space-x-3">
                    {/* The Garage Icon */}
                    <div className="bg-orange-500 text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 border border-orange-500/20">
                      <Wrench className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    {/* Brand name */}
                    <div>
                      <h1 className="font-display font-black text-xl leading-none tracking-tight flex items-center text-white">
                        RANA <span className="text-orange-500 font-sans font-bold ml-1.5 text-xs tracking-widest uppercase border-l border-slate-700 pl-1.5">BIKE CARE</span>
                      </h1>
                      <p className="text-[9px] text-[#FDBA74] font-mono tracking-widest uppercase mt-0.5 font-bold">Premium Motorcare</p>
                    </div>
                  </div>
                  {/* Pinging glowing paintbrush trail point */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2.5 h-10 bg-orange-500 shadow-[0_0_15px_#F97316] rounded-full z-20 pointer-events-none" />
                </div>
              </div>

              {/* STAGE 1 BIKE riding smoothly across the screen from Right to Left */}
              <div className="intro-bike-rider">
                
                {/* Exhaust Smoke Puffs */}
                <div className="absolute right-[-10px] bottom-[12px] w-4 h-4 flex space-x-0.5">
                  <span className="intro-smoke-particle w-2.5 h-2.5 bg-slate-400/25 rounded-full" style={{ animationDelay: "0.1s" }} />
                  <span className="intro-smoke-particle w-2 h-2 bg-slate-300/20 rounded-full" style={{ animationDelay: "0.3s" }} />
                </div>

                {/* Front skid dust */}
                <div className="absolute left-[5px] bottom-0 w-5 h-5 flex flex-wrap opacity-60">
                  <span className="intro-skid-dust w-2 h-2 bg-amber-500/30 rounded-full" />
                  <span className="intro-skid-dust w-1.5 h-1.5 bg-orange-600/25 rounded-full" style={{ animationDelay: "0.2s" }} />
                </div>

                {/* Glowing headlight cone pointing left */}
                <svg className="absolute right-[65px] top-[10px] w-[110px] h-[36px] pointer-events-none" viewBox="0 0 110 36">
                  <polygon 
                    points="110,14 0,0 0,36 110,22" 
                    fill="url(#intro-headlight-grad)" 
                  />
                  <defs>
                    <linearGradient id="intro-headlight-grad" x1="100%" y1="50%" x2="0%" y2="50%">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
                      <stop offset="35%" stopColor="#F97316" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Bike Silhouette Shape inside */}
                <div className="w-full h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 75 48">
                    {/* Bike Chassis Outline */}
                    <path d="M50,22 L62,26" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="50" y1="24" x2="58" y2="38" stroke="#f1f5f9" strokeWidth="1.5" />
                    <rect x="25" y="24" width="16" height="12" rx="2" fill="#334155" />
                    <path d="M35,16 Q45,15 50,20 L50,26 Z" fill="#F97316" />
                    <circle cx="33" cy="22" r="1" fill="#fff" />
                    {/* Headlight point */}
                    <circle cx="58" cy="21" r="1.5" fill="#fef08a" />

                    {/* WHEEL SPINS (Front) */}
                    <g className="intro-spinning-wheel" style={{ transformOrigin: "58px 38px" }}>
                      <circle cx="58" cy="38" r="8" fill="none" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="58" y1="30" x2="58" y2="46" stroke="#e2e8f0" strokeWidth="0.8" />
                      <line x1="50" y1="38" x2="66" y2="38" stroke="#e2e8f0" strokeWidth="0.8" />
                      <circle cx="58" cy="38" r="2.5" fill="#1e293b" />
                    </g>

                    {/* WHEEL SPINS (Rear) */}
                    <g className="intro-spinning-wheel" style={{ transformOrigin: "18px 38px" }}>
                      <circle cx="18" cy="38" r="8" fill="none" stroke="#64748b" strokeWidth="1.5" />
                      <line x1="18" y1="30" x2="18" y2="46" stroke="#e2e8f0" strokeWidth="0.8" />
                      <line x1="10" y1="38" x2="26" y2="38" stroke="#e2e8f0" strokeWidth="0.8" />
                      <circle cx="18" cy="38" r="2.5" fill="#1e293b" />
                    </g>
                  </svg>
                </div>

              </div>

              {/* Status prompt */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[#FDBA74] tracking-widest uppercase flex items-center space-x-2 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                <span>Cinematic Ignition Initializing...</span>
              </div>

            </div>
          )}

          {/* =========================================================
              STAGE 2: FULLY INTERACTIVE BRAND NAVIGATION BAR
              ========================================================= */}
          <div className={`w-full h-16 flex items-center justify-between transition-opacity duration-500 ${
            introStage === "intro" ? "opacity-0" : "opacity-100"
          }`}>
            
            {/* 1. Left side brand group (Interactive + Hover Effects) */}
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, "home")}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group animate-fadeIn"
            >
              {/* Rotating gear wheel + vibrating block */}
              <div className={`relative overflow-hidden bg-eager-green text-white p-2 sm:p-2.5 rounded-xl flex items-center justify-center border-b-4 border-emerald-600 transition-all duration-300 group-hover:scale-105 ${
                isLogoHovered ? "logo-engine-vibrate" : ""
              }`}>
                {/* Rotating Bike */}
                <div className={`transition-transform duration-500 ${isLogoHovered ? "scale-110" : ""}`}>
                  <Bike className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 stroke-[2.5]" />
                </div>
              </div>

              <div className="text-left">
                <h1 className="font-display font-black text-xl sm:text-2xl leading-none tracking-tight flex items-center text-charcoal">
                  Rana <span className="text-eager-green font-extrabold ml-1 text-base sm:text-lg font-sans">Bike Care</span>
                </h1>
              </div>
            </a>

            {/* 2. Middle Navigation Items with sliding motorcycle active underline indicator */}
            <nav className="hidden lg:flex items-center space-x-2 relative">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  ref={(el) => { navItemRefs.current[link.id] = el; }}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={staggerVariants}
                  className={`px-4 py-1.5 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all hover:scale-105 ${
                    activeSection === link.id
                      ? "text-[#46a302] bg-[#f4fce3] dark:bg-emerald-950/40 border-2 border-[#58cc02] font-black shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#58cc02] dark:hover:text-[#58cc02] font-bold"
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* RIDING MOTORCYCLE UNDERLINE INDICATOR (Plays only on interaction) */}
              {indicatorStyle.opacity > 0 && (
                <motion.div
                  animate={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                    opacity: indicatorStyle.opacity,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className="absolute bottom-[-10px] h-[4px] bg-[#58cc02] z-10 rounded-full"
                >
                  {/* Tiny 60FPS riding bike on top of the underline */}
                  <motion.div
                    animate={{
                      scaleX: isRidingRight ? 1 : -1,
                    }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-[-16px] pointer-events-none"
                    style={{
                      right: isRidingRight ? "-10px" : "auto",
                      left: isRidingRight ? "auto" : "-10px",
                      transformOrigin: "center",
                    }}
                  >
                    <svg className="w-9 h-6 select-none overflow-visible" viewBox="0 0 36 24" fill="none">
                      {/* Seat */}
                      <path d="M8 8 C10 8, 16 8, 18 10 C15 11, 9 11, 8 8 Z" fill="#1e293b" />
                      {/* Petrol tank - Red frame */}
                      <path d="M16 6 Q24 5 28 10 L28 14 Q22 15 16 14 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
                      {/* Engine and exhaust */}
                      <rect x="13" y="13" width="7" height="4" rx="1" fill="#475569" />
                      <path d="M15 17 L8 17" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                      
                      {/* Animated Exhaust Smoke Puffs */}
                      <g className="pointer-events-none">
                        <circle cx="5" cy="17" r="1.6" fill="#cbd5e1" className="nav-exhaust-smoke-particle" style={{ animationDelay: "0s" }} />
                        <circle cx="5" cy="17" r="2.0" fill="#94a3b8" className="nav-exhaust-smoke-particle" style={{ animationDelay: "0.2s" }} />
                        <circle cx="5" cy="17" r="2.4" fill="#64748b" className="nav-exhaust-smoke-particle" style={{ animationDelay: "0.4s" }} />
                      </g>

                      {/* Steering handle and forks */}
                      <path d="M26 4 L29 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      <path d="M28 6 L32 16" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
                      {/* Rear fender */}
                      <path d="M6 10 Q11 7 14 10" fill="none" stroke="#475569" strokeWidth="1.5" />
                      {/* Rear Wheel (black tire, white hub) */}
                      <circle cx="10" cy="16" r="4.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="10" cy="16" r="1.5" fill="#94a3b8" />
                      {/* Front Wheel (black tire, white hub) */}
                      <circle cx="30" cy="16" r="4.5" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="30" cy="16" r="1.5" fill="#94a3b8" />
                    </svg>
                  </motion.div>
                  {/* Pinging glowing headlight point of tiny motorcycle */}
                  <span className={`absolute top-[-4px] w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping opacity-75 ${
                    isRidingRight ? "right-[-12px]" : "left-[-12px]"
                  }`} />
                </motion.div>
              )}
            </nav>

            {/* 3. Right side call/action buttons (Magnetic Hover, Ripple Click, Gentle Shake, Theme Toggle) */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Call Now Button */}
              <motion.a
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ y: 1, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 14 }}
                href="tel:+919767824216"
                className="hidden md:inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-[#38bdf8] bg-sky-50/80 hover:bg-sky-100 text-[#0284c7] dark:bg-sky-950/40 dark:text-sky-300 font-black text-xs tracking-wider cursor-pointer shadow-2xs"
              >
                <Phone className="h-4 w-4 text-[#0284c7] dark:text-sky-300" />
                <span className="font-black">CALL NOW</span>
              </motion.a>

              {/* Primary WhatsApp / Book button */}
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ y: 1, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 14 }}
                onClick={onOpenBooking}
                className="relative bg-[#58cc02] hover:bg-[#46a302] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-2 shrink-0 cursor-pointer shadow-xs border border-emerald-600/30"
              >
                <MessageSquare className="h-4 w-4 text-white shrink-0" />
                <span>BOOK</span>
              </motion.button>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-2xl lg:hidden border-2 border-slate-200 text-charcoal hover:bg-slate-50 cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* =========================================================
          STAGE 3: RESPONSIVE MOBILE DRAWER MENU
          ========================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] lg:hidden bg-slate-950/80 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute right-0 top-0 h-full w-[290px] sm:w-[320px] shadow-2xl flex flex-col justify-between border-l p-6 ${
                isDarkMode 
                  ? "bg-slate-950 border-slate-900 text-white" 
                  : "bg-white border-slate-100 text-slate-900"
              }`}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking drawer content
            >
              <div className="space-y-7">
                {/* Mobile Drawer Top logo profile card */}
                <div className="flex items-center space-x-3.5 pb-5 border-b border-orange-500/10">
                  <div className="bg-orange-500 text-white p-2 rounded-xl">
                    <Wrench className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-lg leading-none tracking-tight">RANA GARAGE</h2>
                    <p className="text-[10px] text-orange-500 font-mono tracking-widest uppercase mt-0.5 font-bold">Bike Care Experts</p>
                  </div>
                </div>

                {/* Navigation lists (fading in one after another) */}
                <nav className="flex flex-col space-y-2">
                  {navLinks.map((link, idx) => (
                    <motion.a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => handleLinkClick(e, link.id)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className={`block px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        activeSection === link.id
                          ? "bg-orange-500/15 text-orange-500"
                          : isDarkMode
                            ? "text-slate-300 hover:text-orange-400 hover:bg-slate-900"
                            : "text-slate-600 hover:text-orange-600 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Mobile Drawer Bottom with large high-contrast CTAs */}
              <div className="space-y-3.5 pt-6 border-t border-orange-500/10">
                <a
                  href="tel:+919767824216"
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                    isDarkMode 
                      ? "bg-slate-900 border-slate-800 text-white" 
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <Phone className="h-4 w-4 text-orange-500" />
                  <span>Call Workshops</span>
                </a>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-transform duration-300 active:scale-95 shadow-md shadow-orange-500/20"
                >
                  <MessageSquare className="h-4 w-4 text-white" />
                  <span>WhatsApp Slot</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
