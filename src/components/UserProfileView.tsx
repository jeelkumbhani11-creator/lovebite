"use client";

import React, { useState } from "react";
import Image from "next/image";
import { soundFx } from "@/utils/sound";

interface UserProfileViewProps {
  stats: {
    totalSwipes: number;
    likes: number;
    superlikes: number;
    passes: number;
    matches: number;
  };
  onResetAll: () => void;
}

export default function UserProfileView({
  stats,
  onResetAll,
}: UserProfileViewProps) {
  const [soundEnabled, setSoundEnabled] = useState(soundFx.enabled);
  const [maxDistance, setMaxDistance] = useState(25);
  const [ageRange, setAgeRange] = useState("20 - 28");

  const toggleSound = () => {
    soundFx.enabled = !soundFx.enabled;
    setSoundEnabled(soundFx.enabled);
  };

  const matchRate =
    stats.likes > 0
      ? Math.round((stats.matches / (stats.likes + stats.superlikes)) * 100)
      : 0;

  return (
    <div className="w-full max-w-lg mx-auto h-full flex flex-col px-4 py-3 overflow-y-auto space-y-5">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm flex flex-col items-center text-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3">
          <Image
            src="/profiles/ethan.jpg"
            alt="Your profile"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-1.5">
          Ethan, 25
          <span className="text-sky-500 text-sm" title="Verified Profile">
            ✓
          </span>
        </h2>
        <p className="text-xs text-zinc-500 mb-2">Amsterdam · Active Explorer</p>
        <p className="text-sm text-zinc-600 max-w-xs italic mb-4">
          &ldquo;I bike everywhere, even when I probably shouldn&apos;t. Currently learning to bake sourdough.&rdquo;
        </p>

        <div className="flex flex-wrap justify-center gap-1.5">
          {["Cycling", "Baking", "Film", "Coffee"].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs bg-zinc-100 text-zinc-700 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Swiping Statistics Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 px-1">
          Activity Insights
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/70 text-center shadow-xs">
            <p className="text-2xl font-bold text-zinc-900">{stats.totalSwipes}</p>
            <p className="text-[11px] text-zinc-400 font-medium">Swipes</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/70 text-center shadow-xs">
            <p className="text-2xl font-bold text-rose-500">{stats.likes}</p>
            <p className="text-[11px] text-zinc-400 font-medium">Likes</p>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/70 text-center shadow-xs">
            <p className="text-2xl font-bold text-amber-500">{stats.matches}</p>
            <p className="text-[11px] text-zinc-400 font-medium">Matches</p>
          </div>
        </div>

        <div className="mt-2.5 bg-gradient-to-r from-amber-50 to-rose-50 p-3.5 rounded-2xl border border-amber-200/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-800">Match Compatibility Rate</p>
            <p className="text-[11px] text-zinc-500">Based on your right swipes</p>
          </div>
          <span className="text-lg font-bold text-amber-600">{matchRate}%</span>
        </div>
      </div>

      {/* Discovery Preferences */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 px-1">
          Discovery Settings
        </h3>
        <div className="bg-white rounded-2xl border border-zinc-200/70 divide-y divide-zinc-100 p-1 shadow-xs">
          {/* Distance Slider */}
          <div className="p-3.5">
            <div className="flex justify-between text-xs font-medium text-zinc-700 mb-2">
              <span>Maximum Distance</span>
              <span className="text-rose-500 font-semibold">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Age range */}
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-700">Preferred Age</span>
            <span className="text-xs font-semibold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">
              {ageRange}
            </span>
          </div>

          {/* Sound FX Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-700">Tactile Sound Effects</p>
              <p className="text-[11px] text-zinc-400">Audio feedback on swipe &amp; match</p>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${soundEnabled ? "bg-emerald-500" : "bg-zinc-300"
                }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${soundEnabled ? "left-6" : "left-1"
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Session */}
      <div className="pt-2 pb-4 text-center">
        <button
          type="button"
          onClick={onResetAll}
          className="text-xs text-rose-500 hover:text-rose-600 font-medium hover:underline cursor-pointer"
        >
          Reset Session &amp; Deck History
        </button>
      </div>
    </div>
  );
}
