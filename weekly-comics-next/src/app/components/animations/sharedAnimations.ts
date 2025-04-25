"use client";

import { MotionProps } from "framer-motion";

export function fadeUp(delay: number = 0): MotionProps {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay,
    },
  };
}

export function fadeIn(delay: number = 0): MotionProps {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay,
    },
  };
}