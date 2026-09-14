"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Profile } from "@/types";

interface ProfileDetailsModalProps {
  profile: Profile | null;
  onClose: () => void;
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
}

export default function ProfileDetailsModal({
  profile,
  onClose,
  onPass,
  onLike,
  onSuperLike,
}: ProfileDetailsModalProps) {
  if (!profile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header bar / Close drag handle */}
          <div className="relative w-full h-80 sm:h-96 shrink-0 bg-zinc-900">
            <Image
              src={profile.image}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 500px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all cursor-pointer"
              aria-label="Close details"
            >
              ✕
            </button>

            {/* Name and age overlay */}
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <span className="text-2xl font-light opacity-90">
                  {profile.age}
                </span>
              </div>
              <p className="text-sm opacity-80 flex items-center gap-1 mt-1">
                <span>📍</span>
                <span>{profile.location}</span>
                {profile.distance && <span>· {profile.distance}</span>}
              </p>
            </div>
          </div>

          {/* Scrollable details */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-800">
            {/* About section */}
            <div>
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                About Me
              </h2>
              <p className="text-base leading-relaxed text-zinc-700 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                &ldquo;{profile.bio}&rdquo;
              </p>
            </div>

            {/* Interests tags */}
            <div>
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                Passions &amp; Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3.5 py-1.5 text-sm font-medium bg-zinc-100 text-zinc-800 rounded-full border border-zinc-200/70"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated prompt questions */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Personal Prompts
              </h2>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/50">
                <p className="text-xs font-semibold text-amber-800 mb-1">
                  A perfect Sunday morning looks like...
                </p>
                <p className="text-sm text-zinc-700">
                  Fresh brew, a good book, and no alarms set before 10 AM.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/50">
                <p className="text-xs font-semibold text-emerald-800 mb-1">
                  We&apos;ll get along if...
                </p>
                <p className="text-sm text-zinc-700">
                  You enjoy spontaneous road trips, trying weird street food, and don&apos;t mind bad puns.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-white border-t border-zinc-100 flex items-center justify-around">
            <button
              type="button"
              onClick={() => {
                onClose();
                onPass();
              }}
              className="w-13 h-13 rounded-full flex items-center justify-center bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer font-bold"
              aria-label="Pass"
            >
              ✕
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSuperLike();
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-sky-50 text-sky-500 border border-sky-200 hover:bg-sky-100 transition-all cursor-pointer font-bold"
              aria-label="Super Like"
            >
              ★
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLike();
              }}
              className="w-13 h-13 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-500 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer font-bold text-xl"
              aria-label="Like"
            >
              ♥
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
