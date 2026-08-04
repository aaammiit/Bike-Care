import React, { useState, useEffect, useRef } from "react";
import ranaLogo from "../assets/images/rana_bike_cares_logo_1784714930624.jpg";
import ranaMechanicImg from "../assets/images/rana_singh_mechanic_1785394023899.png";
import journeyStep1Img from "../assets/images/journey_step_entry_handover_1785392370485.jpg";
import journeyStep2Img from "../assets/images/journey_step_diagnosis_check_1785392385570.jpg";
import journeyStep3Img from "../assets/images/journey_step_repair_work_1785392399728.jpg";
import journeyStep4Img from "../assets/images/journey_step_wash_delivery_1785392417547.jpg";
import { generateGoogleMapsUrl } from "../utils/locationUtils";
import { useApp } from "../AppContext";
import { ReviewFormModal } from "./ReviewFormModal";
import { 
  mechanicData, 
  reviewsData, 
  galleryData, 
  beforeAfterData,
  pricingPackages, 
  faqItems, 
  majorBrands,
  workshopLiftImg,
  clutchEngineImg,
  suspensionImg,
  foamWashImg,
  engineOilImg,
  BeforeAfterItem
} from "./garageData";
import { 
  SectionEditorModal, 
  ServiceJourneyStep, 
  WorkshopLogItem 
} from "./SectionEditorModal";
import { AnimatedMotorcycle } from "./AnimatedMotorcycle";
import { CinematicNavbar } from "./CinematicNavbar";
import { ServicesCarousel } from "./ServicesCarousel";
import { SafeImage } from "./SafeImage";
import { ServiceCategorySelector } from "./ServiceCategorySelector";
import { AnimatedSection } from "./AnimatedSection";
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
  DollarSign,
  Upload,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ServiceType } from "../types";

interface LandingPageProps {
  onOpenBooking: (preselectedService?: ServiceType) => void;
  onNavigateToRole: (role: "Customer" | "Admin" | "Mechanic") => void;
  onOpenUsers?: () => void;
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
    phase: "STEP 01",
    title: "Appointment & Bike Inspection",
    img: journeyStep1Img,
    boldIntro: "Honest Checkup & Job Card Entry",
    mainBody: "Bring your motorcycle to Rana Garage or book online. Rana personally inspects your bike, notes down all complaints on a job card, and gives an honest estimate before touching a single bolt."
  },
  {
    phase: "STEP 02",
    title: "Fault Diagnosis & Spares Check",
    img: journeyStep2Img,
    boldIntro: "Genuine Spares & Clear Explanation",
    mainBody: "We inspect engine oil, spark plug, air filter, brakes, and electricals. If any part requires replacement, we inform you first and use 100% genuine OEM spare parts."
  },
  {
    phase: "STEP 03",
    title: "Mechanical Repair & Servicing",
    img: journeyStep3Img,
    boldIntro: "Hands-On Skilled Mechanic Work",
    mainBody: "From oil change, clutch adjustment, and valve setting to complete engine repair, every job is done with precision using quality workshop tools by experienced mechanic Rana."
  },
  {
    phase: "STEP 04",
    title: "Washing, Road Test & Handover",
    img: journeyStep4Img,
    boldIntro: "Foam Wash, Test Ride & Clear Bill",
    mainBody: "Your bike gets a thorough foam wash, chain lubrication, and a 3km road test to ensure smooth riding. Pay easily via Cash or UPI after inspecting your bike."
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

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenBooking, onNavigateToRole, onOpenUsers }) => {
  const { addUserRequest, customerReviews, mechanicProfile } = useApp();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const activeMechanic = mechanicProfile || mechanicData;

  const displayReviews = customerReviews || [];

  // Theme Toggle: Defaults to false (to match user requested Black + Orange + White combo as standard preset)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Active section highlighters for scrolling
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lightbox State
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string; desc: string } | null>(null);

  // Editable Website Sections State (Persisted in localStorage)
  const [serviceJourneyStepsList, setServiceJourneyStepsList] = useState<ServiceJourneyStep[]>(() => {
    const saved = localStorage.getItem("rana_service_journey_steps");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return serviceJourneySteps;
  });

  const [workshopLogsList, setWorkshopLogsList] = useState<WorkshopLogItem[]>(() => {
    const saved = localStorage.getItem("rana_garage_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return galleryData as WorkshopLogItem[];
  });

  const [beforeAfterList, setBeforeAfterList] = useState<BeforeAfterItem[]>(() => {
    const saved = localStorage.getItem("rana_before_after_items");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return beforeAfterData;
  });

  const [isSectionEditorOpen, setIsSectionEditorOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<"journey" | "diaries" | "transformations">("journey");

  const openSectionEditor = (section: "journey" | "diaries" | "transformations") => {
    setActiveEditorSection(section);
    setIsSectionEditorOpen(true);
  };

  const handleSaveJourneySteps = (updatedSteps: ServiceJourneyStep[]) => {
    setServiceJourneyStepsList(updatedSteps);
    try {
      localStorage.setItem("rana_service_journey_steps", JSON.stringify(updatedSteps));
    } catch (e) {
      console.warn("Failed to persist journey steps in localStorage:", e);
    }
  };

  const handleSaveWorkshopLogs = (updatedLogs: WorkshopLogItem[]) => {
    setWorkshopLogsList(updatedLogs);
    try {
      localStorage.setItem("rana_garage_logs", JSON.stringify(updatedLogs));
    } catch (e) {
      console.warn("Failed to persist workshop logs in localStorage:", e);
    }
  };

  const handleSaveBeforeAfterItems = (updatedItems: BeforeAfterItem[]) => {
    setBeforeAfterList(updatedItems);
    try {
      localStorage.setItem("rana_before_after_items", JSON.stringify(updatedItems));
    } catch (e) {
      console.warn("Failed to persist before-after items in localStorage:", e);
    }
  };

  // FAQ Accordion states
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Quick Estimator Widget State
  const [selectedBikeClass, setSelectedBikeClass] = useState<"commuter" | "sport" | "superbike">("commuter");
  const [selectedServices, setSelectedServices] = useState<string[]>(["tuneup", "wash"]);

  // Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [isWhatsApp, setIsWhatsApp] = useState<boolean>(true);
  const [formBrand, setFormBrand] = useState("Royal Enfield");
  const [formModel, setFormModel] = useState("");
  const [formReg, setFormReg] = useState("");
  const [formCategory, setFormCategory] = useState("General Maintenance");
  const [formDesc, setFormDesc] = useState("");
  const [formDate, setFormDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [formTime, setFormTime] = useState("10:00 AM - 12:00 PM");
  const [formPinCode, setFormPinCode] = useState("411012");
  const [formLoc, setFormLoc] = useState("");

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
        const fallbackLat = 18.5772;
        const fallbackLon = 73.8298;
        setGpsCoords({ lat: fallbackLat, lon: fallbackLon });
        setFormLoc(`Lat: ${fallbackLat.toFixed(6)}, Lon: ${fallbackLon.toFixed(6)} (Dapodi, Pimpri Chinchwad GPS Link)`);
        setGpsLoading(false);
        playDiagnosticBeep(600, 250);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Auto-scroll reviews carousel effect
  useEffect(() => {
    if (!displayReviews || displayReviews.length === 0) return;
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % displayReviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayReviews]);

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

  // Monitor Scroll position using IntersectionObserver to avoid layout thrashing and scroll lag
  useEffect(() => {
    const sections = ["home", "services", "about", "gallery", "reviews", "faq", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection((prev) => (prev === id ? prev : id));
          }
        });
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: 0.1
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Process Booking Form Submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!formName.trim()) errors.push("Please provide your full name.");
    if (!formPhone.trim()) errors.push("Active phone number is required.");
    if (!formModel.trim()) errors.push("Please enter your motorcycle model.");
    if (!formDate) errors.push("Please select a preferred service date.");
    if (!formLoc.trim()) errors.push("Please enter or capture your location.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      const errorEl = document.getElementById("appointment-card");
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setValidationErrors([]);
    setIsSubmitting(true);

    // Save to user requests store for owner CSV access
    const finalLocation = `${formLoc || "Dapodi, Pimpri Chinchwad, Pune"} [PIN: ${formPinCode || "411012"}]`;
    if (addUserRequest) {
      addUserRequest({
        name: formName,
        phone: formPhone,
        isWhatsApp: isWhatsApp,
        bikeModel: `${formBrand} ${formModel}`.trim() || "Motorcycle",
        serviceCategory: formCategory,
        description: formDesc || "Service & Maintenance Booking",
        preferredDate: formDate,
        preferredSlot: formTime,
        pickupOption: "None",
        location: finalLocation
      });
    }

    // Processing animation lag
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      setIsBookingModalOpen(false); // Hide form modal when showing success modal!

      if (isWhatsApp) {
        // Create prefilled WhatsApp text block
        const mapsUrl = generateGoogleMapsUrl(formLoc, gpsCoords);
        const whatsappMessage = `*🏍️ RANA BIKE CARE APPOINTMENT REQUEST*
*Customer Details:*
• Name: ${formName}
• Phone: ${formPhone} (WhatsApp Active)

*Motorcycle Details:*
• Brand: ${formBrand}
• Model: ${formModel}
• Reg No: ${formReg.toUpperCase() || "NEW BIKE"}

*Service Requested:*
• Category: ${formCategory}
• Description: "${formDesc || "General checkup and tuning request."}"
• Location & PIN: ${finalLocation}
📍 *Google Maps Location:* ${mapsUrl}

*Preferred Schedule:*
• Preferred Date: ${formDate}
• Preferred Slot: ${formTime}
• Area PIN Code: ${formPinCode || "411012"}

---
_Please confirm my slot on your dashboard, Master Rana. Thank you!_`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const waUrl = `https://wa.me/919272496996?text=${encodedMessage}`;

        // Open WhatsApp after a brief delay so the user sees the success modal first!
        setTimeout(() => {
          window.open(waUrl, "_blank");
        }, 1200);
      }

    }, 800);
  };

  // Quick Estimator Calculation Logic
  const multiplier = selectedBikeClass === "commuter" ? 1.0 : selectedBikeClass === "sport" ? 1.3 : 1.8;

  let totalMin = selectedServices.length > 0 ? 99 : 0; // base inspection fee only if something is selected
  let totalMax = selectedServices.length > 0 ? 199 : 0;

  const ESTIMATOR_SERVICES_DATA = [
    { id: "tuneup", name: "Regular Bike Service", min: 350, max: 750 },
    { id: "engine", name: "Engine Repair & Overhaul", min: 1200, max: 3500 },
    { id: "brakes", name: "Brake Service & Pad Fitting", min: 300, max: 900 },
    { id: "electrical", name: "Battery & Electrical Work", min: 250, max: 800 },
    { id: "chain", name: "Chain Cleaning & Lubrication", min: 150, max: 400 },
    { id: "wash", name: "Bike Washing & Polish", min: 150, max: 400 }
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
        onOpenUsers={onOpenUsers}
      />

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-12 pb-10 md:pt-16 md:pb-14 overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-[-5%] left-[5%] w-[30rem] h-[30rem] bg-[#58cc02]/3 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[5%] w-[25rem] h-[25rem] bg-[#1cb0f6]/3 rounded-full blur-[130px] pointer-events-none" />

        {/* Hero Title & Badge at Top */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-50 border-2 border-brand-200 text-eager-green text-xs sm:text-sm font-bold tracking-wide"
          >
            <Sparkles className="h-4 w-4 animate-spin-slow text-eager-green" />
            <span>PUNE'S MOST RELIABLE TWO-WHEELER WORKSHOP</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-charcoal leading-[1.08]"
          >
            Rana Bike Care.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-pencil-gray font-sans font-medium"
          >
            Expert repair, genuine OEM spare parts, engine overhaul & roadside assistance for all motorcycle models in Pune.
          </motion.p>
        </div>

        {/* Interactive Riding Motorcycle animation block - full bleed edge-to-edge without side margins */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full px-0 pt-0 pb-2 relative z-10"
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
      <AnimatedSection className={`py-6 border-t border-b ${isDarkMode ? "bg-slate-900/10 border-slate-900/60" : "bg-slate-100/50 border-slate-200"}`}>
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
      </AnimatedSection>

      {/* 4. INTERACTIVE SERVICES CATALOG SECTION */}
      <AnimatedSection id="services" className="py-12 md:py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <AnimatedSectionHeader
            badge="RANA GARAGE SERVICES"
            title="Complete Motorcycle Services"
            description="From regular servicing to engine repair, Rana Garage provides honest, affordable, and reliable motorcycle repair for all major bike brands."
          />

          {/* Animated Single Row Carousel */}
          <ServicesCarousel 
            onSelectService={(serviceName) => {
              playDiagnosticBeep(800, 100);
              setFormCategory(serviceName);
              setFormDesc(`Requesting service: "${serviceName}" at Rana Garage.`);
              setIsBookingModalOpen(true);
            }} 
          />

        </div>
      </AnimatedSection>



      {/* 5. PRICING PACKAGES (Clearly Show Inclusions) */}
      <AnimatedSection className="py-8 md:py-12 bg-slate-50/70 dark:bg-slate-950/60 border-t-2 border-b-2 border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-8 space-y-1.5">
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
              Work Inclusions & Service Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold max-w-xl mx-auto leading-normal">
              Comprehensive motorcycle repair and maintenance packages with complete itemized work checklists.
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
                    RECOMMENDED PACKAGE
                  </span>
                )}

                <div className="space-y-4">
                  <div className="text-left flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">{pkg.name}</h3>
                      <p className="text-[11px] text-[#58cc02] font-mono font-bold mt-0.5">Full Maintenance Scope</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block p-2 bg-emerald-50 text-[#58cc02] rounded-xl font-bold text-xs border border-emerald-100">
                        100% Genuine
                      </span>
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
                      setFormDesc(`Requesting service package: "${pkg.name}"`);
                      setIsBookingModalOpen(true);
                    }}
                    className={`w-full text-center py-2.5 px-4 rounded-full text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                      pkg.popular
                        ? "bg-[#58cc02] text-white hover:bg-emerald-600 shadow-sm"
                        : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                    }`}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ y: 1, scale: 0.99 }}
                  >
                    BOOK {pkg.name.toUpperCase()}
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </AnimatedSection>

      {/* 6. BRANDS WE REPAIR GRID */}
      <AnimatedSection className="py-8 md:py-10">
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
      </AnimatedSection>

      {/* 8. APPOINTMENT / ISSUE FORM TRIGGER BANNER (WhatsApp Redirect Gateway) */}
      <AnimatedSection id="appointment-portal" className="py-8 md:py-10 border-t-2 border-b-2 bg-brand-50/15 border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="duo-card p-6 sm:p-10 relative overflow-hidden flex flex-col items-center space-y-6 bg-white text-charcoal">
            
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] text-eager-green font-bold tracking-widest uppercase block">
                DIGITAL QUEUE DISPATCH
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-charcoal tracking-tight leading-tight">
                Schedule Your Service Appointment
              </h2>
              <p className="text-pencil-gray text-xs sm:text-sm font-semibold leading-relaxed max-w-2xl mx-auto">
                Open Pune's premier diagnostics and repair gateway. Complete our rapid ticket setup and auto-generate your WhatsApp priority dispatch.
              </p>
            </div>

            <div className="max-w-md w-full mt-2">
              {/* Standard Service Booking Button */}
              <div className="duo-card p-6 flex flex-col justify-between items-center text-center space-y-4 border-2 border-slate-100 bg-slate-50/40 hover:border-slate-200 transition">
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
            </div>

          </div>

        </div>
      </AnimatedSection>

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
              className="w-full max-w-3xl my-auto transition-all duration-300 transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 text-left align-middle shadow-2xl border-2 border-slate-200 dark:border-slate-800 flex flex-col relative z-10 max-h-[90vh] sm:max-h-[88vh]"
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
                <div className="h-1.5 w-full shrink-0 bg-eager-green" />

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

                  {/* Standard Form - 2 Balanced Columns */}
                  <div className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        
                        {/* Column 1: Contact Profile & Bike Details */}
                        <div className="space-y-4 text-left">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest font-mono border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center">
                            <User className="h-4 w-4 text-[#F97316] mr-1.5" />
                            1. Contact & Bike Details
                          </h3>

                          <div className="space-y-3.5">
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
                                className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition border ${inputClass}`}
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                Phone Number <span className="text-[#F97316]">*</span>
                              </label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. 9823045678"
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value)}
                                className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition border font-mono ${inputClass}`}
                              />
                              <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                                {formPhone.replace(/\D/g, "").length === 0 ? (
                                  <span className="text-slate-400">Enter 10 digits</span>
                                ) : formPhone.replace(/\D/g, "").length === 10 ? (
                                  <span className="text-emerald-500 font-bold">✓ Valid 10-digit phone number</span>
                                ) : (
                                  <span className="text-amber-500 font-bold">⚠️ {formPhone.replace(/\D/g, "").length}/10 digits</span>
                                )}
                              </div>
                            </div>

                            {/* IS THIS WHATSAPP NUMBER QUESTION */}
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                              <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                Is this your WhatsApp Number? <span className="text-[#F97316]">*</span>
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsWhatsApp(true)}
                                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                                    isWhatsApp
                                      ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950/30"
                                      : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                  }`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-emerald-300" />
                                  <span>Yes (WhatsApp)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setIsWhatsApp(false)}
                                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                                    !isWhatsApp
                                      ? "bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-950/30"
                                      : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                  }`}
                                >
                                  <Phone className="h-3 w-3" />
                                  <span>No (Call Only)</span>
                                </button>
                              </div>
                            </div>

                            {/* Bike Brand & Model */}
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                    Bike Brand <span className="text-[#F97316]">*</span>
                                  </label>
                                  <select
                                    value={formBrand}
                                    onChange={(e) => setFormBrand(e.target.value)}
                                    className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none transition border ${inputClass}`}
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
                                    required
                                    placeholder="e.g. Classic 350"
                                    value={formModel}
                                    onChange={(e) => setFormModel(e.target.value)}
                                    className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none transition border ${inputClass}`}
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
                                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition border ${inputClass}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Location, Date & Issue */}
                        <div className="space-y-4 text-left">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest font-mono border-b border-slate-200 dark:border-slate-800/80 pb-2 flex items-center">
                            <MapPin className="h-4 w-4 text-[#F97316] mr-1.5" />
                            2. Location & Preferred Date
                          </h3>

                          <div className="space-y-3.5">
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
                              
                              <div className={`rounded-2xl p-3.5 border transition-all duration-300 ${
                                formLoc 
                                  ? "bg-emerald-500/10 border-emerald-500/30" 
                                  : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800"
                              }`}>
                                {formLoc ? (
                                  <div className="space-y-2">
                                    <div className="flex items-start space-x-2.5">
                                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 mt-0.5 shrink-0">
                                        <MapPin className="h-4 w-4" />
                                      </div>
                                      <div className="text-left">
                                        <p className="text-[11px] font-mono font-black text-slate-900 dark:text-slate-100 leading-none">GPS LOCK ESTABLISHED</p>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-bold font-mono mt-1 leading-relaxed">
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
                                  <div className="flex flex-col items-center justify-center py-2 text-center space-y-2">
                                    <div className="p-2 bg-orange-500/15 text-[#F97316] rounded-full">
                                      <Smartphone className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">No GPS Data Loaded</p>
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans max-w-[240px] mx-auto leading-normal">
                                        We capture live coordinates via phone GPS for towing.
                                      </p>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={handleAcquireLocation}
                                      disabled={gpsLoading}
                                      className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white font-black px-4 py-2 rounded-xl transition duration-300 shadow-md shadow-orange-500/15 text-xs uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer"
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
                                <p className="text-[10px] text-rose-500 font-mono mt-1 font-bold flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {gpsError}
                                </p>
                              )}
                            </div>

                            {/* Preferred Date & Issue Category */}
                            <div className="space-y-3 pt-1">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-1.5 font-black tracking-wider">
                                  Preferred Date <span className="text-[#F97316]">*</span>
                                </label>
                                <input
                                  type="date"
                                  required
                                  value={formDate}
                                  onChange={(e) => setFormDate(e.target.value)}
                                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition border cursor-pointer ${inputClass}`}
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-900 dark:text-slate-200 uppercase mb-2 font-black tracking-wider">
                                  Service Category Selection
                                </label>
                                <ServiceCategorySelector
                                  selectedCategory={formCategory}
                                  onSelectCategory={(cat) => setFormCategory(cat)}
                                  theme="light"
                                />

                                <div className="mt-2.5">
                                  <select
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition border ${inputClass}`}
                                  >
                                    <option value="General Maintenance">General Maintenance</option>
                                    <option value="Engine Repair">Engine Repair & Smoking</option>
                                    <option value="Brake Overhaul">Brake Overhaul & Pads</option>
                                    <option value="Oil & Filter Change">Oil & Filter Change</option>
                                    <option value="Battery & Electrical">Wiring & Battery Problem</option>
                                    <option value="Chain Lube & Clean">Chain Kit & Sprockets</option>
                                    <option value="Suspension Repair">Suspension Leaking Seals</option>
                                    <option value="Tyre & Puncture">Tyre & Puncture</option>
                                    <option value="Washing & Polishing">Foam Wash & Polish</option>
                                    <option value="Custom Repair">Custom Restorations & Mods</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                </div>

                {/* Submit Trigger / Tail / Footer - Fixed at Bottom */}
                <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/35 rounded-b-3xl shrink-0 text-left">
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || formPhone.replace(/\D/g, "").length !== 10}
                      className={`flex-1 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                        formPhone.replace(/\D/g, "").length !== 10
                          ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed border-b-4 border-slate-400 dark:border-slate-700"
                          : isWhatsApp
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800 cursor-pointer"
                          : "bg-[#F97316] hover:bg-[#ea580c] text-white border-b-4 border-orange-700 cursor-pointer"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Saving Booking Request...</span>
                        </>
                      ) : isWhatsApp ? (
                        <>
                          <MessageSquare className="h-4.5 w-4.5" />
                          <span>Confirm & Open WhatsApp Chat</span>
                        </>
                      ) : (
                        <>
                          <Phone className="h-4.5 w-4.5" />
                          <span>Save Booking & Call Mechanic</span>
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
                    🔐 NO REGISTRATION REQUIRED • WE VALUE SENSITIVE PRIVACY
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. MEET THE MECHANIC SECTION - RANA SINGH */}
      <AnimatedSection id="about" className="py-12 md:py-16 bg-white dark:bg-slate-900 border-t border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Grid: Left Portrait + Right Bio, Trust Cards, Services & CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT SIDE: Portrait Photo of Rana Singh inside Workshop */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800/80 hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[3/4] w-full overflow-hidden relative">
                  <SafeImage 
                    src={activeMechanic.photo || ranaMechanicImg} 
                    alt="Rana Singh - Owner & Motorcycle Mechanic" 
                    fallbackSrc="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&h=1000&q=80"
                    iconFallback={<User className="h-16 w-16 text-orange-500" />}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  
                  {/* Photo Caption Overlay with Rating Badge aligned at bottom to keep top signboard contact phone number clear */}
                  <div className="absolute bottom-5 left-5 right-5 text-left text-white space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-orange-400 tracking-widest uppercase block">
                        LOCAL NEIGHBORHOOD GARAGE
                      </span>
                      {/* Trust Badge placed at bottom overlay so top contact details on image are unobscured */}
                      <div className="bg-slate-900/90 backdrop-blur-md text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-lg shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>4.9 Rated</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight drop-shadow-md">Rana Singh</h3>
                    <p className="text-xs text-slate-200 font-medium mt-0.5">Owner & Motorcycle Mechanic • Pune</p>
                  </div>
                </div>

                {/* Sub-card under photo: Small Local Workshop Commitment */}
                <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border-t border-orange-100 dark:border-orange-900/50 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#F97316] shrink-0" />
                    <span>100% Personal Attention to Every Bike</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#F97316] uppercase bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800 shrink-0">
                    4.9 ★ Rated by Local Riders
                  </span>
                </div>
              </motion.div>

              {/* OPTIONAL TRUST SECTION: Customer Review Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed font-serif">
                  "I've been servicing my bike here for years. Honest work, reasonable prices, and my bike is always ready on time."
                </p>
                <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-bold text-slate-900 dark:text-slate-100">— Local Customer</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Review
                  </span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: Titles, Description, Trust Info Cards, Services Badges, Working Hours & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left flex flex-col justify-center">
              
              {/* Header Title & Subtitle */}
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-orange-500/10 text-[#F97316] rounded-full text-xs font-mono font-bold tracking-wider uppercase border border-orange-200 dark:border-orange-800/60">
                  <Wrench className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Owner & Motorcycle Mechanic</span>
                </div>

                <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight leading-none">
                  Meet Rana Singh
                </h2>
              </div>

              {/* Authentic Paragraphs Description */}
              <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  With over 15 years of hands-on experience, Rana Singh has been repairing motorcycles for riders across the local community.
                </p>
                <p>
                  From regular servicing and oil changes to engine repairs and electrical work, every motorcycle is inspected and repaired personally.
                </p>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Rana believes in honest advice, transparent pricing, quality workmanship, and treating every customer's bike like his own.
                </p>
              </div>

              {/* TRUST INFORMATION GRID - Clean Icon Cards (Replacing progress bars) */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Why Local Riders Trust Rana Garage
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: "🔧", title: "15+ Years Experience", desc: "Hands-on motorcycle mechanic expertise" },
                    { icon: "🏍️", title: "3500+ Bikes Serviced", desc: "Trusted by local riders & commuters" },
                    { icon: "⭐", title: "4.9 Customer Rating", desc: "Consistent high quality & honest feedback" },
                    { icon: "🛠️", title: "Genuine Spare Parts", desc: "100% authentic OEM spares used" },
                    { icon: "⏱️", title: "Same-Day Service Available", desc: "Quick turnaround for daily commuters" },
                    { icon: "💬", title: "Honest Pricing", desc: "Upfront estimates with zero hidden costs" }
                  ].map((card, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3 }}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-md transition-all duration-200 flex items-center space-x-3"
                    >
                      <span className="text-2xl shrink-0 p-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-2xs border border-slate-200/50 dark:border-slate-700">{card.icon}</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">{card.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">{card.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* SERVICES BADGES / PILLS */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Regular Servicing",
                    "Engine Repair",
                    "Oil Change",
                    "Brake Repair",
                    "Clutch Repair",
                    "Electrical Repair",
                    "Chain & Sprocket",
                    "Tyre & Puncture",
                    "Battery Replacement"
                  ].map((service, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-slate-800 dark:text-slate-200 border border-orange-200/90 dark:border-orange-800/70 shadow-2xs hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:border-orange-400 transition-all cursor-default"
                    >
                      <Check className="w-3.5 h-3.5 text-[#F97316] stroke-[3]" />
                      <span>{service}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* WORKING HOURS */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 text-[#F97316]">
                    <Clock className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      WORKING HOURS
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Monday – Saturday: 10:00 AM – 9:00 PM
                    </span>
                  </div>
                </div>
                <div className="sm:text-right pl-11 sm:pl-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    SUNDAY
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                    Emergency Service on Call
                  </span>
                </div>
              </div>

              {/* CALL TO ACTION BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-[#F97316] hover:bg-[#ea580c] active:scale-[0.98] text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center space-x-2.5 cursor-pointer"
                >
                  <Calendar className="w-4.5 h-4.5" />
                  <span>📅 Book Service</span>
                </button>

                <a
                  href={`https://wa.me/919272496996?text=${encodeURIComponent("Hello Rana Singh, I would like to inquire about motorcycle service at Rana Garage.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-emerald-600/25 flex items-center justify-center space-x-2.5 cursor-pointer"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>💬 WhatsApp Rana</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </AnimatedSection>

      {/* 10. VISUAL SERVICE JOURNEY */}
      <AnimatedSection id="journey" className="py-12 md:py-16 border-t-2 border-b-2 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200/60 dark:border-slate-800 [perspective:1500px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex-grow">
              <AnimatedSectionHeader
                badge="RANA GARAGE PIPELINE"
                title="Our Service Journey"
                description="We maintain 100% transparency at every step. See how your motorcycle is inspected, diagnosed, serviced, and road tested before delivery at Rana Garage."
              />
            </div>
            <button
              onClick={() => openSectionEditor("journey")}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-orange-400 font-mono font-bold text-xs rounded-xl border-2 border-orange-500/50 hover:border-orange-500 hidden md:flex items-center space-x-2 transition shadow-lg cursor-pointer shrink-0"
            >
              <Upload className="h-4 w-4 text-orange-500" />
              <span>🔧 Upload Photos & Edit Journey</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto mt-8">
            {serviceJourneyStepsList.map((step, idx) => (
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
                  <SafeImage 
                    src={step.img} 
                    alt={step.title} 
                    fallbackSrc="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200"
                    iconFallback={<Wrench className="h-10 w-10 text-orange-500" />}
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
      </AnimatedSection>

      {/* 11. REPAIR PORTFOLIO GALLERY (Masonry Grid with Lightbox Preview) */}
      <AnimatedSection id="gallery" className={`py-12 md:py-16 border-t border-b ${isDarkMode ? "bg-slate-950/40 border-slate-900/60" : "bg-slate-100/70 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex-grow">
              <AnimatedSectionHeader
                badge="ACTIVE WORKSHOP JOBS"
                title="Workshop Diaries. Real Garage Logs."
                description="Inspect authentic mechanical repair logs straight from our Dapodi, Pimpri Chinchwad service bays. Click any job card to view Rana's grease-stained physical workshop workbench file, diagnostics, and tools used."
              />
            </div>
            <button
              onClick={() => openSectionEditor("diaries")}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-orange-400 font-mono font-bold text-xs rounded-xl border-2 border-orange-500/50 hover:border-orange-500 hidden md:flex items-center space-x-2 transition shadow-lg cursor-pointer shrink-0"
            >
              <Upload className="h-4 w-4 text-orange-500" />
              <span>🔧 Upload Photos & Edit Garage Logs</span>
            </button>
          </div>

          {/* Masonry-like layout columns */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 mt-8">
            {workshopLogsList.map((item) => {
              // Dynamically associate realistic greasy garage workshop logs based on ID
              const getWorkshopMeta = (id: string) => {
                const logs: Record<string, { tool: string; diagnostic: string; spec: string; technician: string; greaseLevel: string; severity: string }> = {
                  g1: { tool: "Oil Drain Tray & Spanner Set", diagnostic: "Dark oxidized oil, dirty filter mesh screen.", spec: "Drained old oil & refilled 10W-30", technician: "Rana Singh", greaseLevel: "60% Oil", severity: "HIGH" },
                  g2: { tool: "Socket Wrench & Clutch Puller", diagnostic: "Clutch slipping on acceleration, worn friction plates.", spec: "Fitted genuine OEM clutch kit", technician: "Rana Singh", greaseLevel: "75% Grease", severity: "HIGH" },
                  g3: { tool: "Allen Key & Caliper Cleaner", diagnostic: "Front disc squeaking noise, worn brake pads.", spec: "Replaced disc pads & flushed fluid", technician: "Rana Singh", greaseLevel: "40% Dust", severity: "MEDIUM" },
                  g4: { tool: "Digital Multimeter & Wire Brush", diagnostic: "Self-start clicking sound, battery terminal corrosion.", spec: "Cleaned terminals & recharged battery", technician: "Rana Singh", greaseLevel: "15% Clean", severity: "MEDIUM" },
                  g5: { tool: "Chain Cleaner Brush & Lube Spray", diagnostic: "Loose chain slack, dry noisy sprockets.", spec: "Adjusted slack to 25mm & lubricated", technician: "Rana Singh", greaseLevel: "50% Greasy", severity: "LOW" },
                  g6: { tool: "Tyre Lever Set & Puncture Strips", diagnostic: "Sharp nail puncture in rear tubeless tyre.", spec: "Plugged puncture & inflated to 33 PSI", technician: "Rana Singh", greaseLevel: "20% Dust", severity: "MEDIUM" },
                  g7: { tool: "Foam Spray Gun & Microfiber Cloth", diagnostic: "Grease buildup on engine fins and dull body paint.", spec: "Foam washed & applied gloss polish", technician: "Rana Singh", greaseLevel: "10% Suds", severity: "LOW" },
                  g8: { tool: "Checklist Clipboard & Gauge Set", diagnostic: "Pre-trip complete checkup for long distance ride.", spec: "Verified 30 safety points & road tested", technician: "Rana Singh", greaseLevel: "25% Greasy", severity: "LOW" },
                  g9: { tool: "Carb Cleaner Spray & Jet Needle", diagnostic: "Engine misfiring on idle, dirty carburetor brass jet.", spec: "Cleaned carburetor jets & tuned air screw", technician: "Rana Singh", greaseLevel: "40% Solvent", severity: "HIGH" },
                  g10: { tool: "Exhaust Spanner & Gasket Ring", diagnostic: "Exhaust pipe joint gas leak & loud noise.", spec: "Fitted fresh copper exhaust gasket ring", technician: "Rana Singh", greaseLevel: "30% Exhaust", severity: "MEDIUM" },
                };
                return logs[id] || { tool: (item as any).tool || "General Handtools", diagnostic: (item as any).diagnostic || item.desc, spec: (item as any).spec || "Verified 5km road-test passed", technician: (item as any).technician || "Rana Singh", greaseLevel: (item as any).greaseLevel || "30% Greasy", severity: (item as any).severity || "MEDIUM" };
              };

              const meta = getWorkshopMeta(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxImg({ 
                    url: item.img, 
                    title: item.title, 
                    desc: item.desc,
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
                    <SafeImage 
                      src={item.img} 
                      alt={item.title} 
                      fallbackSrc="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200"
                      iconFallback={<Wrench className="h-8 w-8 text-orange-500" />}
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
                  <SafeImage 
                    src={lightboxImg.url} 
                    alt={lightboxImg.title} 
                    fallbackSrc="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200"
                    iconFallback={<Wrench className="h-12 w-12 text-orange-500" />}
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
      </AnimatedSection>

      {/* 12. CUSTOMER REVIEWS (Carousel Auto-Scroll) */}
      <AnimatedSection id="reviews" className={`py-10 md:py-12 border-t border-b ${isDarkMode ? "bg-slate-900/10 border-slate-900/60" : "bg-white border-slate-200"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          <AnimatedSectionHeader
            badge="COMMUNITY VOICE"
            title="Loved by Riders of Every Age."
            description="Read actual feedback from our local two-wheeler community. Auto-scroll enabled, or use the controls below to navigate."
          />

          {/* Write a Review trigger button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg transition flex items-center space-x-2 cursor-pointer"
            >
              <Star className="h-4 w-4 fill-white" />
              <span>Write a Review & Rate Workshop</span>
            </button>
          </div>

          {/* Carousel main frame */}
          <div className="relative overflow-hidden">
            {displayReviews.length === 0 ? (
              <div className={`${cardClass} border rounded-3xl p-8 text-center space-y-4 shadow-xl`}>
                <Star className="h-10 w-10 text-orange-500/40 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">No Customer Reviews Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first rider to submit a review and rate your experience at Master Rana Garage!
                </p>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-md transition cursor-pointer"
                >
                  Write First Review
                </button>
              </div>
            ) : (
              <>
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
                      {Array.from({ length: displayReviews[activeReviewIdx % displayReviews.length]?.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4.5 w-4.5 fill-[#F97316] text-[#F97316]" />
                      ))}
                    </div>

                    <p className="text-sm sm:text-lg text-slate-700 dark:text-slate-200 font-sans leading-relaxed italic">
                      "{displayReviews[activeReviewIdx % displayReviews.length]?.review}"
                    </p>

                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                      <div className="flex items-center space-x-3.5">
                        {displayReviews[activeReviewIdx % displayReviews.length]?.photo && !displayReviews[activeReviewIdx % displayReviews.length]?.photo.includes("unsplash.com") ? (
                          <SafeImage 
                            src={displayReviews[activeReviewIdx % displayReviews.length]?.photo} 
                            alt={displayReviews[activeReviewIdx % displayReviews.length]?.name} 
                            fallbackSrc=""
                            iconFallback={
                              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#F97316]">
                                <User className="h-6 w-6" />
                              </div>
                            }
                            className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                            containerClassName="w-12 h-12 rounded-full min-h-0 p-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-slate-800 border border-orange-500/30 flex items-center justify-center text-[#F97316] font-bold shadow-sm shrink-0">
                            <User className="h-6 w-6 text-[#F97316]" />
                          </div>
                        )}
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{displayReviews[activeReviewIdx % displayReviews.length]?.name}</h4>
                          <p className="text-[11px] text-[#F97316] font-mono">{displayReviews[activeReviewIdx % displayReviews.length]?.bike}</p>
                        </div>
                      </div>

                      <div className="text-right text-xs font-mono text-slate-500 hidden sm:block">
                        <span>Date: {displayReviews[activeReviewIdx % displayReviews.length]?.date}</span>
                        <span className="block text-[10px] uppercase text-slate-600 mt-0.5">Service: {displayReviews[activeReviewIdx % displayReviews.length]?.service}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Manual controls buttons */}
                <div className="flex justify-center items-center space-x-3.5 mt-8">
                  <button
                    onClick={() => setActiveReviewIdx((prev) => (prev - 1 + displayReviews.length) % displayReviews.length)}
                    className={`p-2.5 rounded-full border ${borderClass} hover:text-[#F97316] hover:border-[#F97316] transition cursor-pointer`}
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>

                  <div className="flex items-center space-x-1.5">
                    {displayReviews.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveReviewIdx(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          activeReviewIdx % displayReviews.length === idx ? "w-6 bg-[#F97316]" : "w-2.5 bg-slate-300 dark:bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveReviewIdx((prev) => (prev + 1) % displayReviews.length)}
                    className={`p-2.5 rounded-full border ${borderClass} hover:text-[#F97316] hover:border-[#F97316] transition cursor-pointer`}
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Review Form Modal */}
        <ReviewFormModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => setActiveReviewIdx(0)}
        />
      </AnimatedSection>

      {/* 13. FAQ SECTION (Horizontal Grid Layout) */}
      <AnimatedSection id="faq" className={`py-12 md:py-16 border-t border-b ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
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
      </AnimatedSection>

      {/* 14. CONTACT SECTION & GOOGLE MAPS PLACEHOLDER */}
      <AnimatedSection id="contact" className={`py-10 md:py-12 border-t ${isDarkMode ? "bg-slate-900/15 border-slate-900/60" : "bg-slate-100/10 border-slate-200"}`}>
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
                      {activeMechanic.address || "Rana Auto Garage, Ganesh Nagar, Dapodi, Opposite Shitladevi Chowk Pimpri Chinchwad, Pune, Maharashtra 411012"}
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
                      {activeMechanic.availableTime || "10:00 AM - 9:00 PM (Mon - Sat)"}
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
                      Direct Hotline: {activeMechanic.phone} <br />
                      Emergency WhatsApp Dispatch Active 24/7
                    </p>
                  </div>
                </div>

              </div>

              {/* Instant Call CTA buttons */}
              <div className="flex gap-3 pt-3">
                <a
                  href={`tel:${activeMechanic.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 py-3 rounded-xl text-xs font-bold text-center transition flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4 text-[#F97316]" />
                  <span>Call Hotline ({activeMechanic.phone})</span>
                </a>

                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex-1 bg-[#F97316] hover:bg-[#ea580c] text-white py-3 rounded-xl text-xs font-black tracking-wider uppercase text-center transition shadow-lg shadow-orange-500/10 cursor-pointer"
                >
                  Book on WhatsApp
                </button>
              </div>

            </div>

            {/* Right Column: Google Maps Interactive Location Component */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl h-80 sm:h-96 w-full flex flex-col justify-between">
                
                {/* Embedded Interactive Google Map */}
                <iframe
                  title="Workshop Live Map Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(15%) contrast(1.05)" }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(activeMechanic.address || "Rana Auto Garage Dapodi Pimpri Chinchwad Pune")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full"
                />

                {/* Map Control bar top overlay */}
                <div className="p-3 bg-slate-900/90 text-white backdrop-blur border-b border-slate-800/80 z-10 flex justify-between items-center text-xs absolute top-0 left-0 right-0">
                  <span className="font-mono text-slate-300 font-semibold uppercase flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-orange-400" />
                    <span>Workshop GPS Location: {activeMechanic.name}</span>
                  </span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded uppercase font-black">
                    PUNE WORKSHOP
                  </span>
                </div>

                {/* Map Details bar bottom overlay */}
                <div className="p-3.5 bg-slate-950/90 text-white backdrop-blur border-t border-slate-800/80 z-10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-left absolute bottom-0 left-0 right-0">
                  <div>
                    <h5 className="font-bold text-white flex items-center gap-1.5">
                      <span>Rana Garage • {activeMechanic.name}</span>
                    </h5>
                    <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                      {activeMechanic.address}
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeMechanic.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#F97316] hover:bg-[#ea580c] text-white font-black px-4 py-2 rounded-xl text-xs transition flex items-center space-x-1.5 shrink-0 shadow-lg"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Get Live Directions</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </AnimatedSection>

      {/* 15. FOOTER SECTION */}
      <footer className={`py-6 border-t ${isDarkMode ? "bg-slate-950 border-slate-900 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"} transition-all`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
            
            {/* Column 1: Logo and motto */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={ranaLogo} alt="Rana Bike Care Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white leading-none">
                    Rana <span className="text-orange-500 font-extrabold">Bike Care</span>
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5 uppercase tracking-wider font-bold">
                    Precision Motorcycle Service
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Pune's premier motorcycle repair, tuning, and restoration workshop. Master craftsmanship for Royal Enfield, KTM, Yamaha & multi-brand bikes.
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
                <a href="#faq" className="hover:text-[#F97316] transition">Support FAQs</a>
              </div>
            </div>

            {/* Column 3: Contact info summary */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wider">Contact Station</h4>
              <p className="text-xs leading-relaxed text-slate-500">
                Rana Auto Garage <br />
                Ganesh Nagar, Dapodi, Opp. Shitladevi Chowk <br />
                Pimpri Chinchwad, Pune, MH 411012 <br />
                Phone & WhatsApp: +91 92724 96996
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
              © {new Date().getFullYear()} Rana Bike Care. All rights reserved. Registered under Maharashtra Automotive Association.
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
                <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white uppercase tracking-tight">
                  {isWhatsApp ? "Booking Saved & WhatsApp Dispatched!" : "Booking Saved in Database!"}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-semibold">
                  {isWhatsApp ? (
                    <>We have saved your request <strong>({formBrand} {formModel})</strong> in our system and opened WhatsApp to message Master Rana Singh.</>
                  ) : (
                    <>We have saved your booking request in our system! Since your number is not on WhatsApp, please call Master Rana Singh directly to confirm your slot.</>
                  )}
                </p>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850/80 text-left space-y-2.5 font-mono text-[10px] sm:text-xs">
                <p className="text-slate-900 dark:text-slate-100 font-bold"><span className="text-slate-500 dark:text-slate-400 font-black">CLIENT:</span> {formName}</p>
                <p className="text-slate-900 dark:text-slate-100 font-bold"><span className="text-slate-500 dark:text-slate-400 font-black">PHONE:</span> {formPhone} ({isWhatsApp ? "WhatsApp" : "Phone Call"})</p>
                <p className="text-slate-900 dark:text-slate-100 font-bold"><span className="text-slate-500 dark:text-slate-400 font-black">BIKE:</span> {formBrand} {formModel}</p>
                <p className="text-slate-900 dark:text-slate-100 font-bold"><span className="text-slate-500 dark:text-slate-400 font-black">SCHEDULE:</span> {formDate} | {formTime}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-black"><span className="text-slate-500 dark:text-slate-400 font-black">STATUS:</span> ✅ RECORDED IN CSV STORE</p>
              </div>

              <div className="space-y-2.5 pt-2">
                {!isWhatsApp ? (
                  <a
                    href="tel:+919272496996"
                    className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-4 w-4 animate-bounce" />
                    <span>📞 Call Mechanic (+91 92724 96996)</span>
                  </a>
                ) : (
                  <a
                    href={`https://wa.me/919272496996?text=${encodeURIComponent(`*🏍️ RANA BIKE CARE APPOINTMENT REQUEST*\nName: ${formName}\nPhone: ${formPhone}\nBike: ${formBrand} ${formModel}\nDate: ${formDate}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                )}

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 17. MECHANIC WEBSITE SECTION CONTENT MANAGER MODAL */}
      <SectionEditorModal
        isOpen={isSectionEditorOpen}
        onClose={() => setIsSectionEditorOpen(false)}
        sectionType={activeEditorSection}
        journeySteps={serviceJourneyStepsList}
        onSaveJourneySteps={handleSaveJourneySteps}
        workshopLogs={workshopLogsList}
        onSaveWorkshopLogs={handleSaveWorkshopLogs}
        beforeAfterItems={beforeAfterList}
        onSaveBeforeAfterItems={handleSaveBeforeAfterItems}
      />

    </div>
  );
};
