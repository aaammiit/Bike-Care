import React, { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { Bike, Booking, RepairJob, Invoice, BIKE_SERVICES_LIST } from "../types";
import { DuoSkeleton } from "./DuoSkeleton";
import {
  Bike as BikeIcon,
  Calendar,
  Clock,
  Wrench,
  FileCheck,
  Plus,
  Compass,
  FileText,
  User,
  PhoneCall,
  MessageSquare,
  AlertOctagon,
  ChevronRight,
  Sparkles,
  MapPin,
  Check,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Premium staggered cascade entry animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 15
    }
  }
};

interface CustomerDashboardProps {
  onOpenBooking: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onOpenBooking, onViewInvoice }) => {
  const {
    currentCustomer,
    updateCustomerProfile,
    bikes,
    bookings,
    repairs,
    invoices,
    addBike,
    cancelBooking,
    approveEstimate,
    markInvoiceAsPaid
  } = useApp();

  const [activeTab, setActiveTab] = useState<"tracker" | "bikes" | "history" | "help">("tracker");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPayingId, setIsPayingId] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSimulatePayment = (invoiceId: string) => {
    setIsPayingId(invoiceId);
    setTimeout(() => {
      markInvoiceAsPaid(invoiceId, "UPI Online (Simulated)");
      setIsPayingId(null);
      setToastMessage("Simulated online payment of invoice successful! Order delivered.");
    }, 1500);
  };

  const handleTabChange = (tab: "tracker" | "bikes" | "history" | "help") => {
    setIsLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };
  
  // Profile editing mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentCustomer.name);
  const [profileMobile, setProfileMobile] = useState(currentCustomer.mobile);
  const [profileEmail, setProfileEmail] = useState(currentCustomer.email);
  const [profileAddress, setProfileAddress] = useState(currentCustomer.address);

  // Bike registration in tab
  const [showBikeForm, setShowBikeForm] = useState(false);
  const [bikeBrand, setBikeBrand] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [bikeReg, setBikeReg] = useState("");
  const [bikeYear, setBikeYear] = useState(2022);
  const [bikeColor, setBikeColor] = useState("");
  const [bikeOdo, setBikeOdo] = useState("");
  const [bikeFuel, setBikeFuel] = useState<"Petrol" | "Electric">("Petrol");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile(profileName, profileEmail, profileMobile, profileAddress);
    setIsEditingProfile(false);
  };

  const handleRegisterBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bikeBrand.trim() || !bikeModel.trim() || !bikeReg.trim()) return;

    addBike({
      brand: bikeBrand,
      model: bikeModel,
      registrationNumber: bikeReg.toUpperCase(),
      year: Number(bikeYear),
      color: bikeColor || "Standard",
      fuelType: bikeFuel,
      odometer: Number(bikeOdo) || 500
    });

    // clear fields
    setBikeBrand("");
    setBikeModel("");
    setBikeReg("");
    setBikeColor("");
    setBikeOdo("");
    setShowBikeForm(false);
  };

  const activeRepairs = repairs.filter(r => r.status !== "Delivered");
  const pastRepairs = repairs.filter(r => r.status === "Delivered");

  // Status mapping for timeline progress percentage
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "Vehicle Received": return 15;
      case "Inspection": return 30;
      case "Estimate Generated": return 45;
      case "Approved": return 60;
      case "Repair Started": return 75;
      case "Quality Check": return 90;
      case "Ready": return 100;
      default: return 0;
    }
  };

  const statusWorkflowSteps = [
    "Vehicle Received",
    "Inspection",
    "Estimate Generated",
    "Repair Started",
    "Quality Check",
    "Ready"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Playful Interactive toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-eager-green text-white border-2 border-emerald-600 border-b-4 rounded-2xl px-6 py-3 shadow-lg flex items-center space-x-3 text-xs font-black uppercase tracking-wider"
          >
            <span className="text-base">✨</span>
            <span>{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)} 
              className="ml-4 hover:text-emerald-200 transition font-black text-[11px] bg-emerald-800/30 px-2 py-1 rounded-md cursor-pointer"
            >
              GOT IT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Customer Header Info */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 -top-10 -left-10" />
        
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-md">
            <User className="h-6 w-6" />
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg">
              <input
                type="text"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                placeholder="Full Name"
                required
              />
              <input
                type="text"
                value={profileMobile}
                onChange={e => setProfileMobile(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                placeholder="Mobile Number"
                required
              />
              <input
                type="email"
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                placeholder="Email Address"
                required
              />
              <input
                type="text"
                value={profileAddress}
                onChange={e => setProfileAddress(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 col-span-1 sm:col-span-2"
                placeholder="Pickup Address"
                required
              />
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-left space-y-0.5">
              <h2 className="font-display font-bold text-lg text-slate-900">{currentCustomer.name}</h2>
              <p className="text-xs text-slate-500 font-mono flex items-center">
                <span>{currentCustomer.mobile}</span>
                <span className="mx-2">•</span>
                <span>{currentCustomer.email}</span>
              </p>
              <p className="text-xs text-slate-400 font-sans line-clamp-1 max-w-md">Pickup point: {currentCustomer.address}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-2 shrink-0">
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition"
            >
              Modify Profile
            </button>
          )}
          <button
            onClick={onOpenBooking}
            className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition shadow-sm"
          >
            Book Bike Service
          </button>
        </div>
      </div>

      {/* Dashboard Tabs with Shared Element Underline Animation */}
      <div className="flex border-b-2 border-slate-200 mb-6 overflow-x-auto space-x-1 sm:space-x-3 relative">
        {(["tracker", "bikes", "history", "help"] as const).map((tab) => {
          const isActive = activeTab === tab;
          let label = "";
          if (tab === "tracker") label = `Active Tracker (${activeRepairs.length})`;
          else if (tab === "bikes") label = `My Bikes (${bikes.length})`;
          else if (tab === "history") label = `Service History (${pastRepairs.length})`;
          else if (tab === "help") label = "Emergency Support";

          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative pb-3 pt-1 px-3.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors shrink-0 outline-none cursor-pointer ${
                isActive ? "text-blue-600 font-extrabold" : "text-slate-500 hover:text-slate-950"
              }`}
            >
              <span className="relative z-10">{label}</span>
              {isActive && (
                <motion.div
                  layoutId="customerActiveTabIndicator"
                  className="absolute bottom-[-2px] left-0 right-0 h-[4px] bg-blue-600 rounded-full z-0"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels wrapped in AnimatePresence with sequential staging layout */}
      <div className="mt-2 text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (isLoading ? "-loading" : "")}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <div className="space-y-6">
                {activeTab === "tracker" && <DuoSkeleton type="detail" count={1} />}
                {activeTab === "bikes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DuoSkeleton type="card" count={3} />
                  </div>
                )}
                {activeTab === "history" && <DuoSkeleton type="list" count={3} />}
                {activeTab === "help" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DuoSkeleton type="card" count={1} />
                    <DuoSkeleton type="card" count={1} />
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* PANEL 1: ACTIVE REPAIR TRACKER */}
                {activeTab === "tracker" && (
                  <motion.div className="space-y-6" variants={containerVariants}>
                {activeRepairs.length === 0 ? (
                  <motion.div variants={itemVariants} className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-6">
                    <Compass className="h-12 w-12 text-slate-300 mx-auto stroke-1 mb-3" />
                    <h4 className="font-display font-bold text-base text-slate-800">No active garage services in progress</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Bring your motorcycle down or book an appointment online to watch your repair operations stream live through our timeline!
                    </p>
                    <button
                      onClick={onOpenBooking}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                      Schedule Bike Booking
                    </button>
                  </motion.div>
                ) : (
                  activeRepairs.map(repair => {
                    const isEstimateStage = repair.status === "Estimate Generated" && !repair.isApprovedByCustomer;
                    const hasInvoiceAvailable = ["Ready", "Delivered"].includes(repair.status);
                    const progressWidth = getProgressPercentage(repair.status);

                    return (
                      <motion.div
                        key={repair.id}
                        variants={itemVariants}
                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 text-left"
                      >
                    {/* Progress Header Card */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <BikeIcon className="h-4.5 w-4.5" />
                          </span>
                          <h3 className="font-display font-bold text-base text-slate-900">
                            {repair.bikeDetails.brand} {repair.bikeDetails.model}
                          </h3>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          REG: {repair.bikeDetails.registrationNumber} • ODOMETER: {repair.bikeDetails.odometer.toLocaleString()} KM
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">LIVE STATUS</div>
                        <span className="inline-flex items-center text-xs font-bold font-mono text-blue-600 mt-0.5 px-2.5 py-0.5 bg-blue-50 rounded-md animate-pulse">
                          {repair.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Estimate Generation Block Needs Approval */}
                    {isEstimateStage && (
                      <div className="bg-amber-50 border border-amber-200/60 p-5 rounded-2xl space-y-4">
                        <div className="flex items-start space-x-3">
                          <AlertOctagon className="h-5.5 w-5.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">Estimate Awaiting Your Authorization</h4>
                            <p className="text-xs text-slate-600 leading-normal mt-1">
                              Mechanic <span className="font-bold text-slate-800">{repair.assignedMechanicName || "Karan Singh"}</span> has inspected your bike and generated the following repair plan. Work will only commence upon your confirmation.
                            </p>
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="border border-amber-200 bg-white rounded-xl overflow-hidden divide-y divide-amber-100 text-xs">
                          <div className="p-3 bg-amber-50/30 flex justify-between font-semibold">
                            <span>Labor: {repair.serviceType}</span>
                            <span className="font-mono">Rs. {repair.estimatedCost.labour}</span>
                          </div>

                          {repair.partsUsed.map((part, pidx) => (
                            <div key={pidx} className="p-3 flex justify-between text-slate-700">
                              <span>{part.name} (x{part.quantity})</span>
                              <span className="font-mono">Rs. {(part.cost * part.quantity)}</span>
                            </div>
                          ))}

                          <div className="p-3.5 flex justify-between items-center bg-slate-900 text-white font-bold">
                            <span>Total Estimated (excl. tax)</span>
                            <span className="font-mono text-sm text-blue-400">Rs. {repair.estimatedCost.total}</span>
                          </div>
                        </div>

                        {repair.mechanicNotes && (
                          <div className="text-xs text-slate-600 italic bg-white/50 p-3 rounded-lg border border-amber-100">
                            <strong>Mechanic's Notes:</strong> "{repair.mechanicNotes}"
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => approveEstimate(repair.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center space-x-1.5"
                          >
                            <ShieldCheck className="h-4.5 w-4.5" />
                            <span>APPROVE ESTIMATE & START WORK</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Progress timeline visualizer */}
                    <div className="space-y-6">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">
                        Repair Journey Timeline
                      </h4>

                      {/* Interactive Visual Line */}
                      <div className="relative">
                        {/* Horizontal track line for desktop, vertical for mobile */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden md:block" />
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 hidden md:block transition-all duration-500"
                          style={{ width: `${progressWidth}%` }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                          {statusWorkflowSteps.map((stepName, stepIdx) => {
                            // Determine state
                            const currentIdx = statusWorkflowSteps.indexOf(repair.status);
                            const thisIdx = statusWorkflowSteps.indexOf(stepName);
                            const isCompleted = thisIdx < currentIdx || repair.status === "Ready" || repair.status === "Delivered";
                            const isActive = repair.status === stepName;

                            return (
                              <div
                                key={stepName}
                                className={`flex md:flex-col items-center md:text-center text-left space-x-3 md:space-x-0 ${
                                  isCompleted ? "opacity-100" : isActive ? "opacity-100" : "opacity-40"
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0 ${
                                    isCompleted
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : isActive
                                      ? "bg-amber-500 border-amber-500 text-white pulse-active"
                                      : "bg-white border-slate-300 text-slate-400"
                                  }`}
                                >
                                  {isCompleted ? "✓" : stepIdx + 1}
                                </div>
                                
                                <div className="mt-0 md:mt-2">
                                  <h5 className="text-xs font-bold text-slate-900">{stepName}</h5>
                                  <p className="text-[9px] text-slate-500 font-sans hidden md:block mt-0.5 leading-tight">
                                    {stepName === "Vehicle Received" && "Bike checked in"}
                                    {stepName === "Inspection" && "42-point checks"}
                                    {stepName === "Estimate Generated" && "Pricing generated"}
                                    {stepName === "Repair Started" && "Expert rebuilding"}
                                    {stepName === "Quality Check" && "Road-test & safety"}
                                    {stepName === "Ready" && "Washed & ready!"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Log Details (reverse chronology) */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 text-left">
                        Activity Logs & Inspection Notes
                      </h4>
                      <div className="space-y-3.5 text-xs text-slate-700">
                        {repair.timeline.slice().reverse().map((log, lidx) => (
                          <div key={lidx} className="flex items-start space-x-2.5 pb-2.5 border-b border-slate-200/40 last:border-0 last:pb-0">
                            <span className="font-mono text-[10px] text-slate-400 mt-0.5">
                              [{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}]
                            </span>
                            <div>
                              <span className="font-bold text-slate-900">{log.status}:</span>{" "}
                              <span className="text-slate-600">{log.notes || "Log entry updated."}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Updated by: {log.updatedBy}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Invoices Available for Pickup */}
                    {hasInvoiceAvailable && (() => {
                      const invoice = invoices.find(i => i.repairId === repair.id);
                      if (!invoice) return null;
                      const amount = invoice.finalAmount;
                      const isPaying = isPayingId === invoice.id;

                      return (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-emerald-600 text-white p-2.5 rounded-xl shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">Your Bike is Ready for Delivery!</h4>
                              <p className="text-[11px] text-slate-600 font-sans">
                                Physical invoice generated. You can settle the bill of <strong className="font-mono text-emerald-800">Rs. {amount}</strong> in person via Cash/UPI, or complete payment online instantly.
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                            <button
                              onClick={() => onViewInvoice(invoice)}
                              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl transition shrink-0 border border-slate-200/80"
                            >
                              View Receipt
                            </button>
                            <button
                              disabled={isPaying}
                              onClick={() => handleSimulatePayment(invoice.id)}
                              className="text-xs font-bold bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white px-3.5 py-2 rounded-xl transition shrink-0 flex items-center space-x-2 shadow-xs cursor-pointer"
                            >
                              {isPaying ? (
                                <>
                                  <span className="animate-spin inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                                  <span>Paying...</span>
                                </>
                              ) : (
                                <span>Pay Online Now</span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {/* PANEL 2: MY BIKES */}
            {activeTab === "bikes" && (
              <motion.div className="space-y-6" variants={containerVariants}>
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-slate-900">My Registered Motorcycles</h3>
              {!showBikeForm && (
                <button
                  onClick={() => setShowBikeForm(true)}
                  className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100/80 text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Another Bike</span>
                </button>
              )}
            </div>

            {showBikeForm && (
              <form onSubmit={handleRegisterBike} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs max-w-xl mx-auto space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-sm text-slate-900">Register Bike Specifications</h4>
                  <button type="button" onClick={() => setShowBikeForm(false)} className="text-xs text-slate-400 hover:underline">
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="Royal Enfield, KTM, Yamaha..."
                      value={bikeBrand}
                      onChange={e => setBikeBrand(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-800 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="Classic 350, Duke 390..."
                      value={bikeModel}
                      onChange={e => setBikeModel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-800 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Registration No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="MH-12-RT-8899"
                      value={bikeReg}
                      onChange={e => setBikeReg(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-800 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mfg Year</label>
                    <input
                      type="number"
                      value={bikeYear}
                      onChange={e => setBikeYear(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-800 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Color Shade</label>
                    <input
                      type="text"
                      placeholder="Stealth Black..."
                      value={bikeColor}
                      onChange={e => setBikeColor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Odometer (KM)</label>
                    <input
                      type="number"
                      placeholder="14000"
                      value={bikeOdo}
                      onChange={e => setBikeOdo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none text-slate-800"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Fuel Type</label>
                    <div className="flex space-x-3">
                      <label className="flex items-center space-x-1.5 text-xs text-slate-700">
                        <input
                          type="radio"
                          checked={bikeFuel === "Petrol"}
                          onChange={() => setBikeFuel("Petrol")}
                        />
                        <span>Petrol</span>
                      </label>
                      <label className="flex items-center space-x-1.5 text-xs text-slate-700">
                        <input
                          type="radio"
                          checked={bikeFuel === "Electric"}
                          onChange={() => setBikeFuel("Electric")}
                        />
                        <span>Electric EV</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-blue-700 transition mt-2"
                >
                  Save Spec Details
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bikes.map(bike => (
                <motion.div 
                  key={bike.id} 
                  variants={itemVariants}
                  className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-5 text-left relative group"
                >
                  <div className="flex justify-between items-start">
                    <div className="bg-slate-100 text-slate-600 p-3 rounded-2xl">
                      <BikeIcon className="h-5 w-5" />
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-mono rounded">
                      {bike.fuelType.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1">
                    <h4 className="font-bold text-sm text-slate-900">{bike.brand} {bike.model}</h4>
                    <p className="text-xs font-mono text-slate-500">{bike.registrationNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                    <div>
                      <span>YEAR:</span> <span className="text-slate-800 font-bold">{bike.year}</span>
                    </div>
                    <div>
                      <span>ODOMETER:</span> <span className="text-slate-800 font-bold">{bike.odometer.toLocaleString()} KM</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
              </motion.div>
            )}

            {/* PANEL 3: PAST REPAIR SERVICE HISTORY */}
            {activeTab === "history" && (
              <motion.div className="space-y-6" variants={containerVariants}>
                <h3 className="font-display font-bold text-base text-slate-900 text-left">My Historical Service Book</h3>
                
                {pastRepairs.length === 0 ? (
                  <motion.div variants={itemVariants} className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-6">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto stroke-1 mb-2" />
                    <p className="text-xs text-slate-500">No completed services found on record.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {pastRepairs.map(rep => {
                      const invoice = invoices.find(inv => inv.repairId === rep.id);
                      return (
                        <motion.div
                          key={rep.id}
                          variants={itemVariants}
                          className="bg-white border-2 border-b-4 border-slate-200 rounded-2xl p-5 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900">{rep.serviceType}</h4>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-mono rounded">
                            COMPLETED & DELIVERED
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-sans">
                          Vehicle: {rep.bikeDetails.brand} {rep.bikeDetails.model} ({rep.bikeDetails.registrationNumber})
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Completed: {rep.completionDate ? new Date(rep.completionDate).toLocaleDateString() : "N/A"} • Mechanic: {rep.assignedMechanicName}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center space-x-4">
                        <div className="text-left sm:text-right">
                          <span className="text-[9px] text-slate-400 font-mono block">Offline Bill</span>
                          <span className="text-sm font-bold text-slate-900 font-mono">Rs. {invoice?.finalAmount || rep.estimatedCost.total}</span>
                        </div>
                        {invoice && (
                          <button
                            onClick={() => onViewInvoice(invoice)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
                          >
                            Receipt
                          </button>
                        )}
                      </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* PANEL 4: EMERGENCY SUPPORT */}
            {activeTab === "help" && (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left" variants={containerVariants}>
                
                {/* Quick Contacts */}
                <motion.div variants={itemVariants} className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 space-y-5">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center">
                <AlertOctagon className="h-5.5 w-5.5 text-red-500 mr-2 shrink-0" />
                Emergency Mechanical Assistance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stuck on the road? Puncture, dry chain, electrical blackout or accidental recovery? Pune's Koregaon Park crew has an active recovery truck!
              </p>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-red-950 block">Assistance Hotline</span>
                    <span className="text-[10px] text-red-600">Available Monday - Saturday (9 AM - 8 PM)</span>
                  </div>
                  <a
                    href="tel:+919876543210"
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Call Now
                  </a>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">WhatsApp Road Help</span>
                    <span className="text-[10px] text-slate-500">Send live location for recovery towing</span>
                  </div>
                  <button
                    onClick={() => setToastMessage("Launching live Pune WhatsApp recovery channel! Connecting you with driver...")}
                    className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Towing Help
                  </button>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-150 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-950 block">Interactive Guided Tour</span>
                    <span className="text-[10px] text-blue-600">Replay step-by-step walk-throughs any time</span>
                  </div>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new Event("start-rana-tour"));
                      setToastMessage("Launching the onboarding guided tour! Enjoy the walk-through.");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Start Tour
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Google Map Coordinates */}
            <motion.div variants={itemVariants} className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 space-y-5">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center">
                <MapPin className="h-5.5 w-5.5 text-blue-600 mr-2" />
                Garage Location Navigation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Follow North Main road or Koregaon Park lane 5 directly. Easily accessible for cruiser tow trucks and scooters.
              </p>

              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Plot 12A, Lane 5, Koregaon Park</span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">PUNE, MAHARASHTRA 411001</span>
                </div>
                
                <a
                  href="https://maps.google.com/?q=Koregaon+Park+Pune"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center shrink-0"
                >
                  Navigate
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </a>
              </div>
            </motion.div>

          </motion.div>
        )}
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
