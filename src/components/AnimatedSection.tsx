import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  id?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  id,
  ...props
}) => {
  let initialOffset = { x: 0, y: 0 };
  if (direction === "up") initialOffset = { x: 0, y: 35 };
  if (direction === "down") initialOffset = { x: 0, y: -35 };
  if (direction === "left") initialOffset = { x: 35, y: 0 };
  if (direction === "right") initialOffset = { x: -35, y: 0 };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.215, 0.61, 0.355, 1.0] // cubic-bezier smooth ease-out
      }}
      className={`transform-gpu ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
};
