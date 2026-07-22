import React, { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { RepairJob, RepairStatus, InventoryItem } from "../types";
import { DuoSkeleton } from "./DuoSkeleton";
import {
  Wrench,
  Camera,
  Play,
  Check,
  AlertTriangle,
  History,
  ClipboardList,
  Plus,
  Trash,
  CheckCircle2,
  FileImage,
  Sparkles,
  CheckCircle,
  RotateCcw
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

export const MechanicPanel: React.FC = () => {
  const {
    repairs,
    inventory,
    updateRepairStatus,
    addPartsToRepair,
    removePartFromRepair,
    completeRepairJob
  } = useApp();

  const loggedInMechanicId = "mech_1"; // Karan Singh
  const loggedInMechanicName = "Karan Singh";

  // Filter assigned active repairs (not delivered and not ready)
  const assignedActiveJobs = repairs.filter(
    r => r.assignedMechanicId === loggedInMechanicId && !["Delivered", "Ready"].includes(r.status)
  );

  const completedJobs = repairs.filter(
    r => r.assignedMechanicId === loggedInMechanicId && ["Delivered", "Ready"].includes(r.status)
  );

  // States
  const [activeJobIdForEdit, setActiveJobIdForEdit] = useState<string | null>(null);
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [partQty, setPartQty] = useState(1);
  const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage("Active workshop queue synced with front-desk reception database!");
    }, 700);
  };

  const handleUpdateStatus = (jobId: string, status: RepairStatus, noteMsg: string) => {
    updateRepairStatus(jobId, status, noteMsg);
  };

  const handleAddPartToJob = (jobId: string) => {
    if (!selectedPartId) return;
    addPartsToRepair(jobId, selectedPartId, partQty);
    setSelectedPartId("");
    setPartQty(1);
  };

  const handleCompleteJob = (jobId: string) => {
    completeRepairJob(jobId, mechanicNotes || "Completed thorough service run. Pressure washed and engine oiled.");
    setMechanicNotes("");
    setActiveJobIdForEdit(null);
  };

  const simulatePhotoUpload = (jobId: string) => {
    // Simulated diagnostic photos of standard motorcycle wear
    const mockPhotos = [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600", // motorcycle engine
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600", // bike chain
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600"  // wheel spokes
    ];
    const chosen = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    
    // Add image url to repair state
    repairs.forEach(r => {
      if (r.id === jobId) {
        if (!r.images.includes(chosen)) {
          r.images.push(chosen);
        }
      }
    });

    setSimulatedImageUrl(chosen);
    setToastMessage("Diagnostic Photo Uploaded! Securely attached to client repair record.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 font-sans text-left relative">
      
      {/* Animated feedback toast overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border-2 border-slate-700 border-b-4 rounded-2xl px-6 py-3 shadow-lg flex items-center space-x-3 text-xs font-black uppercase tracking-wider"
          >
            <span className="text-base">🛠️</span>
            <span>{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)} 
              className="ml-4 hover:text-slate-300 transition font-black text-[11px] bg-slate-800 px-2 py-1 rounded-md cursor-pointer"
            >
              GOT IT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mechanic Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -top-10 -left-10" />
        
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
            <Wrench className="h-6 w-6 rotate-45" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white">Workshop Terminal: {loggedInMechanicName}</h2>
            <p className="text-xs text-slate-400 font-mono">Expert Mechanic • Koregaon Park Pune Workshop Floor</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full md:w-auto">
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl">
              <span className="text-slate-400 uppercase block text-[10px]">Active Queue</span>
              <span className="text-base font-bold text-blue-400 block mt-0.5">{assignedActiveJobs.length} Bikes</span>
            </div>

            <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl">
              <span className="text-slate-400 uppercase block text-[10px]">Completed Today</span>
              <span className="text-base font-bold text-emerald-400 block mt-0.5">{completedJobs.length} Settled</span>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 font-black tracking-widest text-[10px] uppercase px-4 py-3 rounded-2xl transition-all duration-100 flex items-center justify-center space-x-1.5 cursor-pointer active:translate-y-[1.5px] active:border-b-2 shrink-0"
          >
            <RotateCcw className={`h-3.5 w-3.5 text-white ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync Queue</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={isLoading ? "loading" : "ready"}
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left"
        >
          {isLoading ? (
            <>
              <div className="lg:col-span-8 space-y-6">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-blue-600 shrink-0" />
                  My Active Repair Work Order Queue
                </h3>
                <DuoSkeleton type="detail" count={1} />
                <DuoSkeleton type="list" count={2} />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900 flex items-center border-b-2 border-slate-100 pb-3">
                  <History className="h-4.5 w-4.5 mr-2 text-slate-500" />
                  My Workshop Settle History (Karan)
                </h3>
                <DuoSkeleton type="card" count={2} />
              </div>
            </>
          ) : (
            <>
        
        {/* LEFT COLUMN: ACTIVE ASSIGNED JOBS LIST */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="font-display font-bold text-base text-slate-900 flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-blue-600 shrink-0" />
            My Active Repair Work Order Queue
          </h3>

          {assignedActiveJobs.length === 0 ? (
            <motion.div variants={itemVariants} className="bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-12 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-display font-bold text-sm text-slate-800">Job queue cleared!</h4>
              <p className="text-xs text-slate-500 mt-1">Excellent work. Inform the reception desk if you're ready to admit new checkups.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {assignedActiveJobs.map(job => {
                const isSelected = activeJobIdForEdit === job.id;
                
                return (
                  <motion.div
                    key={job.id}
                    variants={itemVariants}
                    className={`bg-white border border-slate-200 rounded-3xl p-5 shadow-xs transition-all duration-300 ${
                      isSelected ? "border-blue-500 ring-1 ring-blue-500/10" : "border-slate-200"
                    }`}
                  >
                    
                    {/* Header: Bike and status */}
                    <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-bold font-mono rounded">
                            {job.status.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">
                            {job.bikeDetails.brand} {job.bikeDetails.model}
                          </h4>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          REG NO: {job.bikeDetails.registrationNumber} • ODOMETER: {job.bikeDetails.odometer.toLocaleString()} KM
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-mono uppercase block">WORK ORDER</span>
                        <span className="font-bold text-xs text-slate-800 font-mono block">{job.serviceType}</span>
                      </div>
                    </div>

                    {/* Operational controls */}
                    <div className="py-4 space-y-4">
                      {/* Step trigger buttons based on current state */}
                      <div className="flex flex-wrap gap-2">
                        {job.status === "Vehicle Received" && (
                          <button
                            onClick={() => handleUpdateStatus(job.id, "Inspection", "Mechanic Karan Singh started multi-point diagnostics check.")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
                          >
                            <Play className="h-3.5 w-3.5 shrink-0" />
                            <span>Start 42-Point Inspection</span>
                          </button>
                        )}

                        {job.status === "Inspection" && (
                          <button
                            onClick={() => handleUpdateStatus(job.id, "Estimate Generated", "Diagnostics complete. Itemized labor + fork seals quote created.")}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Complete Inspection & Send Estimate to Client</span>
                          </button>
                        )}

                        {job.status === "Estimate Generated" && (
                          <div className="text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl flex items-center">
                            <AlertTriangle className="h-4.5 w-4.5 mr-2 shrink-0 animate-bounce" />
                            <span>Estimate generated. Waiting for client Rahul Sharma to authorize online before starting wrench work...</span>
                          </div>
                        )}

                        {job.status === "Approved" && (
                          <button
                            onClick={() => handleUpdateStatus(job.id, "Repair Started", "Wrench work authorized. Gasket Seals removal operations started.")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
                          >
                            <Play className="h-3.5 w-3.5" />
                            <span>Begin Mechanical Repairs</span>
                          </button>
                        )}

                        {job.status === "Repair Started" && (
                          <button
                            onClick={() => setActiveJobIdForEdit(isSelected ? null : job.id)}
                            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition flex items-center space-x-1.5"
                          >
                            <ClipboardList className="h-3.5 w-3.5" />
                            <span>Manage Spares & Settle Repair</span>
                          </button>
                        )}

                        {job.status === "Quality Check" && (
                          <div className="text-xs text-blue-700 font-semibold bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl flex items-center">
                            <Sparkles className="h-4.5 w-4.5 mr-2 shrink-0 text-blue-600" />
                            <span>Bike is currently undergoing high-speed test drives and final detailing. Ready alert triggers automatically.</span>
                          </div>
                        )}
                      </div>

                      {/* Photo upload trigger */}
                      {["Inspection", "Repair Started"].includes(job.status) && (
                        <div className="flex items-center space-x-3 pt-1">
                          <button
                            onClick={() => simulatePhotoUpload(job.id)}
                            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                          >
                            <Camera className="h-3.5 w-3.5 text-slate-500" />
                            <span>Upload Inspection Photo</span>
                          </button>
                          
                          {job.images.length > 0 && (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center font-mono">
                              <Check className="h-3 w-3 mr-0.5" />
                              {job.images.length} Diagnostic photos uploaded
                            </span>
                          )}
                        </div>
                      )}

                      {/* Expanded Repair Editing Bay (Add spare parts & close job) */}
                      {isSelected && job.status === "Repair Started" && (
                        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-4 text-xs animate-fadeIn">
                          <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center">
                            <Wrench className="h-4 w-4 mr-1.5 rotate-45 text-blue-600" />
                            Active Mechanical Workshop Operations
                          </h5>

                          {/* Inventory Part Adder */}
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                            <div className="sm:col-span-8">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Deduct Genuine Spares from Inventory</label>
                              <select
                                value={selectedPartId}
                                onChange={e => setSelectedPartId(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                              >
                                <option value="">Select Spare Item SKU...</option>
                                {inventory.map(item => (
                                  <option key={item.id} value={item.id} disabled={item.quantity <= 0}>
                                    {item.name} (Qty Left: {item.quantity}) - Rs. {item.cost}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Qty</label>
                              <input
                                type="number"
                                min={1}
                                value={partQty}
                                onChange={e => setPartQty(Number(e.target.value))}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-center font-mono"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <button
                                type="button"
                                onClick={() => handleAddPartToJob(job.id)}
                                className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl hover:bg-slate-800 transition flex items-center justify-center text-xs"
                              >
                                <Plus className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </div>

                          {/* Render current parts used */}
                          <div className="space-y-1.5 bg-white border border-slate-200 p-3 rounded-xl">
                            <p className="font-semibold text-slate-500 text-[10px] uppercase">Spare Parts Added to Bill:</p>
                            {job.partsUsed.length === 0 ? (
                              <p className="text-[11px] text-slate-400 italic">No spares deducted yet.</p>
                            ) : (
                              job.partsUsed.map(part => (
                                <div key={part.id} className="flex justify-between items-center text-[11px]">
                                  <span>{part.name} (x{part.quantity})</span>
                                  <button
                                    onClick={() => removePartFromRepair(job.id, part.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Close Job inputs */}
                          <div className="space-y-3 pt-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Mechanic's Diagnostics Report / Service Notes</label>
                              <textarea
                                placeholder="State any additional adjustments made, carburetor tuning details, tyre puncture patches or clutch clearances configured..."
                                value={mechanicNotes}
                                onChange={e => setMechanicNotes(e.target.value)}
                                rows={2}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCompleteJob(job.id)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
                            >
                              <CheckCircle className="h-4.5 w-4.5" />
                              <span>COMPLETE MECHANICAL REPAIR & TRIGGER QUALITY ROAD-TEST</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pre-uploaded images visualization list */}
                    {job.images.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 flex items-center space-x-3 overflow-x-auto">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0">DIAGNOSTIC SNAP:</span>
                        {job.images.map((img, iidx) => (
                          <div key={iidx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <img src={img} alt="diagnostics" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    )}

                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REPAIR HISTORY WORKSHOP REFERENCE */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white border-2 border-b-4 border-slate-200 rounded-3xl p-6 space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-900 flex items-center border-b-2 border-slate-100 pb-3">
            <History className="h-4.5 w-4.5 mr-2 text-slate-500" />
            My Workshop Settle History (Karan)
          </h3>

          <div className="space-y-3.5">
            {completedJobs.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6">No completed jobs on standard log sheet today.</p>
            ) : (
              completedJobs.map(job => (
                <div key={job.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-1 relative">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{job.bikeDetails.brand} {job.bikeDetails.model}</span>
                    <span className="font-mono text-emerald-600">Settle</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">REG: {job.bikeDetails.registrationNumber}</p>
                  <p className="text-[11px] text-slate-600">{job.serviceType}</p>
                  <div className="border-t border-slate-200/50 mt-1.5 pt-1.5 flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>LEDGER: Rs. {job.estimatedCost.total}</span>
                    <span>QC: Clean</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
            </>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
