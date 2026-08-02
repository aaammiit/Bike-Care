import React, { useState } from "react";
import { useApp } from "../AppContext";
import { Booking, RepairJob, Invoice, InventoryItem, Employee, BIKE_SERVICES_LIST, RepairStatus } from "../types";
import { DuoSkeleton } from "./DuoSkeleton";
import {
  TrendingUp,
  Clock,
  Wrench,
  AlertTriangle,
  User,
  Activity,
  Plus,
  CheckCircle,
  FileText,
  BadgeAlert,
  Coins,
  CreditCard,
  UserCheck,
  RotateCcw,
  PlusCircle,
  ShoppingBag,
  Check,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";
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

interface AdminDashboardProps {
  onViewInvoice: (invoice: Invoice) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewInvoice }) => {
  const {
    bookings,
    repairs,
    invoices,
    inventory,
    employees,
    confirmBooking,
    cancelBooking,
    rejectBooking,
    updateRepairStatus,
    assignMechanic,
    addPartsToRepair,
    removePartFromRepair,
    markInvoiceAsPaid,
    addInventoryItem,
    updateInventoryQuantity
  } = useApp();

  // Tabs within admin panel
  const [adminTab, setAdminTab] = useState<"kpi" | "bookings" | "repairs" | "payments" | "inventory" | "staff">("kpi");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (tab: "kpi" | "bookings" | "repairs" | "payments" | "inventory" | "staff") => {
    setIsLoading(true);
    setAdminTab(tab);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Local state for actions
  const [selectedRepairIdForParts, setSelectedRepairIdForParts] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [partQty, setPartQty] = useState(1);
  const [discountValue, setDiscountValue] = useState(0);

  // New Inventory item form
  const [showInvForm, setShowInvForm] = useState(false);
  const [invName, setInvName] = useState("");
  const [invCost, setInvCost] = useState("");
  const [invQty, setInvQty] = useState("");
  const [invSupplier, setInvSupplier] = useState("");
  const [invAlertQty, setInvAlertQty] = useState("");

  // Assign Mechanic overlay modal state
  const [assigningBookingId, setAssigningBookingId] = useState<string | null>(null);
  const [selectedMechId, setSelectedMechId] = useState("");
  const [acceptedDate, setAcceptedDate] = useState("");
  const [acceptedTimeSlot, setAcceptedTimeSlot] = useState("");

  // Reject Booking overlay modal state
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Financial aggregation
  const paidInvoices = invoices.filter(i => i.paymentStatus === "Paid");
  const unpaidInvoices = invoices.filter(i => i.paymentStatus === "Unpaid");

  const totalMonthlyRevenue = paidInvoices.reduce((acc, inv) => acc + inv.finalAmount, 0);
  const pendingCollections = unpaidInvoices.reduce((acc, inv) => acc + inv.finalAmount, 0);
  const pendingBookingsCount = bookings.filter(b => b.status === "Pending").length;
  const activeRepairsCount = repairs.filter(r => !["Delivered", "Ready"].includes(r.status)).length;
  const lowStockItems = inventory.filter(i => i.quantity <= i.minAlertQuantity);

  // Seed chart data using actual seeded invoices + simulated historic averages
  const revenueHistoryChartData = [
    { date: "07/11", Cash: 1800, UPI: 4200 },
    { date: "07/12", Cash: 2200, UPI: 5600 },
    { date: "07/13", Cash: 3100, UPI: 6800 },
    { date: "07/14", Cash: 1500, UPI: 3900 },
    { date: "07/15", Cash: 4500, UPI: 8200 },
    { date: "07/16", Cash: paidInvoices.filter(i => i.paymentMethod === "Cash").reduce((sum, i) => sum + i.finalAmount, 0) + 1200, UPI: paidInvoices.filter(i => i.paymentMethod === "UPI at Garage").reduce((sum, i) => sum + i.finalAmount, 0) + 3800 }
  ];

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBookingId) return;
    confirmBooking(
      assigningBookingId,
      selectedMechId || undefined,
      acceptedDate || undefined,
      acceptedTimeSlot || undefined
    );
    setAssigningBookingId(null);
    setSelectedMechId("");
    setAcceptedDate("");
    setAcceptedTimeSlot("");
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingBookingId) return;
    rejectBooking(rejectingBookingId, rejectionReason || "Workshop schedule full for requested time slot.");
    setRejectingBookingId(null);
    setRejectionReason("");
  };

  const handleAddPartsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepairIdForParts || !selectedPartId) return;
    addPartsToRepair(selectedRepairIdForParts, selectedPartId, Number(partQty));
    setSelectedPartId("");
    setPartQty(1);
  };

  const handleCreateInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim() || !invCost.trim() || !invQty.trim()) return;

    addInventoryItem({
      name: invName,
      cost: Number(invCost),
      quantity: Number(invQty),
      supplier: invSupplier || "Local Spare Wholesalers",
      minAlertQuantity: Number(invAlertQty) || 2
    });

    setInvName("");
    setInvCost("");
    setInvQty("");
    setInvSupplier("");
    setInvAlertQty("");
    setShowInvForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      
      {/* 1. ADMIN ACTION KPI BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-xs flex items-center space-x-3">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl shrink-0">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Collections</span>
            <span className="text-base font-bold font-mono block text-emerald-600">Rs. {totalMonthlyRevenue.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 block font-sans">Physical Paid Bills</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-xs flex items-center space-x-3">
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Pending Cash</span>
            <span className="text-base font-bold font-mono block text-amber-600">Rs. {pendingCollections.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 block font-sans">Estimates Generated</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-xs flex items-center space-x-3">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Pending Books</span>
            <span className="text-base font-bold block text-slate-900">{pendingBookingsCount} Requests</span>
            <span className="text-[9px] text-slate-400 block font-sans">Awaiting Mechanic Slots</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-xs flex items-center space-x-3">
          <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl shrink-0">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Active Jobs</span>
            <span className="text-base font-bold block text-slate-900">{activeRepairsCount} Bikes</span>
            <span className="text-[9px] text-slate-400 block font-sans">In Workshop Bays</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-xs flex items-center space-x-3 col-span-2 lg:col-span-1">
          <div className={`p-2.5 rounded-xl shrink-0 ${lowStockItems.length > 0 ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-50 text-slate-600"}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Stock Warnings</span>
            <span className={`text-base font-bold block ${lowStockItems.length > 0 ? "text-red-600" : "text-slate-900"}`}>
              {lowStockItems.length} Parts Low
            </span>
            <span className="text-[9px] text-slate-400 block font-sans">Reorder required soon</span>
          </div>
        </div>

      </div>

      {/* Admin Dashboard Sidebar/Navigation Tabs with sliding underline */}
      <div className="flex border-b-2 border-slate-200 mb-6 overflow-x-auto space-x-1 sm:space-x-3 relative">
        {(["kpi", "bookings", "repairs", "payments", "inventory", "staff"] as const).map((tab) => {
          const isActive = adminTab === tab;
          let label = "";
          if (tab === "kpi") label = "Executive Analytics";
          else if (tab === "bookings") label = `Bookings (${pendingBookingsCount})`;
          else if (tab === "repairs") label = `Workshop (${repairs.filter(r => r.status !== "Delivered").length})`;
          else if (tab === "payments") label = `Payments (${unpaidInvoices.length})`;
          else if (tab === "inventory") label = `Inventory (${inventory.length})`;
          else if (tab === "staff") label = "Mechanic Staffing";

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
                  layoutId="adminActiveTabIndicator"
                  className="absolute bottom-[-2px] left-0 right-0 h-[4px] bg-blue-600 rounded-full z-0"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. ADMIN VIEWPORT PANELS */}
      <div className="mt-2 text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={adminTab + (isLoading ? "-loading" : "")}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {isLoading ? (
              <div className="space-y-6">
                {adminTab === "kpi" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <DuoSkeleton type="detail" count={1} className="lg:col-span-2" />
                    <DuoSkeleton type="card" count={1} />
                  </div>
                )}
                {adminTab === "bookings" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DuoSkeleton type="card" count={3} />
                  </div>
                )}
                {adminTab === "repairs" && <DuoSkeleton type="list" count={4} />}
                {adminTab === "payments" && <DuoSkeleton type="list" count={4} />}
                {adminTab === "inventory" && (
                  <div className="space-y-4">
                    <DuoSkeleton type="table" count={4} />
                  </div>
                )}
                {adminTab === "staff" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DuoSkeleton type="card" count={3} />
                  </div>
                )}
              </div>
            ) : (
              <>
            
            {/* PANEL A: EXECUTIVE ANALYTICS */}
            {adminTab === "kpi" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            
            {/* Chart Area */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Daily Revenue Performance Trend</h3>
                  <p className="text-xs text-slate-400">Offline collections made physically at the garage (Cash vs UPI split)</p>
                </div>
                <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueHistoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#0f172a", borderRadius: "12px", border: "0", color: "#fff" }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="UPI" name="UPI at Counter" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Cash" name="Hard Cash Settle" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Low Stock Alert Deck */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 flex items-center">
                  <BadgeAlert className="h-4.5 w-4.5 text-red-500 mr-2 shrink-0" />
                  Inventory Reorder Alert list
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Parts falling below minimum stock threshold levels</p>
                
                <div className="space-y-2.5 mt-4">
                  {lowStockItems.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-4">All parts inventory stock levels are secure.</p>
                  ) : (
                    lowStockItems.map(item => (
                      <div key={item.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">SUPPLIER: {item.supplier}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-bold rounded block font-mono">
                            STOCK: {item.quantity}
                          </span>
                          <button
                            onClick={() => updateInventoryQuantity(item.id, item.quantity + 10)}
                            className="text-[10px] font-bold text-blue-600 hover:underline mt-1 block"
                          >
                            +10 Restock
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setAdminTab("inventory")}
                  className="w-full text-center text-xs font-semibold text-blue-600 hover:underline"
                >
                  Manage Spare Parts Catalogue
                </button>
              </div>
            </div>

          </div>
        )}

        {/* PANEL B: MANAGE BOOKINGS */}
        {adminTab === "bookings" && (
          <div className="space-y-4 text-left animate-fadeIn">
            <h3 className="font-display font-bold text-base text-slate-900">Awaiting Service Confirmations</h3>
            
            {bookings.filter(b => b.status === "Pending").length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">All customer booking requests cleared!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.filter(b => b.status === "Pending").map(booking => (
                  <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-mono rounded">
                          PENDING ADMISSION
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-2">{booking.customerName}</h4>
                        <p className="text-xs font-mono text-slate-500">{booking.customerMobile}</p>
                      </div>

                      <div className="text-right text-xs">
                        <span className="font-mono text-blue-600 block font-bold">{booking.date}</span>
                        <span className="text-[10px] text-slate-400 block font-sans">{booking.timeSlot}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1.5 text-xs">
                      <div>
                        <span className="text-slate-400 font-mono text-[10px]">VEHICLE:</span>{" "}
                        <span className="font-semibold text-slate-800">{booking.bikeDetails}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono text-[10px]">WORK:</span>{" "}
                        <span className="font-semibold text-slate-800">{booking.serviceType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono text-[10px]">TRANSPORT:</span>{" "}
                        <span className="font-semibold text-slate-800">{booking.pickupOption === "None" ? "Self Drive" : booking.pickupOption}</span>
                      </div>
                      {booking.notes && (
                        <div className="text-slate-500 italic border-t border-slate-200/40 pt-1.5 mt-1">
                          " {booking.notes} "
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => {
                          setRejectingBookingId(booking.id);
                          setRejectionReason("Workshop schedule full for requested time slot. Please contact us to pick an alternate date.");
                        }}
                        className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
                      >
                        Decline Booking
                      </button>

                      <button
                        onClick={() => {
                          setAssigningBookingId(booking.id);
                          setAcceptedDate(booking.date);
                          setAcceptedTimeSlot(booking.timeSlot);
                          setSelectedMechId(employees.find(e => e.role === "Mechanic")?.id || "");
                        }}
                        className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm cursor-pointer"
                      >
                        Accept Request & Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Accept Request & Assign Mechanic Overlay Dialog */}
            {assigningBookingId && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 text-left shadow-2xl">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">Accept Service Request</h4>
                    <button
                      type="button"
                      onClick={() => setAssigningBookingId(null)}
                      aria-label="Close dialog"
                      title="Close"
                      className="shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <X className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <form onSubmit={handleConfirmAssign} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Accepted Date
                        </label>
                        <input
                          type="text"
                          required
                          value={acceptedDate}
                          onChange={e => setAcceptedDate(e.target.value)}
                          placeholder="2026-07-25"
                          className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Accepted Time Slot
                        </label>
                        <input
                          type="text"
                          required
                          value={acceptedTimeSlot}
                          onChange={e => setAcceptedTimeSlot(e.target.value)}
                          placeholder="10:00 AM - 12:00 PM"
                          className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Select Mechanic on Duty
                      </label>
                      <select
                        value={selectedMechId}
                        onChange={e => setSelectedMechId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                      >
                        <option value="">Decide Later / Dispatch Pool</option>
                        {employees.filter(e => e.role === "Mechanic" && e.status === "Active").map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.jobsCompleted} jobs completed)
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition cursor-pointer"
                    >
                      Accept Request & Send WhatsApp Alert
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Reject Request Overlay Dialog */}
            {rejectingBookingId && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 text-left shadow-2xl">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                    <h4 className="font-bold text-sm text-red-600 dark:text-red-400 truncate">Decline Service Request</h4>
                    <button
                      type="button"
                      onClick={() => setRejectingBookingId(null)}
                      aria-label="Close dialog"
                      title="Close"
                      className="shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <X className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <form onSubmit={handleConfirmReject} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Reason for Rejection / Customer Message
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        placeholder="e.g. Workshop schedule full for requested time slot. Please contact us at +91 92724 96996."
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:ring-1 focus:ring-red-500 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-red-700 transition cursor-pointer"
                    >
                      Confirm Rejection & Send Message
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL C: WORKSHOP TERMINAL (ACTIVE JOBS CONTROL) */}
        {adminTab === "repairs" && (
          <div className="space-y-6 text-left animate-fadeIn">
            <h3 className="font-display font-bold text-base text-slate-900">Workshop Floor Operations Terminal</h3>
            
            <div className="space-y-4">
              {repairs.filter(r => r.status !== "Delivered").map(repair => {
                const isPartAdding = selectedRepairIdForParts === repair.id;

                return (
                  <div
                    key={repair.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row justify-between gap-6"
                  >
                    
                    {/* Repair details */}
                    <div className="space-y-3.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold font-mono rounded">
                          {repair.status.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {repair.bikeDetails.brand} {repair.bikeDetails.model}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">REG: {repair.bikeDetails.registrationNumber}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 font-mono text-[10px] block">CLIENT</span>
                          <span className="font-semibold text-slate-800">{repair.customerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[10px] block">ASSIGNED DUTY</span>
                          <span className="font-semibold text-slate-800">{repair.assignedMechanicName || "Dispatch Pool"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[10px] block">SERVICE SPEC</span>
                          <span className="font-semibold text-slate-800">{repair.serviceType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[10px] block">CURRENT LEDGER</span>
                          <span className="font-bold text-slate-900 font-mono text-blue-600">Rs. {repair.estimatedCost.total}</span>
                        </div>
                      </div>

                      {/* Timeline status quick update buttons */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">TRANSITION FLOOR:</span>
                        
                        {(["Vehicle Received", "Inspection", "Estimate Generated", "Approved", "Repair Started", "Quality Check", "Ready"] as RepairStatus[]).map(st => (
                          <button
                            key={st}
                            onClick={() => updateRepairStatus(repair.id, st, `State manually changed on workshop terminal.`)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition ${
                              repair.status === st
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Operational Parts and Mechanic Assignment Side panel */}
                    <div className="lg:w-80 shrink-0 bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-200">
                          <span className="font-bold text-slate-900">Genuine Spare Parts Added</span>
                          <button
                            onClick={() => setSelectedRepairIdForParts(isPartAdding ? null : repair.id)}
                            className="text-[10px] text-blue-600 font-bold hover:underline"
                          >
                            {isPartAdding ? "Close" : "+ Add Part"}
                          </button>
                        </div>

                        {/* List parts currently on repair */}
                        <div className="space-y-1 text-xs">
                          {repair.partsUsed.length === 0 ? (
                            <p className="text-[11px] text-slate-400 italic">No parts added to bill yet.</p>
                          ) : (
                            repair.partsUsed.map(part => (
                              <div key={part.id} className="flex justify-between items-center">
                                <span className="text-[11px] text-slate-600">{part.name} (x{part.quantity})</span>
                                <div className="flex items-center space-x-1 font-mono text-[11px]">
                                  <span>Rs. {part.cost * part.quantity}</span>
                                  <button
                                    onClick={() => removePartFromRepair(repair.id, part.id)}
                                    className="text-red-500 hover:text-red-700 ml-1 font-sans text-[10px] font-bold"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {isPartAdding && (
                          <form onSubmit={handleAddPartsSubmit} className="pt-2 border-t border-slate-200 space-y-2">
                            <select
                              value={selectedPartId}
                              onChange={e => setSelectedPartId(e.target.value)}
                              required
                              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px]"
                            >
                              <option value="">Select Spare Part...</option>
                              {inventory.map(item => (
                                <option key={item.id} value={item.id} disabled={item.quantity <= 0}>
                                  {item.name} (Cost: Rs. {item.cost} | Stock: {item.quantity})
                                </option>
                              ))}
                            </select>

                            <div className="flex space-x-2">
                              <input
                                type="number"
                                required
                                min={1}
                                value={partQty}
                                onChange={e => setPartQty(Number(e.target.value))}
                                className="w-14 bg-white border border-slate-200 rounded-lg p-1.5 text-[11px]"
                              />
                              <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg py-1.5"
                              >
                                Add Bill Line
                              </button>
                            </div>
                          </form>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Total Bill Cost:</span>
                        <span className="font-bold text-slate-900 font-mono">Rs. {repair.estimatedCost.total}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PANEL D: PAYMENTS MARKER & INVOICES */}
        {adminTab === "payments" && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-slate-900">Ledger Bill Collections (Counter terminal)</h3>
              <span className="text-xs text-slate-400 font-mono">Physical Cash & UPI Reconciliation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invoices.map(invoice => (
                <div key={invoice.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Invoice: #{invoice.id}</h4>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">Customer: {invoice.customerName}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                        invoice.paymentStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                      }`}
                    >
                      {invoice.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-sans text-slate-700">
                    <p>VEHICLE: {invoice.bikeDetails.brand} {invoice.bikeDetails.model} ({invoice.bikeDetails.registrationNumber})</p>
                    <p className="font-mono">BASE PARTS & LABOR SUB: Rs. {(invoice.labourCharges + invoice.partsCost)}</p>
                    <p className="font-mono">CGST/SGST (18%): Rs. {invoice.taxes}</p>
                    <p className="font-mono font-bold text-slate-950 text-sm">FINAL AMOUNT DUE: Rs. {invoice.finalAmount}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => onViewInvoice(invoice)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Inspect Sheet
                    </button>

                    {invoice.paymentStatus === "Unpaid" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => markInvoiceAsPaid(invoice.id, "Cash")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition"
                        >
                          Paid via Cash
                        </button>
                        <button
                          onClick={() => markInvoiceAsPaid(invoice.id, "UPI at Garage")}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition"
                        >
                          Paid via UPI
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">
                        Paid via {invoice.paymentMethod} • {invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString() : ""}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL E: PARTS INVENTORY MANAGER */}
        {adminTab === "inventory" && (
          <div className="space-y-6 text-left animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-slate-900">Spare Parts Inventory Directory</h3>
              {!showInvForm && (
                <button
                  onClick={() => setShowInvForm(true)}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-sm"
                >
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span>Register Spare Spec</span>
                </button>
              )}
            </div>

            {showInvForm && (
              <form onSubmit={handleCreateInventory} className="bg-slate-50 border border-slate-200 p-5 rounded-3xl max-w-xl mx-auto space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                  <h4 className="font-bold text-xs text-slate-900">Add Spare Part Specification</h4>
                  <button type="button" onClick={() => setShowInvForm(false)} className="text-slate-400 text-xs">Cancel</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Part Name / Brand SKU *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Classic 350 Rear Brake Shoes - Brembo"
                      value={invName}
                      onChange={e => setInvName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Cost (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={invCost}
                      onChange={e => setInvCost(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={invQty}
                      onChange={e => setInvQty(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Enfield Spares Pvt Ltd"
                      value={invSupplier}
                      onChange={e => setInvSupplier(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Min. Warning Level (Qty)</label>
                    <input
                      type="number"
                      value={invAlertQty}
                      onChange={e => setInvAlertQty(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs"
                >
                  Save to Inventory Stock database
                </button>
              </form>
            )}

            {/* Inventory table board */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-mono">
                    <th className="py-3.5 px-6">Part Description</th>
                    <th className="py-3.5 px-3 text-right">Unit Price</th>
                    <th className="py-3.5 px-4 text-center">Remaining Quantity</th>
                    <th className="py-3.5 px-4">Brand Supplier</th>
                    <th className="py-3.5 px-6 text-center">Quick Stock Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {inventory.map(part => {
                    const isLow = part.quantity <= part.minAlertQuantity;
                    return (
                      <tr key={part.id} className={isLow ? "bg-red-50/20" : ""}>
                        <td className="py-3.5 px-6 font-semibold text-slate-900">
                          {part.name}
                          {isLow && (
                            <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 text-[9px] rounded font-bold uppercase tracking-wider font-mono">
                              LOW STOCK
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-slate-900 font-bold">Rs. {part.cost}</td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className={`px-2 py-0.5 rounded font-bold ${isLow ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>
                            {part.quantity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-sans">{part.supplier}</td>
                        <td className="py-3.5 px-6 text-center">
                          <button
                            onClick={() => updateInventoryQuantity(part.id, part.quantity + 10)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-2 py-1 rounded transition text-[10px]"
                          >
                            +10 Reorder
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANEL F: STAFF METRICS */}
        {adminTab === "staff" && (
          <div className="space-y-6 text-left animate-fadeIn">
            <h3 className="font-display font-bold text-base text-slate-900">Operational Mechanic Performance</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {employees.filter(e => e.role === "Mechanic").map(staff => (
                <div key={staff.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                      <UserCheck className="h-5 w-5" />
                    </div>

                    <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold rounded-full">
                      ON WORKSHOP FLOOR
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{staff.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Role: EXPERT TWO-WHEELER MECHANIC</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{staff.mobile}</p>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Lifetime Jobs Settle:</span>
                    <span className="font-mono font-bold text-blue-600 text-sm">{staff.jobsCompleted} Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
