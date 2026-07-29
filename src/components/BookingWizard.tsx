import React, { useState, useEffect } from "react";
import { ServiceType } from "../types";
import { useApp } from "../AppContext";
import {
  X,
  MessageSquare,
  User,
  Phone,
  Wrench,
  CheckCircle,
  ExternalLink,
  Calendar,
  MapPin,
  Navigation,
  FileText,
  Bike
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ServiceCategorySelector } from "./ServiceCategorySelector";

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceType;
}

const BRANDS = [
  "Royal Enfield",
  "Honda",
  "Yamaha",
  "TVS",
  "Bajaj",
  "Hero",
  "KTM",
  "Suzuki",
  "Jawa",
  "BMW",
  "Ather",
  "Other"
];

const CATEGORIES = [
  "General Maintenance",
  "Engine Repair",
  "Brake Overhaul",
  "Oil & Filter Change",
  "Battery & Electrical",
  "Chain Lube & Clean",
  "Suspension Repair",
  "Tyre & Puncture",
  "Washing & Polishing",
  "Custom Repair"
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  preselectedService
}) => {
  const { addUserRequest } = useApp();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isWhatsApp, setIsWhatsApp] = useState<boolean>(true);
  const [bikeBrand, setBikeBrand] = useState("Royal Enfield");
  const [bikeModel, setBikeModel] = useState("Classic 350");
  const [serviceCategory, setServiceCategory] = useState<string>(
    preselectedService || "General Maintenance"
  );
  const [locationAddress, setLocationAddress] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

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
        if (!locationAddress) {
          setLocationAddress(`Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)} (Live GPS)`);
        }
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
      setServiceCategory(preselectedService);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullBike = `${bikeBrand} ${bikeModel}`.trim();
    let locText = locationAddress.trim();
    if (gpsCoords && !locText.includes("GPS")) {
      locText += ` (Live GPS: https://maps.google.com/?q=${gpsCoords.lat.toFixed(6)},${gpsCoords.lon.toFixed(6)})`;
    }

    // Save to user requests store
    if (addUserRequest) {
      addUserRequest({
        name: customerName.trim(),
        phone: customerPhone.trim(),
        isWhatsApp: isWhatsApp,
        bikeModel: fullBike || "Motorcycle",
        serviceCategory: serviceCategory,
        description: issueDescription.trim() || "General Maintenance & Inspection",
        preferredDate: bookingDate,
        preferredSlot: "Flexible Day Slot",
        pickupOption: "None",
        location: locText || "Pune Workshop Visit"
      });
    }

    const message = `🔧 *SERVICE BOOKING REQUEST - RANA GARAGE*
----------------------------------------
👤 *Customer Name:* ${customerName.trim()}
📞 *Phone Number:* ${customerPhone.trim()} (${isWhatsApp ? "WhatsApp Active" : "Call Only"})
🏍️ *Bike Details:* ${fullBike}
🛠️ *Issue Category:* ${serviceCategory}
📝 *Description:* ${issueDescription.trim() || "General Maintenance"}
📍 *Location:* ${locText || "Pune Workshop Visit"}
📅 *Preferred Date:* ${bookingDate}
----------------------------------------
📍 *Rana Garage:* Lane 7, Koregaon Park, Pune
📞 *Helpline:* +91 97678 24216`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/919767824216?text=${encoded}`;

    setFormattedWaUrl(url);
    setIsSubmitted(true);

    if (isWhatsApp) {
      window.open(url, "_blank");
    }
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
          className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/80 text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
        >
          {/* Header Banner */}
          <div className="bg-emerald-600 px-5 py-3.5 flex items-center justify-between text-white shrink-0 shadow-md">
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-white/20 rounded-xl">
                <Wrench className="h-5 w-5 text-white" />
              </span>
              <div>
                <h3 className="font-display font-black text-sm uppercase tracking-wider">🔧 QUICK SERVICE BOOKING</h3>
                <p className="text-[11px] text-emerald-100 font-medium">Direct Connect to Master Rana Garage</p>
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
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
              
              {/* SECTION 1: CONTACT INFORMATION */}
              <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/70">
                <div className="flex items-center gap-1.5 border-b border-slate-700 pb-2">
                  <User className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">1. Contact Details</span>
                </div>

                {/* Input with Label under Placeholder */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter Full Name (e.g. Rajkumar Shinde)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-emerald-500 outline-none transition font-medium"
                  />
                  <label className="block text-[11px] font-bold text-slate-400 mt-1 pl-1">
                    Customer Full Name *
                  </label>
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-Digit Phone Number (e.g. 9823045678)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition font-mono font-medium ${
                      customerPhone.replace(/\D/g, "").length === 10
                        ? "border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        : customerPhone.length > 0
                        ? "border-amber-500"
                        : "border-slate-700"
                    }`}
                  />
                  <label className="block text-[11px] font-bold text-slate-400 mt-1 pl-1">
                    Mobile Phone Number *
                  </label>
                  <div className="mt-0.5 text-[10px] font-mono pl-1">
                    {customerPhone.replace(/\D/g, "").length === 10 ? (
                      <span className="text-emerald-400 font-bold">✓ Valid 10-digit phone number</span>
                    ) : (
                      <span className="text-slate-500">Must be 10 digits</span>
                    )}
                  </div>
                </div>

                {/* ASK: IS THIS YOUR WHATSAPP NUMBER? */}
                <div className="pt-2 border-t border-slate-700/60">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWhatsApp(true)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                        isWhatsApp
                          ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950/50"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Yes, WhatsApp Active</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsWhatsApp(false)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                        !isWhatsApp
                          ? "bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-950/50"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Phone className="h-3 w-3" />
                      <span>No, Call Only</span>
                    </button>
                  </div>
                  <label className="block text-[11px] font-bold text-slate-400 mt-1 pl-1 text-center">
                    Is this your WhatsApp active phone number? *
                  </label>
                </div>
              </div>

              {/* SECTION 2: BIKE BRAND AND MODEL */}
              <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/70">
                <div className="flex items-center gap-1.5 border-b border-slate-700 pb-2">
                  <Bike className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">2. Bike Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <select
                      value={bikeBrand}
                      onChange={(e) => setBikeBrand(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none cursor-pointer font-medium"
                    >
                      {BRANDS.map((b) => (
                        <option key={b} value={b} className="bg-slate-900 text-slate-100">
                          {b}
                        </option>
                      ))}
                    </select>
                    <label className="block text-[11px] font-bold text-slate-400 mt-1 pl-1">
                      Motorcycle Manufacturer / Brand *
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Classic 350 / Duke 200"
                      value={bikeModel}
                      onChange={(e) => setBikeModel(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-emerald-500 outline-none transition font-medium"
                    />
                    <label className="block text-[11px] font-bold text-slate-400 mt-1 pl-1">
                      Specific Bike Model Name *
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 3: LOCATION & DATE */}
              <div className="space-y-2 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/70">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">3. Location & Preferred Date</span>
                  </div>

                  <button
                    type="button"
                    onClick={acquirePhoneLocation}
                    disabled={isLocating}
                    className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className={`h-3 w-3 ${isLocating ? "animate-spin" : ""}`} />
                    <span>{isLocating ? "Locating..." : "Auto Fetch GPS"}</span>
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lane 7, Koregaon Park, Pune"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-emerald-500 outline-none transition font-medium"
                  />
                  <label className="block text-[11px] font-bold text-slate-400 mt-1 pl-1">
                    Service Area / Workshop Address Location *
                  </label>
                  {gpsCoords && (
                    <p className="text-[10px] text-emerald-400 font-mono mt-0.5 pl-1">
                      ✓ Live GPS Captured: {gpsCoords.lat.toFixed(5)}, {gpsCoords.lon.toFixed(5)}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 outline-none transition font-medium cursor-pointer"
                  />
                  <label className="block text-[11px] font-bold text-slate-400 mt-1 pl-1">
                    Preferred Service Date *
                  </label>
                </div>
              </div>

              {/* SECTION 4: ISSUE CATEGORY */}
              <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/70">
                <div className="flex items-center gap-1.5 border-b border-slate-700 pb-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">4. Issue Category</span>
                </div>

                <div className="space-y-3">
                  <ServiceCategorySelector
                    selectedCategory={serviceCategory}
                    onSelectCategory={(cat) => setServiceCategory(cat)}
                    theme="dark"
                  />

                  <div className="pt-2 border-t border-slate-700/60">
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none cursor-pointer font-medium"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <label className="block text-[11px] font-bold text-slate-400 mt-1 pl-1">
                      Selected Repair Category *
                    </label>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={customerPhone.replace(/\D/g, "").length !== 10}
                className={`w-full font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center space-x-2 mt-2 ${
                  customerPhone.replace(/\D/g, "").length === 10
                    ? isWhatsApp
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-[0.99]"
                      : "bg-amber-600 hover:bg-amber-500 text-white cursor-pointer active:scale-[0.99]"
                    : "bg-slate-800 text-slate-500 border border-slate-700/80 cursor-not-allowed opacity-60"
                }`}
              >
                {isWhatsApp ? (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Confirm Booking & Dispatch on WhatsApp</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    <span>Save Booking & Call Mechanic Directly</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto border ${
                isWhatsApp ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-amber-500/20 text-amber-400 border-amber-500/40"
              }`}>
                <CheckCircle className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">
                  {isWhatsApp ? "Booking Saved & WhatsApp Opened!" : "Booking Saved in Database!"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isWhatsApp
                    ? "Your booking details are recorded in our database and sent via WhatsApp to Chief Mechanic Master Rana Singh."
                    : "Your request is saved in our database! Since your number is not on WhatsApp, please call Master Rana Singh directly to confirm."}
                </p>
              </div>

              <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-slate-300 font-mono space-y-1 text-left">
                <p><span className="text-slate-400">Customer:</span> <strong className="text-white">{customerName}</strong></p>
                <p><span className="text-slate-400">Phone:</span> <strong className="text-white">{customerPhone}</strong> ({isWhatsApp ? "WhatsApp" : "Phone Call"})</p>
                <p><span className="text-slate-400">Bike:</span> <strong className="text-emerald-400">{bikeBrand} {bikeModel}</strong></p>
                <p><span className="text-slate-400">Category:</span> <strong className="text-amber-400">{serviceCategory}</strong></p>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                {isWhatsApp ? (
                  <a
                    href={formattedWaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open WhatsApp Message</span>
                  </a>
                ) : (
                  <a
                    href="tel:+919767824216"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Phone className="h-4 w-4 animate-bounce" />
                    <span>📞 Call Mechanic Master Rana (+91 97678 24216)</span>
                  </a>
                )}

                <button
                  onClick={handleReset}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Done / Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
