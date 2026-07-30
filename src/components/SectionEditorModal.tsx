import React, { useState } from "react";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  Wrench, 
  Layers, 
  Sliders, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Bike, 
  Clock, 
  DollarSign, 
  Sparkles,
  AlertCircle,
  Lock,
  Key,
  ShieldCheck
} from "lucide-react";
import { motion } from "motion/react";
import { BeforeAfterItem, GalleryItem } from "./garageData";
import { compressImageFile } from "../utils/imageCompressor";

export interface ServiceJourneyStep {
  phase: string;
  title: string;
  img: string;
  boldIntro: string;
  mainBody: string;
}

export interface WorkshopLogItem extends GalleryItem {
  tool?: string;
  diagnostic?: string;
  spec?: string;
  technician?: string;
  greaseLevel?: string;
  severity?: "HIGH" | "MEDIUM" | "LOW";
}

interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: "journey" | "diaries" | "transformations";
  
  // Journey Steps State & Setter
  journeySteps: ServiceJourneyStep[];
  onSaveJourneySteps: (steps: ServiceJourneyStep[]) => void;

  // Workshop Logs State & Setter
  workshopLogs: WorkshopLogItem[];
  onSaveWorkshopLogs: (logs: WorkshopLogItem[]) => void;

  // Before/After Transformations State & Setter
  beforeAfterItems: BeforeAfterItem[];
  onSaveBeforeAfterItems: (items: BeforeAfterItem[]) => void;
}

export const SectionEditorModal: React.FC<SectionEditorModalProps> = ({
  isOpen,
  onClose,
  sectionType,
  journeySteps,
  onSaveJourneySteps,
  workshopLogs,
  onSaveWorkshopLogs,
  beforeAfterItems,
  onSaveBeforeAfterItems
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"journey" | "diaries" | "transformations">(sectionType);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Security PIN Verification State
  const [pinInput, setPinInput] = useState("");
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const MASTER_MECHANIC_PIN = "1234";

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === MASTER_MECHANIC_PIN) {
      setIsPinAuthenticated(true);
      setPinError(null);
    } else {
      setPinError("Incorrect Security PIN! Please enter '1234' to authorize editing.");
    }
  };

  // Synchronize tab when sectionType prop changes
  React.useEffect(() => {
    setActiveSubTab(sectionType);
    setEditingId(null);
    setIsAddingNew(false);
  }, [sectionType, isOpen]);

  // Temporary local state copies while editing inside modal
  const [tempJourneySteps, setTempJourneySteps] = useState<ServiceJourneyStep[]>(journeySteps);
  const [tempWorkshopLogs, setTempWorkshopLogs] = useState<WorkshopLogItem[]>(workshopLogs);
  const [tempBeforeAfter, setTempBeforeAfter] = useState<BeforeAfterItem[]>(beforeAfterItems);

  React.useEffect(() => {
    setTempJourneySteps(journeySteps);
  }, [journeySteps]);

  React.useEffect(() => {
    setTempWorkshopLogs(workshopLogs);
  }, [workshopLogs]);

  React.useEffect(() => {
    setTempBeforeAfter(beforeAfterItems);
  }, [beforeAfterItems]);

  // Single Journey Step Form State
  const [journeyForm, setJourneyForm] = useState<ServiceJourneyStep>({
    phase: "PHASE 05",
    title: "New Service Stage",
    img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
    boldIntro: "Quality Check & Tuning",
    mainBody: "Enter custom details describing what mechanics perform during this phase of the repair pipeline."
  });

  // Single Workshop Log Form State
  const [logForm, setLogForm] = useState<WorkshopLogItem>({
    id: `g_${Date.now()}`,
    title: "Front Brake Shoe & Cable Fitting",
    category: "brake",
    categoryLabel: "Brake Service",
    img: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&q=80&w=1200",
    desc: "Replaced worn drum brake shoes, cleaned brake drum liner, and adjusted cable free play.",
    tool: "Ring Spanner & Cable Pliers",
    diagnostic: "Soft brake pedal feel, worn drum brake lining.",
    spec: "Brake lever free play adjusted to 15mm.",
    technician: "Rana Singh",
    greaseLevel: "30% Dust",
    severity: "MEDIUM"
  });

  // Single Before/After Form State
  const [beforeAfterForm, setBeforeAfterForm] = useState<BeforeAfterItem>({
    id: `ba_${Date.now()}`,
    title: "Yamaha RX100 Engine Restoration",
    bike: "Yamaha RX100 Vintage 2-Stroke",
    beforeImg: "https://images.unsplash.com/photo-1558981804-05561a35563a?auto=format&fit=crop&w=800&q=80",
    afterImg: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=800&q=80",
    desc: "Complete crank overhaul, cylinder porting, chrome polishing, and original factory exhaust installation.",
    duration: "18 Hours",
    satisfaction: "100%",
    cost: 9500
  });

  if (!isOpen) return null;

  // File Upload Helper (Reads image file into base64 Data URL with automatic lightweight compression)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert("Image file size should be under 12MB.");
      return;
    }

    try {
      const compressedBase64 = await compressImageFile(file, 1000, 1000, 0.82);
      if (compressedBase64) {
        callback(compressedBase64);
      }
    } catch (err) {
      console.error("Error compressing image file:", err);
    }
  };

  const notifySave = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // --- JOURNEY HANDLERS ---
  const handleSaveJourneyForm = () => {
    let updated: ServiceJourneyStep[];
    if (editingId !== null && typeof editingId === "number") {
      updated = [...tempJourneySteps];
      updated[editingId] = journeyForm;
    } else {
      updated = [...tempJourneySteps, journeyForm];
    }
    setTempJourneySteps(updated);
    onSaveJourneySteps(updated);
    setIsAddingNew(false);
    setEditingId(null);
    notifySave("Our Service Journey steps updated successfully!");
  };

  const handleEditJourneyStep = (idx: number) => {
    setJourneyForm(tempJourneySteps[idx]);
    setEditingId(idx);
    setIsAddingNew(true);
  };

  const handleDeleteJourneyStep = (idx: number) => {
    if (!confirm("Are you sure you want to remove this journey step?")) return;
    const updated = tempJourneySteps.filter((_, i) => i !== idx);
    setTempJourneySteps(updated);
    onSaveJourneySteps(updated);
    notifySave("Journey step deleted.");
  };

  const handleMoveJourneyStep = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= tempJourneySteps.length) return;
    const updated = [...tempJourneySteps];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTempJourneySteps(updated);
    onSaveJourneySteps(updated);
  };

  // --- WORKSHOP LOGS HANDLERS ---
  const handleSaveLogForm = () => {
    let updated: WorkshopLogItem[];
    const existingIdx = tempWorkshopLogs.findIndex(item => item.id === logForm.id);
    if (existingIdx >= 0) {
      updated = [...tempWorkshopLogs];
      updated[existingIdx] = logForm;
    } else {
      updated = [logForm, ...tempWorkshopLogs];
    }
    setTempWorkshopLogs(updated);
    onSaveWorkshopLogs(updated);
    setIsAddingNew(false);
    setEditingId(null);
    notifySave("Workshop Diary logs updated successfully!");
  };

  const handleEditLogItem = (item: WorkshopLogItem) => {
    setLogForm(item);
    setEditingId(item.id);
    setIsAddingNew(true);
  };

  const handleDeleteLogItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this garage log entry?")) return;
    const updated = tempWorkshopLogs.filter(item => item.id !== id);
    setTempWorkshopLogs(updated);
    onSaveWorkshopLogs(updated);
    notifySave("Garage log removed.");
  };

  // --- BEFORE / AFTER HANDLERS ---
  const handleSaveBeforeAfterForm = () => {
    let updated: BeforeAfterItem[];
    const existingIdx = tempBeforeAfter.findIndex(item => item.id === beforeAfterForm.id);
    if (existingIdx >= 0) {
      updated = [...tempBeforeAfter];
      updated[existingIdx] = beforeAfterForm;
    } else {
      updated = [beforeAfterForm, ...tempBeforeAfter];
    }
    setTempBeforeAfter(updated);
    onSaveBeforeAfterItems(updated);
    setIsAddingNew(false);
    setEditingId(null);
    notifySave("Before & After Transformations updated successfully!");
  };

  const handleEditBeforeAfterItem = (item: BeforeAfterItem) => {
    setBeforeAfterForm(item);
    setEditingId(item.id);
    setIsAddingNew(true);
  };

  const handleDeleteBeforeAfterItem = (id: string) => {
    if (!confirm("Are you sure you want to remove this transformation entry?")) return;
    const updated = tempBeforeAfter.filter(item => item.id !== id);
    setTempBeforeAfter(updated);
    onSaveBeforeAfterItems(updated);
    notifySave("Transformation entry removed.");
  };

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto p-3 sm:p-6 flex items-center justify-center min-h-full">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
      />

      {/* Main Container Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative z-10 w-full max-w-4xl bg-slate-900 text-slate-100 border-2 border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/15 text-orange-500 border border-orange-500/30">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  MECHANIC WEBSITE MANAGER
                </span>
                {isPinAuthenticated && (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> UNLOCKED
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-display font-black text-white mt-0.5">
                Upload Photos & Update Section Data
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isPinAuthenticated ? (
          /* MECHANIC SECURITY PIN GATE SCREEN */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-orange-500/20 text-orange-500 border-2 border-orange-500/40 flex items-center justify-center shadow-xl shadow-orange-500/10">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2 max-w-md">
              <span className="text-[10px] font-mono font-black text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/30 uppercase tracking-widest">
                🔐 MECHANIC SECURITY GATE
              </span>
              <h4 className="text-xl font-display font-black text-white">
                Enter Master Mechanic Passcode
              </h4>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                To update garage photos, upload repair files, or edit text on the live website, please enter your 4-digit Mechanic Passcode.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="w-full max-w-xs space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (e.g. 1234)"
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-orange-500 rounded-2xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-white outline-none transition shadow-inner"
                  autoFocus
                />
                
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold text-orange-400 bg-orange-950/70 py-1.5 px-3 rounded-xl border border-orange-800/80">
                  <Key className="h-3.5 w-3.5 text-orange-400" />
                  <span>DEFAULT PASSCODE: 1234</span>
                </div>
              </div>

              {pinError && (
                <div className="text-xs font-mono font-bold text-rose-400 bg-rose-950/90 border border-rose-800 p-2.5 rounded-xl animate-shake">
                  {pinError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-2xl transition shadow-lg shadow-orange-600/30 cursor-pointer flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Verify & Open Editor</span>
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Section Tabs Switcher */}
        <div className="px-5 pt-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveSubTab("journey");
              setIsAddingNew(false);
              setEditingId(null);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center space-x-2 border-t border-x cursor-pointer ${
              activeSubTab === "journey"
                ? "bg-slate-900 border-orange-500 text-orange-400 border-b-2 border-b-slate-900"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>1. Our Service Journey</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab("diaries");
              setIsAddingNew(false);
              setEditingId(null);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center space-x-2 border-t border-x cursor-pointer ${
              activeSubTab === "diaries"
                ? "bg-slate-900 border-orange-500 text-orange-400 border-b-2 border-b-slate-900"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>2. Workshop Diaries Logs</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab("transformations");
              setIsAddingNew(false);
              setEditingId(null);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center space-x-2 border-t border-x cursor-pointer ${
              activeSubTab === "transformations"
                ? "bg-slate-900 border-orange-500 text-orange-400 border-b-2 border-b-slate-900"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>3. Tuned & Treated Before/After</span>
          </button>
        </div>

        {/* Success / Notification Banner */}
        {saveMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-800 px-6 py-2.5 text-xs text-emerald-300 font-mono font-bold flex items-center space-x-2 animate-fadeIn shrink-0">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">

          {/* ==================== SUB-TAB 1: OUR SERVICE JOURNEY ==================== */}
          {activeSubTab === "journey" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-display font-black text-white text-base">Pipeline Service Journey Steps</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Update images, step titles, phase tags, and descriptions for the 3D pipeline journey.
                  </p>
                </div>
                {!isAddingNew && (
                  <button
                    onClick={() => {
                      setJourneyForm({
                        phase: `PHASE 0${tempJourneySteps.length + 1}`,
                        title: "New Custom Diagnostic Phase",
                        img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
                        boldIntro: "Quality Check & Precision Tuning",
                        mainBody: "Enter custom diagnostic or repair description for this step."
                      });
                      setEditingId(null);
                      setIsAddingNew(true);
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Step</span>
                  </button>
                )}
              </div>

              {/* Form Mode */}
              {isAddingNew ? (
                <div className="bg-slate-950 p-5 rounded-2xl border-2 border-orange-500/50 space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h5 className="font-mono font-bold text-orange-400 text-xs uppercase tracking-widest flex items-center gap-1.5">
                      <Edit3 className="h-4 w-4" />
                      <span>{editingId !== null ? "Edit Journey Step" : "Create New Journey Step"}</span>
                    </h5>
                    <button
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Image Upload Block (Visible on Laptop/Desktop only) */}
                  <div className="hidden md:block space-y-2">
                    <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                      📸 Step Photo (Upload Local File OR Enter Image URL)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-4 aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative group">
                        <img 
                          src={journeyForm.img} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-white font-mono">
                          Live Preview
                        </div>
                      </div>

                      <div className="sm:col-span-8 space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Option A: Upload Local Image File from device</label>
                          <label className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-mono font-bold cursor-pointer transition gap-2">
                            <Upload className="h-4 w-4 text-orange-400" />
                            <span>Choose Photo File...</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              className="hidden" 
                              onChange={(e) => handleImageFileUpload(e, (dataUrl) => setJourneyForm({ ...journeyForm, img: dataUrl }))}
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Option B: Image Web URL</label>
                          <input 
                            type="text"
                            value={journeyForm.img}
                            onChange={(e) => setJourneyForm({ ...journeyForm, img: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-orange-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Phase Badge Tag</label>
                      <input 
                        type="text"
                        value={journeyForm.phase}
                        onChange={(e) => setJourneyForm({ ...journeyForm, phase: e.target.value })}
                        placeholder="e.g. PHASE 01"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Step Main Title</label>
                      <input 
                        type="text"
                        value={journeyForm.title}
                        onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })}
                        placeholder="e.g. Digital Slot Queue Reservation"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Bold Intro Lead Text</label>
                    <input 
                      type="text"
                      value={journeyForm.boldIntro}
                      onChange={(e) => setJourneyForm({ ...journeyForm, boldIntro: e.target.value })}
                      placeholder="e.g. Fast slot reservation & zero queue delays"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Main Description Body</label>
                    <textarea 
                      rows={3}
                      value={journeyForm.mainBody}
                      onChange={(e) => setJourneyForm({ ...journeyForm, mainBody: e.target.value })}
                      placeholder="Enter detailed description..."
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-orange-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingId(null);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveJourneyForm}
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center space-x-1.5"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Step to Journey</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* List Mode */
                <div className="space-y-3">
                  {tempJourneySteps.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3.5 flex-grow min-w-0">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-mono font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                              {step.phase}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Step #{idx + 1}</span>
                          </div>
                          <h5 className="font-display font-black text-white text-sm truncate mt-0.5">{step.title}</h5>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{step.boldIntro}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleMoveJourneyStep(idx, "up")}
                          disabled={idx === 0}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveJourneyStep(idx, "down")}
                          disabled={idx === tempJourneySteps.length - 1}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditJourneyStep(idx)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-mono font-bold cursor-pointer flex items-center space-x-1"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteJourneyStep(idx)}
                          className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== SUB-TAB 2: WORKSHOP DIARIES LOGS ==================== */}
          {activeSubTab === "diaries" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-display font-black text-white text-base">Workshop Diaries & Repair Portfolio Logs</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Upload photos of authentic repair jobs, diagnostics, tool specs, and grease notes.
                  </p>
                </div>
                {!isAddingNew && (
                  <button
                    onClick={() => {
                      setLogForm({
                        id: `g_${Date.now()}`,
                        title: "Custom Mechanical Repair Overhaul",
                        category: "servicing",
                        categoryLabel: "Engine Overhaul",
                        img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
                        desc: "Detailed mechanical repair and diagnostics log.",
                        tool: "Pneumatic Torque Wrench",
                        diagnostic: "Loss of engine power and high decibel friction noise.",
                        spec: "Compression calibrated back to factory specs.",
                        technician: "Rana Singh",
                        greaseLevel: "50% Greasy",
                        severity: "MEDIUM"
                      });
                      setEditingId(null);
                      setIsAddingNew(true);
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload New Garage Log</span>
                  </button>
                )}
              </div>

              {/* Form Mode */}
              {isAddingNew ? (
                <div className="bg-slate-950 p-5 rounded-2xl border-2 border-orange-500/50 space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h5 className="font-mono font-bold text-orange-400 text-xs uppercase tracking-widest flex items-center gap-1.5">
                      <Edit3 className="h-4 w-4" />
                      <span>{editingId ? "Edit Workshop Log File" : "Upload & Create Workshop Diary Log"}</span>
                    </h5>
                    <button
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Image Upload Block (Visible on Laptop/Desktop only) */}
                  <div className="hidden md:block space-y-2">
                    <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                      📸 Garage Work Photo (Upload Local File OR Web Image URL)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-4 aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative">
                        <img 
                          src={logForm.img} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="sm:col-span-8 space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Option A: Upload Local Image File from device</label>
                          <label className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-mono font-bold cursor-pointer transition gap-2">
                            <Upload className="h-4 w-4 text-orange-400" />
                            <span>Select Photo File...</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              className="hidden" 
                              onChange={(e) => handleImageFileUpload(e, (dataUrl) => setLogForm({ ...logForm, img: dataUrl }))}
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">Option B: Image Web URL</label>
                          <input 
                            type="text"
                            value={logForm.img}
                            onChange={(e) => setLogForm({ ...logForm, img: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-orange-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Job Title / Bike Component</label>
                      <input 
                        type="text"
                        value={logForm.title}
                        onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                        placeholder="e.g. Inverted USD Fork Resealing"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Category Tag Label</label>
                      <input 
                        type="text"
                        value={logForm.categoryLabel}
                        onChange={(e) => setLogForm({ ...logForm, categoryLabel: e.target.value })}
                        placeholder="e.g. Brakes & Suspension"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Workbench Tool Utilized</label>
                      <input 
                        type="text"
                        value={logForm.tool || ""}
                        onChange={(e) => setLogForm({ ...logForm, tool: e.target.value })}
                        placeholder="e.g. Pneumatic Seal Driver"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Assigned Technician</label>
                      <input 
                        type="text"
                        value={logForm.technician || ""}
                        onChange={(e) => setLogForm({ ...logForm, technician: e.target.value })}
                        placeholder="e.g. Rana Singh"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Severity Risk Level</label>
                      <select 
                        value={logForm.severity || "MEDIUM"}
                        onChange={(e) => setLogForm({ ...logForm, severity: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      >
                        <option value="HIGH">HIGH RISK</option>
                        <option value="MEDIUM">MEDIUM RISK</option>
                        <option value="LOW">LOW RISK</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Initial Complaint / Diagnostic Note</label>
                    <textarea 
                      rows={2}
                      value={logForm.diagnostic || logForm.desc}
                      onChange={(e) => setLogForm({ ...logForm, diagnostic: e.target.value, desc: e.target.value })}
                      placeholder="Describe what issue the motorcycle arrived with..."
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-orange-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Final Physical Spec / Remedy</label>
                    <input 
                      type="text"
                      value={logForm.spec || ""}
                      onChange={(e) => setLogForm({ ...logForm, spec: e.target.value })}
                      placeholder="e.g. Installed double-lip NOK seals, refilled 10W fork oil"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingId(null);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLogForm}
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center space-x-1.5"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Log to Workshop Diaries</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* List Mode */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tempWorkshopLogs.map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex items-start justify-between gap-3"
                    >
                      <div className="flex space-x-3 min-w-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <span className="text-[9px] font-mono font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                            {item.categoryLabel}
                          </span>
                          <h5 className="font-display font-black text-white text-xs truncate leading-snug">{item.title}</h5>
                          <p className="text-[10px] text-slate-400 font-mono line-clamp-1">{item.diagnostic || item.desc}</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1 shrink-0">
                        <button
                          onClick={() => handleEditLogItem(item)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-orange-400 text-[10px] font-mono font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLogItem(item.id)}
                          className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-[10px] font-mono cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== SUB-TAB 3: TUNED & TREATED BEFORE/AFTER ==================== */}
          {activeSubTab === "transformations" && (
            <div className="space-y-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-display font-black text-white text-base">Tuned & Treated to Perfection (Before & After)</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Upload "Before Repair" and "After Restoration" photos along with turnaround time and cost details.
                  </p>
                </div>
                {!isAddingNew && (
                  <button
                    onClick={() => {
                      setBeforeAfterForm({
                        id: `ba_${Date.now()}`,
                        title: "Custom Motorcycle Rebuild & Restoration",
                        bike: "Royal Enfield Classic 350",
                        beforeImg: "https://images.unsplash.com/photo-1558981804-05561a35563a?auto=format&fit=crop&w=800&q=80",
                        afterImg: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=800&q=80",
                        desc: "Complete engine decarbonization, high-heat ceramic exhaust coating, and chrome wheel detailing.",
                        duration: "16 Hours",
                        satisfaction: "100%",
                        cost: 6500
                      });
                      setEditingId(null);
                      setIsAddingNew(true);
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Transformation</span>
                  </button>
                )}
              </div>

              {/* Form Mode */}
              {isAddingNew ? (
                <div className="bg-slate-950 p-5 rounded-2xl border-2 border-orange-500/50 space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h5 className="font-mono font-bold text-orange-400 text-xs uppercase tracking-widest flex items-center gap-1.5">
                      <Edit3 className="h-4 w-4" />
                      <span>{editingId ? "Edit Before & After Entry" : "Create New Before & After Transformation"}</span>
                    </h5>
                    <button
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Dual Image Upload Grid (Visible on Laptop/Desktop only) */}
                  <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                    {/* BEFORE IMAGE */}
                    <div className="space-y-3">
                      <label className="block text-xs font-mono font-black text-rose-400 uppercase tracking-wider">
                        🔴 1. "BEFORE REPAIR" PHOTO
                      </label>
                      <div className="aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                        <img src={beforeAfterForm.beforeImg} alt="Before" className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-2">
                        <label className="inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold cursor-pointer transition gap-2 border border-slate-700">
                          <Upload className="h-4 w-4 text-rose-400" />
                          <span>Upload Before Photo...</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileUpload(e, (dataUrl) => setBeforeAfterForm({ ...beforeAfterForm, beforeImg: dataUrl }))}
                          />
                        </label>
                        <input 
                          type="text"
                          value={beforeAfterForm.beforeImg}
                          onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, beforeImg: e.target.value })}
                          placeholder="Or Before Image URL..."
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono outline-none"
                        />
                      </div>
                    </div>

                    {/* AFTER IMAGE */}
                    <div className="space-y-3">
                      <label className="block text-xs font-mono font-black text-emerald-400 uppercase tracking-wider">
                        🟢 2. "AFTER RESTORATION" PHOTO
                      </label>
                      <div className="aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                        <img src={beforeAfterForm.afterImg} alt="After" className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-2">
                        <label className="inline-flex items-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold cursor-pointer transition gap-2 border border-slate-700">
                          <Upload className="h-4 w-4 text-emerald-400" />
                          <span>Upload After Photo...</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileUpload(e, (dataUrl) => setBeforeAfterForm({ ...beforeAfterForm, afterImg: dataUrl }))}
                          />
                        </label>
                        <input 
                          type="text"
                          value={beforeAfterForm.afterImg}
                          onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, afterImg: e.target.value })}
                          placeholder="Or After Image URL..."
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Transformation Title</label>
                      <input 
                        type="text"
                        value={beforeAfterForm.title}
                        onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, title: e.target.value })}
                        placeholder="e.g. Enfield 350 Decarbonization"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Motorcycle Model</label>
                      <input 
                        type="text"
                        value={beforeAfterForm.bike}
                        onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, bike: e.target.value })}
                        placeholder="e.g. Royal Enfield Bullet 350"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Turnaround Duration</label>
                      <input 
                        type="text"
                        value={beforeAfterForm.duration}
                        onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, duration: e.target.value })}
                        placeholder="e.g. 12 Hours"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Cost (₹ INR)</label>
                      <input 
                        type="number"
                        value={beforeAfterForm.cost}
                        onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, cost: Number(e.target.value) || 0 })}
                        placeholder="4500"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Rider Satisfaction Rating</label>
                      <input 
                        type="text"
                        value={beforeAfterForm.satisfaction}
                        onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, satisfaction: e.target.value })}
                        placeholder="100%"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Restoration Summary Description</label>
                    <textarea 
                      rows={3}
                      value={beforeAfterForm.desc}
                      onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, desc: e.target.value })}
                      placeholder="Describe the mechanical steps and transformation result..."
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-orange-500 font-sans"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingId(null);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBeforeAfterForm}
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center space-x-1.5"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Transformation Entry</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* List Mode */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tempBeforeAfter.map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                            {item.bike}
                          </span>
                          <h5 className="font-display font-black text-white text-sm mt-1">{item.title}</h5>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => handleEditBeforeAfterItem(item)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-orange-400 text-[10px] font-mono font-bold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBeforeAfterItem(item.id)}
                            className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-[10px] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Dual Image Preview */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                          <img src={item.beforeImg} alt="Before" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-rose-900/80 text-rose-200 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                            BEFORE
                          </span>
                        </div>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                          <img src={item.afterImg} alt="After" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-emerald-900/80 text-emerald-200 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                            AFTER
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                        <span>⏱️ {item.duration}</span>
                        <span className="text-emerald-400 font-bold">₹{item.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Changes persist immediately to website via local storage</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
          >
            Done & Return to Website
          </button>
        </div>
        </>
        )}
      </motion.div>
    </div>
  );
};
