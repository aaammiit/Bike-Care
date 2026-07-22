import React, { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { Wrench, Shield, User, MessageSquare, Bell, Wifi, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import logoImg from "../assets/images/rana_bike_cares_logo_1784714930624.jpg";

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenMessages: () => void;
  onNavigateToLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking, onOpenMessages, onNavigateToLanding }) => {
  const { currentRole, setCurrentRole, currentCustomer, notifications } = useApp();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const unreadCount = notifications.filter(n => n.recipientRole === currentRole && !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-slate-200 text-charcoal shadow-[0_2px_0_0_#f1f5f9]">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-rose-500 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center space-x-2 border-b-4 border-rose-700">
          <WifiOff className="h-4 w-4 shrink-0 animate-bounce" />
          <span className="tracking-wide">
            You are currently offline. Local updates are preserved but live booking operations are paused.
          </span>
          <span className="bg-rose-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-[8px] border-2 border-rose-800">
            OFFLINE MODE ACTIVE
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Connection Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group" onClick={onNavigateToLanding}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] overflow-hidden border-2 border-slate-200 bg-white p-0.5 shadow-[0_2px_0_0_#cbd5e1] group-hover:border-eager-green transition-all shrink-0">
              <img
                src={logoImg}
                alt="Rana Bike Cares Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[9px]"
              />
            </div>
            <div className="text-left">
              <h1 className="font-display font-black text-lg sm:text-xl leading-none tracking-tight text-slate-900 flex items-center">
                Rana <span className="text-eager-green font-extrabold ml-1 font-sans">Bike Cares</span>
              </h1>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center pl-2 sm:pl-3 border-l-2 border-slate-200">
            {isOnline ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-[10px] text-[9px] sm:text-[10px] font-bold bg-brand-50 text-eager-green border-2 border-brand-100 shadow-[0_2px_0_0_#d7ffb8]">
                <span className="w-1.5 h-1.5 rounded-full bg-eager-green mr-1 sm:mr-1.5 animate-pulse" />
                <Wifi className="h-3 w-3 mr-0.5 sm:mr-1 text-eager-green" />
                <span className="hidden sm:inline uppercase tracking-wider">Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-[10px] text-[9px] sm:text-[10px] font-bold bg-rose-50 text-rose-600 border-2 border-rose-200 shadow-[0_2px_0_0_#fecdd3] animate-bounce">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1 sm:mr-1.5 animate-ping" />
                <WifiOff className="h-3 w-3 mr-0.5 sm:mr-1 text-rose-500" />
                <span className="uppercase tracking-wider">Offline</span>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Navigation & Role Toggler */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Quick Role Switcher */}
          <div className="bg-slate-100 p-1.5 rounded-[16px] flex items-center space-x-1 border-2 border-slate-200">
            <button
              onClick={() => setCurrentRole("Customer")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all duration-150 ${
                currentRole === "Customer"
                  ? "bg-white text-eager-green border-2 border-slate-200 shadow-[0_2px_0_0_#cbd5e1]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Customer</span>
            </button>
            <button
              onClick={() => setCurrentRole("Admin")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all duration-150 ${
                currentRole === "Admin"
                  ? "bg-white text-spark-blue border-2 border-slate-200 shadow-[0_2px_0_0_#cbd5e1]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button
              onClick={() => setCurrentRole("Mechanic")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all duration-150 ${
                currentRole === "Mechanic"
                  ? "bg-white text-amber-600 border-2 border-slate-200 shadow-[0_2px_0_0_#cbd5e1]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mechanic</span>
            </button>
          </div>

          {/* Quick Actions based on Role */}
          {currentRole === "Customer" && (
            <motion.button
              onClick={onOpenBooking}
              className="duo-btn-green-sm text-xs py-2.5 px-4 rounded-[14px]"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 1.5, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
              style={{ transition: "background-color 100ms, border-color 100ms, color 100ms, box-shadow 100ms" }}
            >
              Book Service
            </motion.button>
          )}

          {/* Simulated Mobile SMS/WhatsApp Drawer Trigger */}
          <button
            onClick={onOpenMessages}
            className="p-2 text-slate-500 hover:text-spark-blue hover:bg-sky-50 rounded-[12px] transition-all relative border-2 border-slate-200 bg-white shadow-[0_2px_0_0_#cbd5e1] active:translate-y-[1px] active:shadow-none"
            title="View Live Notification Logs"
          >
            <MessageSquare className="h-4.5 w-4.5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-eager-green rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* Notifications Log */}
          <div className="relative">
            <button className="p-2 text-slate-500 hover:text-spark-blue hover:bg-sky-50 rounded-[12px] transition-all relative border-2 border-slate-200 bg-white shadow-[0_2px_0_0_#cbd5e1] active:translate-y-[1px] active:shadow-none">
              <Bell className="h-4.5 w-4.5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Dynamic Role Sub-Banner for testing */}
      <div className="bg-slate-900 text-slate-300 text-center py-1.5 px-4 text-xs font-mono flex items-center justify-center space-x-2">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span>
          {currentRole === "Customer" && `Viewing as Customer: ${currentCustomer.name} (${currentCustomer.email})`}
          {currentRole === "Admin" && "Viewing as Executive Owner: Rajesh Shinde (Admin Suite Access)"}
          {currentRole === "Mechanic" && "Viewing as Mechanic: Karan Singh (Workshop Terminal Access)"}
        </span>
        <span className="text-slate-500 hidden md:inline">| Switch tabs to test real-time cross-role sync!</span>
      </div>
    </header>
  );
};
