"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Header, { NavTab } from "@/components/Header";
import CardStack, { CardStackHandle } from "@/components/CardStack";
import ActionBar from "@/components/ActionBar";
import MatchModal from "@/components/MatchModal";
import ProfileDetailsModal from "@/components/ProfileDetailsModal";
import MatchesView from "@/components/MatchesView";
import UserProfileView from "@/components/UserProfileView";
import { profiles as initialProfiles } from "@/data/profiles";
import {
  Profile,
  SwipeDirection,
  SwipeAction,
  SwipeHistoryItem,
  Conversation,
} from "@/types";
import { soundFx } from "@/utils/sound";
import { motion } from "framer-motion";

const MOCK_REPLIES: Record<string, string[]> = {
  maya: [
    "Haha you read my mind! What kind of coffee do you usually drink?",
    "Books and pasta are really my entire personality. No regrets though!",
  ],
  arjun: [
    "Hey! If you can handle high spice levels, dinner is on me 🍛",
    "Great taste! Glad we connected.",
  ],
  sofia: [
    "Hey there! Always up for testing a new café, deal? ☕",
    "Loved your vibe! Hope your week is going great.",
  ],
  james: [
    "Hello! Ready to debate parks anytime you are 🏃‍♂️",
    "Hey! Always looking for good recommendations in the city.",
  ],
  luna: [
    "Road trip starts now! What music are we playing first? 🚗💨",
    "Hey! Life's too short for boring weekends, right?",
  ],
  priya: [
    "Plant #28 says hello! 🌱 So glad we matched.",
    "Hey! What's your current favorite read?",
  ],
  alex: [
    "Konnichiwa! Help me pick the best noodle shop in town? 🍜",
    "Hey! Great to meet you!",
  ],
};

export default function Home() {
  const [profiles] = useState<Profile[]>(initialProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [passes, setPasses] = useState<string[]>([]);
  const [superlikes, setSuperlikes] = useState<string[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [history, setHistory] = useState<SwipeHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<NavTab>("Discover");
  const [matchModalProfile, setMatchModalProfile] = useState<Profile | null>(null);
  const [selectedDetailProfile, setSelectedDetailProfile] =
    useState<Profile | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({});
  const cardStackRef = useRef<CardStackHandle>(null);

  const currentProfile = profiles[currentIndex];
  const isDeckFinished = currentIndex >= profiles.length;

  const toggleSound = () => {
    soundFx.enabled = !soundFx.enabled;
    setSoundEnabled(soundFx.enabled);
  };

  // Perform a swipe
  const handleSwipe = useCallback(
    (direction: SwipeDirection, action: SwipeAction) => {
      const profile = profiles[currentIndex];
      if (!profile) return;

      const historyItem: SwipeHistoryItem = { profile, direction, action };
      setHistory((prev) => [...prev, historyItem]);

      if (action === "pass") {
        setPasses((prev) => [...prev, profile.id]);
      } else if (action === "like") {
        setLikes((prev) => [...prev, profile.id]);
        if (profile.willMatch) {
          setMatches((prev) => [...prev, profile]);
          setTimeout(() => {
            soundFx.playMatch();
            setMatchModalProfile(profile);
          }, 250);
        }
      } else if (action === "superlike") {
        setSuperlikes((prev) => [...prev, profile.id]);
        if (profile.willMatch) {
          setMatches((prev) => [...prev, profile]);
          setTimeout(() => {
            soundFx.playMatch();
            setMatchModalProfile(profile);
          }, 250);
        }
      }

      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, profiles]
  );

  // Undo / Rewind previous swipe
  const handleUndo = useCallback(() => {
    if (history.length === 0 || currentIndex === 0) return;

    soundFx.playUndo();
    const lastItem = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCurrentIndex((prev) => prev - 1);

    const targetId = lastItem.profile.id;
    if (lastItem.action === "like") {
      setLikes((prev) => prev.filter((id) => id !== targetId));
      setMatches((prev) => prev.filter((p) => p.id !== targetId));
    } else if (lastItem.action === "pass") {
      setPasses((prev) => prev.filter((id) => id !== targetId));
    } else if (lastItem.action === "superlike") {
      setSuperlikes((prev) => prev.filter((id) => id !== targetId));
      setMatches((prev) => prev.filter((p) => p.id !== targetId));
    }
  }, [currentIndex, history]);

  // Sending message into conversation
  const handleSendMessage = useCallback(
    (profileId: string, text: string) => {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const userMsg = {
        id: `msg-${Date.now()}`,
        sender: "user" as const,
        text,
        timestamp,
      };

      setConversations((prev) => {
        const existing = prev[profileId]?.messages || [];
        return {
          ...prev,
          [profileId]: {
            profileId,
            messages: [...existing, userMsg],
          },
        };
      });

      // Automated witty reply simulation
      setTimeout(() => {
        const replies = MOCK_REPLIES[profileId] || [
          "Hey! Thanks for reaching out 😊",
          "Loved chatting with you!",
        ];
        const randomReply =
          replies[Math.floor(Math.random() * replies.length)];

        setConversations((prev) => {
          const existing = prev[profileId]?.messages || [];
          return {
            ...prev,
            [profileId]: {
              profileId,
              messages: [
                ...existing,
                {
                  id: `reply-${Date.now()}`,
                  sender: "them" as const,
                  text: randomReply,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            },
          };
        });
      }, 900);
    },
    []
  );

  // Restart Deck
  const handleRestart = () => {
    soundFx.playSwipe();
    setCurrentIndex(0);
    setHistory([]);
    setLikes([]);
    setPasses([]);
    setSuperlikes([]);
    setMatches([]);
    setConversations({});
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (matchModalProfile) {
        if (e.key === "Escape") setMatchModalProfile(null);
        return;
      }

      if (selectedDetailProfile) {
        if (e.key === "Escape") setSelectedDetailProfile(null);
        return;
      }

      if (activeTab !== "Discover" || isDeckFinished) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        soundFx.playPass();
        if (cardStackRef.current) {
          cardStackRef.current.swipeLeft();
        } else {
          handleSwipe("left", "pass");
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        soundFx.playLike();
        if (cardStackRef.current) {
          cardStackRef.current.swipeRight();
        } else {
          handleSwipe("right", "like");
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        soundFx.playSuperLike();
        if (cardStackRef.current) {
          cardStackRef.current.swipeUp();
        } else {
          handleSwipe("up", "superlike");
        }
      } else if (e.key === "z" || e.key === "Z" || e.key === "Backspace") {
        e.preventDefault();
        handleUndo();
      } else if (e.key === " " || e.key === "i" || e.key === "I") {
        e.preventDefault();
        if (currentProfile) {
          setSelectedDetailProfile(currentProfile);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeTab,
    isDeckFinished,
    matchModalProfile,
    selectedDetailProfile,
    currentProfile,
    handleSwipe,
    handleUndo,
  ]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-50 text-zinc-900 select-none">
      {/* Top App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        matchCount={matches.length}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main App Body */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 py-2">
        {/* DISCOVER TAB */}
        {activeTab === "Discover" && (
          <div className="flex flex-col items-center justify-center w-full max-w-sm h-full mx-auto">
            {!isDeckFinished ? (
              <>
                {/* Active Card Deck */}
                <div className="flex-1 w-full flex items-center justify-center max-h-[540px]">
                  <CardStack
                    ref={cardStackRef}
                    profiles={profiles}
                    currentIndex={currentIndex}
                    onSwipe={handleSwipe}
                    onInfoClick={(p) => setSelectedDetailProfile(p)}
                  />
                </div>

                {/* Bottom Action Controls */}
                <ActionBar
                  onPass={() => {
                    soundFx.playPass();
                    if (cardStackRef.current) {
                      cardStackRef.current.swipeLeft();
                    } else {
                      handleSwipe("left", "pass");
                    }
                  }}
                  onLike={() => {
                    soundFx.playLike();
                    if (cardStackRef.current) {
                      cardStackRef.current.swipeRight();
                    } else {
                      handleSwipe("right", "like");
                    }
                  }}
                  onSuperLike={() => {
                    soundFx.playSuperLike();
                    if (cardStackRef.current) {
                      cardStackRef.current.swipeUp();
                    } else {
                      handleSwipe("up", "superlike");
                    }
                  }}
                  onUndo={handleUndo}
                  onInfo={() => {
                    if (currentProfile) setSelectedDetailProfile(currentProfile);
                  }}
                  canUndo={history.length > 0}
                />
              </>
            ) : (
              /* All Caught Up Deck State */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-lg text-center flex flex-col items-center"
              >
                {/* Animated pulsing radar */}
                <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center text-2xl shadow-md">
                    ✨
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 mb-1">
                  You&apos;re All Caught Up!
                </h2>
                <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                  You&apos;ve viewed all available profiles in your area for now.
                </p>

                {/* Stats Recap */}
                <div className="grid grid-cols-3 gap-3 w-full mb-6 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100">
                  <div>
                    <span className="text-xl font-bold text-zinc-900">
                      {profiles.length}
                    </span>
                    <p className="text-[11px] text-zinc-400 font-medium">Seen</p>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-rose-500">
                      {likes.length + superlikes.length}
                    </span>
                    <p className="text-[11px] text-zinc-400 font-medium">Liked</p>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-amber-500">
                      {matches.length}
                    </span>
                    <p className="text-[11px] text-zinc-400 font-medium">Matches</p>
                  </div>
                </div>

                {/* CTA Options */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  {matches.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("Matches")}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-semibold shadow-md hover:opacity-95 transition-all cursor-pointer"
                    >
                      View Matches ({matches.length})
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="w-full py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-semibold transition-colors cursor-pointer border border-zinc-200"
                  >
                    Reset &amp; Shuffle Deck
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* MATCHES TAB */}
        {activeTab === "Matches" && (
          <MatchesView
            matches={matches}
            conversations={conversations}
            onSendMessage={handleSendMessage}
            onExploreClick={() => setActiveTab("Discover")}
          />
        )}

        {/* PROFILE TAB */}
        {activeTab === "Profile" && (
          <UserProfileView
            stats={{
              totalSwipes: currentIndex,
              likes: likes.length,
              superlikes: superlikes.length,
              passes: passes.length,
              matches: matches.length,
            }}
            onResetAll={handleRestart}
          />
        )}
      </main>

      {/* Match Celebration Modal */}
      <MatchModal
        profile={matchModalProfile}
        onClose={() => setMatchModalProfile(null)}
        onSendMessage={(msg) => {
          if (matchModalProfile) {
            handleSendMessage(matchModalProfile.id, msg);
            setMatchModalProfile(null);
            setActiveTab("Matches");
          }
        }}
      />

      {/* Full Profile Details Modal */}
      <ProfileDetailsModal
        profile={selectedDetailProfile}
        onClose={() => setSelectedDetailProfile(null)}
        onPass={() => {
          soundFx.playPass();
          if (cardStackRef.current) {
            cardStackRef.current.swipeLeft();
          } else {
            handleSwipe("left", "pass");
          }
        }}
        onLike={() => {
          soundFx.playLike();
          if (cardStackRef.current) {
            cardStackRef.current.swipeRight();
          } else {
            handleSwipe("right", "like");
          }
        }}
        onSuperLike={() => {
          soundFx.playSuperLike();
          if (cardStackRef.current) {
            cardStackRef.current.swipeUp();
          } else {
            handleSwipe("up", "superlike");
          }
        }}
      />
    </div>
  );
}
