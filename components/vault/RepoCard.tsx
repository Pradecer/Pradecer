"use client";

import { motion } from "framer-motion";
import { Star, GitFork, Clock, GitPullRequest, ExternalLink, ShieldAlert } from "lucide-react";
import { GitHubRepository } from "@/types/github";
import { hudAudio } from "@/lib/soundEffects";

interface RepoCardProps {
  repo: GitHubRepository;
}

export function RepoCard({ repo }: RepoCardProps) {
  const {
    name,
    description,
    stargazerCount,
    forkCount,
    primaryLanguage,
    pushedAt,
    pullRequests,
    url,
  } = repo;

  // Stale status check: older than 90 days
  const pushedDate = new Date(pushedAt);
  const isStale = (Date.now() - pushedDate.getTime()) / (1000 * 60 * 60 * 24) > 90;
  const openPRCount = pullRequests?.totalCount || 0;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => hudAudio.playBlip(750, 0.03)}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative block overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-4 font-hud shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all hover:border-[var(--web-shooter-blue)] hover:shadow-[0_0_24px_rgba(0,164,228,0.35)] tech-bracket"
    >
      {/* Top Header Row */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <h3 className="truncate text-sm font-bold tracking-wide text-[var(--web-white)] group-hover:text-[var(--web-shooter-blue)] transition-colors">
            {name}
          </h3>
          <ExternalLink size={12} className="text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {openPRCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-[var(--web-shooter-blue)]/20 border border-[var(--web-shooter-blue)]/40 px-2 py-0.5 text-[10px] font-bold text-[var(--web-shooter-blue)] shrink-0">
            <GitPullRequest size={11} /> {openPRCount} PR{openPRCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mb-4 line-clamp-2 text-xs text-[var(--web-white)]/65 leading-relaxed">
        {description || "No transmission log recorded for this repository node."}
      </p>

      {/* Footer Meta Metrics */}
      <div className="flex items-center gap-3 text-[11px] text-[var(--web-white)]/70">
        {primaryLanguage && (
          <span className="flex items-center gap-1.5 font-semibold">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_6px_currentColor]"
              style={{ backgroundColor: primaryLanguage.color }}
            />
            {primaryLanguage.name}
          </span>
        )}

        <span className="flex items-center gap-1 font-semibold text-white/80">
          <Star size={12} className="text-[var(--webbing-gold)] fill-[var(--webbing-gold)]/20" /> {stargazerCount}
        </span>

        <span className="flex items-center gap-1 font-semibold text-white/80">
          <GitFork size={12} /> {forkCount}
        </span>

        <span
          className={`ml-auto flex items-center gap-1 text-[10px] font-bold ${
            isStale
              ? "text-[var(--crimson-red)]"
              : "text-[var(--radioactive-green)]"
          }`}
          title={isStale ? "Repo Stale (>90 days inactive)" : "Active Repo"}
        >
          {isStale ? <ShieldAlert size={11} /> : <Clock size={11} />}
          {pushedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Hover Web Residue Shimmer Effect */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[var(--web-shooter-blue)]/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </motion.a>
  );
}
