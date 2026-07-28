import React, { useState } from "react";
import { AppProvider } from "./AppContext";
import { LandingPage } from "./components/LandingPage";
import { BookingWizard } from "./components/BookingWizard";
import { UsersModal } from "./components/UsersModal";
import { ServiceType } from "./types";
import { motion } from "motion/react";
import { Phone, MessageSquare } from "lucide-react";

const MainAppContent: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ServiceType | undefined>(undefined);

  const handleOpenBooking = (serviceName?: ServiceType) => {
    setPreselectedService(serviceName);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative selection:bg-rose-500 selection:text-white">
      {/* Main Animated Website */}
      <main className="flex-grow">
        <LandingPage
          onOpenBooking={handleOpenBooking}
          onNavigateToRole={() => {}}
          onOpenUsers={() => setIsUsersOpen(true)}
        />
      </main>

      {/* Floating Action Bar (Call & WhatsApp Direct Access) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        <motion.a
          href="tel:+919767824216"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-full shadow-xl border border-slate-700/80 tracking-wide"
        >
          <Phone className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="hidden xs:inline">+91 97678 24216</span>
        </motion.a>

        <motion.a
          href="https://wa.me/919767824216?text=Hello%20Rana%20Singh%20(Rana%20Garage),%20I%20have%20an%20inquiry%20regarding%20motorcycle%20repair%20and%20service."
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xl border border-emerald-400 tracking-wide cursor-pointer"
        >
          <MessageSquare className="h-4 w-4 text-white" />
          <span>WhatsApp Chat</span>
        </motion.a>
      </div>

      {/* Booking Request Modal Overlay (Direct WhatsApp Connect) */}
      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={preselectedService}
      />

      {/* Website Owner Users & Lead Requests Data Modal (6-Digit PIN Security) */}
      <UsersModal
        isOpen={isUsersOpen}
        onClose={() => setIsUsersOpen(false)}
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

