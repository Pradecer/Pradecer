"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Activity, Cpu, AlertTriangle, RefreshCw } from "lucide-react";
import { SuitSelector } from "./SuitSelector";
import { SuitTheme } from "@/hooks/useSuitTheme";
import { RateLimitStatus, GitHubViewerData } from "@/types/github";
import { hudAudio } from "@/lib/soundEffects";

interface HUDHeaderProps {
  viewer?: GitHubViewerData;
  rateLimit?: RateLimitStatus;
  isNearLimit?: boolean;
  isDemo?: boolean;
  currentSuit: SuitTheme;
  onSelectSuit: (suit: SuitTheme) => void;
  onSearchUser: (username: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function HUDHeader({
  viewer,
  rateLimit,
  isNearLimit,
  isDemo,
  currentSuit,
  onSelectSuit,
  onSearchUser,
  onRefresh,
  isLoading,
}: HUDHeaderProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      hudAudio.playBlip(1100);
      onSearchUser(searchInput.trim());
    }
  };

  const remainingPercent = rateLimit
    ? Math.round((rateLimit.remaining / rateLimit.limit) * 100)
    : 92;

  return (
    <header className="relative mb-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-4 font-hud shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl tech-bracket">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* User Identity Section */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--web-shooter-blue)] bg-black/60 shadow-[0_0_20px_rgba(0,164,228,0.4)] overflow-hidden">
            {viewer?.avatarUrl ? (
              <Image
                src={viewer.avatarUrl}
                alt={viewer.name || viewer.login}
                width={56}
                height={56}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <Cpu className="text-[var(--web-shooter-blue)] animate-pulse" size={28} />
            )}
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-black bg-[var(--radioactive-green)] shadow-[0_0_8px_#39FF14]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-wide text-[var(--web-white)]">
                {viewer?.name || "WEB-HEAD AGENT"}
              </h1>
              <span className="rounded border border-[var(--webbing-gold)]/40 bg-[var(--webbing-gold)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--webbing-gold)]">
                @{viewer?.login || "operative"}
              </span>
              {isDemo && (
                <span className="rounded border border-purple-500/40 bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                  DEMO HUD MODE
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[var(--web-white)]/70 line-clamp-1 max-w-xl">
              {viewer?.bio || "Spider-Sense developer HUD active. Monitoring public repositories & CI streams."}
            </p>
          </div>
        </div>

        {/* Telemetry Controls & Search */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Public Handle Quick Lookup */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Target GitHub User..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-44 rounded-lg border border-white/10 bg-black/50 py-1.5 pl-8 pr-3 text-xs text-white placeholder-white/40 focus:border-[var(--web-shooter-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--web-shooter-blue)] transition-all"
            />
            <Search size={13} className="absolute left-2.5 text-white/40" />
          </form>

          {/* Refresh Action */}
          <button
            onClick={() => {
              hudAudio.playBlip(1000);
              onRefresh();
            }}
            disabled={isLoading}
            title="Refresh GitHub Telemetry"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/70 hover:border-[var(--web-shooter-blue)] hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-[var(--web-shooter-blue)]" : ""} />
          </button>

          {/* Rate Limit Bandwidth Gauge */}
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs">
            <Activity
              size={14}
              className={isNearLimit ? "text-[var(--crimson-red)] animate-ping" : "text-[var(--web-shooter-blue)]"}
            />
            <div className="text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-white/60">Bandwidth:</span>
                <span
                  className={`font-bold ${
                    isNearLimit ? "text-[var(--crimson-red)]" : "text-[var(--webbing-gold)]"
                  }`}
                >
                  {remainingPercent}%
                </span>
              </div>
            </div>
            {isNearLimit && (
              <span title="API Bandwidth Critical!">
                <AlertTriangle size={13} className="text-[var(--crimson-red)]" />
              </span>
            )}
          </div>

          {/* Suit Theme Selector */}
          <SuitSelector currentSuit={currentSuit} onSelectSuit={onSelectSuit} />
        </div>

      </div>
    </header>
  );
}
