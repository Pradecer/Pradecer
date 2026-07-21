"use client";

import { useState, useMemo } from "react";
import { RepoCard } from "./RepoCard";
import { GitHubRepository } from "@/types/github";
import { Database, Filter, ArrowUpDown } from "lucide-react";
import { hudAudio } from "@/lib/soundEffects";

interface RepoGridProps {
  repositories: GitHubRepository[];
  isLoading?: boolean;
}

type SortField = "stars" | "updated" | "name";

export function RepoGrid({ repositories, isLoading }: RepoGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortField>("stars");

  // Extract unique languages
  const languages = useMemo(() => {
    const langSet = new Set<string>();
    repositories.forEach((r) => {
      if (r.primaryLanguage?.name) {
        langSet.add(r.primaryLanguage.name);
      }
    });
    return Array.from(langSet);
  }, [repositories]);

  // Filter & Sort
  const filteredRepos = useMemo(() => {
    return repositories
      .filter((r) => {
        const matchesName = r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLang = selectedLang === "ALL" || r.primaryLanguage?.name === selectedLang;
        return matchesName && matchesLang;
      })
      .sort((a, b) => {
        if (sortBy === "stars") return b.stargazerCount - a.stargazerCount;
        if (sortBy === "updated") return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
        return a.name.localeCompare(b.name);
      });
  }, [repositories, searchTerm, selectedLang, sortBy]);

  return (
    <section className="mb-8 font-hud">
      {/* Section Header */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-[var(--webbing-gold)]" />
          <h2 className="text-base font-extrabold tracking-wider uppercase text-white">
            Oscorp Tech Vault
          </h2>
          <span className="rounded bg-[var(--web-shooter-blue)]/20 px-2 py-0.5 text-xs font-bold text-[var(--web-shooter-blue)]">
            {filteredRepos.length} Repositories
          </span>
        </div>

        {/* Filters & Sorting Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Filter files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-xs text-white placeholder-white/40 focus:border-[var(--web-shooter-blue)] focus:outline-none"
          />

          {/* Sort Control */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white/70">
            <ArrowUpDown size={12} className="text-[var(--webbing-gold)]" />
            <select
              value={sortBy}
              onChange={(e) => {
                hudAudio.playBlip(900);
                setSortBy(e.target.value as SortField);
              }}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="stars" className="bg-[var(--suit-black)] text-white">Sort: Stars</option>
              <option value="updated" className="bg-[var(--suit-black)] text-white">Sort: Recent</option>
              <option value="name" className="bg-[var(--suit-black)] text-white">Sort: Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language Filter Tags */}
      {languages.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="flex items-center gap-1 text-[11px] font-bold text-white/50 mr-1">
            <Filter size={11} /> LANG:
          </span>
          <button
            onClick={() => {
              hudAudio.playBlip(850);
              setSelectedLang("ALL");
            }}
            className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
              selectedLang === "ALL"
                ? "bg-[var(--web-shooter-blue)] text-white shadow-[0_0_10px_rgba(0,164,228,0.4)]"
                : "border border-white/10 bg-black/30 text-white/60 hover:text-white"
            }`}
          >
            ALL
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                hudAudio.playBlip(850);
                setSelectedLang(lang);
              }}
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                selectedLang === lang
                  ? "bg-[var(--webbing-gold)] text-black shadow-[0_0_10px_rgba(242,169,0,0.4)]"
                  : "border border-white/10 bg-black/30 text-white/60 hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-36 rounded-xl border border-white/10 bg-black/30 animate-pulse p-4"
            />
          ))}
        </div>
      ) : filteredRepos.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/30 p-8 text-center">
          <p className="text-sm font-semibold text-white/70">
            No repository archives found matching telemetry criteria.
          </p>
          <p className="mt-1 text-xs text-white/40">Try resetting search parameters or language filter.</p>
        </div>
      ) : (
        /* Repository Grid */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  );
}
