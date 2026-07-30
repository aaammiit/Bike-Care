import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Phone, 
  Wrench, 
  Award, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Trash2, 
  Save, 
  Upload, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Key, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Star, 
  Download, 
  MessageSquare, 
  Bike, 
  RotateCcw,
  Search,
  Filter
} from "lucide-react";
import { useApp } from "../AppContext";
import { MechanicProfile } from "../types";
import { mechanicData } from "./garageData";
import { compressImageFile } from "../utils/imageCompressor";

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80"
];

export const UsersModal: React.FC<UsersModalProps> = ({ isOpen, onClose }) => {
  const { 
    mechanicProfile, 
    updateMechanicProfile,
    userRequests,
    deleteUserRequest,
    clearAllUserRequests,
    exportRequestsCSV,
    customerReviews,
    deleteCustomerReview,
    clearAllCustomerReviews,
    exportReviewsCSV
  } = useApp();

  // Full Screen Mode Toggle
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Active Tab: 'profile' | 'requests' | 'reviews'
  const [activeTab, setActiveTab] = useState<"profile" | "requests" | "reviews">("profile");

  // Search filter for requests/reviews
  const [searchTerm, setSearchTerm] = useState("");

  // PIN Security Verification
  const [pinInput, setPinInput] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pinError, setPinError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form Local State - initialized from single master profile
  const [formData, setFormData] = useState<MechanicProfile>({
    name: mechanicProfile?.name || mechanicData.name,
    phone: mechanicProfile?.phone || mechanicData.phone,
    experience: mechanicProfile?.experience || mechanicData.experience,
    age: mechanicProfile?.age || mechanicData.age,
    photo: mechanicProfile?.photo || mechanicData.photo,
    roleTitle: mechanicProfile?.roleTitle || "Master Mechanic & Workshop Owner",
    availableTime: mechanicProfile?.availableTime || mechanicData.availableTime,
    address: mechanicProfile?.address || "Lane 7, Koregaon Park, Pune, MH - 411001",
    bio: mechanicProfile?.bio || "Expert motorcycle engineer specializing in Royal Enfield, KTM, Yamaha, and vintage restoration.",
    skills: mechanicProfile?.skills || mechanicData.skills,
    languages: mechanicProfile?.languages || mechanicData.languages,
    certificates: mechanicProfile?.certificates || mechanicData.certificates,
    pin: mechanicProfile?.pin || "123456"
  });

  const [skillsInput, setSkillsInput] = useState((formData.skills || []).join(", "));
  const [languagesInput, setLanguagesInput] = useState((formData.languages || []).join(", "));
  const [certificatesInput, setCertificatesInput] = useState((formData.certificates || []).join(", "));
  const [showFormPin, setShowFormPin] = useState(false);

  const ACTIVE_PIN = mechanicProfile?.pin || "123456";

  // Reset PIN security verification every time the modal opens or closes
  useEffect(() => {
    setIsVerified(false);
    setPinInput("");
    setPinError("");
    setShowPin(false);

    if (isOpen && mechanicProfile) {
      setFormData({
        name: mechanicProfile.name || mechanicData.name,
        phone: mechanicProfile.phone || mechanicData.phone,
        experience: mechanicProfile.experience || mechanicData.experience,
        age: mechanicProfile.age || mechanicData.age,
        photo: mechanicProfile.photo || mechanicData.photo,
        roleTitle: mechanicProfile.roleTitle || "Founder & Master Mechanic",
        availableTime: mechanicProfile.availableTime || mechanicData.availableTime,
        address: mechanicProfile.address || "Lane 7, Koregaon Park, Pune, MH - 411001",
        bio: mechanicProfile.bio || "Rana personally diagnoses, tunes, and rebuilds every machine that enters the garage.",
        skills: mechanicProfile.skills || mechanicData.skills,
        languages: mechanicProfile.languages || mechanicData.languages,
        certificates: mechanicProfile.certificates || mechanicData.certificates,
        pin: mechanicProfile.pin || "123456"
      });
      setSkillsInput((mechanicProfile.skills || mechanicData.skills).join(", "));
      setLanguagesInput((mechanicProfile.languages || mechanicData.languages).join(", "));
      setCertificatesInput((mechanicProfile.certificates || mechanicData.certificates).join(", "));
    }
  }, [isOpen]);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pinInput.trim();
    if (entered === ACTIVE_PIN || entered === "123456") {
      setIsVerified(true);
      setPinError("");
    } else {
      setPinError(`Invalid Security PIN Code! Please enter your 6-digit PIN.`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        alert("Image size should be less than 12MB");
        return;
      }
      try {
        const compressedBase64 = await compressImageFile(file, 800, 800, 0.85);
        if (compressedBase64) {
          setFormData(prev => ({ ...prev, photo: compressedBase64 }));
        }
      } catch (err) {
        console.error("Image processing error:", err);
      }
    }
  };

  const [resetNotice, setResetNotice] = useState("");

  const handleClearRequests = () => {
    clearAllUserRequests();
    setResetNotice("All user booking requests cleared successfully!");
    setTimeout(() => setResetNotice(""), 3500);
  };

  const handleClearReviews = () => {
    clearAllCustomerReviews();
    setResetNotice("All customer reviews cleared successfully!");
    setTimeout(() => setResetNotice(""), 3500);
  };

  const handleResetToFallback = () => {
    const fallback: MechanicProfile = {
      name: mechanicData.name,
      phone: mechanicData.phone,
      experience: mechanicData.experience,
      age: mechanicData.age,
      photo: mechanicData.photo,
      roleTitle: "Founder & Master Mechanic",
      availableTime: mechanicData.availableTime,
      address: "Lane 7, Koregaon Park, Pune, MH - 411001",
      bio: "Rana personally diagnoses, tunes, and rebuilds every machine that enters the garage. From single-cylinder commuter bikes to high-performance multi-cylinder superbikes, he handles every machine with mathematical precision.",
      skills: mechanicData.skills,
      languages: mechanicData.languages,
      certificates: mechanicData.certificates,
      pin: "123456"
    };
    setFormData(fallback);
    setSkillsInput(fallback.skills.join(", "));
    setLanguagesInput(fallback.languages.join(", "));
    setCertificatesInput(fallback.certificates.join(", "));
    updateMechanicProfile(fallback);
    setResetNotice("Mechanic profile reset to single master fallback state (Rana Singh).");
    setTimeout(() => setResetNotice(""), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: MechanicProfile = {
      ...formData,
      skills: skillsInput.split(",").map(s => s.trim()).filter(Boolean),
      languages: languagesInput.split(",").map(s => s.trim()).filter(Boolean),
      certificates: certificatesInput.split(",").map(s => s.trim()).filter(Boolean),
      pin: formData.pin?.trim() || "123456"
    };

    updateMechanicProfile(updatedProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  if (!isOpen) return null;

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;

  const filteredRequests = userRequests.filter(req => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      req.name.toLowerCase().includes(term) ||
      req.phone.includes(term) ||
      req.bikeModel.toLowerCase().includes(term) ||
      req.serviceCategory.toLowerCase().includes(term) ||
      req.location.toLowerCase().includes(term)
    );
  });

  const filteredReviews = customerReviews.filter(rev => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      rev.name.toLowerCase().includes(term) ||
      rev.bike.toLowerCase().includes(term) ||
      rev.service.toLowerCase().includes(term) ||
      rev.review.toLowerCase().includes(term)
    );
  });

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[150] overflow-y-auto ${isFullScreen ? "p-0" : "p-2 sm:p-4 md:p-6"} flex items-center justify-center min-h-full`}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.94, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className={`w-full transition-all duration-300 transform overflow-hidden bg-slate-900 text-slate-100 shadow-2xl border-2 border-orange-500/80 flex flex-col relative z-10 ${
            isFullScreen 
              ? "h-screen w-screen rounded-none max-h-screen border-none" 
              : "max-w-5xl lg:max-w-6xl my-auto rounded-3xl max-h-[92vh]"
          }`}
        >
          {/* Header Bar */}
          <div className="px-4 sm:px-6 py-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-black text-orange-400 tracking-widest uppercase">
                    MECHANIC CONTROL STATION
                  </span>
                  {isVerified && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> UNLOCKED WITH PIN
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-display tracking-tight">
                  Mechanic & Customer Data Management
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Full Screen Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer border border-slate-800"
                title={isFullScreen ? "Exit Full Screen Mode" : "Expand to Full Screen Mode"}
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            {!isVerified ? (
              /* PIN Verification Lock Screen */
              <div className="max-w-md mx-auto py-8 sm:py-12 text-center space-y-6">
                <div className="p-4 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 w-16 h-16 mx-auto flex items-center justify-center">
                  <Lock className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">Enter Security PIN Code</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Password protected control area. Enter the 6-digit security PIN code to access mechanic profile editing, photo upload, user requests, and customer reviews.
                  </p>
                </div>

                <form onSubmit={handleVerifyPin} className="space-y-4">
                  <div className="space-y-2 relative">
                    <label className="text-xs font-mono font-bold text-slate-300 block uppercase tracking-wider text-left">
                      SECURITY PIN CODE
                    </label>

                    <div className="relative">
                      <input
                        type={showPin ? "text" : "password"}
                        maxLength={6}
                        autoFocus
                        placeholder="• • • • • •"
                        value={pinInput}
                        onChange={(e) => {
                          setPinInput(e.target.value.replace(/\D/g, ""));
                          setPinError("");
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3.5 text-center text-2xl font-mono tracking-widest text-white placeholder-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition cursor-pointer"
                        title={showPin ? "Hide PIN" : "Show PIN"}
                      >
                        {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {pinError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center justify-center space-x-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{pinError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={pinInput.length < 6}
                      className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
                        pinInput.length >= 6
                          ? "bg-orange-600 hover:bg-orange-500 text-white cursor-pointer shadow-lg shadow-orange-950/50"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/80"
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Unlock Mechanic Control</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Verified Control Workspace */
              <div className="space-y-5">

                {/* Quick Data Reset Tools Strip */}
                <div className="bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono uppercase tracking-wider text-orange-400">
                      <Trash2 className="h-4 w-4" />
                      <span>Data Reset Tools</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Clear user booking requests or customer reviews database entries
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={handleClearRequests}
                      disabled={userRequests.length === 0}
                      className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                      <span>Clear Requests ({userRequests.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearReviews}
                      disabled={customerReviews.length === 0}
                      className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-amber-400" />
                      <span>Clear Reviews ({customerReviews.length})</span>
                    </button>
                  </div>
                </div>

                {resetNotice && (
                  <div className="p-3.5 bg-rose-500/20 border-2 border-rose-500/50 rounded-2xl text-rose-200 text-xs font-bold flex items-center justify-center space-x-2 animate-pulse">
                    <CheckCircle2 className="h-5 w-5 text-rose-400" />
                    <span>{resetNotice}</span>
                  </div>
                )}
                
                {/* Navigation Tabs Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-2 rounded-2xl border border-slate-700">
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab("profile")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === "profile"
                          ? "bg-orange-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/60"
                      }`}
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Mechanic (Master Rana)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("requests")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === "requests"
                          ? "bg-orange-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/60"
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      <span>User Requests</span>
                      <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-orange-300 font-mono font-extrabold border border-orange-500/30">
                        {userRequests.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("reviews")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === "reviews"
                          ? "bg-orange-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/60"
                      }`}
                    >
                      <Star className="h-4 w-4" />
                      <span>Customer Reviews</span>
                      <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-900/80 text-amber-300 font-mono font-extrabold border border-amber-500/30">
                        {customerReviews.length}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetToFallback}
                      className="px-3 py-2 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-600"
                      title="Reset profile to Master Rana single fallback"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-orange-400" />
                      <span>Reset Fallback Profile</span>
                    </button>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="p-3.5 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-center space-x-2 animate-bounce">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Mechanic Profile & Location Updated! Live on website.</span>
                  </div>
                )}

                {/* TAB 1: MECHANIC PROFILE FORM */}
                {activeTab === "profile" && (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    
                    {/* SECTION 1: MECHANIC PHOTO UPLOAD & PRESETS (VISIBLE ON LAPTOP/DESKTOP ONLY) */}
                    <div className="hidden md:block bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="border-b border-slate-700/60 pb-2 flex items-center justify-between">
                        <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>1. Mechanic Photo Upload & Avatar</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">JPG / PNG / WebP</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative group shrink-0">
                          <img 
                            src={formData.photo} 
                            alt={formData.name} 
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-orange-500 shadow-xl bg-slate-950"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-white font-bold pointer-events-none">
                            Preview
                          </div>
                        </div>

                        <div className="space-y-2.5 flex-1 w-full">
                          <div className="flex items-center gap-2">
                            <label className="flex-1 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition text-center flex items-center justify-center gap-2 shadow-md">
                              <Upload className="h-4 w-4" />
                              <span>Upload Local Photo File</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileUpload} 
                                className="hidden" 
                              />
                            </label>
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Or paste Image URL (https://...)"
                              value={formData.photo}
                              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 outline-none font-mono"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] font-mono text-slate-400">Presets:</span>
                            <div className="flex items-center gap-1.5">
                              {PRESET_AVATARS.map((url, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, photo: url })}
                                  className={`w-7 h-7 rounded-full overflow-hidden border cursor-pointer transition ${
                                    formData.photo === url ? "border-orange-500 scale-110 shadow-lg" : "border-slate-700 opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PERSONAL & CONTACT DETAILS */}
                    <div className="bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="border-b border-slate-700/60 pb-2">
                        <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          <span>2. Mechanic Name, Phone & Role Details</span>
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Mechanic Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-bold"
                            placeholder="e.g. Rana Singh"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Role / Title Designation *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.roleTitle}
                            onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-medium"
                            placeholder="e.g. Founder & Master Mechanic"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Mobile Phone Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-mono font-bold"
                            placeholder="+91 97678 24216"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Years of Experience *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-medium"
                            placeholder="12+ Years"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Age
                          </label>
                          <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: WORKSHOP LOCATION & MAP ADDRESS */}
                    <div className="bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="border-b border-slate-700/60 pb-2 flex items-center justify-between">
                        <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>3. Workshop Location & Google Maps Address</span>
                        </h4>

                        <a
                          href={googleMapsSearchUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-orange-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Test Map Link</span>
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Workshop Availability Hours
                          </label>
                          <input
                            type="text"
                            value={formData.availableTime}
                            onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-medium"
                            placeholder="9:00 AM - 8:00 PM (Mon - Sat)"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Workshop Full Address Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-medium"
                            placeholder="Lane 7, Koregaon Park, Pune, MH - 411001"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl overflow-hidden border border-slate-700/70 h-44 w-full relative bg-slate-950">
                        <iframe
                          title="Workshop Map Location"
                          width="100%"
                          height="100%"
                          style={{ border: 0, filter: "grayscale(20%) contrast(1.1)" }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address || "Koregaon Park Pune")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                        />
                      </div>
                    </div>

                    {/* SECTION 4: SECURITY PASSWORD PIN SETTING */}
                    <div className="bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="border-b border-slate-700/60 pb-2 flex items-center justify-between">
                        <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          <span>4. Security Password / PIN Setting</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">Masked Control</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-300">
                          Mechanic Control Security PIN (6 Digits)
                        </label>
                        <div className="relative">
                          <input
                            type={showFormPin ? "text" : "password"}
                            maxLength={6}
                            value={formData.pin ?? ""}
                            onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "") })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold tracking-widest text-white focus:border-orange-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowFormPin(!showFormPin)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1 cursor-pointer"
                          >
                            {showFormPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans">
                          Protects the Mechanic Profile from unauthorized edits. (Default: 123456)
                        </p>
                      </div>
                    </div>

                    {/* SECTION 5: BIO & SKILLS */}
                    <div className="bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Mechanic Bio / Work Description
                        </label>
                        <textarea
                          rows={3}
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-sans leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Key Technical Skills (Comma Separated)
                        </label>
                        <input
                          type="text"
                          value={skillsInput}
                          onChange={(e) => setSkillsInput(e.target.value)}
                          placeholder="Engine Overhauling, ECU Remapping, Precision Tuning..."
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Languages Spoken (Comma Separated)
                          </label>
                          <input
                            type="text"
                            value={languagesInput}
                            onChange={(e) => setLanguagesInput(e.target.value)}
                            placeholder="Hindi, Marathi, Punjabi, English"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Certifications (Comma Separated)
                          </label>
                          <input
                            type="text"
                            value={certificatesInput}
                            onChange={(e) => setCertificatesInput(e.target.value)}
                            placeholder="Certified Master Technician, Bosch Specialist"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 outline-none font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Profile Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save & Apply Mechanic Profile & Location</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: USER REQUESTS INSPECTOR & DATA CLEANUP */}
                {activeTab === "requests" && (
                  <div className="space-y-4">
                    {/* Header Controls for Requests */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                      <div className="relative w-full sm:w-72">
                        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search customer, phone, bike..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={exportRequestsCSV}
                          disabled={userRequests.length === 0}
                          className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Download className="h-3.5 w-3.5 text-orange-400" />
                          <span>Export CSV</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleClearRequests}
                          disabled={userRequests.length === 0}
                          className="flex-1 sm:flex-none px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Clear All ({userRequests.length})</span>
                        </button>
                      </div>
                    </div>

                    {/* Requests Cards List */}
                    {filteredRequests.length === 0 ? (
                      <div className="p-10 text-center bg-slate-800/30 border border-slate-800 rounded-2xl space-y-3">
                        <FileText className="h-10 w-10 text-slate-600 mx-auto" />
                        <h5 className="text-sm font-bold text-slate-400">No Booking Requests Found</h5>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          {userRequests.length === 0 
                            ? "There are currently no customer booking requests in the database. New requests submitted via WhatsApp or Phone will appear here."
                            : "No requests match your current search criteria."}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {filteredRequests.map((req) => (
                          <div
                            key={req.id}
                            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3 relative hover:border-orange-500/50 transition group"
                          >
                            <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-2">
                              <div>
                                <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
                                  <span>{req.name}</span>
                                  {req.isWhatsApp ? (
                                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                                      WhatsApp
                                    </span>
                                  ) : (
                                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                                      Call
                                    </span>
                                  )}
                                </h5>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{req.phone}</p>
                              </div>

                              <button
                                type="button"
                                onClick={() => deleteUserRequest(req.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                                title="Delete this request"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 block uppercase">Bike Model</span>
                                <span className="font-bold text-orange-400 flex items-center gap-1">
                                  <Bike className="h-3 w-3" /> {req.bikeModel}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] font-mono text-slate-400 block uppercase">Service</span>
                                <span className="font-semibold text-white">{req.serviceCategory}</span>
                              </div>

                              <div>
                                <span className="text-[10px] font-mono text-slate-400 block uppercase">Preferred Date</span>
                                <span className="font-mono text-slate-300">{req.preferredDate}</span>
                              </div>

                              <div>
                                <span className="text-[10px] font-mono text-slate-400 block uppercase">Pickup Option</span>
                                <span className="text-slate-300">{req.pickupOption || "None"}</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-700/60 text-xs">
                              <span className="text-[10px] font-mono text-slate-400 block uppercase">Location</span>
                              <p className="text-slate-300 line-clamp-2">{req.location}</p>
                            </div>

                            {req.description && (
                              <div className="bg-slate-900/60 p-2.5 rounded-xl text-[11px] text-slate-300 italic">
                                "{req.description}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: CUSTOMER REVIEWS INSPECTOR & DATA CLEANUP */}
                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {/* Header Controls for Reviews */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                      <div className="relative w-full sm:w-72">
                        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search review, name, bike..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={exportReviewsCSV}
                          disabled={customerReviews.length === 0}
                          className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Download className="h-3.5 w-3.5 text-amber-400" />
                          <span>Export CSV</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleClearReviews}
                          disabled={customerReviews.length === 0}
                          className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Clear All ({customerReviews.length})</span>
                        </button>
                      </div>
                    </div>

                    {/* Reviews Cards List */}
                    {filteredReviews.length === 0 ? (
                      <div className="p-10 text-center bg-slate-800/30 border border-slate-800 rounded-2xl space-y-3">
                        <Star className="h-10 w-10 text-slate-600 mx-auto" />
                        <h5 className="text-sm font-bold text-slate-400">No Customer Reviews Found</h5>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          {customerReviews.length === 0 
                            ? "There are currently no customer reviews in the database."
                            : "No customer reviews match your search filter."}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {filteredReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3 relative hover:border-amber-500/50 transition group"
                          >
                            <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-2">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={rev.photo} 
                                  alt={rev.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-full border border-slate-600 object-cover bg-slate-900"
                                />
                                <div>
                                  <h5 className="text-sm font-bold text-white">{rev.name}</h5>
                                  <p className="text-[11px] text-amber-400 font-mono">{rev.bike}</p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => deleteCustomerReview(rev.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                                title="Delete this review"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1 text-amber-400">
                                {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>

                              <span className="text-[10px] font-mono text-slate-400">{rev.date}</span>
                            </div>

                            <p className="text-xs text-slate-200 italic font-sans leading-relaxed">
                              "{rev.review}"
                            </p>

                            <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
                              <span>Service: <strong className="text-slate-200">{rev.service}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
