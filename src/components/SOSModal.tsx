import React, { useState, useEffect } from "react";
import { generateGoogleMapsUrl } from "../utils/locationUtils";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MapPin,
  Phone,
  Navigation,
  MessageSquare,
  ShieldAlert,
  CheckCircle,
  ExternalLink,
  User,
  FileText,
  Smartphone,
  PhoneCall,
  AlertCircle
} from "lucide-react";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MECHANIC_PHONE = "+91 97678 24216";
const MECHANIC_RAW_PHONE = "+919767824216";

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [manualLocation, setManualLocation] = useState("");
  const [issueNote, setIssueNote] = useState("");

  // Geolocation states
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formattedWaUrl, setFormattedWaUrl] = useState("");
  const [formattedSmsUrl, setFormattedSmsUrl] = useState("");

  const acquirePhoneLocation = () => {
    setIsLocating(true);
    if (!("geolocation" in navigator)) {
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
      (error) => {
        console.warn("Geolocation warning:", error.message);
        setGpsCoords({ lat: 18.5362, lon: 73.8940 });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (isOpen) {
      acquirePhoneLocation();
    }
  }, [isOpen]);

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

  const prepareDispatchData = () => {
    let mapsUrl = "";
    let locationText = "";

    if (gpsCoords) {
      mapsUrl = `https://maps.google.com/?q=${gpsCoords.lat.toFixed(6)},${gpsCoords.lon.toFixed(6)}`;
      locationText = `Lat ${gpsCoords.lat.toFixed(5)}, Lon ${gpsCoords.lon.toFixed(5)}`;
    } else {
      mapsUrl = generateGoogleMapsUrl(manualLocation || "Koregaon Park, Pune");
      locationText = manualLocation || "Pune Breakdown Area";
    }

    if (manualLocation.trim()) {
      locationText += ` (${manualLocation.trim()})`;
    }

    const issueText = issueNote.trim() ? issueNote.trim() : "Urgent road breakdown rescue required";

    const fullMessage = `🚨 *EMERGENCY SOS BREAKDOWN* 🚨
👤 Name: ${customerName.trim() || "Rider"}
📞 Phone: ${customerPhone.trim() || "Not provided"}
📍 Location: ${locationText}
🗺️ Map: ${mapsUrl}
📝 Issue: ${issueText}
----------------------------------------
⚠️ URGENT RESCUE - RANA GARAGE PUNE (+91 97678 24216)`;

    return {
      fullMessage,
      waUrl: `https://wa.me/919767824216?text=${encodeURIComponent(fullMessage)}`,
      smsUrl: `sms:+919767824216?body=${encodeURIComponent(fullMessage)}`
    };
  };

  const handleSendSOSWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const data = prepareDispatchData();
    setFormattedWaUrl(data.waUrl);
    setFormattedSmsUrl(data.smsUrl);
    setIsSubmitted(true);

    window.open(data.waUrl, "_blank");
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
          className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500/80 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
        >
          {/* Header Banner - High Visibility SOS Red */}
          <div className="bg-rose-600 px-5 py-4 flex items-center justify-between text-white shrink-0 shadow-md">
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-white/20 rounded-xl animate-pulse">
                <ShieldAlert className="h-5 w-5 text-white" />
              </span>
              <div>
                <h3 className="font-display font-black text-sm uppercase tracking-wider">🚨 EMERGENCY SOS RESCUE</h3>
                <p className="text-[11px] text-rose-100 font-medium">Live Phone GPS Breakdown Dispatch</p>
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
            <form onSubmit={handleSendSOSWhatsApp} className="p-5 space-y-4 overflow-y-auto">
              {/* High-Contrast Phone GPS Location Box */}
              <div className="bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <MapPin className={`h-4 w-4 ${gpsCoords ? "text-emerald-400" : "text-amber-400 animate-bounce"}`} />
                    <span className="font-bold text-slate-100">Phone GPS Location:</span>
                  </div>

                  <button
                    type="button"
                    onClick={acquirePhoneLocation}
                    disabled={isLocating}
                    className="inline-flex items-center space-x-1 text-[11px] font-extrabold uppercase text-rose-400 hover:text-rose-300 cursor-pointer disabled:opacity-50"
                  >
                    <Navigation className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                    <span>{isLocating ? "Locating..." : "REFRESH GPS"}</span>
                  </button>
                </div>

                {gpsCoords ? (
                  <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40 flex items-center justify-between">
                    <span className="font-semibold">🟢 Lat {gpsCoords.lat.toFixed(5)}, Lon {gpsCoords.lon.toFixed(5)}</span>
                    <a
                      href={`https://maps.google.com/?q=${gpsCoords.lat},${gpsCoords.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:underline font-bold text-[10px] flex items-center gap-0.5 bg-emerald-700/60 px-2 py-0.5 rounded"
                    >
                      <span>Map</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-amber-300 bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/40">
                    🟡 Fetching live phone coordinates...
                  </div>
                )}
              </div>

              {/* 1. Full Name Input - Friendly High Contrast Field */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-rose-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:border-rose-500 focus:bg-slate-800/90 focus:ring-1 focus:ring-rose-500 outline-none transition font-medium"
                />
              </div>

              {/* 2. Phone Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-rose-400" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9767824216"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:border-rose-500 focus:bg-slate-800/90 focus:ring-1 focus:ring-rose-500 outline-none transition font-mono font-medium"
                />
              </div>

              {/* 3. Location / Address Input */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-rose-400" />
                  <span>Location / Landmark Address *</span>
                </label>
                <input
                  type="text"
                  required={!gpsCoords}
                  placeholder="e.g. Koregaon Park Lane 7 / Petrol Pump"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:border-rose-500 focus:bg-slate-800/90 focus:ring-1 focus:ring-rose-500 outline-none transition font-medium"
                />
              </div>

              {/* 4. Issue Description */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>Issue Description</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal uppercase">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Flat tyre, engine stopped, chain broken..."
                  value={issueNote}
                  onChange={(e) => setIssueNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:border-rose-500 focus:bg-slate-800/90 focus:ring-1 focus:ring-rose-500 outline-none transition font-medium"
                />
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-rose-950/60 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Send SOS via WhatsApp</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/40">
                <CheckCircle className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">SOS Dispatched to WhatsApp</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your location details have been prepared for WhatsApp.
                </p>
              </div>

              {/* Notice if phone number has no WhatsApp */}
              <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-left space-y-1.5 shadow-sm">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>No WhatsApp linked with your number?</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  If your phone number is not linked with WhatsApp or connection fails, call Chief Mechanic directly or send an SMS request:
                </p>
              </div>

              {/* Mechanic Direct Number Card */}
              <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block font-semibold">Chief Mechanic Hotline</span>
                  <span className="text-sm font-black text-rose-400 font-mono">{MECHANIC_PHONE}</span>
                </div>
                <a
                  href={`tel:${MECHANIC_RAW_PHONE}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>CALL DIRECT</span>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                <a
                  href={formattedWaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/40"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open WhatsApp Again</span>
                </a>

                <a
                  href={formattedSmsUrl}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold py-2.5 rounded-xl text-xs transition border border-rose-500/40 flex items-center justify-center space-x-2"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Send Request via SMS</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full text-slate-400 hover:text-slate-200 font-semibold py-1.5 text-xs transition cursor-pointer"
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
