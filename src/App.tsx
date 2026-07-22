import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./AppContext";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { CustomerDashboard } from "./components/CustomerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { MechanicPanel } from "./components/MechanicPanel";
import { BookingWizard } from "./components/BookingWizard";
import { InvoicePrintModal } from "./components/InvoicePrintModal";
import { CommunicationsDrawer } from "./components/CommunicationsDrawer";
import { OnboardingTour } from "./components/OnboardingTour";
import { SOSModal } from "./components/SOSModal";
import { ServiceType, Invoice } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, MessageSquare, ExternalLink, Settings } from "lucide-react";

const MainAppContent: React.FC = () => {
  const { currentRole, currentCustomer } = useApp();

  // Navigation / Modal States
  const [showDashboard, setShowDashboard] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ServiceType | undefined>(undefined);
  
  // Invoice print state
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Guided Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    // Check if onboarding is completed for new user
    const completed = localStorage.getItem("rana_garage_onboarding_completed");
    if (completed !== "true") {
      setIsTourOpen(true);
    }

    const handleStartTour = () => {
      setIsTourOpen(true);
    };
    window.addEventListener("start-rana-tour", handleStartTour);
    return () => {
      window.removeEventListener("start-rana-tour", handleStartTour);
    };
  }, []);

  const handleOpenBooking = (serviceName?: ServiceType) => {
    setPreselectedService(serviceName);
    setIsBookingOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setActiveInvoice(invoice);
    setIsInvoiceOpen(true);
  };

  const handleNavigateToLanding = () => {
    setShowDashboard(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      
      {/* 1. Header with Role Selector */}
      {!(currentRole === "Customer" && !showDashboard) && (
        <Header
          onOpenBooking={() => handleOpenBooking()}
          onOpenMessages={() => setIsMessagesOpen(true)}
          onNavigateToLanding={handleNavigateToLanding}
        />
      )}

      {/* 2. Main Viewport Panel Router */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRole + (showDashboard ? "-dash" : "-landing")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Customer Role Routes */}
            {currentRole === "Customer" && (
              <>
                {showDashboard ? (
                  <CustomerDashboard
                    onOpenBooking={() => handleOpenBooking()}
                    onViewInvoice={handleViewInvoice}
                  />
                ) : (
                  <LandingPage
                    onOpenBooking={handleOpenBooking}
                    onNavigateToRole={(role) => {
                      if (role === "Customer") setShowDashboard(true);
                    }}
                    onOpenSOS={() => setIsSOSOpen(true)}
                  />
                )}
              </>
            )}

            {/* Admin/Garage Owner Suite Routes */}
            {currentRole === "Admin" && (
              <AdminDashboard onViewInvoice={handleViewInvoice} />
            )}

            {/* Mechanic Floor routes */}
            {currentRole === "Mechanic" && (
              <MechanicPanel />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Floating Quick Switch Navigation HUD (Stripe-like helper indicator in corners for visual reviews) */}
      {currentRole === "Customer" && (
        <div className="fixed bottom-6 right-6 z-30 no-print">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDashboard(!showDashboard)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-lg border border-slate-800 tracking-wide"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{showDashboard ? "Browse Services Catalog" : "Open My Live Tracker / Profile"}</span>
          </motion.button>
        </div>
      )}

      {/* 4. Booking Wizard Modal Overlay */}
      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
      />

      {/* SOS Breakdown Emergency Modal Overlay */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      {/* 5. Invoicing Print Modal overlay */}
      <InvoicePrintModal
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          setActiveInvoice(null);
        }}
        invoice={activeInvoice}
      />

      {/* 6. Messaging Simulation drawer log */}
      <CommunicationsDrawer
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />

      {/* 7. Onboarding Guided Tour Overlay */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
