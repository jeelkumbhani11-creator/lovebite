"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Profile, ChatMessage, Conversation } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface MatchesViewProps {
  matches: Profile[];
  conversations: Record<string, Conversation>;
  onSendMessage: (profileId: string, text: string) => void;
  onExploreClick: () => void;
}

export default function MatchesView({
  matches,
  conversations,
  onSendMessage,
  onExploreClick,
}: MatchesViewProps) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile || !replyText.trim()) return;
    onSendMessage(selectedProfile.id, replyText.trim());
    setReplyText("");
  };

  const activeConversation = selectedProfile
    ? conversations[selectedProfile.id]?.messages || []
    : [];

  return (
    <div className="w-full max-w-xl mx-auto h-full flex flex-col px-4 py-2">
      {/* If no matches yet */}
      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mb-4 border border-rose-100 shadow-sm animate-pulse">
            💌
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            No Matches Yet
          </h2>
          <p className="text-sm text-zinc-500 max-w-xs mb-6">
            Swipe right on people you like. When they like you back, they will appear here!
          </p>
          <button
            type="button"
            onClick={onExploreClick}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            Start Swiping Now
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-6">
          {/* New Matches Row */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                New Matches ({matches.length})
              </h2>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
              {matches.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setSelectedProfile(profile)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                >
                  <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 group-hover:scale-105 transition-transform shadow-sm">
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-700 max-w-[64px] truncate">
                    {profile.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 px-1">
              Messages
            </h2>

            <div className="divide-y divide-zinc-100 bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
              {matches.map((profile) => {
                const conv = conversations[profile.id]?.messages;
                const lastMsg = conv && conv.length > 0 ? conv[conv.length - 1] : null;

                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => setSelectedProfile(profile)}
                    className="w-full flex items-center gap-3.5 p-3.5 hover:bg-zinc-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-200">
                      <Image
                        src={profile.image}
                        alt={profile.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-zinc-900 truncate">
                          {profile.name}
                        </h3>
                        {lastMsg && (
                          <span className="text-[11px] text-zinc-400">
                            {lastMsg.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {lastMsg
                          ? (lastMsg.sender === "user" ? "You: " : "") + lastMsg.text
                          : "New match! Say something..."}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Chat Dialog */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-lg h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/70">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-200">
                    <Image
                      src={selectedProfile.image}
                      alt={selectedProfile.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      {selectedProfile.name}, {selectedProfile.age}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active now
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="w-8 h-8 rounded-full bg-zinc-200/70 text-zinc-600 hover:bg-zinc-200 flex items-center justify-center text-sm font-bold cursor-pointer"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/40">
                <div className="text-center my-2">
                  <span className="text-[11px] bg-zinc-100 text-zinc-400 px-3 py-1 rounded-full">
                    Matched with {selectedProfile.name} · {selectedProfile.location}
                  </span>
                </div>

                {activeConversation.length === 0 && (
                  <div className="text-center text-zinc-400 text-xs py-8">
                    Send a message to break the ice! 💬
                  </div>
                )}

                {activeConversation.map((msg: ChatMessage) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-br-sm shadow-sm"
                          : "bg-white text-zinc-800 border border-zinc-200/70 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-zinc-100 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selectedProfile.name}...`}
                  className="flex-1 bg-zinc-100 border border-zinc-200 rounded-full px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  ➤
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
