import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, CheckCircle2, MessageSquarePlus, Bike, Wrench } from "lucide-react";
import { useApp } from "../AppContext";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addCustomerReview } = useApp();

  const [name, setName] = useState("");
  const [bike, setBike] = useState("");
  const [service, setService] = useState("General Maintenance");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bike.trim() || !review.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addCustomerReview({
        name: name.trim(),
        bike: bike.trim(),
        service,
        rating,
        review: review.trim()
      });

      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setBike("");
        setReview("");
        setRating(5);
        onSuccess();
        onClose();
      }, 1500);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] overflow-y-auto p-3 sm:p-6 flex items-center justify-center min-h-full">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="w-full max-w-lg my-auto transition-all duration-300 transform overflow-hidden rounded-3xl bg-slate-900 text-slate-100 shadow-2xl border border-slate-800 flex flex-col relative z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-orange-500/10 text-[#F97316] border border-orange-500/20">
                <MessageSquarePlus className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-400 tracking-widest uppercase block">
                  CUSTOMER FEEDBACK
                </span>
                <h3 className="text-lg font-bold text-white font-display">
                  Submit Garage Experience Review
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6">
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-10 text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-extrabold text-white">Thank You for Your Review!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Your feedback has been saved and is now live in our website review section.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Rating Selector */}
                <div className="space-y-1.5 text-center bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-mono font-bold text-slate-300 block uppercase tracking-wider">
                    Rate Your Service Experience
                  </label>
                  <div className="flex items-center justify-center space-x-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 transition transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600 fill-slate-800"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 block pt-1 font-bold">
                    {rating === 5 && "⭐ Excellent (5/5 Stars)"}
                    {rating === 4 && "👍 Very Good (4/5 Stars)"}
                    {rating === 3 && "👌 Good (3/5 Stars)"}
                    {rating === 2 && "😐 Average (2/5 Stars)"}
                    {rating === 1 && "👎 Needs Improvement (1/5 Stars)"}
                  </span>
                </div>

                {/* Name & Bike */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                      Motorcycle Model *
                    </label>
                    <div className="relative">
                      <Bike className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Enfield Hunter 350"
                        value={bike}
                        onChange={(e) => setBike(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                    Service Completed
                  </label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                    >
                      <option value="General Maintenance">General Service & Engine Oil</option>
                      <option value="Brake & Clutch Overhaul">Brake & Clutch Overhaul</option>
                      <option value="Electrical & Battery Service">Electrical & Battery Service</option>
                      <option value="Engine Tuning & Carburetor">Engine Tuning & Performance</option>
                      <option value="Emergency Breakdown SOS">Emergency Breakdown Repair</option>
                    </select>
                  </div>
                </div>

                {/* Review Message */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                    Your Review / Feedback *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your experience regarding mechanics, service speed, pricing, or bike performance..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !bike.trim() || !review.trim()}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
                    !name.trim() || !bike.trim() || !review.trim()
                      ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      : "bg-[#F97316] hover:bg-[#ea580c] text-white shadow-lg shadow-orange-950/50 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <span>Saving Review...</span>
                  ) : (
                    <>
                      <Star className="h-4 w-4 fill-white" />
                      <span>Submit & Publish Review</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
