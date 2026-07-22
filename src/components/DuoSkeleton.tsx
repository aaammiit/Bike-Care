import React from "react";
import { motion } from "motion/react";

interface DuoSkeletonProps {
  type?: "card" | "list" | "grid" | "table" | "kpi" | "detail";
  count?: number;
  className?: string;
}

export const DuoSkeleton: React.FC<DuoSkeletonProps> = ({
  type = "card",
  count = 1,
  className = "",
}) => {
  const shimmerAnimation = {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const renderSingleSkeleton = (index: number) => {
    switch (type) {
      case "kpi":
        return (
          <div
            key={index}
            className="text-center p-6 rounded-2xl border-2 border-b-4 border-slate-200 bg-white shadow-sm flex flex-col justify-center items-center space-y-3"
          >
            <motion.div
              animate={shimmerAnimation}
              className="w-16 h-10 bg-slate-200 rounded-xl"
            />
            <motion.div
              animate={shimmerAnimation}
              className="w-24 h-4 bg-slate-100 rounded-md"
            />
          </div>
        );

      case "list":
        return (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white border-2 border-b-4 border-slate-100 rounded-2xl space-x-4"
          >
            <div className="flex items-center space-x-3.5 flex-1">
              <motion.div
                animate={shimmerAnimation}
                className="w-10 h-10 bg-slate-200 rounded-xl shrink-0"
              />
              <div className="space-y-2 flex-1">
                <motion.div
                  animate={shimmerAnimation}
                  className="w-2/3 h-4 bg-slate-200 rounded-md"
                />
                <motion.div
                  animate={shimmerAnimation}
                  className="w-1/2 h-3 bg-slate-100 rounded-md"
                />
              </div>
            </div>
            <motion.div
              animate={shimmerAnimation}
              className="w-16 h-8 bg-slate-200 rounded-xl"
            />
          </div>
        );

      case "grid":
      case "card":
        return (
          <div
            key={index}
            className="duo-card p-6 flex flex-col justify-between space-y-5 bg-white border-2 border-b-4 border-slate-200 rounded-2xl"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1 mr-4">
                  <motion.div
                    animate={shimmerAnimation}
                    className="w-3/4 h-5 bg-slate-200 rounded-md"
                  />
                  <motion.div
                    animate={shimmerAnimation}
                    className="w-1/2 h-3.5 bg-slate-100 rounded-md"
                  />
                </div>
                <motion.div
                  animate={shimmerAnimation}
                  className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0"
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <motion.div
                  animate={shimmerAnimation}
                  className="w-full h-3 bg-slate-100 rounded-md"
                />
                <motion.div
                  animate={shimmerAnimation}
                  className="w-5/6 h-3 bg-slate-100 rounded-md"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 space-x-3">
              <motion.div
                animate={shimmerAnimation}
                className="w-20 h-4 bg-slate-100 rounded-md"
              />
              <motion.div
                animate={shimmerAnimation}
                className="w-28 h-9 bg-slate-200 rounded-xl"
              />
            </div>
          </div>
        );

      case "table":
        return (
          <div
            key={index}
            className="border-b border-slate-100 p-4 flex items-center justify-between space-x-4 bg-white"
          >
            <motion.div
              animate={shimmerAnimation}
              className="w-1/4 h-4 bg-slate-200 rounded-md"
            />
            <motion.div
              animate={shimmerAnimation}
              className="w-1/6 h-4 bg-slate-100 rounded-md"
            />
            <motion.div
              animate={shimmerAnimation}
              className="w-1/6 h-4 bg-slate-100 rounded-md"
            />
            <motion.div
              animate={shimmerAnimation}
              className="w-12 h-6 bg-slate-200 rounded-md"
            />
          </div>
        );

      case "detail":
        return (
          <div
            key={index}
            className="p-6 bg-white border-2 border-b-4 border-slate-200 rounded-3xl space-y-6"
          >
            <div className="flex items-center space-x-4">
              <motion.div
                animate={shimmerAnimation}
                className="w-16 h-16 bg-slate-200 rounded-2xl"
              />
              <div className="space-y-2 flex-1">
                <motion.div
                  animate={shimmerAnimation}
                  className="w-1/3 h-6 bg-slate-200 rounded-md"
                />
                <motion.div
                  animate={shimmerAnimation}
                  className="w-1/4 h-4 bg-slate-100 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-3.5 py-4 border-y border-slate-100">
              <div className="flex justify-between">
                <motion.div animate={shimmerAnimation} className="w-1/4 h-4 bg-slate-100 rounded-md" />
                <motion.div animate={shimmerAnimation} className="w-1/3 h-4 bg-slate-200 rounded-md" />
              </div>
              <div className="flex justify-between">
                <motion.div animate={shimmerAnimation} className="w-1/5 h-4 bg-slate-100 rounded-md" />
                <motion.div animate={shimmerAnimation} className="w-1/4 h-4 bg-slate-200 rounded-md" />
              </div>
              <div className="flex justify-between">
                <motion.div animate={shimmerAnimation} className="w-1/3 h-4 bg-slate-100 rounded-md" />
                <motion.div animate={shimmerAnimation} className="w-1/2 h-4 bg-slate-200 rounded-md" />
              </div>
            </div>

            <div className="flex space-x-3.5 pt-2">
              <motion.div
                animate={shimmerAnimation}
                className="flex-1 h-12 bg-slate-200 rounded-2xl"
              />
              <motion.div
                animate={shimmerAnimation}
                className="flex-1 h-12 bg-slate-100 rounded-2xl border-2 border-slate-200"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => renderSingleSkeleton(idx))}
    </div>
  );
};
