import React, { useState, useEffect } from "react";
import { ServiceType } from "../types";
import {
  X,
  MessageSquare,
  User,
  Phone,
  Wrench,
  CheckCircle,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceType;
}

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM"
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [issueDescription, setIssueDescription] = useState<string>(
    preselectedService ? `Requesting: ${preselectedService}` : ""
  );
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [bookingSlot, setBookingSlot] = useState("10:00 AM - 12:00 PM");

  // Geolocation states
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formattedWaUrl, setFormattedWaUrl] = useState("");

  const acquirePhoneLocation = () => {
    setIsLocating(true);
    if (!("navigator" in window) || !("geolocation" in navigator)) {
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setGpsCoords({ lat, lon });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  useEffect(() => {
    if (isOpen) {
      acquirePhoneLocation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedService) {
      setIssueDescription(`Requesting: ${preselectedService}`);
    }
  }, [preselectedService]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    let locText = locationAddress.trim();
    if (gpsCoords) {
      locText += ` (Live GPS: https://maps.google.com/?q=${gpsCoords.lat.toFixed(6)},${gpsCoords.lon.toFixed(6)})`;
    }

    const message = `🔧 *SLOT BOOKING REQUEST - RANA GARAGE*
----------------------------------------
👤 *Full Name:* ${customerName.trim()}
📞 *Phone Number:* ${customerPhone.trim()}
📍 *Location / Address:* ${locText || "Customer Self Visit"}
📝 *Issue Description:* ${issueDescription.trim() || "General Checkup & Service"}
📅 *Date:* ${bookingDate}
⏰ *Time:* ${bookingSlot}
----------------------------------------
📍 *Garage Location:* Lane 7, Koregaon Park, Pune
📞 *Helpline:* +91 97678 24216`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/919767824216?text=${encoded}`;

    setFormattedWaUrl(url);
    setIsSubmitted(true);

    window.open(url, "_blank");
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-500/80 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
        >
          {/* Header Banner - High Visibility Emerald Green */}
          <div className="bg-emerald-600 px-5 py-4 flex items-center justify-between text-white shrink-0 shadow-md">
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-white/20 rounded-xl">
                <Wrench className="h-5 w-5 text-white" />
              </span>
              <div>
                <h3 className="font-display font-black text-sm uppercase tracking-wider">🔧 STANDARD SLOT BOOKING</h3>
                <p className="text-[11px] text-emerald-100 font-medium">Direct Connect to Rana Garage</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSendToWhatsApp} className="p-5 space-y-4 overflow-y-auto">
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-emerald-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:bg-slate-800/90 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                />
              </div>

              {/* 2. Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9767824216"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:bg-slate-800/90 focus:ring-1 focus:ring-emerald-500 outline-none transition font-mono font-medium"
                />
              </div>

              {/* 3. Live Phone GPS Location / Landmark Address */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <span>Live GPS Location / Landmark Address</span>
                  </label>
                  <button
                    type="button"
                    onClick={acquirePhoneLocation}
                    disabled={isLocating}
                    className="text-[11px] font-extrabold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                    <span>{isLocating ? "Locating..." : "FETCH GPS"}</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder={gpsCoords ? `GPS Locked: ${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lon.toFixed(4)} (or type address)` : "Enter locality or landmark address"}
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:bg-slate-800/90 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                />
                {gpsCoords && (
                  <p className="text-[11px] text-emerald-400 mt-1 font-mono font-semibold">
                    ✓ GPS Lat: {gpsCoords.lat.toFixed(5)}, Lon: {gpsCoords.lon.toFixed(5)}
                  </p>
                )}
              </div>

              {/* 4. Issue Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span>Issue Description</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the issue or service needed..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:bg-slate-800/90 focus:ring-1 focus:ring-emerald-500 outline-none transition font-medium"
                />
              </div>

              {/* 5. Date */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span>Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:bg-slate-800/90 outline-none transition font-medium cursor-pointer"
                />
              </div>

              {/* 6. Time */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Time *</span>
                </label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 focus:bg-slate-800/90 outline-none cursor-pointer transition font-medium"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot} className="bg-slate-900 text-slate-100">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/60 flex items-center justify-center space-x-2 cursor-pointer mt-2 active:scale-[0.99]"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Confirm Slot on WhatsApp</span>
              </button>
            </form>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Booking Prepared</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your slot request has been sent to WhatsApp. Chief Mechanic Rana Singh will review and confirm your booking.
                </p>
              </div>

              <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-slate-300 font-mono shadow-inner">
                <p>Mechanic Phone: <strong className="text-emerald-400 font-bold">+91 97678 24216</strong></p>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                <a
                  href={formattedWaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open WhatsApp</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
