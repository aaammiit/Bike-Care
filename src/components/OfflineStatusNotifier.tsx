import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OfflineStatusNotifier: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [showRestored, setShowRestored] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
      setIsDismissed(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      setIsDismissed(false);

      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 4000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md pointer-events-none">
      <AnimatePresence>
        {/* Offline Banner */}
        {isOffline && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center justify-between gap-3 bg-amber-950/95 border border-amber-500/40 text-amber-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <WifiOff className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  Offline Mode Active
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                </p>
                <p className="text-[11px] text-amber-200/80 leading-snug">
                  You are offline or on a slow network. Cached website features remain fully functional.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg text-amber-400 hover:text-amber-200 hover:bg-amber-900/50 transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Back Online Banner */}
        {showRestored && !isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 bg-emerald-950/95 border border-emerald-500/40 text-emerald-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Wifi className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 inline" /> Connection Restored
              </p>
              <p className="text-[11px] text-emerald-200/80 leading-snug">
                You are back online. All services synchronized.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
