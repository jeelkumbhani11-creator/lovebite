"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Profile } from "@/types";

interface MatchModalProps {
  profile: Profile | null;
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

const DEFAULT_ICEBREAKERS = [
  "Hey! Loved your bio ✨",
  "Coffee this weekend? ☕",
  "That rooftop sounds amazing! 🌆",
  "What are you listening to lately? 🎧",
];

export default function MatchModal({
  profile,
  onClose,
  onSendMessage,
}: MatchModalProps) {
  const [customText, setCustomText] = useState("");

  if (!profile) return null;

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setCustomText("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center z-10 overflow-hidden"
        >
          {/* Glowing background ambient lights */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Celebratory badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3"
          >
            <span>🎉</span> New Connection
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-pink-300 tracking-tight mb-1">
            It&apos;s a Match!
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            You and <span className="text-white font-medium">{profile.name}</span> liked each other.
          </p>

          {/* Connected Avatars */}
          <div className="flex items-center justify-center -space-x-4 mb-6 relative">
            {/* User Avatar */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-zinc-900 shadow-xl overflow-hidden"
            >
              <Image
                src="/profiles/ethan.jpg"
                alt="Your profile"
                fill
                sizes="96px"
                className="object-cover"
              />
            </motion.div>

            {/* Heart badge between avatars */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="z-10 w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg border-2 border-zinc-900 text-lg"
            >
              ❤️
            </motion.div>

            {/* Matched Avatar */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-zinc-900 shadow-xl overflow-hidden"
            >
              <Image
                src={profile.image}
                alt={profile.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Quick Icebreaker pills */}
          <div className="mb-5">
            <p className="text-xs text-zinc-400 font-medium mb-2.5">
              Break the ice with a prompt:
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {DEFAULT_ICEBREAKERS.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => handleSend(text)}
                  className="text-xs bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full border border-zinc-700/60 transition-colors cursor-pointer"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Custom message input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(customText);
            }}
            className="flex items-center gap-2 mb-4"
          >
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={`Say something nice to ${profile.name}...`}
              className="flex-1 bg-zinc-850 border border-zinc-750 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors bg-zinc-800/80"
            />
            <button
              type="submit"
              disabled={!customText.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
            >
              Send
            </button>
          </form>

          {/* Keep Swiping Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Keep Swiping
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
