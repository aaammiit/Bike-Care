import React, { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, MapPin, Phone, Truck, CheckCircle2, ShieldAlert, Navigation, Compass } from "lucide-react";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PUNE_AREAS = [
  "Koregaon Park, near Lane 7",
  "Kalyani Nagar, near Gold Adlabs",
  "Viman Nagar, near Phoenix Mall",
  "Hinjewadi Phase 1, near Wipro Circle",
  "Shivaji Nagar, near FC Road",
  "Camp, near MG Road",
  "Senapati Bapat Road, near ICC Towers"
];

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const { currentCustomer, bikes, triggerSOS } = useApp();

  const [selectedBikeId, setSelectedBikeId] = useState<string>(bikes[0]?.id || "other");
  const [issueType, setIssueType] = useState<string>("Flat Tyre / Puncture");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [phone, setPhone] = useState<string>(currentCustomer.mobile || "");
  const [customBike, setCustomBike] = useState<string>("");

  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Simulated live tracking states
  const [liveStep, setLiveStep] = useState<number>(0);

  const handleSimulateGps = () => {
    setIsSimulatingGps(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomArea = PUNE_AREAS[Math.floor(Math.random() * PUNE_AREAS.length)];
      setLocation(randomArea + " (Pinpoint Lock: " + (18.5204 + Math.random() * 0.05).toFixed(4) + "° N, " + (73.8567 + Math.random() * 0.05).toFixed(4) + "° E)");
      count++;
      if (count > 8) {
        clearInterval(interval);
        setIsSimulatingGps(false);
      }
    }, 150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalBikeDetails = "";
    if (selectedBikeId === "other") {
      finalBikeDetails = customBike || "Unknown Motorcycle";
    } else {
      const b = bikes.find(x => x.id === selectedBikeId);
      finalBikeDetails = b ? `${b.brand} ${b.model} (${b.registrationNumber})` : "Motorcycle";
    }

    const finalLocation = location || "Pune Main Road (GPS Est.)";

    triggerSOS({
      bikeId: selectedBikeId,
      bikeDetails: finalBikeDetails,
      issueType,
      description: description || "Stranded on road, need towing/on-site repair.",
      location: finalLocation
    });

    setIsSubmitted(true);

    // Auto progress live tracking simulation steps
    setTimeout(() => setLiveStep(1), 3000);
    setTimeout(() => setLiveStep(2), 7000);
  };

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-md min-h-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", duration: 0.45 }}
          className="relative w-full max-w-lg my-auto bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-500/30 max-h-[90vh] sm:max-h-[88vh] flex flex-col text-slate-800 dark:text-slate-100 z-10"
        >
          {/* Top SOS Warning Strip */}
          <div className="sticky top-0 z-30 bg-rose-600 dark:bg-rose-700 text-white px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between shadow-lg shrink-0 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0 flex-1 pr-1">
              <span className="p-1 sm:p-1.5 bg-white/20 rounded-lg animate-pulse shrink-0">
                <ShieldAlert className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-white" />
              </span>
              <div className="text-left min-w-0 flex-1">
                <h3 className="font-display font-black text-xs sm:text-sm tracking-wider uppercase truncate">🚨 EMERGENCY ROAD ASSIST</h3>
                <p className="text-[10px] sm:text-[11px] font-mono text-rose-100 uppercase tracking-wider truncate">Instant Rescue Dispatch Panel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close emergency SOS modal"
              title="Close (Esc)"
              className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-rose-800 text-white flex items-center justify-center transition-all cursor-pointer border border-white/30 shadow-2xs z-30 active:scale-95"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {/* Intro warning banner */}
                <div className="bg-rose-50 dark:bg-rose-950/40 p-4 rounded-2xl border border-rose-200/50 dark:border-rose-900/40 flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
                    <strong>Stranded on road in Pune?</strong> We provide instant pickups, tire puncture assistance, and spot repairs. A mechanical technician will be dispatched instantly on submission.
                  </p>
                </div>

                {/* Bike Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Stranded Vehicle
                  </label>
                  <select
                    value={selectedBikeId}
                    onChange={(e) => setSelectedBikeId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm font-bold focus:border-rose-500 focus:outline-none transition-colors"
                  >
                    {bikes.map((bike) => (
                      <option key={bike.id} value={bike.id}>
                        {bike.brand} {bike.model} ({bike.registrationNumber})
                      </option>
                    ))}
                    <option value="other">Other Bike / Custom Details</option>
                  </select>
                </div>

                {/* Custom Bike Input if Other */}
                {selectedBikeId === "other" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Enter Bike Brand, Model & Registration
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Honda Activa 6G (MH-12-AB-1234)"
                      value={customBike}
                      onChange={(e) => setCustomBike(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus:border-rose-500 focus:outline-none transition-colors"
                    />
                  </motion.div>
                )}

                {/* Breakdown Reason */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Emergency Issue Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Flat Tyre / Puncture",
                      "Engine Failure / No Start",
                      "Empty Fuel Tank",
                      "Clutch / Brake Jam",
                      "Minor Accident / Fall",
                      "Other Breakdown"
                    ].map((issue) => (
                      <button
                        key={issue}
                        type="button"
                        onClick={() => setIssueType(issue)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left border-2 transition-all flex items-center justify-between ${
                          issueType === issue
                            ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/30 dark:border-rose-500 dark:text-rose-300"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-950/40 dark:border-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <span>{issue}</span>
                        {issueType === issue && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Location GPS Sim */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Breakdown Location in Pune
                    </label>
                    <button
                      type="button"
                      onClick={handleSimulateGps}
                      disabled={isSimulatingGps}
                      className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 cursor-pointer disabled:opacity-50"
                    >
                      <Navigation className={`h-3 w-3 ${isSimulatingGps ? "animate-spin" : ""}`} />
                      <span>{isSimulatingGps ? "Acquiring GPS..." : "GPS Pinpoint"}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Near Westin Hotel, Koregaon Park"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus:border-rose-500 focus:outline-none transition-colors"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>

                {/* Phone number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="Enter emergency phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus:border-rose-500 focus:outline-none transition-colors"
                    />
                    <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>

                {/* Additional Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Describe any specific symptoms
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Heard a loud metal clanking then throttle free-spun. Oil dripping."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Warning Strip Stripes */}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/20 cursor-pointer relative overflow-hidden"
                  >
                    {/* Warning diagonal background stripes overlay */}
                    <div className="absolute inset-0 bg-repeat bg-[linear-gradient(45deg,#be123c_25%,transparent_25%,transparent_50%,#be123c_50%,#be123c_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-10 animate-[pulse_1.5s_infinite]" />
                    <Truck className="h-4.5 w-4.5 z-10 animate-bounce" />
                    <span className="z-10">DISPATCH RIDER NOW</span>
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center border-4 border-rose-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <Compass className="h-8 w-8 text-rose-600 dark:text-rose-400 animate-spin" style={{ animationDuration: "3s" }} />
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-lg tracking-tight text-rose-600 dark:text-rose-400">
                    RESCUE UNIT DISPATCHED!
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Our system has allocated emergency technician <strong>Karan Singh</strong> to head to your destination. We are tracking your location.
                  </p>
                </div>

                {/* Step timeline simulator */}
                <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-900 space-y-4 text-left">
                  <h5 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">
                    RESCUE LOG TRACKER
                  </h5>

                  <div className="space-y-4 relative pl-3 border-l-2 border-slate-200 dark:border-slate-800 ml-1.5">
                    {/* Step 1: Breakdown Logged */}
                    <div className="relative flex items-start space-x-3">
                      <div className="absolute -left-[21px] top-0.5 bg-white dark:bg-slate-900 rounded-full p-0.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="text-xs">
                        <p className="font-black text-slate-700 dark:text-slate-200">Emergency breakdown logged</p>
                        <p className="text-[10px] text-slate-400">10 seconds ago • System Dispatch</p>
                      </div>
                    </div>

                    {/* Step 2: Mechanic Dispatched */}
                    <div className="relative flex items-start space-x-3">
                      <div className="absolute -left-[21px] top-0.5 bg-white dark:bg-slate-900 rounded-full p-0.5">
                        {liveStep >= 1 ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-pulse" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping" />
                        )}
                      </div>
                      <div className="text-xs">
                        <p className={`font-black ${liveStep >= 1 ? "text-slate-700 dark:text-slate-200" : "text-rose-600 font-extrabold animate-pulse"}`}>
                          Technician Dispatch: Karan Singh
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {liveStep >= 1 ? "Mechanic with toolkits on route on workshop Duke 390" : "Dispatch in progress..."}
                        </p>
                      </div>
                    </div>

                    {/* Step 3: On Location */}
                    <div className="relative flex items-start space-x-3">
                      <div className="absolute -left-[21px] top-0.5 bg-white dark:bg-slate-900 rounded-full p-0.5">
                        {liveStep >= 2 ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-slate-100" />
                        )}
                      </div>
                      <div className="text-xs">
                        <p className={`font-bold ${liveStep >= 2 ? "text-slate-700 dark:text-slate-200 font-black" : "text-slate-400"}`}>
                          Estimated Arrival: 12 minutes
                        </p>
                        <p className="text-[10px] text-slate-400">GPS location matching active</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950 font-bold text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Go Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
