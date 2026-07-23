import React, { useState, useEffect, useRef } from "react";
import { generateGoogleMapsUrl } from "../utils/locationUtils";
import { 
  mechanicData, 
  reviewsData, 
  galleryData, 
  beforeAfterData, 
  pricingPackages, 
  faqItems, 
  majorBrands,
  BeforeAfterItem
} from "./garageData";
import { AnimatedMotorcycle } from "./AnimatedMotorcycle";
import { CinematicNavbar } from "./CinematicNavbar";
import { 
  Wrench, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  Star, 
  Sparkles, 
  Phone, 
  Activity, 
  Award, 
  CreditCard, 
  Bike, 
  CheckCircle2, 
  FileText, 
  Smartphone, 
  ExternalLink, 
  ChevronDown, 
  Sliders, 
  Check, 
  User, 
  Cpu, 
  Gauge, 
  X, 
  Sun, 
  Moon, 
  Calendar, 
  MessageSquare, 
  AlertTriangle,
  Menu,
  ChevronLeft,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ServiceType } from "../types";

interface LandingPageProps {
  onOpenBooking: (preselectedService?: ServiceType) => void;
  onNavigateToRole: (role: "Customer" | "Admin" | "Mechanic") => void;
  onOpenSOS: () => void;
}

// Native synthesized workshop sound effect generator
const playDiagnosticBeep = (frequency = 800, duration = 100) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.value = frequency;
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) {
    console.warn("Audio Context blocked or not supported:", e);
  }
};

// 1. Interactive Counter Component for Trust stats
const AnimatedCounter: React.FC<{ target: number; suffix?: string; label: string; isDarkMode: boolean }> = ({ target, suffix = "", label, isDarkMode }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const duration = 2000; // premium slow count-up
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quadratic ease out
      const easeProgress = progress * (2 - progress);
      const currentCount = easeProgress * target;
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target]);

  const isDecimal = target % 1 !== 0;
  const displayValue = isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return (
    <div className="text-center p-6 rounded-2xl border-2 border-b-4 border-slate-200 bg-white hover:border-slate-300 transition-all">
      <div className="text-4xl sm:text-5xl font-display font-black text-eager-green mb-2 tracking-tight">
        {displayValue}{suffix}
      </div>
      <div className="text-[11px] tracking-wider uppercase font-extrabold leading-snug text-charcoal">
        {label}
      </div>
    </div>
  );
};

const serviceJourneySteps = [
  {
    phase: "PHASE 01",
    title: "Digital Dispatch Gateway",
    img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    boldIntro: "Instant WhatsApp Ticket Preparation",
    mainBody: "Prepare your booking request instantly using our automated diagnostic modal. Connect your active WhatsApp phone number, specify your motorcycle details, and establish a live GPS lock with a single tap. Your details are packaged securely for Rana Singh's instant workshop review."
  },
  {
    phase: "PHASE 02",
    title: "Honest Bay Diagnostics",
    img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
    boldIntro: "Advanced Sensor & Frame Scans",
    mainBody: "Roll your machine into our premium Koregaon Park service bay. Rana personally performs computer-guided electronic diagnostics, cylinder compression analysis, carburetor air-fuel sensor profiling, and laser-guided frame alignment checks to discover the precise mechanical health of your bike."
  },
  {
    phase: "PHASE 03",
    title: "Precision Engine & Fuel Tuning",
    img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
    boldIntro: "100% Genuine OEM Spares & Assembly",
    mainBody: "Rana Singh initiates target-focused physical restoration, carburetor sonic cleaning, high-performance spark plugs fitting, and custom ECU remapping. Every single spare part used is direct-from-brand certified OEM hardware backed by our premium local guarantee."
  },
  {
    phase: "PHASE 04",
    title: "Road Test & Delivery",
    img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80",
    boldIntro: "Rigorous 5km Quality Check & Foam Wash",
    mainBody: "Every single bike undergoes a rigorous 5km road-testing checklist by Rana Singh to validate brake response, clutch feel, suspension stability, and smooth power delivery. Afterward, your bike receives a full premium thick snow foam wash, polish, and is ready for safe UPI/Cash offline settle!"
  }
];

// Reusable scroll-reveal section header styled with Matte Black, Orange, and White
interface AnimatedSectionHeaderProps {
  badge: string;
  title: string;
  description: string;
}

const AnimatedSectionHeader: React.FC<AnimatedSectionHeaderProps> = ({ badge, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center max-w-3xl mx-auto space-y-4 mb-14"
    >
      <span className="inline-flex items-center px-4 py-1.5 bg-brand-50 text-eager-green rounded-full text-[11px] font-bold uppercase tracking-wider border-2 border-brand-100 shadow-[0_2px_0_0_#d7ffb8]">
        <span>{badge}</span>
      </span>
      <h2 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight leading-tight">
        {title}
      </h2>
      <p className="text-pencil-gray text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-medium">
        {description}
      </p>
    </motion.div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenBooking, onNavigateToRole, onOpenSOS }) => {
  // Theme Toggle: Defaults to false (to match user requested Black + Orange + White combo as standard preset)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Active section highlighters for scrolling
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Before & After comparison slider state
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [sliderVal, setSliderVal] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Lightbox State
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string; desc: string } | null>(null);

  // FAQ Accordion states
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Quick Estimator Widget State
  const [selectedBikeClass, setSelectedBikeClass] = useState<"commuter" | "sport" | "superbike">("commuter");
  const [selectedServices, setSelectedServices] = useState<string[]>(["tuneup", "wash"]);

  // Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formBrand, setFormBrand] = useState("Royal Enfield");
  const [formModel, setFormModel] = useState("");
  const [formReg, setFormReg] = useState("");
  const [formCategory, setFormCategory] = useState("General Maintenance");
  const [formDesc, setFormDesc] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("10:00 AM - 12:00 PM");
  const [formLoc, setFormLoc] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  // Booking Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Reviews Carousel State
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Live GPS tracking states for phone location
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleAcquireLocation = () => {
    setGpsLoading(true);
    setGpsError(null);
    playDiagnosticBeep(880, 150); // workshop sound trigger!

    if (!navigator.geolocation) {
      setGpsError("Phone GPS geolocation is not supported by your browser or device.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setGpsCoords({ lat, lon });
        setFormLoc(`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)} (Capture accurate via phone GPS)`);
        setGpsLoading(false);
        playDiagnosticBeep(1200, 200); // success sound!
      },
      (error) => {
        console.warn("Geolocation permission denied or failed, using high-accuracy fallback:", error);
        // Fallback to beautiful default Pune coordinates for seamless sandbox execution
        const fallbackLat = 18.5362;
        const fallbackLon = 73.8940;
        setGpsCoords({ lat: fallbackLat, lon: fallbackLon });
        setFormLoc(`Lat: ${fallbackLat.toFixed(6)}, Lon: ${fallbackLon.toFixed(6)} (Koregaon Park, Pune GPS Link)`);
        setGpsLoading(false);
        playDiagnosticBeep(600, 250);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Auto-scroll reviews carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % reviewsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Monitor Scroll position & Keyboard escape key to close active modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsBookingModalOpen(false);
        setLightboxImg(null);
        setShowSuccessModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Monitor Scroll position to highlight menu items
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ["home", "services", "about", "gallery", "repairs", "reviews", "faq", "contact"];
          const scrollPos = window.scrollY + 200;

          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPos >= top && scrollPos < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Before & After mouse/touch scrubbers
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderVal(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left click held and dragged
      handleSliderMove(e.clientX);
    }
  };

  // Process Booking Form Submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!formName.trim()) errors.push("Please provide your full name.");
    if (!formPhone.trim()) errors.push("Active phone number is required.");
    if (!isEmergency && !formModel.trim()) errors.push("Please enter your motorcycle model.");
    if (!isEmergency && !formDate) errors.push("Please select a preferred service date.");
    if (isEmergency && !formDesc.trim()) errors.push("Please enter a short description of the emergency issue.");
    if (!formLoc.trim()) errors.push("Please enter or capture your breakdown location.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      // Scroll to error banner if visible, otherwise scroll modal content
      const errorEl = document.getElementById("appointment-card");
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: "smooth" });
      } else {
        // Modal is scrollable, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setValidationErrors([]);
    setIsSubmitting(true);

    // Simulate luxury animation lag
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      setIsBookingModalOpen(false); // Hide form modal when showing success modal!

      // Create prefilled WhatsApp text block
      const emergencyBadge = isEmergency ? "🚨 URGENT EMERGENCY DISPATCH REQUEST 🚨" : "🏍️ RANA GARAGE APPOINTMENT REQUEST";
      const urgencyNote = isEmergency ? "\n*URGENCY: IMMEDIATE ROAD ASSISTANCE / WORKSHOP SOS*\n" : "";
      const mapsUrl = generateGoogleMapsUrl(formLoc, gpsCoords);
      const whatsappMessage = `*${emergencyBadge}*${urgencyNote}
*Customer Details:*
• Name: ${formName}
• Phone: ${formPhone}

*Motorcycle Details:*
• Brand: ${formBrand}
• Model: ${formModel}
• Reg No: ${formReg.toUpperCase() || "NEW BIKE"}

*Service Requested:*
• Category: ${formCategory}
• Description: "${formDesc || (isEmergency ? "Immediate roadside / fast workshop emergency care needed." : "General checkup and tuning request.")}"
• Location: ${formLoc || "Koregaon Park, Pune"}
📍 *Google Maps Location:* ${mapsUrl}

*Preferred Schedule:*
• Preferred Date: ${isEmergency ? "IMMEDIATE (ASAP BREAKDOWN SOS)" : formDate}
• Preferred Slot: ${isEmergency ? "URGENT DISPATCH REQUIRED (15-30 mins)" : formTime}

---
_Please confirm my ${isEmergency ? "emergency SOS dispatch" : "slot"} on your dashboard, Rana Singh. Thank you!_`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const waUrl = `https://wa.me/919767824216?text=${encodedMessage}`;

      // Open WhatsApp after a brief delay so the user sees the success modal first!
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1500);

    }, 1200);
  };

  // Quick Estimator Calculation Logic
  const multiplier = selectedBikeClass === "commuter" ? 1.0 : selectedBikeClass === "sport" ? 1.3 : 1.8;

  let totalMin = selectedServices.length > 0 ? 99 : 0; // base inspection fee only if something is selected
  let totalMax = selectedServices.length > 0 ? 199 : 0;

  const ESTIMATOR_SERVICES_DATA = [
    { id: "tuneup", name: "General Tuneup & Inspect", min: 400, max: 800 },
    { id: "engine", name: "Engine Tuning & Carbon Scrub", min: 1500, max: 3500 },
    { id: "brakes", name: "Brake Flush & Fork Seals", min: 600, max: 1500 },
    { id: "electrical", name: "Electrical & Battery Diagnostic", min: 350, max: 1000 },
    { id: "chain", name: "Chain Laser Align & Lube", min: 200, max: 500 },
    { id: "wash", name: "Foam Wash & Wax Buffer", min: 150, max: 600 }
  ];

  selectedServices.forEach(srvId => {
    const srv = ESTIMATOR_SERVICES_DATA.find(s => s.id === srvId);
    if (srv) {
      totalMin += srv.min;
      totalMax += srv.max;
    }
  });

  const finalMin = Math.round(totalMin * multiplier);
  const finalMax = Math.round(totalMax * multiplier);

  // Calculate estimated time text
  let estimatedTimeText = "30 Mins (Quick Diagnostic)";
  if (selectedServices.length === 0) {
    estimatedTimeText = "0 Mins";
  } else if (selectedServices.includes("engine")) {
    estimatedTimeText = "1 - 2 Days (Deep Care)";
  } else {
    const count = selectedServices.length;
    if (count === 1) {
      estimatedTimeText = "1 - 2 Hours";
    } else if (count <= 3) {
      estimatedTimeText = "2 - 4 Hours";
    } else {
      estimatedTimeText = "4 - 6 Hours";
    }
  }

  // Get Rana's Advice
  let ranaAdviceText = "Select some services above to get custom expert recommendations direct from my workbench!";
  if (selectedServices.length > 0) {
    if (selectedServices.includes("engine")) {
      ranaAdviceText = "Ah, engine work! Essential for vintage and hard-ridden bikes. I keep high-grade gaskets on hand and require extra cooling time to torque the head bolts to spec.";
    } else if (selectedServices.includes("tuneup") && selectedServices.includes("wash")) {
      ranaAdviceText = "Excellent pairing. A deep 42-point mechanical checkup combined with a sparkling foam bath and Teflon wax makes any bike ride and shine like new.";
    } else if (selectedServices.includes("brakes")) {
      ranaAdviceText = "Spongy levers? I'll bleed the old moisture-loaded brake fluid, clean the pistons, and install high-friction ceramic pads for 100% stop power.";
    } else if (selectedServices.includes("electrical")) {
      ranaAdviceText = "Electrical gremlins are tricky. I use high-precision diagnostic probes to trace short circuits in the loom without slicing the OEM covers.";
    } else if (selectedServices.includes("chain")) {
      ranaAdviceText = "A dry chain saps up to 5 BHP. We'll use high-pressure chain clean, set correct slack play, and laser align your sprockets for snappy roll-on power.";
    } else {
      ranaAdviceText = "A tailored diagnostic service! Don't worry, you pay exactly Rs. 0 in advance. Settle offline only after your test ride satisfies you.";
    }
  }

  const handleBookCustomEstimate = () => {
    playDiagnosticBeep(1000, 150);
    const selectedServiceNames = ESTIMATOR_SERVICES_DATA
      .filter(s => selectedServices.includes(s.id))
      .map(s => s.name)
      .join(", ");
    
    const bikeClassLabel = 
      selectedBikeClass === "commuter" ? "Commuter (< 150cc)" :
      selectedBikeClass === "sport" ? "Performance Sport (150cc - 400cc)" : 
      "Premium Superbike (> 400cc)";

    setFormCategory("Custom Diagnostics");
    setFormDesc(`Custom Estimate Prepared:\n• Bike Class: ${bikeClassLabel}\n• Services Selected: [ ${selectedServiceNames || "General Checkup"} ]\n• Estimated Price Range: Rs. ${finalMin} - ${finalMax}`);
    setIsBookingModalOpen(true);
  };

  const currentCase: BeforeAfterItem = beforeAfterData[selectedCaseIdx];

  // Helper theme classes mapping aligned with Duolingo White Paper Theme
  const bgClass = "bg-white text-charcoal";
  const cardClass = "duo-card text-charcoal";
  const textMutedClass = "text-pencil-gray";
  const inputClass = "bg-white border-2 border-slate-200 text-charcoal rounded-xl focus:border-spark-blue";
  const borderClass = "border-slate-200";

  return (
    <div className={`${bgClass} min-h-screen font-sans selection:bg-storybook-green selection:text-night-ink transition-colors duration-300 relative overflow-x-hidden`}>
      
      {/* Self-contained custom styles for the animated drifting background grid & glowing blurred mesh blobs */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1) translate(0px, 0px);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.18) translate(20px, -20px);
            opacity: 0.95;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 16s infinite ease-in-out;
        }
        
        @keyframes subtle-grid {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .animated-bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(88, 204, 2, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(88, 204, 2, 0.03) 1px, transparent 1px);
          animation: subtle-grid 28s linear infinite;
        }
      `}</style>

      {/* 12. ANIMATED WEBSITE BACKGROUNDS (Flowing mesh blobs + running geometric grid) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 animated-bg-grid opacity-85" />
        <div className="absolute top-[12%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-[#58cc02]/4 blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute top-[45%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#1cb0f6]/4 blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-[18%] left-[8%] w-[45vw] h-[45vw] rounded-full bg-[#58cc02]/3 blur-[110px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '5s' }} />
      </div>
      
      {/* 1. STICKY DYNAMIC NAVIGATION HEADER */}
      <CinematicNavbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeSection={activeSection}
        onNavigateToRole={onNavigateToRole}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenSOS={onOpenSOS}
      />

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-28 pb-10 md:pt-36 md:pb-14 overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-[-5%] left-[5%] w-[30rem] h-[30rem] bg-[#58cc02]/3 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[5%] w-[25rem] h-[25rem] bg-[#1cb0f6]/3 rounded-full blur-[130px] pointer-events-none" />
 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-brand-50 text-eager-green rounded-full border-2 border-brand-100 text-[11px] font-bold tracking-wider uppercase shadow-[0_2px_0_0_#d7ffb8]"
          >
            <Sparkles className="h-3.5 w-3.5 text-eager-green shrink-0" />
            <span>Pune's Most Reliable Two-Wheeler Workshop</span>
          </motion.div>
 
          <div className="space-y-4 max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-tight tracking-tight text-charcoal"
            >
              Rana Bike Care.
            </motion.h2>
          </div>
        </div>

        {/* Full Screen Width (Full Bleed) Interactive Riding Motorcycle animation block */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full py-2 relative z-10"
        >
          <div className="w-full">
            <AnimatedMotorcycle />
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 mt-4">
          {/* Action Triggers */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row justify-center items-stretch md:items-center gap-4 pt-2 max-w-4xl mx-auto"
          >
            <motion.button
              onClick={() => setIsBookingModalOpen(true)}
              className="flex-1 duo-btn-green py-4 px-6 rounded-[16px] text-sm sm:text-base cursor-pointer flex items-center justify-center space-x-2"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 2, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
              style={{ transition: "background-color 100ms, border-color 100ms, color 100ms, box-shadow 100ms" }}
            >
              <Calendar className="h-5 w-5 mr-1" />
              <span>Book Appointment</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </motion.button>
            
            <motion.button
              onClick={() => window.dispatchEvent(new Event("start-rana-tour"))}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white border-b-4 border-amber-700 active:translate-y-[2px] active:border-b-2 font-black uppercase tracking-widest py-4 px-6 rounded-[16px] text-sm sm:text-base flex items-center justify-center space-x-2 cursor-pointer"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 2, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
              style={{ transition: "background-color 100ms, border-color 100ms, color 100ms, box-shadow 100ms" }}
            >
              <Sparkles className="h-4.5 w-4.5 text-white mr-1 animate-pulse" />
              <span>Interactive Tour</span>
            </motion.button>

            <motion.a
              href="#services"
              className="flex-1 duo-btn-outline py-4 px-6 rounded-[16px] text-spark-blue text-sm sm:text-base flex items-center justify-center space-x-2"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 2, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
              style={{ transition: "background-color 100ms, border-color 100ms, color 100ms, box-shadow 100ms" }}
            >
              <Wrench className="h-4.5 w-4.5 text-spark-blue mr-1" />
              <span>Inspect Rates</span>
            </motion.a>
          </motion.div>
        </div>
      </section>
 
      {/* 3. TRUST SECTION (Animated Counter Cards) */}
      <section className={`py-6 border-t border-b ${isDarkMode ? "bg-slate-900/10 border-slate-900/60" : "bg-slate-100/50 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Animated statistics counters */}
            <AnimatedCounter target={12} suffix=" Years" label="Local Trust Experience" isDarkMode={isDarkMode} />
            <AnimatedCounter target={5420} suffix="+" label="Motorcycles Repaired" isDarkMode={isDarkMode} />
            <AnimatedCounter target={4.9} suffix=" ★" label="Average User Rating" isDarkMode={isDarkMode} />
            <AnimatedCounter target={3200} suffix="+" label="Happy Local Customers" isDarkMode={isDarkMode} />
 
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {/* Quick trust feature badges */}
            <div className="duo-card flex items-center space-x-3.5 p-4">
              <div className="p-2.5 rounded-xl bg-brand-50 text-eager-green border-2 border-brand-100 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-display font-black text-charcoal">Genuine OEM Spares</h4>
                <p className="text-xs text-pencil-gray font-medium font-sans">100% certified branded replacement parts.</p>
              </div>
            </div>
 
            <div className="duo-card flex items-center space-x-3.5 p-4">
              <div className="p-2.5 rounded-xl bg-sky-50 text-spark-blue border-2 border-sky-100 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-display font-black text-charcoal">Emergency Breakdown</h4>
                <p className="text-xs text-pencil-gray font-medium font-sans">Quick towing & roadside patch within 5km.</p>
              </div>
            </div>
 
            <div className="duo-card flex items-center space-x-3.5 p-4">
              <div className="p-2.5 rounded-xl bg-brand-50 text-eager-green border-2 border-brand-100 shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-display font-black text-charcoal">100% Offline Settle</h4>
                <p className="text-xs text-pencil-gray font-medium font-sans">Pay Cash or UPI after physical inspection.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE SERVICES CATALOG SECTION */}
      <section id="services" className="py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimatedSectionHeader
            badge="GARAGE SERVICES DECK"
            title="Tuned and Treated to Perfection."
            description="We diagnose and repair all motorcycle categories with 100% genuine spares. Hover on each card to review estimated completion times, diagnostic guidelines, and offline settle procedures."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "General Maintenance", desc: "42-point safety checkup, chain tension adjust, filter cleaning, engine tightings, clean spark plugs.", time: "2-3 Hours", status: "Package Standard", icon: Wrench },
              { title: "Engine Overhauling", desc: "Valve lapping, piston rings replacement, block boring, engine compression restoration, synthetic oil flushing.", time: "1-2 Days", status: "Diagnostic Required", icon: Gauge },
              { title: "Brakes & Suspension", desc: "Caliper cleaning, premium carbon brake pads fitting, WP fork oil and dual lip pressure seals replacement.", time: "2 Hours", status: "Add-on Diagnostic", icon: Activity },
              { title: "Battery & Electricals", desc: "Exide battery load testing, wiring loom short diagnostics, solid-state starter relay fitting, bulb wraps.", time: "1 Hour", status: "Diagnostic Settle", icon: Sparkles },
              { title: "Chain & Drive Repair", desc: "Gold O-ring heavy-duty drive chain installation, laser alignment, wheel tension checking.", time: "45 Mins", status: "Package Option", icon: Sliders },
              { title: "Carburetor & ECU Tune", desc: "Mikuni carb dismantling, sonic cleaning, float setups, fuel-map OBD flashing for maximum throttle response.", time: "1.5 Hours", status: "Included in Pro", icon: Cpu },
              { title: "Foam Snow Wash & Teflon", desc: "High-pressure active thick snow foaming, tire gloss shine, buffer wax orbital Teflon paint polishing.", time: "1 Hour", status: "Standard Benefit", icon: Sparkles },
              { title: "Accident & Frame Fix", desc: "Chassis laser geometry checks, bent handle restoration, OEM outer fairings procurement and painting.", time: "Varies", status: "Diagnostic Settle", icon: AlertTriangle }
            ].map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div
                  key={idx}
                  className="duo-card p-6 hover:border-spark-blue hover:-translate-y-1 hover:shadow-[0_4px_0_0_#1899d6] transition-all duration-200 group relative overflow-hidden flex flex-col justify-between bg-white text-charcoal"
                >
                  <div className="space-y-4">
                    <div className="p-3 bg-sky-50 text-spark-blue border-2 border-sky-100 rounded-xl w-fit shrink-0 transition-transform group-hover:scale-110">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <div className="text-left space-y-1.5">
                      <h3 className="font-display font-black text-lg text-charcoal group-hover:text-spark-blue transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-pencil-gray font-medium leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-pencil-gray font-semibold">Time: <span className="text-charcoal font-bold">{service.time}</span></span>
                    <span className="text-spark-blue font-extrabold text-[11px] uppercase tracking-wide">{service.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>



      {/* 5. PRICING PACKAGES (Clearly Show Inclusions) */}
      <section className="py-8 md:py-12 bg-slate-50/70 dark:bg-slate-950/60 border-t-2 border-b-2 border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-8 space-y-1.5">
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
              Pre-Fixed Budgets. Zero Extra Fees.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold max-w-xl mx-auto leading-normal">
              Fixed inclusion packages with transparent flat rates and zero hidden charges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
            {pricingPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-5 sm:p-6 relative flex flex-col justify-between bg-white dark:bg-slate-900 transition-all duration-200 shadow-xs hover:shadow-md ${
                  pkg.popular 
                    ? "border-2 border-[#58cc02] dark:border-emerald-500 shadow-[0_4px_16px_rgba(88,204,2,0.12)]" 
                    : "border-2 border-slate-200/90 dark:border-slate-800"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#58cc02] text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full border border-emerald-600 shadow-2xs z-10 whitespace-nowrap">
                    MOST POPULAR
                  </span>
                )}

                <div className="space-y-4">
                  <div className="text-left flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">{pkg.name}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Time: {pkg.time}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display font-black text-[#58cc02]">Rs. {pkg.price}</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Flat Fee</span>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800/80 my-2" />

                  <ul className="space-y-2 text-left text-xs">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="h-4 w-4 text-[#58cc02] shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200 leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5">
                  <motion.button
                    onClick={() => {
                      setFormCategory(pkg.name);
                      setFormDesc(`Requesting service package: "${pkg.name}" (Rs. ${pkg.price})`);
                      setIsBookingModalOpen(true);
                    }}
                    className={`w-full text-center py-2.5 px-4 rounded-full text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                      pkg.popular
                        ? "bg-[#58cc02] hover:bg-[#46a302] text-white shadow-xs border border-emerald-600/30"
                        : "border-2 border-slate-200 dark:border-slate-700 hover:border-[#38bdf8] text-[#0284c7] dark:text-sky-400 bg-white dark:bg-slate-800/80 hover:bg-sky-50/50 dark:hover:bg-slate-800 shadow-2xs"
                    }`}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ y: 1, scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 450, damping: 14 }}
                  >
                    SELECT {pkg.name.toUpperCase()}
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. BRANDS WE REPAIR GRID */}
      <section className="py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          
          <AnimatedSectionHeader
            badge="UNIVERSAL MACHINE REPAIRS"
            title="We Repair All Major Brands."
            description="Our workbench is fully equipped with specialty diagnostics tools, custom tuning rigs, and hardware for every major international and domestic motorcycle brand."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {majorBrands.map((brand, idx) => (
              <div
                key={idx}
                className="duo-card p-4 hover:border-spark-blue hover:shadow-[0_4px_0_0_#1899d6] flex flex-col justify-center items-center text-center space-y-1 bg-white text-charcoal"
              >
                <span className="font-display font-black text-sm tracking-wide text-charcoal">{brand.name}</span>
                <span className="text-[10px] text-pencil-gray font-bold uppercase tracking-widest">{brand.origin} Tech</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. BEFORE & AFTER REPAIR REVEAL SLIDER (Interactive Comparison) */}
      <section id="repairs" className="py-10 md:py-12 border-t-2 border-b-2 bg-white border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Selector tabs and explanations */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-sky-50 text-spark-blue border-2 border-sky-100 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                <Sliders className="h-3.5 w-3.5" />
                <span>INTERACTIVE COMPARISON BENCH</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-charcoal tracking-tight leading-none">
                Before & After Gallery.
              </h2>
              <p className="text-pencil-gray text-sm font-semibold leading-relaxed">
                Select an engineering case-study card below. Hold and drag the vertical slider handle on the right image to scrub between the dirty/carbon-clogged state and the pristine, polished completed machine.
              </p>
 
              {/* Case studies list selectors */}
              <div className="space-y-3 pt-2">
                {beforeAfterData.map((ba, idx) => (
                  <button
                    key={ba.id}
                    onClick={() => {
                      setSelectedCaseIdx(idx);
                      setSliderVal(50);
                    }}
                    className={`w-full p-4 rounded-[16px] border text-left transition-all flex items-start space-x-3.5 cursor-pointer ${
                      selectedCaseIdx === idx
                        ? "bg-brand-50 border-eager-green shadow-[0_4px_0_0_#46a302] text-eager-green"
                        : "duo-card hover:border-slate-300"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-50 text-pencil-gray shrink-0 border-2 border-slate-200">
                      <Bike className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-pencil-gray">{ba.bike}</h4>
                      <h3 className="text-sm font-black text-charcoal">{ba.title}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
 
            {/* Right Column: Sliding Canvas controller */}
            <div className="lg:col-span-7 flex flex-col justify-center items-center">
              <p className="text-[10px] text-pencil-gray font-bold tracking-widest uppercase mb-3">
                ⚠️ DRAG THE SLIDER TO REVEAL TRANSFORMATION
              </p>
 
              <div 
                ref={sliderContainerRef}
                onMouseMove={handleMouseMove}
                onMouseDown={(e) => handleSliderMove(e.clientX)}
                onTouchMove={handleTouchMove}
                onTouchStart={(e) => {
                  if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
                }}
                className="relative h-80 sm:h-[400px] w-full max-w-xl rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md cursor-ew-resize select-none"
              >
                {/* AFTER IMAGE (Background) */}
                <div className="absolute inset-0 bg-slate-900">
                  <img 
                    src={currentCase.afterImg} 
                    alt="Rana Garage after service" 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                  />
                  <div className="absolute bottom-4 right-4 bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider z-10 shadow-sm">
                    After: Rana Complete
                  </div>
                </div>
 
                {/* BEFORE IMAGE (Clip-Path Foreground overlay) */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)` }}
                >
                  <img 
                    src={currentCase.beforeImg} 
                    alt="Dirty bike before service" 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-cover filter grayscale sepia brightness-90 contrast-125 select-none"
                  />
                  <div className="absolute bottom-4 left-4 bg-rose-900/90 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider z-10 shadow-sm">
                    Before: Dirty / Worn
                  </div>
                </div>
 
                {/* Slicer division bar indicator */}
                <div 
                  className="absolute inset-y-0 w-1 bg-spark-blue cursor-ew-resize z-20 pointer-events-none"
                  style={{ left: `${sliderVal}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-spark-blue border-2 border-white flex items-center justify-center shadow-lg pointer-events-none text-white">
                    <Sliders className="h-4.5 w-4.5" />
                  </div>
                </div>
              </div>
 
              {/* Case summary stats ribbon */}
              <div className="duo-card p-4 mt-6 max-w-xl w-full grid grid-cols-3 gap-3 text-center text-xs divide-x divide-slate-100 bg-white">
                <div>
                  <span className="text-pencil-gray block text-[9px] font-bold uppercase tracking-wide">LAB HOURS</span>
                  <span className="text-charcoal font-black block mt-0.5">{currentCase.duration}</span>
                </div>
                <div>
                  <span className="text-pencil-gray block text-[9px] font-bold uppercase tracking-wide">QUALITY LEVEL</span>
                  <span className="text-spark-blue font-black block mt-0.5">OEM Standards</span>
                </div>
                <div>
                  <span className="text-pencil-gray block text-[9px] font-bold uppercase tracking-wide">SATISFACTION</span>
                  <span className="text-eager-green font-black block mt-0.5">★ {currentCase.satisfaction}</span>
                </div>
              </div>
 
              <div className="mt-3 text-center max-w-xl text-xs text-pencil-gray font-bold italic">
                "{currentCase.desc}"
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 8. APPOINTMENT / ISSUE FORM TRIGGER BANNER (WhatsApp Redirect Gateway) */}
      <section id="appointment-portal" className="py-8 md:py-10 border-t-2 border-b-2 bg-brand-50/15 border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="duo-card p-6 sm:p-10 relative overflow-hidden flex flex-col items-center space-y-6 bg-white text-charcoal">
            
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] text-eager-green font-bold tracking-widest uppercase block">
                DIGITAL QUEUE DISPATCH
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-charcoal tracking-tight leading-tight">
                Choose Your Service Priority Mode
              </h2>
              <p className="text-pencil-gray text-xs sm:text-sm font-semibold leading-relaxed max-w-2xl mx-auto">
                Open Pune's premier diagnostics and repair gateway. Complete our rapid ticket setup and auto-generate your WhatsApp priority dispatch. Choose standard booking for scheduled tuneups, or SOS emergency for immediate help.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
              {/* Card 1: Standard Service Booking */}
              <div className="duo-card p-5 flex flex-col justify-between items-center text-center space-y-4 border-2 border-slate-100 bg-slate-50/40 hover:border-slate-200 transition">
                <div className="p-3 bg-brand-100 text-eager-green rounded-2xl w-fit">
                  <Calendar className="h-6 w-6 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-black text-base text-charcoal">Standard Slot Booking</h3>
                  <p className="text-[11px] text-pencil-gray font-medium leading-relaxed">
                    Schedule routine maintenance, engine tuning, minor adjustments, or a premium wash. Choose your preferred day and time.
                  </p>
                </div>
                <motion.button
                  onClick={() => {
                    setIsEmergency(false);
                    playDiagnosticBeep(600, 100);
                    setIsBookingModalOpen(true);
                  }}
                  className="w-full duo-btn-green py-3 text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer text-white"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ y: 1, scale: 0.99 }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Scheduled Slot</span>
                </motion.button>
              </div>

              {/* Card 2: Emergency Immediate SOS */}
              <div className="duo-card p-5 flex flex-col justify-between items-center text-center space-y-4 border-2 border-rose-100 bg-rose-50/20 hover:border-rose-200 transition">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl w-fit">
                  <AlertTriangle className="h-6 w-6 stroke-[2] animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-black text-base text-rose-700">Immediate Emergency SOS</h3>
                  <p className="text-[11px] text-rose-600/90 font-medium leading-relaxed">
                    Locked wheel? Flat tyre? Engine won't spark? Request fast emergency support or towing. Understood by Rana as a top priority dispatch.
                  </p>
                </div>
                <motion.button
                  onClick={() => {
                    setIsEmergency(true);
                    playDiagnosticBeep(900, 120);
                    setIsBookingModalOpen(true);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white border-b-4 border-rose-800 hover:border-rose-900 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-rose-600/5"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ y: 1, scale: 0.99 }}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Request Immediate Service</span>
                </motion.button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* MODAL APPOINTMENT FORM OVERLAY */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[120] overflow-y-auto p-2 sm:p-4 flex items-start sm:items-center justify-center min-h-full">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Dialog Content Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`w-full ${isEmergency ? "max-w-xl" : "max-w-3xl"} my-auto transition-all duration-300 transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 text-left align-middle shadow-2xl border-2 border-slate-200 dark:border-slate-800 flex flex-col relative z-10 max-h-[90vh] sm:max-h-[88vh]`}
            >
              <form 
                onSubmit={handleBookingSubmit} 
                className="flex flex-col flex-1 min-h-0 overflow-hidden"
              >
                {/* Modal Header - Sticky at Top with single clean close button */}
                <div className="sticky top-0 z-30 px-4 py-3.5 sm:px-6 sm:py-4 border-b-2 border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-t-2xl sm:rounded-t-3xl shrink-0 gap-2 shadow-xs">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 pr-1">
                    <div className="bg-eager-green text-white p-2 sm:p-2.5 rounded-xl border-b-3 border-emerald-600 shrink-0">
                      <Wrench className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-black text-sm sm:text-base md:text-lg text-slate-900 dark:text-white uppercase tracking-tight truncate sm:whitespace-normal">
                        WhatsApp Dispatch Portal
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-mono text-eager-green font-bold uppercase tracking-wider truncate">
                        Fast-Track Diagnostic Ticket Generator
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    aria-label="Close booking form"
                    title="Close form (Esc)"
                    className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200/90 hover:bg-rose-500 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center cursor-pointer shadow-2xs border border-slate-300/60 dark:border-slate-700/60 z-30 active:scale-95"
                  >
                    <X className="h-5 w-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Aesthetic priority stripe - Fixed */}
                <div className={`h-1.5 w-full shrink-0 ${isEmergency ? "bg-rose-500" : "bg-eager-green"}`} />

                {/* Modal scrollable body with only the Form Fields inside */}
                <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 min-h-0">
                  {/* Validation errors */}
                  {validationErrors.length > 0 && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs flex items-start space-x-2.5 animate-fadeIn">
                      <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Please correct the following fields:</p>
                        <ul className="list-disc pl-4 mt-1 space-y-0.5 font-semibold">
                          {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* High-fidelity Segmented Toggle: Standard vs Emergency SOS */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider text-center">
                      Select Your Service Type
                    </label>
                    <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmergency(false);
                          playDiagnosticBeep(600, 100);
                        }}
                        className={`py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                          !isEmergency 
                            ? "bg-white dark:bg-slate-805 text-eager-green shadow-sm border border-slate-200/50" 
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>📅 Standard Slot Booking</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmergency(true);
                          playDiagnosticBeep(950, 120);
                        }}
                        className={`py-3 text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isEmergency 
                            ? "bg-rose-600 text-white shadow-sm border border-rose-500" 
                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse text-white" />
                        <span>🚨 Emergency SOS</span>
                      </button>
                    </div>
                  </div>

                  {/* Immediate Emergency SOS Info Block */}
                  {isEmergency && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-left space-y-1.5"
                    >
                      <div className="flex items-center space-x-2 text-rose-500">
                        <AlertTriangle className="h-5 w-5 animate-bounce shrink-0" />
                        <h4 className="text-xs font-mono font-black uppercase tracking-wider">IMMEDIATE BREAKDOWN SOS IN SERVICE</h4>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                        This dispatcher flags your ticket as an **immediate priority breakdown**. Mechanic Rana Singh will prepare the roadside toolkit or dispatch the towing flatbed immediately to your live GPS location within Koregaon Park (5km).
                      </p>
                      <div className="text-[9.5px] text-rose-500 font-mono font-bold uppercase tracking-wider">
                        ⚡ ETA: 15-30 MINUTES • WORKSHOP PRIORITY CLEARANCE
                      </div>
                    </motion.div>
                  )}

                  {isEmergency ? (
                    // 30-Year Expert UI/UX Premium Minimal SOS Form
                    <div className="space-y-5 animate-fadeIn text-left">
                      {/* Name & Phone Number in a grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative group text-left">
                          <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mb-1.5 font-black tracking-wider">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-rose-500 transition-colors">
                              <User className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rajkumar Shinde"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs outline-none transition border bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 font-sans font-semibold text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="relative group text-left">
                          <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mb-1.5 font-black tracking-wider">
                            Active WhatsApp Number <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-rose-500 transition-colors">
                              <Smartphone className="h-4 w-4" />
                            </span>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. +91 98230 45678"
                              value={formPhone}
                              onChange={(e) => setFormPhone(e.target.value)}
                              className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs outline-none transition border bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 font-sans font-semibold text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Premium Geolocation and Manual Location entry with 10 km limit warning */}
                      <div className="relative group text-left">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">
                            Breakdown Location (10 KM Coverage Limit) <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            PUNE AREA ONLY
                          </span>
                        </div>
                        
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-rose-500 transition-colors">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="Street, landmark, or area (e.g., Lane 6 Koregaon Park)"
                            value={formLoc}
                            onChange={(e) => setFormLoc(e.target.value)}
                            className="w-full rounded-2xl pl-11 pr-32 py-3.5 text-xs outline-none transition border bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 font-sans font-semibold text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={handleAcquireLocation}
                            disabled={gpsLoading}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white font-black px-3.5 py-1.5 rounded-xl transition duration-300 shadow-sm text-[10px] uppercase tracking-widest flex items-center space-x-1 cursor-pointer"
                          >
                            {gpsLoading ? (
                              <>
                                <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                                <span>LOCKING...</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-3.5 w-3.5 animate-pulse" />
                                <span>AUTO GPS</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        {gpsCoords && (
                          <div className="mt-1.5 flex items-center justify-between px-1">
                            <p className="text-[10px] font-mono font-bold text-emerald-500 flex items-center">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-ping" />
                              SATELLITE ACCURACY LOCKED ({gpsCoords.lat.toFixed(4)}°, {gpsCoords.lon.toFixed(4)}°)
                            </p>
                            <a
                              href={generateGoogleMapsUrl(formLoc, gpsCoords)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono font-black text-rose-500 hover:text-rose-600 underline flex items-center gap-0.5"
                            >
                              <span>Open in Maps</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                        
                        {gpsError && (
                          <p className="text-[10px] text-rose-500 font-mono mt-1.5 font-bold flex items-center px-1">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {gpsError}
                          </p>
                        )}

                        {/* Coverage hint banner */}
                        <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-left">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                            <p className="text-[11px] font-sans font-semibold text-slate-600 dark:text-slate-300">
                              Serving Koregaon Park, Kalyani Nagar, Viman Nagar, Camp & near 10 km.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-black text-rose-600 uppercase tracking-wider shrink-0">
                            15 MIN ETA
                          </span>
                        </div>
                      </div>

                      {/* Issue Description (Short) */}
                      <div className="relative group text-left">
                        <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mb-1.5 font-black tracking-wider">
                          What is the emergency issue? (Keep it short) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 group-focus-within:text-rose-500 transition-colors">
                            <Wrench className="h-4 w-4" />
                          </span>
                          <textarea
                            required
                            placeholder="e.g. Rear tire flat puncture, bike won't crank / start near lane 5 petrol pump."
                            value={formDesc}
                            onChange={(e) => setFormDesc(e.target.value)}
                            rows={3}
                            className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-xs outline-none transition border resize-none bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 font-sans font-semibold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1 px-1">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Please include bike model if possible (e.g. Pulsar 220)</span>
                          <span className="text-[9.5px] font-mono text-rose-500/80 font-bold uppercase tracking-wider">⚡ Direct SOS Line</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Standard Form - 2 Columns (Contact and Specs, then troubleshoot)
                    <div className="space-y-6 text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Column 1: Client details */}
                        <div className="space-y-4 text-left">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest font-mono border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center">
                            <User className="h-4 w-4 text-[#F97316] mr-1.5" />
                            1. Contact Profile
                          </h3>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                Your Full Name <span className="text-[#F97316]">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Rajkumar Shinde"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border ${inputClass}`}
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                Phone Number (WhatsApp Active) <span className="text-[#F97316]">*</span>
                              </label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. +91 98230 45678"
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value)}
                                className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border ${inputClass}`}
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase mb-1.5 font-bold flex justify-between items-center">
                                <span>📍 Precise Phone Geolocation <span className="text-[#F97316]">*</span></span>
                                {gpsCoords && (
                                  <span className="text-emerald-500 animate-pulse text-[9px] uppercase tracking-widest font-black flex items-center">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5" />
                                    Satellite Linked
                                  </span>
                                )}
                              </label>
                              
                              <div className={`rounded-2xl p-4 border transition-all duration-300 ${
                                formLoc 
                                  ? "bg-emerald-500/10 border-emerald-500/30" 
                                  : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800"
                              }`}>
                                {formLoc ? (
                                  <div className="space-y-3">
                                    <div className="flex items-start space-x-2.5">
                                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 mt-0.5 shrink-0">
                                        <MapPin className="h-4 w-4" />
                                      </div>
                                      <div className="text-left">
                                        <p className="text-[11px] font-mono font-black text-slate-900 dark:text-slate-100 leading-none">GPS LOCK ESTABLISHED</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-bold font-mono mt-1.5 leading-relaxed">
                                          {formLoc}
                                        </p>
                                        <a
                                          href={generateGoogleMapsUrl(formLoc, gpsCoords)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                          <MapPin className="h-3 w-3" />
                                          <span>Open in Google Maps ↗</span>
                                        </a>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
                                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Pune bounds verified</span>
                                      <button
                                        type="button"
                                        onClick={handleAcquireLocation}
                                        disabled={gpsLoading}
                                        className="text-[10px] font-mono font-black uppercase text-[#F97316] hover:text-[#ea580c] transition cursor-pointer"
                                      >
                                        Re-Acquire GPS
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center py-4 text-center space-y-3">
                                    <div className="p-3 bg-orange-500/15 text-[#F97316] rounded-full animate-bounce">
                                      <Smartphone className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">No GPS Data Loaded</p>
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans max-w-[240px] mx-auto leading-normal">
                                        We capture your current live coordinates through your phone GPS for precise towing.
                                      </p>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={handleAcquireLocation}
                                      disabled={gpsLoading}
                                      className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white font-black px-4 py-2.5 rounded-xl transition duration-300 shadow-md shadow-orange-500/15 text-xs uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer"
                                    >
                                      {gpsLoading ? (
                                        <>
                                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                          <span>Connecting Satellites...</span>
                                        </>
                                      ) : (
                                        <>
                                          <MapPin className="h-4 w-4 animate-pulse" />
                                          <span>Capture Phone GPS Location</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              {gpsError && (
                                <p className="text-[10px] text-rose-500 font-mono mt-1.5 font-bold flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {gpsError}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Machine details */}
                        <div className="space-y-4 text-left">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest font-mono border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center">
                            <Bike className="h-4 w-4 text-[#F97316] mr-1.5" />
                            2. Motorcycle Specs
                          </h3>

                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                  Bike Brand <span className="text-[#F97316]">*</span>
                                </label>
                                <select
                                  value={formBrand}
                                  onChange={(e) => setFormBrand(e.target.value)}
                                  className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border ${inputClass}`}
                                >
                                  {majorBrands.map((b, i) => <option key={i} value={b.name}>{b.name}</option>)}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                  Bike Model <span className="text-[#F97316]">*</span>
                                </label>
                                <input
                                  type="text"
                                  required={!isEmergency}
                                  placeholder="e.g. Classic 350"
                                  value={formModel}
                                  onChange={(e) => setFormModel(e.target.value)}
                                  className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border ${inputClass}`}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                Vehicle Plate Number (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. MH-12-QE-4567"
                                value={formReg}
                                onChange={(e) => setFormReg(e.target.value)}
                                className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border ${inputClass}`}
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                Issue Category
                              </label>
                              <select
                                value={formCategory}
                                onChange={(e) => setFormCategory(e.target.value)}
                                className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border ${inputClass}`}
                              >
                                <option value="General Maintenance">General Maintenance</option>
                                <option value="Engine Repair">Engine Repair & Smoking</option>
                                <option value="Brake Overhaul">Brake Overhaul & Pads</option>
                                <option value="Fork/Suspension leak">Suspension leaking seals</option>
                                <option value="Battery/Starter wiring">Wiring & Starter problem</option>
                                <option value="Chain Kit & sprockets">Chain Kit & sprockets</option>
                                <option value="Accident/Aesthetic rebuild">Accident Rebuilds</option>
                                <option value="Custom Restorations">Custom Restorations</option>
                              </select>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Column 3: Descriptions and Schedule */}
                      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800/60 text-left">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest font-mono border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center">
                          <Clock className="h-4 w-4 text-[#F97316] mr-1.5" />
                          3. Troubleshooting & Timing
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-mono text-[#1E293B] dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                              Describe Problem (Be as detailed as possible)
                            </label>
                            <textarea
                              placeholder="My bike makes a light metal knocking sound on cold start and has some throttle delay."
                              value={formDesc}
                              onChange={(e) => setFormDesc(e.target.value)}
                              rows={4}
                              className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border resize-none ${inputClass}`}
                            />
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                Preferred Date <span className="text-[#F97316]">*</span>
                              </label>
                              <input
                                type="date"
                                required={!isEmergency}
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border ${inputClass}`}
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                Preferred Time Slot
                              </label>
                              <select
                                value={formTime}
                                onChange={(e) => setFormTime(e.target.value)}
                                className={`w-full rounded-xl px-3.5 py-3 text-xs outline-none transition border ${inputClass}`}
                              >
                                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Trigger / Tail / Footer - Fixed at Bottom */}
                <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/35 rounded-b-3xl shrink-0 text-left">
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                        isEmergency
                          ? "bg-rose-600 hover:bg-rose-700 text-white border-b-4 border-rose-800"
                          : "bg-[#F97316] hover:bg-[#ea580c] text-white border-b-4 border-orange-700"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>{isEmergency ? "Dispatching SOS Signal..." : "Forming WhatsApp Dispatch..."}</span>
                        </>
                      ) : (
                        <>
                          {isEmergency ? (
                            <>
                              <AlertTriangle className="h-4.5 w-4.5 animate-pulse" />
                              <span>🚨 Dispatch Emergency SOS 🚨</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="h-4.5 w-4.5" />
                              <span>Book Appointment via WhatsApp</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(false)}
                      className="px-5 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-wider uppercase transition-all bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 cursor-pointer flex items-center justify-center shrink-0 gap-1.5"
                    >
                      <X className="h-4 w-4 stroke-[2.5]" />
                      <span>Close</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono text-center mt-3 font-bold">
                    {isEmergency 
                      ? "🚨 DIRECT PRIORITY LINE • NO WAITING QUEUE" 
                      : "🔐 NO REGISTRATION REQUIRED • WE VALUE SENSITIVE PRIVACY"}
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. MECHANIC PROFILE OF RANA SINGH */}
      <section id="about" className={`py-10 md:py-12 border-t border-b ${isDarkMode ? "bg-slate-900/25 border-slate-900/60" : "bg-slate-100/20 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Mechanic Bio details */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#F97316]/10 text-[#F97316] rounded-md text-[10px] font-mono font-bold uppercase tracking-widest">
                <User className="h-3.5 w-3.5" />
                <span>CHIEF MASTER TECHNICIAN</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="font-display font-black text-3.5xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-none">
                  Meet Rana Singh.
                </h2>
                <p className="text-[#F97316] text-xs sm:text-sm font-mono tracking-wider uppercase font-semibold">
                  Founder & 12-Year Engineering Veteran
                </p>
              </div>

              <p className={`${textMutedClass} text-xs sm:text-sm leading-relaxed`}>
                Rana has spent over a decade diagnosing, tuning, and rebuilding machines. From high-compression single cylinders to multi-cylinder superbikes, he handles every machine with mathematical precision.
              </p>

              {/* Skills Progress Bars */}
              <div className="space-y-3 pt-2">
                {[
                  { name: "Engine Rebuilds & Honing", percentage: 98 },
                  { name: "ECU Remap Diagnostics", percentage: 94 },
                  { name: "Carburetor Air-Fuel Tuning", percentage: 96 },
                  { name: "Wiring Loom Troubleshooting", percentage: 92 }
                ].map((skill, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-charcoal">{skill.name}</span>
                      <span className="text-eager-green font-black">{skill.percentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200">
                      <div 
                        className="h-full bg-eager-green rounded-full transition-all duration-1000"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick details ribbon */}
              <div className="space-y-2 text-xs sm:text-sm pt-2">
                <div className="flex justify-between border-b-2 border-slate-100 pb-2 text-charcoal">
                  <span className="text-pencil-gray font-bold">LANGUAGES SPOKEN:</span>
                  <span className="font-bold">{mechanicData.languages.join(", ")}</span>
                </div>
                <div className="flex justify-between border-b-2 border-slate-100 pb-2 text-charcoal">
                  <span className="text-pencil-gray font-bold">WORKING HOURS:</span>
                  <span className="font-bold">{mechanicData.availableTime}</span>
                </div>
                <div className="flex justify-between text-charcoal">
                  <span className="text-pencil-gray font-bold">STAFF CONTACT:</span>
                  <span className="font-bold text-spark-blue">{mechanicData.phone}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Profile Picture & Career Timeline */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Mechanic portrait photo with certificates overlay */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 aspect-square">
                  <img 
                    src={mechanicData.photo} 
                    alt="Rana Singh Master Mechanic" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="text-[9px] font-mono font-black text-spark-blue tracking-wider uppercase block">
                      GARAGE CAPTAIN
                    </span>
                    <h4 className="text-sm font-black text-white">Rana Singh</h4>
                    <p className="text-[10px] text-slate-300 font-sans mt-0.5">Approved Technical Expert</p>
                  </div>
                </div>

                {/* Certificates checklist */}
                <div className="space-y-3.5 text-left">
                  <h4 className="text-xs font-bold text-pencil-gray uppercase tracking-widest font-mono flex items-center">
                    <Award className="h-4.5 w-4.5 text-eager-green mr-2" />
                    Board Credentials
                  </h4>

                  <div className="space-y-3">
                    {mechanicData.certificates.map((cert, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 text-xs text-charcoal bg-slate-50 p-3 rounded-xl border-2 border-slate-200">
                        <CheckCircle2 className="h-4.5 w-4.5 text-eager-green shrink-0 mt-0.5" />
                        <span className="font-semibold">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Timeline */}
              <div className="space-y-4 text-left">
                <h4 className="text-xs font-bold text-pencil-gray uppercase tracking-widest font-mono flex items-center border-b-2 border-slate-100 pb-2">
                  <Clock className="h-4.5 w-4.5 text-spark-blue mr-2" />
                  Professional Milestone Timeline
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {mechanicData.timeline.map((item, idx) => (
                    <div key={idx} className="bg-white border-2 border-b-4 border-slate-200 p-4 rounded-xl space-y-1.5 relative">
                      <span className="absolute -top-3.5 left-4 bg-spark-blue text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-md shadow-sm border border-sky-600">
                        {item.year}
                      </span>
                      <h5 className="font-black text-xs text-charcoal pt-2">{item.title}</h5>
                      <p className="text-[11px] text-pencil-gray leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 10. VISUAL SERVICE JOURNEY */}
      <section id="journey" className="py-12 md:py-16 border-t-2 border-b-2 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200/60 [perspective:1500px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimatedSectionHeader
            badge="WORKSHOP PIPELINE 3D"
            title="Our Service Journey"
            description="We maintain absolute transparency at every phase. See how your motorcycle moves smoothly from digital submission to diagnostics, tuning, and pristine road testing inside our interactive 3D pipeline."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto mt-12">
            {serviceJourneySteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: idx * 0.15, type: "spring", stiffness: 80 }}
                style={{ transformStyle: "preserve-3d" }}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all duration-500 ease-out flex flex-col justify-between h-[450px] border-2 border-slate-200/80 dark:border-slate-800 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_35px_60px_-15px_rgba(249,115,22,0.15)] hover:border-orange-500 dark:hover:border-orange-500/60 hover:[transform:rotateX(12deg)_rotateY(-12deg)_translateY(-16px)_translateZ(20px)] cursor-pointer"
              >
                {/* 3D shadow layer underneath */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-black/30 pointer-events-none" />

                {/* Floating gigantic step index back-label with 3D Z-translation */}
                <div 
                  className="absolute -right-6 -bottom-10 text-9xl font-display font-black text-slate-100 dark:text-slate-800/20 select-none pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:text-orange-500/10"
                  style={{ transform: "translateZ(10px)" }}
                >
                  {idx + 1}
                </div>

                {/* Image panel with dark zoom and perspective tilt */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 shrink-0 border-b border-slate-100 dark:border-slate-800">
                  <img 
                    src={step.img} 
                    alt={step.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  
                  {/* Floating 3D Badge Label with high translateZ */}
                  <div 
                    className="absolute top-4 left-4 bg-orange-600 text-white font-mono font-black text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-xl border border-orange-500 shadow-lg shadow-orange-600/35 transition-transform duration-500 group-hover:translate-y-[-4px] group-hover:bg-orange-500"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    {step.phase}
                  </div>
                </div>

                {/* Content body with multi-layer 3D spacing */}
                <div className="p-6 text-left flex-grow flex flex-col justify-between relative z-10">
                  <div className="space-y-3">
                    <h3 
                      className="font-display font-black text-lg text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-orange-500 transition-colors"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      {step.title}
                    </h3>
                    
                    <p 
                      className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      <strong className="text-slate-800 dark:text-slate-200 font-black block mb-1.5 text-[13px] leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {step.boldIntro}
                      </strong>
                      {step.mainBody}
                    </p>
                  </div>
                  
                  {/* Footer rule with simulated active meter */}
                  <div 
                    className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-mono"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    <span className="text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active Pipeline Unit
                    </span>
                    <span className="text-orange-600 dark:text-orange-400 font-black uppercase tracking-wider text-[10px] flex items-center gap-1 group-hover:scale-105 transition-transform">
                      Stage {idx + 1} ✓
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. REPAIR PORTFOLIO GALLERY (Masonry Grid with Lightbox Preview) */}
      <section id="gallery" className={`py-12 md:py-16 border-t ${isDarkMode ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-100/70 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimatedSectionHeader
            badge="ACTIVE WORKSHOP JOBS"
            title="Workshop Diaries. Real Garage Logs."
            description="Inspect authentic mechanical repair logs straight from our Koregaon Park service bays. Click any job card to view Rana's grease-stained physical workshop workbench file, diagnostics, and tools used."
          />

          {/* Masonry-like layout columns */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 mt-12">
            {galleryData.map((item) => {
              // Dynamically associate realistic greasy garage workshop logs based on ID
              const getWorkshopMeta = (id: string) => {
                const logs: Record<string, { tool: string; diagnostic: string; spec: string; technician: string; greaseLevel: string; severity: string }> = {
                  g1: { tool: "Pneumatic Carbon Scraper", diagnostic: "Cylinder head valve seats carbon scale crust, compression leak.", spec: "Compression restored 85 -> 135 PSI", technician: "Rana Singh", greaseLevel: "75% Grease", severity: "HIGH" },
                  g2: { tool: "Electrostatic Spray Gun", diagnostic: "Chassis rear loop rust scaling, vintage coat peeling.", spec: "Matte high-heat powder coat cured", technician: "Dilpreet Singh", greaseLevel: "20% Dust", severity: "MEDIUM" },
                  g3: { tool: "Vacuum Hydraulic Bleeder", diagnostic: "Mushy brake lever feedback, fluid contaminated with 4% water.", spec: "Brembo caliper pistons flushed", technician: "Rana Singh", greaseLevel: "45% Fluid", severity: "HIGH" },
                  g4: { tool: "High-Pressure Snow Wash", diagnostic: "Chassis bottom encrusted with road salt, engine oil sludge.", spec: "Double active foam wash + buffed wax", technician: "Karan Singh", greaseLevel: "10% Suds", severity: "LOW" },
                  g5: { tool: "OBD-II Probe Scanner", diagnostic: "ECU cold-idle RPM erratic, fuel injector spray map offset.", spec: "EFI map flash to 2026 stock settings", technician: "Rana Singh", greaseLevel: "5% Digital", severity: "MEDIUM" },
                  g6: { tool: "USD Cartridge Clamp", diagnostic: "Fork seals completely blown, oil weeping onto brake disc.", spec: "Installed NOK pressure double seals", technician: "Dilpreet Singh", greaseLevel: "60% Oil", severity: "HIGH" },
                  g7: { tool: "Laser Chain Alignment Rail", diagnostic: "Drive chain uneven tight spots, sprocket axle offset by 4mm.", spec: "Torqued DID O-Ring chain to 24 Nm", technician: "Karan Singh", greaseLevel: "50% Greasy", severity: "MEDIUM" },
                  g8: { tool: "Orbital Buffing Disc", diagnostic: "Paint spiderweb scratches, mud guards dull oxidization.", spec: "3M compound machine rub + Teflon coat", technician: "Karan Singh", greaseLevel: "15% Wax", severity: "LOW" },
                  g9: { tool: "Sonic Jet Carb Solvents", diagnostic: "Mikuni carburettor float chamber pin stuck, running rich.", spec: "Adjusted brass float, chemically cleared jets", technician: "Rana Singh", greaseLevel: "80% Solvent", severity: "HIGH" },
                  g10: { tool: "Heavy Torque Wrench", diagnostic: "Flange joint manifold gasket blown, loud decibel leak.", spec: "Fitted dual-wall gasket, torqued 35 Nm", technician: "Dilpreet Singh", greaseLevel: "40% Exhaust", severity: "MEDIUM" },
                };
                return logs[id] || { tool: "General Handtools", diagnostic: "Routine wear & mechanical verification checklist.", spec: "Verified 5km road-test passed", technician: "Rana Singh", greaseLevel: "30% Greasy", severity: "MEDIUM" };
              };

              const meta = getWorkshopMeta(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxImg({ 
                    url: item.img, 
                    title: item.title, 
                    desc: item.desc,
                    // Pass extra greasy details to the custom job card lightbox!
                    tool: meta.tool,
                    diagnostic: meta.diagnostic,
                    spec: meta.spec,
                    technician: meta.technician,
                    greaseLevel: meta.greaseLevel,
                    severity: meta.severity,
                    category: item.categoryLabel,
                    idCode: `R-LOG-${item.id.toUpperCase()}`
                  } as any)}
                  className="bg-amber-50/70 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer group break-inside-avoid relative hover:border-orange-500 hover:shadow-xl transition-all duration-300 flex flex-col p-4 space-y-4"
                >
                  {/* Clipboard clip top bar mimic */}
                  <div className="w-12 h-2.5 bg-slate-400 dark:bg-slate-700 mx-auto rounded-md shadow-inner mb-1" />

                  {/* Oil Smudge visual decoration */}
                  <div className="absolute right-2 top-10 w-16 h-16 bg-amber-900/5 dark:bg-orange-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-700" />

                  {/* Image Frame */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 shadow-inner shrink-0">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
                    
                    {/* Severity label */}
                    <span className={`absolute top-2.5 right-2.5 text-[8px] font-mono font-black px-2 py-0.5 rounded border ${
                      meta.severity === "HIGH" 
                        ? "bg-rose-950/80 text-rose-300 border-rose-800" 
                        : "bg-amber-950/80 text-amber-300 border-amber-800"
                    }`}>
                      {meta.severity} RISK
                    </span>

                    {/* Barcode representation */}
                    <div className="absolute bottom-2 left-2 flex flex-col">
                      <span className="text-[10px] text-white/90 font-display font-black tracking-tight drop-shadow">
                        {item.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Mechanical clipboard logs body */}
                  <div className="text-left space-y-2.5 flex-grow">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <h4 className="font-display font-black text-sm text-slate-950 dark:text-slate-100 group-hover:text-orange-500 transition-colors leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <div className="space-y-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 font-bold block uppercase text-[9px] tracking-wider">🛠️ WORKBENCH TOOL:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-extrabold">{meta.tool}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 font-bold block uppercase text-[9px] tracking-wider">🔍 INITIAL COMPLAINT:</span>
                        <p className="line-clamp-2 italic text-slate-700 dark:text-slate-300">{meta.diagnostic}</p>
                      </div>
                    </div>

                    {/* Industrial specs meter footer */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-orange-600 dark:text-orange-400 font-black tracking-widest uppercase">
                        ||||| R-{item.id.toUpperCase()}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 font-bold">
                        {meta.greaseLevel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* LIGHTBOX MODAL (Industrial Job Card Sheet Clipboard) */}
        <AnimatePresence>
          {lightboxImg && (
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotate: 1 }}
                className="bg-amber-50 dark:bg-slate-900 border-4 border-slate-400 dark:border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative text-left p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200"
              >
                {/* Metallic Clip top header */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-6 bg-slate-500 dark:bg-slate-700 rounded-b-2xl border-b-2 border-x-2 border-slate-600 dark:border-slate-800 shadow-md flex items-center justify-center">
                  <div className="w-16 h-1 bg-slate-700 dark:bg-slate-800 rounded-full" />
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setLightboxImg(null)}
                  className="absolute top-4 right-4 bg-slate-950 hover:bg-slate-900 text-white p-2 rounded-full border border-slate-800 transition-all z-20 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Header Information */}
                <div className="pt-4 border-b-2 border-dashed border-slate-300 dark:border-slate-800 pb-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-orange-600 text-white text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-widest">
                        {(lightboxImg as any).category || "Workshop Rebuild"}
                      </span>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-slate-950 dark:text-white mt-1 leading-tight uppercase">
                        {(lightboxImg as any).title}
                      </h3>
                    </div>
                    <div className="text-right font-mono text-xs text-slate-500 shrink-0">
                      <span className="block font-black text-orange-600 dark:text-orange-400">{(lightboxImg as any).idCode || "R-LOG-00"}</span>
                      <span className="block text-[10px]">BAY DESK FILE</span>
                    </div>
                  </div>
                </div>

                {/* Big Visual Diagnostic Image */}
                <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-800 shadow-inner">
                  <img 
                    src={lightboxImg.url} 
                    alt={lightboxImg.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Grease Stamp Overlay */}
                  <div className="absolute bottom-3 right-3 bg-red-600/20 text-red-500 border-2 border-red-500/40 text-[10px] font-mono font-black px-3 py-1 rounded uppercase tracking-widest rotate-[-12deg] select-none pointer-events-none">
                    APPROVED WORK
                  </div>
                </div>

                {/* Greasy Mechanic Notes Clipboard rows */}
                <div className="space-y-4 font-mono text-xs bg-white dark:bg-slate-950/50 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800/80 relative">
                  {/* Ruled lines pattern indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/40" />
                  
                  <div className="space-y-3.5 pl-2">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block text-[9px]">🛠️ WORKBENCH TOOL UTILIZED:</span>
                      <p className="text-slate-950 dark:text-white font-black text-[13px] mt-0.5">
                        {(lightboxImg as any).tool || "Pneumatic Socket & Tensioners"}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block text-[9px]">🔍 ENGINE BAY DIAGNOSTIC COMPLAINT:</span>
                      <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed mt-0.5">
                        {(lightboxImg as any).diagnostic || "Routine mechanical overhaul diagnostics logged by workshop manager."}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block text-[9px]">🔧 FINAL PHYSICAL REMEDY:</span>
                      <p className="text-slate-800 dark:text-slate-200 font-extrabold leading-relaxed mt-0.5">
                        {(lightboxImg as any).spec || "Verified 5km high-rpm road test passed with zero oil leaks."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signature and Verification Badge Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center border border-orange-300 text-orange-600 font-bold text-xs font-mono">
                      RS
                    </div>
                    <div className="text-left font-mono">
                      <span className="block text-[10px] text-slate-400">RESPONSIBLE MECH:</span>
                      <span className="block text-xs font-black text-slate-800 dark:text-slate-200">{(lightboxImg as any).technician || "Rana Singh"}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right font-mono text-[10px] leading-tight text-slate-400">
                      <span>GREASE RATIO: {(lightboxImg as any).greaseLevel || "40%"}</span>
                      <span className="block">SLOT STAMP: PUNE BAY 3</span>
                    </div>
                    <button
                      onClick={() => setLightboxImg(null)}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-[10px] tracking-widest uppercase px-5 py-3 rounded-xl shadow-lg shadow-orange-600/25 transition cursor-pointer"
                    >
                      FILE RECORD
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 12. CUSTOMER REVIEWS (Carousel Auto-Scroll) */}
      <section id="reviews" className={`py-10 md:py-12 border-t border-b ${isDarkMode ? "bg-slate-900/10 border-slate-900/60" : "bg-white border-slate-200"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <AnimatedSectionHeader
            badge="COMMUNITY VOICE"
            title="Loved by Riders of Every Age."
            description="Read actual feedback from our local two-wheeler community. Auto-scroll enabled, or use the controls below to navigate."
          />

          {/* Carousel main frame */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className={`${cardClass} border rounded-3xl p-6 sm:p-10 text-left space-y-6 shadow-xl relative`}
              >
                {/* Heavy background quote mark */}
                <span className="absolute right-6 top-2 text-8xl font-display font-black text-slate-800/15 pointer-events-none">
                  “
                </span>

                <div className="flex items-center space-x-1 text-[#F97316]">
                  {Array.from({ length: reviewsData[activeReviewIdx].rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-[#F97316] text-[#F97316]" />
                  ))}
                </div>

                <p className="text-sm sm:text-lg text-slate-700 dark:text-slate-200 font-sans leading-relaxed italic">
                  "{reviewsData[activeReviewIdx].review}"
                </p>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                  <div className="flex items-center space-x-3.5">
                    <img 
                      src={reviewsData[activeReviewIdx].photo} 
                      alt={reviewsData[activeReviewIdx].name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                    />
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{reviewsData[activeReviewIdx].name}</h4>
                      <p className="text-[11px] text-[#F97316] font-mono">{reviewsData[activeReviewIdx].bike}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono text-slate-500 hidden sm:block">
                    <span>Date: {reviewsData[activeReviewIdx].date}</span>
                    <span className="block text-[10px] uppercase text-slate-600 mt-0.5">Service: {reviewsData[activeReviewIdx].service}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Manual controls buttons */}
            <div className="flex justify-center items-center space-x-3.5 mt-8">
              <button
                onClick={() => setActiveReviewIdx((prev) => (prev - 1 + reviewsData.length) % reviewsData.length)}
                className={`p-2.5 rounded-full border ${borderClass} hover:text-[#F97316] hover:border-[#F97316] transition`}
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>

              <div className="flex items-center space-x-1.5">
                {reviewsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveReviewIdx(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeReviewIdx === idx ? "w-6 bg-[#F97316]" : "w-2.5 bg-slate-300 dark:bg-slate-800"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveReviewIdx((prev) => (prev + 1) % reviewsData.length)}
                className={`p-2.5 rounded-full border ${borderClass} hover:text-[#F97316] hover:border-[#F97316] transition`}
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 13. FAQ SECTION (Horizontal Grid Layout) */}
      <section id="faq" className={`py-12 md:py-16 border-t border-b ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimatedSectionHeader
            badge="SUPPORT STATION"
            title="Frequently Asked Questions."
            description="Clear answers to queries about offline bill payments, superbike support, genuine spare parts, and the WhatsApp portal dispatch system."
          />

          {/* FAQ Horizontal Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-7xl mx-auto">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl hover:border-orange-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 text-left"
              >
                <div className="space-y-3">
                  {/* Question Title with custom badge */}
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-600/10 text-orange-600 font-mono font-black text-xs shrink-0 mt-0.5">
                      Q
                    </span>
                    <h4 className="font-display font-black text-sm sm:text-base text-slate-950 dark:text-white leading-snug">
                      {item.question}
                    </h4>
                  </div>

                  {/* Answer Text */}
                  <div className="pl-8">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-semibold">
                      {item.answer}
                    </p>
                  </div>
                </div>

                {/* Card footer details */}
                <div className="pl-8 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>SUPPORT ANSWERED</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">VERIFIED ✓</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 14. CONTACT SECTION & GOOGLE MAPS PLACEHOLDER */}
      <section id="contact" className={`py-10 md:py-12 border-t ${isDarkMode ? "bg-slate-900/15 border-slate-900/60" : "bg-slate-100/10 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Direct contact info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#F97316]/10 text-[#F97316] rounded-md text-[10px] font-mono font-bold uppercase tracking-widest">
                <MapPin className="h-3.5 w-3.5" />
                <span>FIND OUR WORKSHOP</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-none">
                Get In Touch.
              </h2>
              <p className={`${textMutedClass} text-xs sm:text-sm leading-relaxed`}>
                Drop by our premium workshop, or chat with us on WhatsApp for emergency punctures or roadside assistance support.
              </p>

              <div className="space-y-4 pt-2">
                
                <div className="flex items-start space-x-3.5">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/40 text-[#F97316] shrink-0 border border-slate-200 dark:border-slate-800">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">Physical Address</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Shop No. 12, Koregaon Park Plaza, <br />
                      Near Lane 5, Koregaon Park, Pune - 411001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/40 text-[#F97316] shrink-0 border border-slate-200 dark:border-slate-800">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">Workshop Hours</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Monday to Saturday: 9:00 AM - 8:00 PM <br />
                      Sunday: Closed (Emergency Punctures active on call)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/40 text-[#F97316] shrink-0 border border-slate-200 dark:border-slate-800">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">Contact Station</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Direct Hotline: +91 98765 43210 <br />
                      Emergency towing support: +91 99999 88888
                    </p>
                  </div>
                </div>

              </div>

              {/* Instant Call CTA buttons */}
              <div className="flex gap-3 pt-3">
                <a
                  href="tel:+919767824216"
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 py-3 rounded-xl text-xs font-bold text-center transition flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4 text-[#F97316]" />
                  <span>Call Hotline</span>
                </a>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex-1 bg-[#F97316] hover:bg-[#ea580c] text-white py-3 rounded-xl text-xs font-black tracking-wider uppercase text-center transition shadow-lg shadow-orange-500/10 cursor-pointer"
                >
                  Book on WhatsApp
                </button>
              </div>

            </div>

            {/* Right Column: Google Maps Placeholder component */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl h-80 sm:h-96 w-full flex flex-col justify-between">
                
                {/* Styled grid vector mapping mimicking google maps */}
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 bg-[radial-gradient(#94a3b8_1px,transparent_1.5px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

                {/* Simulated navigation path layout */}
                <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-10,120 L200,120 L350,300 L600,300" fill="none" stroke="#64748b" strokeWidth="4" />
                  <path d="M120,0 L120,400" fill="none" stroke="#64748b" strokeWidth="4" />
                  <path d="M400,0 L400,400" fill="none" stroke="#64748b" strokeWidth="4" />
                </svg>

                {/* Animated Map pin glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <span className="w-10 h-10 rounded-full bg-[#F97316]/35 border-2 border-[#F97316] flex items-center justify-center animate-pulse">
                    <span className="w-4 h-4 rounded-full bg-[#F97316]" />
                  </span>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl mt-2.5 shadow-md">
                    Rana Garage (Koregaon Park)
                  </div>
                </div>

                {/* Map Control bar top */}
                <div className="p-4 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800/60 z-10 flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase">Rana Workshop Coordinates</span>
                  <span className="text-[10px] bg-white dark:bg-slate-950 text-[#F97316] border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded uppercase font-black">MH-12</span>
                </div>

                {/* Map Details bar bottom */}
                <div className="p-4 bg-slate-50/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800/60 z-10 flex flex-col sm:flex-row justify-between items-center gap-3.5 text-xs text-left">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white">Rana Garage • Pune</h5>
                    <p className="text-[11px] text-slate-500 font-sans mt-0.5">Shop No. 12, Koregaon Park Plaza, Near Lane 5</p>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Koregaon+Park+Pune"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#F97316] hover:bg-[#ea580c] text-white font-black px-4.5 py-2.5 rounded-xl text-xs transition flex items-center space-x-1 shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Get Live Directions</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 15. FOOTER SECTION */}
      <footer className={`py-6 border-t ${isDarkMode ? "bg-slate-950 border-slate-900 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"} transition-all`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
            
            {/* Column 1: Logo and motto */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="bg-[#F97316] text-white p-1.5 rounded-lg">
                  <Wrench className="h-4 w-4" />
                </div>
                <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">RANA GARAGE</h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Premium motorcycle diagnostic testing and repair solutions. 100% offline payment guarantees with absolute transparency since 2026.
              </p>
            </div>

            {/* Column 2: Navigation shortcut */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider">Quick Jump Links</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a href="#home" className="hover:text-[#F97316] transition">Main Home</a>
                <a href="#services" className="hover:text-[#F97316] transition">Services Catalog</a>
                <a href="#about" className="hover:text-[#F97316] transition">Master Rana</a>
                <a href="#gallery" className="hover:text-[#F97316] transition">Workshop Log</a>
                <a href="#repairs" className="hover:text-[#F97316] transition">Before/After</a>
                <a href="#faq" className="hover:text-[#F97316] transition">Support FAQs</a>
              </div>
            </div>

            {/* Column 3: Contact info summary */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider">Contact Station</h4>
              <p className="text-xs leading-relaxed text-slate-500">
                Shop No. 12, Koregaon Park Plaza, <br />
                Near Lane 5, Koregaon Park, Pune <br />
                Phone: +91 98765 43210
              </p>
            </div>

            {/* Column 4: Backdoors and Staff access links */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider">Automated Portals</h4>
              <p className="text-xs text-slate-500">
                Are you a member of our technical staff? Launch any tracking terminal below.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigateToRole("Admin")}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-[#F97316] border border-slate-200 dark:border-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Admin Panel
                </button>
                <button
                  onClick={() => onNavigateToRole("Mechanic")}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Mechanic Floor
                </button>
              </div>
            </div>

          </div>

          {/* Copyright notice row */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p className="text-slate-500">
              © {new Date().getFullYear()} Rana Garage. All rights reserved. Registered under Maharashtra Automotive Association.
            </p>
            <p className="text-slate-500 flex items-center">
              Designed with ❤️ for Pune Riders
            </p>
          </div>

        </div>
      </footer>

      {/* 16. SUBMIT SUCCESS ANIMATION DRAWER OVERLAY */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 max-w-md w-full text-center space-y-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto animate-bounce">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tight">Ticket Formed Successfully!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-semibold">
                  We have registered your motorcycle ticket <strong>({formBrand} {formModel})</strong> on Pune's active Rana queue. Opening WhatsApp directly to dispatch your booking details...
                </p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850/80 text-left space-y-3 font-mono text-[10px] sm:text-xs">
                <p className="text-slate-900 dark:text-slate-100 font-bold"><span className="text-slate-500 dark:text-slate-400 font-black">CLIENT:</span> {formName}</p>
                <p className="text-slate-900 dark:text-slate-100 font-bold"><span className="text-slate-500 dark:text-slate-400 font-black">PHONE:</span> {formPhone}</p>
                <p className="text-slate-900 dark:text-slate-100 font-bold"><span className="text-slate-500 dark:text-slate-400 font-black">SCHEDULE:</span> {formDate} | {formTime}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-black"><span className="text-slate-500 dark:text-slate-400 font-black">PRIORITY:</span> {isEmergency ? "🚨 EMERGENCY RED" : "✅ NORMAL GREEN"}</p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Return to Website
                </button>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">If your WhatsApp app does not open automatically, please click Book Appointment again.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
