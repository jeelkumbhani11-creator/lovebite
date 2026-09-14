"use client";

import Image from "next/image";
import { Profile } from "@/types";

interface ProfileCardProps {
  profile: Profile;
  /** 0 = fully hidden, 1 = fully visible */
  likeOpacity: number;
  passOpacity: number;
  superlikeOpacity?: number;
  onInfoClick?: () => void;
}

export default function ProfileCard({
  profile,
  likeOpacity,
  passOpacity,
  superlikeOpacity = 0,
  onInfoClick,
}: ProfileCardProps) {
  return (
    <article className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl select-none bg-zinc-900 border border-black/5 transition-shadow hover:shadow-2xl">
      {/* Profile image */}
      <Image
        src={profile.image}
        alt={`${profile.name}, ${profile.age}`}
        fill
        className="object-cover pointer-events-none"
        sizes="(max-width: 480px) 90vw, 380px"
        priority
        draggable={false}
      />

      {/* Dynamic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />

      {/* LIKE label */}
      <div
        className="swipe-label swipe-label-like"
        style={{ opacity: likeOpacity }}
        aria-hidden="true"
      >
        LIKE
      </div>

      {/* PASS label */}
      <div
        className="swipe-label swipe-label-pass"
        style={{ opacity: passOpacity }}
        aria-hidden="true"
      >
        PASS
      </div>

      {/* SUPER LIKE label */}
      <div
        className="swipe-label swipe-label-superlike"
        style={{ opacity: superlikeOpacity }}
        aria-hidden="true"
      >
        SUPER LIKE
      </div>

      {/* Top right quick info button */}
      {onInfoClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInfoClick();
          }}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/20 flex items-center justify-center hover:bg-black/60 transition-all active:scale-95 shadow-md cursor-pointer"
          aria-label="View profile details"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      )}

      {/* Profile info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 text-white pointer-events-none">
        {/* Name & age */}
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {profile.name}
          </h2>
          <span className="text-xl font-normal text-white/80">
            {profile.age}
          </span>
        </div>

        {/* Location & distance */}
        <p className="text-sm text-white/80 flex items-center gap-1.5 mb-2.5">
          <svg
            className="w-4 h-4 text-white/70 inline shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{profile.location}</span>
          {profile.distance && (
            <>
              <span className="opacity-50">·</span>
              <span className="opacity-85">{profile.distance}</span>
            </>
          )}
        </p>

        {/* Bio */}
        <p className="text-sm leading-relaxed text-white/90 mb-3 line-clamp-2 drop-shadow-sm font-normal">
          &ldquo;{profile.bio}&rdquo;
        </p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-0.5 text-xs font-medium bg-white/20 backdrop-blur-md rounded-full text-white/95 border border-white/10"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
