"use client";

import React from "react";

export type NavTab = "Discover" | "Matches" | "Profile";

export interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  matchCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const tabs: { id: NavTab; label: string; icon: string }[] = [
  { id: "Discover", label: "Discover", icon: "✨" },
  { id: "Matches", label: "Matches", icon: "💬" },
  { id: "Profile", label: "Profile", icon: "👤" },
];

export default function Header({
  activeTab,
  onTabChange,
  matchCount,
  soundEnabled,
  onToggleSound,
}: HeaderProps) {
  return (
    <header className="w-full max-w-2xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 select-none">
      {/* Wordmark Logo */}
      <button
        type="button"
        onClick={() => onTabChange("Discover")}
        className="flex items-center gap-2 group text-left cursor-pointer"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold tracking-tight text-zinc-900">
          Swipe<span className="text-amber-500">Lab</span>
        </span>
      </button>

      {/* Navigation Pills */}
      <nav
        className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-full border border-zinc-200/60 shadow-xs"
        aria-label="Main navigation"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/40"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xs">{tab.icon}</span>
              <span>{tab.label}</span>

              {/* Match count badge */}
              {tab.id === "Matches" && matchCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-bold rounded-full shadow-xs">
                  {matchCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sound FX Quick Toggle */}
      <button
        type="button"
        onClick={onToggleSound}
        title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer border border-zinc-200/60 text-sm"
        aria-label="Toggle sound effects"
      >
        {soundEnabled ? "🔊" : "🔇"}
      </button>
    </header>
  );
}

