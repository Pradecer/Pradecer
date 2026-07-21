"use client";

import { useState } from "react";
import { ContributionCalendar, ContributionDay } from "@/types/github";
import { Grid, Calendar, Flame } from "lucide-react";
import { hudAudio } from "@/lib/soundEffects";

interface ContributionHeatmapProps {
  calendar?: ContributionCalendar;
}

export function ContributionHeatmap({ calendar }: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  if (!calendar || !calendar.weeks) return null;

  const { totalContributions, weeks } = calendar;

  // Compute color step based on contribution count and suit theme variables
  const getCellColor = (count: number) => {
    if (count === 0) return "bg-black/40 border border-white/5";
    if (count <= 3) return "bg-[var(--web-shooter-blue)]/40 border border-[var(--web-shooter-blue)]/50";
    if (count <= 8) return "bg-[var(--web-shooter-blue)] border border-[var(--web-shooter-blue)] shadow-[0_0_6px_rgba(0,164,228,0.5)]";
    if (count <= 15) return "bg-[var(--webbing-gold)] border border-[var(--webbing-gold)] shadow-[0_0_8px_rgba(242,169,0,0.6)]";
    return "bg-[var(--crimson-red)] border border-[var(--crimson-red)] shadow-[0_0_10px_rgba(230,36,41,0.8)] animate-pulse";
  };

  return (
    <div className="mb-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-5 font-hud backdrop-blur-xl shadow-xl tech-bracket">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Grid size={18} className="text-[var(--web-shooter-blue)]" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Spider-Grid Telemetry
          </h3>
          <span className="rounded bg-[var(--webbing-gold)]/20 px-2 py-0.5 text-xs font-bold text-[var(--webbing-gold)]">
            {totalContributions} Commits (365 Days)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-white/60">
          <span>Less</span>
          <div className="flex gap-1">
            <span className="h-3 w-3 rounded-sm bg-black/40 border border-white/10" />
            <span className="h-3 w-3 rounded-sm bg-[var(--web-shooter-blue)]/40" />
            <span className="h-3 w-3 rounded-sm bg-[var(--web-shooter-blue)]" />
            <span className="h-3 w-3 rounded-sm bg-[var(--webbing-gold)]" />
            <span className="h-3 w-3 rounded-sm bg-[var(--crimson-red)]" />
          </div>
          <span>More (Hottest)</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="inline-flex gap-1 min-w-[700px]">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.contributionDays.map((day, dIdx) => (
                <div
                  key={`${wIdx}-${dIdx}`}
                  onMouseEnter={() => {
                    hudAudio.playBlip(1200, 0.02);
                    setHoveredDay(day);
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`h-3 w-3 rounded-sm transition-transform hover:scale-125 cursor-pointer ${getCellColor(
                    day.contributionCount
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tooltip Inspector */}
      <div className="mt-2 flex items-center justify-between min-h-[24px] text-xs">
        {hoveredDay ? (
          <div className="flex items-center gap-2 font-semibold text-white">
            <Calendar size={13} className="text-[var(--webbing-gold)]" />
            <span>{new Date(hoveredDay.date).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span>
            <span className="text-[var(--web-shooter-blue)]">&bull;</span>
            <span className="font-bold text-[var(--webbing-gold)]">
              {hoveredDay.contributionCount} Commits / Activity Transmissions
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-white/40 text-[11px]">
            <Flame size={12} className="text-[var(--webbing-gold)]" />
            Hover over any cell to inspect exact daily contribution telemetry.
          </div>
        )}
      </div>
    </div>
  );
}
