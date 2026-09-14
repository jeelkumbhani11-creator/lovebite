"use client";

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
  PanInfo,
} from "framer-motion";
import { Profile, SwipeDirection, SwipeAction } from "@/types";
import ProfileCard from "./ProfileCard";
import { soundFx } from "@/utils/sound";

export interface CardStackHandle {
  swipeLeft: () => void;
  swipeRight: () => void;
  swipeUp: () => void;
}

interface CardStackProps {
  profiles: Profile[];
  currentIndex: number;
  onSwipe: (direction: SwipeDirection, action: SwipeAction) => void;
  onInfoClick?: (profile: Profile) => void;
}

interface InteractiveCardProps {
  profile: Profile;
  onSwipe: (direction: SwipeDirection, action: SwipeAction) => void;
  onInfoClick?: () => void;
}

export interface InteractiveCardHandle {
  fly: (direction: SwipeDirection, action: SwipeAction) => void;
}

// Sub-component for the top card to ensure fresh, isolated motion values on every card change
const InteractiveCard = forwardRef<InteractiveCardHandle, InteractiveCardProps>(
  function InteractiveCard({ profile, onSwipe, onInfoClick }, ref) {
    const isExitingRef = useRef(false);

    // Each card instance has its own motion values, initialized strictly to 0
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-250, 0, 250], [-16, 0, 16]);

    const [likeOpacity, setLikeOpacity] = useState(0);
    const [passOpacity, setPassOpacity] = useState(0);
    const [superlikeOpacity, setSuperlikeOpacity] = useState(0);

    useMotionValueEvent(x, "change", (latestX) => {
      if (latestX > 15) {
        setLikeOpacity(Math.min(1, (latestX - 15) / 80));
        setPassOpacity(0);
      } else if (latestX < -15) {
        setPassOpacity(Math.min(1, Math.abs(latestX + 15) / 80));
        setLikeOpacity(0);
      } else {
        setLikeOpacity(0);
        setPassOpacity(0);
      }
    });

    useMotionValueEvent(y, "change", (latestY) => {
      if (latestY < -30 && Math.abs(x.get()) < 60) {
        setSuperlikeOpacity(Math.min(1, Math.abs(latestY + 30) / 90));
      } else {
        setSuperlikeOpacity(0);
      }
    });

    const triggerFly = useCallback(
      async (direction: SwipeDirection, action: SwipeAction) => {
        if (isExitingRef.current) return;
        isExitingRef.current = true;

        const screenW = typeof window !== "undefined" ? window.innerWidth : 600;
        const screenH = typeof window !== "undefined" ? window.innerHeight : 800;

        if (direction === "left") {
          setPassOpacity(1);
          setLikeOpacity(0);
          await Promise.all([
            animate(x, -screenW - 100, { duration: 0.28, ease: "easeIn" }),
            animate(rotate, -20, { duration: 0.28, ease: "easeIn" }),
          ]);
        } else if (direction === "right") {
          setLikeOpacity(1);
          setPassOpacity(0);
          await Promise.all([
            animate(x, screenW + 100, { duration: 0.28, ease: "easeIn" }),
            animate(rotate, 20, { duration: 0.28, ease: "easeIn" }),
          ]);
        } else if (direction === "up") {
          setSuperlikeOpacity(1);
          await animate(y, -screenH - 100, { duration: 0.28, ease: "easeIn" });
        }

        onSwipe(direction, action);
      },
      [x, y, rotate, onSwipe]
    );

    useImperativeHandle(
      ref,
      () => ({
        fly: triggerFly,
      }),
      [triggerFly]
    );

    const handleDragEnd = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (isExitingRef.current) return;

      const threshold = 90;
      const velocityThreshold = 400;

      // Super Like (dragged up)
      if (info.offset.y < -110 && Math.abs(info.offset.x) < 90) {
        soundFx.playSuperLike();
        triggerFly("up", "superlike");
        return;
      }

      // Like (dragged right)
      if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
        soundFx.playLike();
        triggerFly("right", "like");
        return;
      }

      // Pass (dragged left)
      if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
        soundFx.playPass();
        triggerFly("left", "pass");
        return;
      }

      // Snap back to middle
      soundFx.playSwipe();
      setLikeOpacity(0);
      setPassOpacity(0);
      setSuperlikeOpacity(0);
    };

    return (
      <motion.div
        style={{
          x,
          y,
          rotate,
          zIndex: 10,
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        initial={{ scale: 0.95, y: 12, opacity: 0.9, x: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <ProfileCard
          profile={profile}
          likeOpacity={likeOpacity}
          passOpacity={passOpacity}
          superlikeOpacity={superlikeOpacity}
          onInfoClick={onInfoClick}
        />
      </motion.div>
    );
  }
);

const CardStack = forwardRef<CardStackHandle, CardStackProps>(function CardStack(
  { profiles, currentIndex, onSwipe, onInfoClick },
  ref
) {
  const topCardRef = useRef<InteractiveCardHandle>(null);

  useImperativeHandle(
    ref,
    () => ({
      swipeLeft: () => topCardRef.current?.fly("left", "pass"),
      swipeRight: () => topCardRef.current?.fly("right", "like"),
      swipeUp: () => topCardRef.current?.fly("up", "superlike"),
    }),
    []
  );

  const currentProfile = profiles[currentIndex];
  const nextProfile1 = profiles[currentIndex + 1];
  const nextProfile2 = profiles[currentIndex + 2];

  if (!currentProfile) {
    return null;
  }

  return (
    <div className="card-stack relative w-full h-full flex items-center justify-center">
      {/* 3rd Card in background stack - centered */}
      {nextProfile2 && (
        <motion.div
          key={nextProfile2.id}
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0.86, y: 30, opacity: 0.3 }}
          animate={{ scale: 0.90, y: 22, opacity: 0.55 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{ zIndex: 1 }}
        >
          <ProfileCard
            profile={nextProfile2}
            likeOpacity={0}
            passOpacity={0}
          />
        </motion.div>
      )}

      {/* 2nd Card in background stack - always perfectly centered in the middle */}
      {nextProfile1 && (
        <motion.div
          key={nextProfile1.id}
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0.90, y: 22, opacity: 0.55 }}
          animate={{ scale: 0.95, y: 11, opacity: 0.88 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{ zIndex: 2 }}
        >
          <ProfileCard
            profile={nextProfile1}
            likeOpacity={0}
            passOpacity={0}
          />
        </motion.div>
      )}

      {/* Top Active Card - pops from the middle with spring animation */}
      <InteractiveCard
        key={currentProfile.id}
        ref={topCardRef}
        profile={currentProfile}
        onSwipe={onSwipe}
        onInfoClick={onInfoClick ? () => onInfoClick(currentProfile) : undefined}
      />
    </div>
  );
});

export default CardStack;
