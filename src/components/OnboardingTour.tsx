import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wrench, 
  Sparkles, 
  MessageSquare, 
  Activity, 
  Cpu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  ShieldCheck,
  Check,
  Smartphone
} from "lucide-react";

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  accentText: string;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset steps when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps: TourStep[] = [
    {
      badge: "Welcome Tour",
      title: "Rana Garage Premium Motorcare",
      description: "Welcome to Pune's premium, full-stack two-wheeler workshop platform! Rana Garage combines elite engineering with offline transparent dispatch directly via WhatsApp.",
      icon: <Wrench className="h-8 w-8 text-white stroke-[2.5]" />,
      colorClass: "bg-orange-500 border-orange-600 shadow-orange-500/25",
      accentText: "Experience 100% transparency & zero upfront payments."
    },
    {
      badge: "Step 1 of 4",
      title: "Explore Services & Rates",
      description: "Browse curated maintenance plans (General, Diagnostic, and Custom Performance Tuning). Check out our real-time interactive Before & After comparison slider to see actual workshop restoration jobs!",
      icon: <Sparkles className="h-8 w-8 text-white" />,
      colorClass: "bg-[#58cc02] border-[#46a302] shadow-[#58cc02]/25",
      accentText: "Slide, compare, and understand precise service components before booking."
    },
    {
      badge: "Step 2 of 4",
      title: "WhatsApp Dispatch Ticket",
      description: "Request a repair slot by providing details and capturing your highly accurate phone GPS location. The platform generates an instant pre-filled premium WhatsApp ticket block to dispatch to Rana Singh.",
      icon: <MessageSquare className="h-8 w-8 text-white" />,
      colorClass: "bg-[#1cb0f6] border-[#0ea5e9] shadow-[#1cb0f6]/25",
      accentText: "One-click geolocation capture ensures quick emergency assistance!"
    },
    {
      badge: "Step 3 of 4",
      title: "Live Active Repair Tracker",
      description: "Keep tabs on your bike during active workshop processing. The customer dashboard displays real-time mechanic checklist logs, current phase highlights, diagnostic photos, and itemized invoice details.",
      icon: <Activity className="h-8 w-8 text-white" />,
      colorClass: "bg-purple-500 border-purple-600 shadow-purple-500/25",
      accentText: "Track progress from intake through test-rides to final collection."
    },
    {
      badge: "Step 4 of 4",
      title: "Simulated Roles Hub",
      description: "Test the complete ecosystem! Toggle between Customer, Mechanic, and Admin roles to simulate adding replacement parts, updating repair checklist phases, uploading workshop photos, and generating invoices.",
      icon: <Cpu className="h-8 w-8 text-white" />,
      colorClass: "bg-amber-500 border-amber-600 shadow-amber-500/25",
      accentText: "Click the 'Staff Hub' or bottom 'Switch' button to test other panels!"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("rana_garage_onboarding_completed", "true");
    onClose();
  };

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <div id="onboarding-tour-overlay" className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        {/* Background Click Shield */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative bg-white w-full max-w-lg rounded-3xl border-2 border-b-8 border-slate-200 text-slate-800 shadow-2xl p-6 md:p-8 overflow-hidden z-10 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Row with step indicator and close */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
            <span className="px-3.5 py-1.5 bg-slate-150 text-slate-700 font-extrabold text-[10px] tracking-wider uppercase rounded-full border border-slate-200">
              {step.badge}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Skip Tour"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Animated step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="py-6 space-y-5"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-2xl border-2 border-b-4 ${step.colorClass} flex items-center justify-center`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-display font-black text-lg md:text-xl text-slate-950 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-orange-500 font-mono tracking-wider uppercase font-bold mt-1 flex items-center">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified Service
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {step.description}
              </p>

              <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 flex items-start space-x-3">
                <div className="bg-white rounded-full p-1 border border-slate-200 text-[#58cc02] shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                </div>
                <p className="text-xs font-bold text-slate-700 leading-normal">
                  {step.accentText}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6 flex">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-full transition-all duration-300 ${
                  idx <= currentStep 
                    ? currentStep === 4 ? "bg-[#58cc02]" : "bg-orange-500" 
                    : "bg-slate-100"
                } ${idx > 0 ? "border-l border-white" : ""}`}
              />
            ))}
          </div>

          {/* Bottom actions row */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100 space-x-3">
            <button
              onClick={handleComplete}
              className="text-slate-400 hover:text-slate-700 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Skip Tour
            </button>

            <div className="flex items-center space-x-3 shrink-0">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-b-4 border-slate-200 active:translate-y-[2px] active:border-b-2 font-black tracking-wider text-xs uppercase px-4 py-3 rounded-2xl transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className={`text-white font-black tracking-widest text-xs uppercase px-5 py-3 rounded-2xl transition-all flex items-center space-x-1.5 cursor-pointer active:translate-y-[2px] active:border-b-2 border-b-4 ${
                  currentStep === steps.length - 1
                    ? "bg-[#58cc02] hover:bg-[#46a302] border-[#377e02]"
                    : "bg-orange-500 hover:bg-orange-600 border-orange-700"
                }`}
              >
                <span>{currentStep === steps.length - 1 ? "Let's Go!" : "Next"}</span>
                {currentStep === steps.length - 1 ? (
                  <ArrowRight className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
