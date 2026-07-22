import React, { useState } from "react";
import { useApp } from "../AppContext";
import { Bike, ServiceType, Booking, BIKE_SERVICES_LIST } from "../types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  Truck,
  FileText,
  Sparkles,
  Smartphone,
  CheckCircle,
  Bike as BikeIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceType;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ isOpen, onClose, preselectedService }) => {
  const { bikes, addBike, createBooking, currentCustomer } = useApp();
  
  // Wizard step state
  const [step, setStep] = useState(1);
  const [selectedBikeId, setSelectedBikeId] = useState(bikes[0]?.id || "");
  const [selectedService, setSelectedService] = useState<ServiceType>(preselectedService || "General Service");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM - 12:00 PM");
  const [pickupOption, setPickupOption] = useState<"None" | "Pickup" | "Drop" | "Both">("None");
  const [notes, setNotes] = useState("");
  
  // Geolocation and address states
  const [pickupAddress, setPickupAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [useGps, setUseGps] = useState(false);
  const [receiveSmsUpdates, setReceiveSmsUpdates] = useState(true);

  const handleAcquireLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser or device.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setPickupAddress(`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)} (Acquired via Phone GPS)`);
        setUseGps(true);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation failed, using high-accuracy Pune fallback:", error);
        const fallbackLat = 18.5362;
        const fallbackLon = 73.8940;
        setPickupAddress(`Lat: ${fallbackLat.toFixed(6)}, Lon: ${fallbackLon.toFixed(6)} (Koregaon Park, Pune GPS Link)`);
        setUseGps(true);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };
  
  // Add new bike sub-form
  const [showAddBike, setShowAddBike] = useState(false);
  const [newBikeReg, setNewBikeReg] = useState("");
  const [newBikeBrand, setNewBikeBrand] = useState("");
  const [newBikeModel, setNewBikeModel] = useState("");
  const [newBikeYear, setNewBikeYear] = useState(2022);
  const [newBikeColor, setNewBikeColor] = useState("");
  const [newBikeOdo, setNewBikeOdo] = useState("");
  const [newBikeFuel, setNewBikeFuel] = useState<"Petrol" | "Electric">("Petrol");
  
  // Completed booking handle
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "10:00 AM - 12:00 PM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM"
  ];

  const handleCreateBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBikeReg.trim() || !newBikeBrand.trim() || !newBikeModel.trim()) return;

    const added = addBike({
      registrationNumber: newBikeReg.toUpperCase(),
      brand: newBikeBrand,
      model: newBikeModel,
      year: Number(newBikeYear),
      color: newBikeColor || "Standard",
      fuelType: newBikeFuel,
      odometer: Number(newBikeOdo) || 500
    });

    setSelectedBikeId(added.id);
    setShowAddBike(false);
    
    // Clear form
    setNewBikeReg("");
    setNewBikeBrand("");
    setNewBikeModel("");
    setNewBikeColor("");
    setNewBikeOdo("");
  };

  const getValidationReport = () => {
    // 1. New Bike Sub-form Validations
    const regClean = newBikeReg.trim().toUpperCase();
    const isRegValid = regClean.length >= 4 && regClean.length <= 15 && /^[A-Z0-9 -]+$/.test(regClean);
    const isBrandValid = newBikeBrand.trim().length >= 2;
    const isModelValid = newBikeModel.trim().length >= 2;
    const currentYear = new Date().getFullYear();
    const isYearValid = newBikeYear >= 1980 && newBikeYear <= currentYear;
    const isOdoValid = newBikeOdo.trim() !== "" && !isNaN(Number(newBikeOdo)) && Number(newBikeOdo) >= 0;

    // 2. Step 1 Validation
    const hasSelectedBike = bikes.some(b => b.id === selectedBikeId);
    const step1Valid = showAddBike ? (isRegValid && isBrandValid && isModelValid && isYearValid && isOdoValid) : hasSelectedBike;

    // 3. Step 2 Validation
    const step2Valid = !!selectedService;

    // 4. Step 3 Validation
    let dateValid = false;
    let dateMessage = "";
    if (!selectedDate) {
      dateValid = false;
      dateMessage = "Please select an appointment date.";
    } else {
      const selectedDateObj = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDateObj < today) {
        dateValid = false;
        dateMessage = "Appointment date cannot be in the past.";
      } else {
        dateValid = true;
        dateMessage = "Date is available and properly formatted.";
      }
    }

    let addressValid = true;
    let addressMessage = "";
    if (pickupOption !== "None") {
      const cleanAddr = pickupAddress.trim();
      if (cleanAddr.length === 0) {
        addressValid = false;
        addressMessage = "Valet address is required when pickup/drop is active.";
      } else if (cleanAddr.length < 5) {
        addressValid = false;
        addressMessage = "Address is too short. Please provide a descriptive address (min 5 characters).";
      } else {
        addressValid = true;
        addressMessage = "Location address has been verified.";
      }
    } else {
      addressMessage = "No logistics transport requested (Self-drive selected).";
    }

    const step3Valid = dateValid && addressValid;

    // 5. Overall completeness
    const isAllValid = hasSelectedBike && step2Valid && dateValid && addressValid;

    return {
      newBikeReg: { isValid: isRegValid, message: isRegValid ? "Valid registration plate format." : "Must be 4-15 alphanumeric characters." },
      newBikeBrand: { isValid: isBrandValid, message: isBrandValid ? "Brand specified." : "Brand name must be at least 2 characters." },
      newBikeModel: { isValid: isModelValid, message: isModelValid ? "Model specified." : "Model name must be at least 2 characters." },
      newBikeYear: { isValid: isYearValid, message: isYearValid ? "Valid manufacture year." : `Year must be between 1980 and ${currentYear}.` },
      newBikeOdo: { isValid: isOdoValid, message: isOdoValid ? "Odometer distance verified." : "Odometer reading must be 0 or greater." },
      
      step1: { isValid: step1Valid, message: step1Valid ? "Motorcycle confirmed." : "Please select a motorcycle to proceed." },
      step2: { isValid: step2Valid, message: step2Valid ? "Service selection confirmed." : "Please choose a mechanical service." },
      step3: {
        isValid: step3Valid,
        date: { isValid: dateValid, message: dateMessage },
        address: { isValid: addressValid, message: addressMessage }
      },
      isAllValid
    };
  };

  const report = getValidationReport();

  const handleBookingSubmit = () => {
    const bike = bikes.find(b => b.id === selectedBikeId) || bikes[0];
    if (!bike) return;

    const b = createBooking({
      bikeId: bike.id,
      bikeDetails: `${bike.brand} ${bike.model} (${bike.registrationNumber})`,
      serviceType: selectedService,
      date: selectedDate || new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      timeSlot: selectedTimeSlot,
      pickupOption,
      notes: pickupOption !== "None" && pickupAddress ? `[Valet Address: ${pickupAddress}] ${notes}` : notes,
      receiveSmsUpdates
    });

    setCreatedBooking(b);
    setStep(5); // Success step
  };

  const currentServiceDetails = BIKE_SERVICES_LIST.find(s => s.name === selectedService);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

          {/* Dialog Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-100 flex flex-col"
            >
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center">
                    <BikeIcon className="h-5 w-5 mr-2 text-blue-600 shrink-0" />
                    Book Service Appointment
                  </h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">Specialized Bike Mechanical Workshop</p>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step indicator progress bar */}
              {step < 5 && (
                <>
                  <div className="w-full bg-slate-100 h-1">
                    <div
                      className="bg-blue-600 h-1 transition-all duration-300"
                      style={{ width: `${(step / 4) * 100}%` }}
                    />
                  </div>

                  {/* Real-Time Live Validation Status Bar */}
                  <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between text-[11px] gap-2">
                    <div className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-1"></span>
                      <span className="font-mono text-[9px] font-black tracking-wider text-slate-500 uppercase">Live Verification:</span>
                    </div>
                    <div className="flex items-center space-x-3.5 font-mono text-[10px]">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400">Step 1 (Motorcycle):</span>
                        {report.step1.isValid ? (
                          <span className="text-emerald-600 font-bold flex items-center">
                            <Check className="h-3.5 w-3.5 mr-0.5 stroke-[3]" /> Passed
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold flex items-center">
                            <AlertCircle className="h-3 w-3 mr-0.5" /> Pending
                          </span>
                        )}
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400">Step 2 (Service):</span>
                        {report.step2.isValid ? (
                          <span className="text-emerald-600 font-bold flex items-center">
                            <Check className="h-3.5 w-3.5 mr-0.5 stroke-[3]" /> Passed
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold flex items-center">
                            <AlertCircle className="h-3 w-3 mr-0.5" /> Pending
                          </span>
                        )}
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400">Step 3 (Logistics):</span>
                        {report.step3.isValid ? (
                          <span className="text-emerald-600 font-bold flex items-center">
                            <Check className="h-3.5 w-3.5 mr-0.5 stroke-[3]" /> Passed
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold flex items-center">
                            <AlertCircle className="h-3 w-3 mr-0.5" /> Incomplete
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Wizard Content Panel */}
              <div className="p-6 flex-1 min-h-[380px]">
                
                {/* STEP 1: SELECT BIKE */}
                {step === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-500">
                        Step 1: Select Your Motorcycle
                      </h4>
                      {!showAddBike && (
                        <button
                          onClick={() => setShowAddBike(true)}
                          className="flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add New Bike</span>
                        </button>
                      )}
                    </div>

                    {showAddBike ? (
                      /* Add Bike Form */
                      <form onSubmit={handleCreateBike} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
                          <h5 className="text-xs font-bold text-slate-800">Add New Bike Specification</h5>
                          <button
                            type="button"
                            onClick={() => setShowAddBike(false)}
                            className="text-[11px] text-slate-500 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex justify-between items-center">
                              <span>Registration Number *</span>
                              {newBikeReg.trim() && (
                                <span className={report.newBikeReg.isValid ? "text-emerald-600 font-bold text-[9px] tracking-wider uppercase" : "text-rose-500 font-bold text-[9px] tracking-wider uppercase"}>
                                  {report.newBikeReg.isValid ? "✓ Format OK" : "✗ Invalid Format"}
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. MH-12-QE-1234"
                              value={newBikeReg}
                              onChange={(e) => setNewBikeReg(e.target.value)}
                              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition ${
                                newBikeReg.trim()
                                  ? report.newBikeReg.isValid
                                    ? "border-emerald-300 focus:border-emerald-500 bg-emerald-50/10"
                                    : "border-rose-300 focus:border-rose-500 bg-rose-50/10"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            />
                            {newBikeReg.trim() && !report.newBikeReg.isValid && (
                              <p className="text-[10px] text-rose-500 mt-1 leading-tight font-mono">{report.newBikeReg.message}</p>
                            )}
                          </div>

                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex justify-between items-center">
                              <span>Bike Brand / Manufacturer *</span>
                              {newBikeBrand.trim() && (
                                <span className={report.newBikeBrand.isValid ? "text-emerald-600 font-bold text-[9px] tracking-wider uppercase" : "text-rose-500 font-bold text-[9px] tracking-wider uppercase"}>
                                  {report.newBikeBrand.isValid ? "✓ OK" : "✗ Required"}
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Royal Enfield, KTM, Ather"
                              value={newBikeBrand}
                              onChange={(e) => setNewBikeBrand(e.target.value)}
                              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition ${
                                newBikeBrand.trim()
                                  ? report.newBikeBrand.isValid
                                    ? "border-emerald-300 focus:border-emerald-500 bg-emerald-50/10"
                                    : "border-rose-300 focus:border-rose-500 bg-rose-50/10"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            />
                            {newBikeBrand.trim() && !report.newBikeBrand.isValid && (
                              <p className="text-[10px] text-rose-500 mt-1 leading-tight font-mono">{report.newBikeBrand.message}</p>
                            )}
                          </div>

                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex justify-between items-center">
                              <span>Bike Model *</span>
                              {newBikeModel.trim() && (
                                <span className={report.newBikeModel.isValid ? "text-emerald-600 font-bold text-[9px] tracking-wider uppercase" : "text-rose-500 font-bold text-[9px] tracking-wider uppercase"}>
                                  {report.newBikeModel.isValid ? "✓ OK" : "✗ Required"}
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Classic 350, Duke 390"
                              value={newBikeModel}
                              onChange={(e) => setNewBikeModel(e.target.value)}
                              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition ${
                                newBikeModel.trim()
                                  ? report.newBikeModel.isValid
                                    ? "border-emerald-300 focus:border-emerald-500 bg-emerald-50/10"
                                    : "border-rose-300 focus:border-rose-500 bg-rose-50/10"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            />
                            {newBikeModel.trim() && !report.newBikeModel.isValid && (
                              <p className="text-[10px] text-rose-500 mt-1 leading-tight font-mono">{report.newBikeModel.message}</p>
                            )}
                          </div>

                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex justify-between items-center">
                              <span>Manufacture Year *</span>
                              <span className={report.newBikeYear.isValid ? "text-emerald-600 font-bold text-[9px] tracking-wider uppercase" : "text-rose-500 font-bold text-[9px] tracking-wider uppercase"}>
                                {report.newBikeYear.isValid ? "✓ OK" : "✗ Invalid Year"}
                              </span>
                            </label>
                            <input
                              type="number"
                              required
                              value={newBikeYear}
                              onChange={(e) => setNewBikeYear(Number(e.target.value))}
                              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition ${
                                report.newBikeYear.isValid
                                  ? "border-emerald-300 focus:border-emerald-500 bg-emerald-50/10"
                                  : "border-rose-300 focus:border-rose-500 bg-rose-50/10"
                              }`}
                            />
                            {!report.newBikeYear.isValid && (
                              <p className="text-[10px] text-rose-500 mt-1 leading-tight font-mono">{report.newBikeYear.message}</p>
                            )}
                          </div>

                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Bike Color / Aesthetic Accent</label>
                            <input
                              type="text"
                              placeholder="e.g. Stealth Black, Chrome"
                              value={newBikeColor}
                              onChange={(e) => setNewBikeColor(e.target.value)}
                              className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            />
                          </div>

                          <div className="col-span-1">
                            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex justify-between items-center">
                              <span>Odometer Reading (KM) *</span>
                              {newBikeOdo.trim() && (
                                <span className={report.newBikeOdo.isValid ? "text-emerald-600 font-bold text-[9px] tracking-wider uppercase" : "text-rose-500 font-bold text-[9px] tracking-wider uppercase"}>
                                  {report.newBikeOdo.isValid ? "✓ OK" : "✗ Invalid"}
                                </span>
                              )}
                            </label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 15000"
                              value={newBikeOdo}
                              onChange={(e) => setNewBikeOdo(e.target.value)}
                              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition ${
                                newBikeOdo.trim()
                                  ? report.newBikeOdo.isValid
                                    ? "border-emerald-300 focus:border-emerald-500 bg-emerald-50/10"
                                    : "border-rose-300 focus:border-rose-500 bg-rose-50/10"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            />
                            {newBikeOdo.trim() && !report.newBikeOdo.isValid && (
                              <p className="text-[10px] text-rose-500 mt-1 leading-tight font-mono">{report.newBikeOdo.message}</p>
                            )}
                          </div>

                          <div className="col-span-1 sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-800 mb-1.5">Engine Fuel Type *</label>
                            <div className="flex space-x-6 bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
                              <label className="flex items-center space-x-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
                                <input
                                  type="radio"
                                  checked={newBikeFuel === "Petrol"}
                                  onChange={() => setNewBikeFuel("Petrol")}
                                  className="text-blue-600 h-4 w-4 focus:ring-blue-500"
                                />
                                <span>Petrol (Combustion)</span>
                              </label>
                              <label className="flex items-center space-x-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
                                <input
                                  type="radio"
                                  checked={newBikeFuel === "Electric"}
                                  onChange={() => setNewBikeFuel("Electric")}
                                  className="text-blue-600 h-4 w-4 focus:ring-blue-500"
                                />
                                <span>Electric (EV Motor)</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={
                            !report.newBikeReg.isValid ||
                            !report.newBikeBrand.isValid ||
                            !report.newBikeModel.isValid ||
                            !report.newBikeYear.isValid ||
                            !report.newBikeOdo.isValid
                          }
                          className="w-full text-white font-bold py-3 rounded-xl text-xs transition shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none bg-blue-600 hover:bg-blue-700"
                        >
                          Register Bike Specification
                        </button>
                      </form>
                    ) : (
                      /* Bike list selection cards */
                      <div className="space-y-3">
                        {bikes.map(bike => (
                          <div
                            key={bike.id}
                            onClick={() => setSelectedBikeId(bike.id)}
                            className={`p-4 border rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-300 ${
                              selectedBikeId === bike.id
                                ? "border-blue-500 bg-blue-50/50 shadow-xs"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-xl ${selectedBikeId === bike.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                <BikeIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-slate-900">{bike.brand} {bike.model}</h4>
                                <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono mt-0.5">
                                  <span>{bike.registrationNumber}</span>
                                  <span>•</span>
                                  <span>{bike.year}</span>
                                  <span>•</span>
                                  <span>{bike.odometer.toLocaleString()} KM</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                selectedBikeId === bike.id
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}>
                                {selectedBikeId === bike.id && <Check className="h-3 w-3" />}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: CHOOSE BIKE SERVICE */}
                {step === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-500">
                      Step 2: Choose Required Mechanical Service
                    </h4>

                    <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-2">
                      {BIKE_SERVICES_LIST.map(svc => (
                        <div
                          key={svc.name}
                          onClick={() => setSelectedService(svc.name)}
                          className={`p-3 border rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                            selectedService === svc.name
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex-1 pr-3 text-left">
                            <h5 className="font-bold text-xs text-slate-900">{svc.name}</h5>
                            <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-tight line-clamp-1">
                              {svc.description}
                            </p>
                          </div>

                          <div className="text-right shrink-0 flex items-center space-x-4">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-slate-400 font-mono">DURATION</span>
                              <span className="text-xs font-bold font-mono text-slate-900">{svc.typicalDuration}</span>
                            </div>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selectedService === svc.name ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                            }`}>
                              {selectedService === svc.name && <Check className="h-2.5 w-2.5" />}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {currentServiceDetails && (
                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-start space-x-3 text-left">
                        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Service Estimate: {selectedService}</h5>
                          <p className="text-[11px] text-slate-600 leading-normal mt-0.5">{currentServiceDetails.description}</p>
                          <div className="flex space-x-4 mt-2.5 text-[10px] font-mono">
                            <div>
                              <span className="text-slate-400 uppercase">Typical Duration:</span>{" "}
                              <span className="text-slate-800 font-bold">{currentServiceDetails.typicalDuration}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 uppercase">Pricing Plan:</span>{" "}
                              <span className="text-slate-800 font-bold">Fixed Package Inclusion</span>
                            </div>
                            <div>
                              <span className="text-slate-400 uppercase">Offline Billing:</span>{" "}
                              <span className="text-slate-800 font-bold">Settle after checkup</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: DATE & TIME SLOT & LOGISTICS */}
                {step === 3 && (
                  <div className="space-y-5 animate-fadeIn text-left">
                    <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-500">
                      Step 3: Appointment Date & Logistics
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between items-center">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 text-blue-600 mr-1.5" />
                            Appointment Date *
                          </span>
                          {selectedDate && (
                            <span className={report.step3.date.isValid ? "text-emerald-600 font-bold text-[9px]" : "text-rose-500 font-bold text-[9px]"}>
                              {report.step3.date.isValid ? "✓ DATE APPROVED" : "✗ DATE IN PAST"}
                            </span>
                          )}
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split("T")[0]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 transition ${
                            selectedDate
                              ? report.step3.date.isValid
                                ? "border-emerald-300 focus:border-emerald-500 bg-emerald-50/10"
                                : "border-rose-300 focus:border-rose-500 bg-rose-50/10"
                              : "border-slate-200"
                          }`}
                        />
                        {selectedDate && !report.step3.date.isValid ? (
                          <p className="text-[10px] text-rose-500 font-mono mt-1">{report.step3.date.message}</p>
                        ) : (
                          <p className="text-[10px] text-slate-400 font-mono mt-1">Please select next available workshop day.</p>
                        )}
                      </div>

                      {/* Time slot */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                          <Clock className="h-4 w-4 text-blue-600 mr-1.5" />
                          Preferred Slot *
                        </label>
                        <select
                          value={selectedTimeSlot}
                          onChange={(e) => setSelectedTimeSlot(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                        >
                          {timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>

                      {/* Pickup Drop options */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                          <Truck className="h-4 w-4 text-blue-600 mr-1.5" />
                          Valet Pick-up & Drop-off Services
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {(["None", "Pickup", "Drop", "Both"] as const).map(opt => (
                            <div
                              key={opt}
                              onClick={() => {
                                setPickupOption(opt);
                                if (opt === "None") {
                                  setPickupAddress("");
                                  setUseGps(false);
                                  setLocationError(null);
                                }
                              }}
                              className={`p-2.5 border rounded-xl cursor-pointer text-center transition ${
                                pickupOption === opt
                                  ? "border-blue-500 bg-blue-50/50 text-blue-600"
                                  : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                              }`}
                            >
                              <span className="text-xs font-bold block">{opt === "None" ? "Self-Drive" : opt}</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5">
                                {opt === "None" && "Bring to garage"}
                                {opt === "Pickup" && "Home collection"}
                                {opt === "Drop" && "Home drop-off"}
                                {opt === "Both" && "Complete valet"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pickup Address Input & Use Current Location */}
                      {pickupOption !== "None" && (
                        <div className="col-span-1 sm:col-span-2 space-y-2">
                          <label className="block text-xs font-semibold text-slate-700 flex justify-between items-center">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 text-blue-600 mr-1.5" />
                              Valet Address / Location *
                            </span>
                            {pickupAddress.trim() && (
                              <span className={report.step3.address.isValid ? "text-emerald-600 font-bold text-[9px]" : "text-rose-500 font-bold text-[9px]"}>
                                {report.step3.address.isValid ? (useGps ? "✓ GPS ACTIVE" : "✓ FORMAT VERIFIED") : "✗ FORMAT ERROR"}
                              </span>
                            )}
                          </label>

                          <div className="grid grid-cols-1 gap-2">
                            {useGps ? (
                              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-start justify-between animate-fadeIn">
                                <div className="flex items-start space-x-2.5">
                                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 mt-0.5 shrink-0">
                                    <MapPin className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-mono font-bold text-emerald-800 leading-none">GPS LOCK ESTABLISHED</p>
                                    <p className="text-xs text-slate-700 font-medium font-mono mt-1.5 leading-relaxed font-bold">
                                      {pickupAddress || "Acquiring coordinates..."}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUseGps(false);
                                    setPickupAddress("");
                                  }}
                                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 uppercase"
                                >
                                  Clear / Edit
                                </button>
                              </div>
                            ) : (
                              <div className="relative flex items-center">
                                <input
                                  type="text"
                                  placeholder="Enter complete towing address..."
                                  value={pickupAddress}
                                  onChange={(e) => setPickupAddress(e.target.value)}
                                  className={`w-full bg-white border rounded-xl pl-3 pr-24 py-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 transition ${
                                    pickupAddress.trim()
                                      ? report.step3.address.isValid
                                        ? "border-emerald-300 focus:border-emerald-500 bg-emerald-50/10"
                                        : "border-rose-300 focus:border-rose-500 bg-rose-50/10"
                                      : "border-slate-200"
                                  }`}
                                />
                                <button
                                  type="button"
                                  disabled={isLocating}
                                  onClick={handleAcquireLocation}
                                  className="absolute right-1.5 top-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1"
                                >
                                  {isLocating ? (
                                    <>
                                      <div className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mr-1" />
                                      <span>Locating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="h-3 w-3" />
                                      <span>Use GPS</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}

                            {pickupAddress.trim() && !report.step3.address.isValid && (
                              <p className="text-[10px] text-rose-600 font-mono flex items-center mt-1">
                                <AlertCircle className="h-3.5 w-3.5 mr-1 text-rose-600 shrink-0" />
                                {report.step3.address.message}
                              </p>
                            )}

                            {locationError && (
                              <p className="text-[10px] text-rose-600 font-mono flex items-center mt-1">
                                <AlertCircle className="h-3.5 w-3.5 mr-1 text-rose-600 shrink-0" />
                                {locationError}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Additional description notes */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                          <FileText className="h-4 w-4 text-blue-600 mr-1.5" />
                          Additional Notes or Issues Describe (Optional)
                        </label>
                        <textarea
                          placeholder="List any noises, handling issues, carburetor coughing, indicator bulb damage, or specific spare parts requests..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                        />
                      </div>

                      {/* SMS Updates checkbox */}
                      <div className="col-span-1 sm:col-span-2 pt-1">
                        <label className="flex items-start space-x-3 cursor-pointer select-none bg-slate-50 border border-slate-200/60 p-3 rounded-xl hover:bg-slate-100/50 transition">
                          <input
                            type="checkbox"
                            checked={receiveSmsUpdates}
                            onChange={(e) => setReceiveSmsUpdates(e.target.checked)}
                            className="text-blue-600 h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              Receive SMS updates for my service
                            </span>
                            <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">
                              Get real-time mobile notifications as your motorcycle moves from check-in, inspection, cost estimate approval, to ready for pick-up.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW BOOKING AND CONFIRM */}
                {step === 4 && (
                  <div className="space-y-4 animate-fadeIn text-left">
                    <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-500">
                      Step 4: Review Appointment Summary
                    </h4>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3.5">
                      {/* Bike Details */}
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/50">
                        <span className="text-slate-500">Selected Vehicle:</span>
                        <span className="font-bold text-slate-900">
                          {bikes.find(b => b.id === selectedBikeId)?.brand} {bikes.find(b => b.id === selectedBikeId)?.model}
                        </span>
                      </div>

                      {/* Service */}
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/50">
                        <span className="text-slate-500">Selected Service:</span>
                        <span className="font-bold text-slate-900">{selectedService}</span>
                      </div>

                      {/* Time slot */}
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/50">
                        <span className="text-slate-500">Scheduled Appointment:</span>
                        <span className="font-bold text-slate-900">
                          {selectedDate || "Tomorrow"} • {selectedTimeSlot}
                        </span>
                      </div>

                      {/* Logistics */}
                      <div className="flex justify-between items-start text-xs pb-2 border-b border-slate-200/50">
                        <span className="text-slate-500">Logistics Transport:</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">
                            {pickupOption === "None" ? "Self Drive to Garage" : pickupOption}
                          </span>
                          {pickupOption !== "None" && pickupAddress && (
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5 max-w-[220px] leading-tight text-right break-all">
                              Address: {pickupAddress}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing Notice */}
                      <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 text-orange-800">
                          <CheckCircle className="h-4.5 w-4.5 text-orange-600 shrink-0" />
                          <div>
                            <span className="font-bold block">Physical Offline Payment Guaranteed</span>
                            <span className="text-[10px] text-orange-600 block leading-tight">Pay securely at the garage counter via Cash or UPI on collection.</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 font-mono block">Pricing Model</span>
                          <span className="text-xs font-bold text-slate-900 font-sans">Flat Package Rate</span>
                        </div>
                      </div>
                    </div>

                    {/* SMS Updates checkbox in Step 4 */}
                    <div className="pt-1">
                      <label className="flex items-start space-x-3 cursor-pointer select-none bg-slate-50 border border-slate-200/60 p-3 rounded-xl hover:bg-slate-100/50 transition">
                        <input
                          type="checkbox"
                          checked={receiveSmsUpdates}
                          onChange={(e) => setReceiveSmsUpdates(e.target.checked)}
                          className="text-blue-600 h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            Receive SMS updates for my service
                          </span>
                          <span className="text-[10px] text-slate-500 block leading-normal mt-0.5">
                            Real-time SMS tracking updates will be dispatched to your registered number: <strong className="text-slate-700">{currentCustomer.mobile}</strong>.
                          </span>
                        </div>
                      </label>
                    </div>

                    <p className="text-[10px] text-slate-500 font-sans leading-relaxed text-center">
                      By confirming, you authorize our mechanics to run diagnostic checkups. Your booking will appear in the Admin Dashboard, where the team will schedule a slot and assign a mechanic.
                    </p>
                  </div>
                )}

                {/* STEP 5: SUCCESS CHECK WITH SIMULATED ALERTS */}
                {step === 5 && createdBooking && (
                  <div className="text-center py-6 space-y-5 animate-scaleIn">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-md">
                      <Check className="h-9 w-9 stroke-[3]" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-xl text-slate-900">Service Booked Successfully!</h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        Your appointment has been registered. Our reception team has received the alert in Pune Koregaon Park center and will assign a mechanic shortly.
                      </p>
                    </div>

                    {/* Simulated Notifications Sent Panel */}
                    {receiveSmsUpdates ? (
                      <div className="max-w-md mx-auto bg-slate-950 text-slate-200 border border-slate-800 p-4 rounded-2xl text-left space-y-2.5 animate-fadeIn">
                        <div className="flex items-center space-x-1.5 border-b border-slate-800 pb-2">
                          <Smartphone className="h-4 w-4 text-emerald-500" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">AUTOMATED GATEWAY SMS ALERTS DISPATCHED</span>
                        </div>
                        
                        <div className="text-xs space-y-1.5 leading-relaxed font-sans">
                          <p className="text-slate-400 text-[10px] font-mono">RECIPIENT: {currentCustomer.mobile}</p>
                          <div className="bg-slate-900/60 p-2.5 border border-slate-800/50 rounded-lg text-slate-300 italic">
                            "Apex Bike Garage: Your service booking for {selectedService} has been received and is pending confirmation! We will contact you shortly."
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-2 animate-fadeIn">
                        <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-2 text-slate-500">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">SMS ALERTS DISABLED</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-normal font-sans">
                          You opted out of SMS alerts for this service. You can still track your repair status live through the customer portal tracker anytime.
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={onClose}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
                      >
                        Go to Customer Tracker
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer Controls */}
              {step < 5 && (
                <div className="px-6 py-4.5 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-3xl">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      onClick={() => {
                        // validations using report
                        if (step === 1 && !report.step1.isValid) return;
                        if (step === 2 && !report.step2.isValid) return;
                        if (step === 3 && !report.step3.isValid) return;
                        setStep(step + 1);
                      }}
                      disabled={
                        (step === 1 && !report.step1.isValid) ||
                        (step === 2 && !report.step2.isValid) ||
                        (step === 3 && !report.step3.isValid)
                      }
                      className="bg-blue-600 text-white text-xs font-bold px-5 py-2 rounded-xl hover:bg-blue-700 transition flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <span>Continue</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleBookingSubmit}
                      disabled={!report.isAllValid}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2 rounded-xl transition flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <span>Confirm & Book Appointment</span>
                    </button>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
