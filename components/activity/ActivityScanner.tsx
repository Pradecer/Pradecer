"use client";

import { useState } from "react";
import { ActivityFeedItem } from "@/types/github";
import { Terminal, Radio, ShieldAlert, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { hudAudio } from "@/lib/soundEffects";

interface ActivityScannerProps {
  feed: ActivityFeedItem[];
}

export function ActivityScanner({ feed }: ActivityScannerProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const filteredFeed = feed.filter(
    (item) => filterSeverity === "ALL" || item.severity === filterSeverity
  );

  const getSeverityBadge = (severity: ActivityFeedItem["severity"]) => {
    switch (severity) {
      case "critical":
        return (
          <span className="flex items-center gap-1 rounded bg-[var(--crimson-red)]/20 px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--crimson-red)] border border-[var(--crimson-red)]/40 animate-pulse">
            <ShieldAlert size={10} /> CRITICAL
          </span>
        );
      case "warning":
        return (
          <span className="flex items-center gap-1 rounded bg-[var(--webbing-gold)]/20 px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--webbing-gold)] border border-[var(--webbing-gold)]/40">
            <AlertTriangle size={10} /> WARN
          </span>
        );
      case "success":
        return (
          <span className="flex items-center gap-1 rounded bg-[var(--radioactive-green)]/20 px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--radioactive-green)] border border-[var(--radioactive-green)]/40">
            <CheckCircle2 size={10} /> MERGED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded bg-[var(--web-shooter-blue)]/20 px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--web-shooter-blue)] border border-[var(--web-shooter-blue)]/40">
            <Info size={10} /> TELEMETRY
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-5 font-mono backdrop-blur-xl shadow-xl tech-bracket">
      {/* Scanner Header */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-[var(--web-shooter-blue)]" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white font-hud">
            Police Scanner & Activity Log
          </h3>
          <span className="flex items-center gap-1 rounded bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-extrabold text-red-400">
            <Radio size={10} className="animate-pulse" /> LIVE STREAM
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 text-[11px] font-hud">
          {["ALL", "critical", "warning", "success"].map((sev) => (
            <button
              key={sev}
              onClick={() => {
                hudAudio.playBlip(900);
                setFilterSeverity(sev);
              }}
              className={`rounded px-2 py-0.5 uppercase font-bold transition ${
                filterSeverity === sev
                  ? "bg-white/20 text-white border border-white/30"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Feed Scroll Container */}
      <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
        {filteredFeed.length === 0 ? (
          <div className="py-6 text-center text-xs text-white/40 font-mono">
            No activity signals detected matching severity parameters.
          </div>
        ) : (
          filteredFeed.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-2 rounded-lg border border-white/5 bg-black/50 p-2.5 text-xs transition hover:border-white/20"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {getSeverityBadge(item.severity)}
                <span className="font-bold text-[var(--webbing-gold)] text-[11px]">
                  [{item.repo}]
                </span>
                <span className="text-white/90 truncate">{item.message}</span>
              </div>
              <span className="text-[10px] text-white/40 shrink-0 self-end md:self-auto">
                {item.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
