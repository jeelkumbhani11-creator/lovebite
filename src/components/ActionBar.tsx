"use client";

import React from "react";
import { motion } from "framer-motion";

interface ActionBarProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onUndo: () => void;
  onInfo: () => void;
  canUndo: boolean;
  disabled?: boolean;
}

export default function ActionBar({
  onPass,
  onLike,
  onSuperLike,
  onUndo,
  onInfo,
  canUndo,
  disabled = false,
}: ActionBarProps) {
  return (
    <div className="flex flex-col items-center gap-2 mt-4 select-none">
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {/* Undo Button */}
        <motion.button
          type="button"
          whileHover={canUndo && !disabled ? { scale: 1.1 } : {}}
          whileTap={canUndo && !disabled ? { scale: 0.92 } : {}}
          onClick={onUndo}
          disabled={!canUndo || disabled}
          aria-label="Undo previous swipe (Z)"
          title="Undo (Z or Backspace)"
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border shadow-md transition-all cursor-pointer ${
            canUndo && !disabled
              ? "bg-white text-amber-500 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
              : "bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed opacity-60"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h10a5 5 0 015 5v2m0 0l-4-4m4 4l4-4"
            />
          </svg>
        </motion.button>

        {/* Pass Button */}
        <motion.button
          type="button"
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          onClick={onPass}
          disabled={disabled}
          aria-label="Pass profile (Left Arrow)"
          title="Pass (Left Arrow)"
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-white text-rose-500 border border-rose-200 shadow-lg hover:bg-rose-50 hover:border-rose-300 hover:shadow-rose-100/50 transition-all cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>

        {/* Super Like Button */}
        <motion.button
          type="button"
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          onClick={onSuperLike}
          disabled={disabled}
          aria-label="Super Like profile (Up Arrow)"
          title="Super Like (Up Arrow)"
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white text-sky-500 border border-sky-200 shadow-md hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.button>

        {/* Like Button */}
        <motion.button
          type="button"
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          onClick={onLike}
          disabled={disabled}
          aria-label="Like profile (Right Arrow)"
          title="Like (Right Arrow)"
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-white text-emerald-500 border border-emerald-200 shadow-lg hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-emerald-100/50 transition-all cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.button>

        {/* Info Button */}
        <motion.button
          type="button"
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.92 } : {}}
          onClick={onInfo}
          disabled={disabled}
          aria-label="View Profile Info (Space)"
          title="Profile Details (Space or I)"
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white text-indigo-500 border border-indigo-200 shadow-md hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.button>
      </div>

      {/* Keyboard hints */}
      <div className="hidden sm:flex items-center gap-3 text-[11px] text-zinc-400 font-medium tracking-wide">
        <span>← Pass</span>
        <span>·</span>
        <span>↑ Super Like</span>
        <span>·</span>
        <span>→ Like</span>
        <span>·</span>
        <span>Z Undo</span>
      </div>
    </div>
  );
}
