import React, { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { MessageSquare, PhoneCall, X, ShieldAlert, Smartphone, ArrowDown, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommunicationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunicationsDrawer: React.FC<CommunicationsDrawerProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  const { sentMessagesLog, triggerSmsWhatsApp, currentCustomer } = useApp();
  const [activeTab, setActiveTab] = useState<"All" | "WhatsApp" | "SMS">("All");
  const [testMsg, setTestMsg] = useState("");

  const filteredLogs = sentMessagesLog.filter(log => {
    if (activeTab === "All") return true;
    return log.type === activeTab;
  });

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMsg.trim()) return;
    triggerSmsWhatsApp(currentCustomer.mobile, testMsg, "SMS");
    setTestMsg("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-slate-950 text-slate-100 shadow-2xl z-50 flex flex-col border-l border-slate-800"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 gap-2 shrink-0">
              <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-1">
                <div className="bg-green-500/20 text-green-400 p-2 rounded-xl shrink-0">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-bold text-sm tracking-tight text-white flex items-center truncate">
                    <span className="truncate">Messaging Simulator</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-mono rounded shrink-0">
                      ACTIVE
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono truncate">Real-time WhatsApp & SMS Gateway Log</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close messaging simulator drawer"
                title="Close (Esc)"
                className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer border border-slate-700 shadow-2xs z-20"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Simulated Live Alert Banner */}
            <div className="bg-blue-950/80 border-b border-blue-900/50 p-3 flex items-start space-x-2.5 text-xs text-blue-200">
              <ShieldAlert className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                This simulator captures and displays external message dispatches triggered by automated garage events (booking confirmation, estimates, vehicle-ready alerts).
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="p-3 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/50">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">GATEWAY LOGS</span>
              <div className="flex space-x-1.5">
                {(["All", "WhatsApp", "SMS"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                      activeTab === tab
                        ? "bg-slate-800 text-white shadow-inner"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <MessageSquare className="h-8 w-8 text-slate-600 mb-2 stroke-1" />
                  <p className="text-xs text-slate-400 font-sans">No messages dispatched yet.</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Book a service or update status to trigger logs.</p>
                </div>
              ) : (
                filteredLogs.map(log => (
                  <div
                    key={log.id}
                    className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 relative group hover:bg-slate-900 transition-all duration-300"
                  >
                    {/* Log Meta */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            log.type === "WhatsApp" ? "bg-emerald-500" : "bg-cyan-400"
                          }`}
                        />
                        <span
                          className={`font-semibold tracking-wider ${
                            log.type === "WhatsApp" ? "text-emerald-400" : "text-cyan-400"
                          }`}
                        >
                          {log.type.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    {/* Recipient */}
                    <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>TO: {log.to}</span>
                      <span className="text-slate-500">API Status: Delivered</span>
                    </div>

                    {/* Text Bubble */}
                    <div className="p-3 bg-slate-950/70 border border-slate-800/50 rounded-lg text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-wrap">
                      {log.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick SMS Trigger Input */}
            <form onSubmit={handleSendTestMessage} className="p-4 border-t border-slate-800 bg-slate-900">
              <label className="block text-[10px] font-mono text-slate-400 mb-2 uppercase">
                SEND SIMULATED MESSAGE TO {currentCustomer.name}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a custom alert (e.g. 'Your fork oil leaks are critical')..."
                  value={testMsg}
                  onChange={(e) => setTestMsg(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0"
                  title="Send Alert"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
