"use client";

import { useState, useEffect, useMemo } from "react";
import { useGitHubData } from "@/hooks/useGitHubData";
import { useSuitTheme } from "@/hooks/useSuitTheme";
import { HUDHeader } from "@/components/hud/HUDHeader";
import { SpiderSenseAlert, SpiderSenseAlertData } from "@/components/hud/SpiderSenseAlert";
import { ContributionHeatmap } from "@/components/spider-grid/ContributionHeatmap";
import { WebNetworkGraph } from "@/components/web-network/WebNetworkGraph";
import { LanguageDistribution } from "@/components/charts/LanguageDistribution";
import { RepoGrid } from "@/components/vault/RepoGrid";
import { ActivityScanner } from "@/components/activity/ActivityScanner";
import { MOCK_ACTIVITY_FEED } from "@/lib/mockData";
import { ShieldAlert, Terminal, Zap, GitPullRequest, Star, Layers } from "lucide-react";

export default function DashboardPage() {
  const { suit, changeSuit } = useSuitTheme();
  const {
    viewer,
    rateLimit,
    isNearLimit,
    isDemo,
    isLoading,
    error,
    setActiveUsername,
    refresh,
  } = useGitHubData();

  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  const repositories = useMemo(() => {
    return viewer?.repositories?.nodes || [];
  }, [viewer]);

  // Evaluate Spider-Sense Alerts dynamically from repos and PRs
  const activeAlerts: SpiderSenseAlertData[] = useMemo(() => {
    const alerts: SpiderSenseAlertData[] = [];

    // 1. Critical CI failure alert
    alerts.push({
      id: "alert-ci-failure",
      title: "CI / BUILD PIPELINE FAILURE",
      message: "GitHub Actions workflow run failed on arm64 cross-compile target in nanotech-suit-firmware.",
      severity: "critical",
      repoUrl: repositories.find((r) => r.name.includes("nanotech"))?.url,
    });

    // 2. Stale PR alerts
    repositories.forEach((repo) => {
      if (repo.pullRequests?.nodes) {
        repo.pullRequests.nodes.forEach((pr) => {
          const prDays = (Date.now() - new Date(pr.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          if (prDays > 14) {
            alerts.push({
              id: `pr-${repo.id}-${pr.title}`,
              title: `STALE PR DETECTED: [${repo.name}]`,
              message: `"${pr.title}" has been open for ${Math.round(prDays)} days without merge.`,
              severity: "warning",
              repoUrl: repo.url,
            });
          }
        });
      }
    });

    return alerts.filter((a) => !dismissedAlertIds.includes(a.id));
  }, [repositories, dismissedAlertIds]);

  const handleDismissAlert = (id: string) => {
    setDismissedAlertIds((prev) => [...prev, id]);
  };

  // Stats aggregate
  const totalStars = useMemo(() => {
    return repositories.reduce((acc, r) => acc + r.stargazerCount, 0);
  }, [repositories]);

  const totalForks = useMemo(() => {
    return repositories.reduce((acc, r) => acc + r.forkCount, 0);
  }, [repositories]);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto font-hud">
      {/* Spider-Sense Toast Alerts */}
      <SpiderSenseAlert alerts={activeAlerts} onDismiss={handleDismissAlert} />

      {/* Main HUD Header */}
      <HUDHeader
        viewer={viewer}
        rateLimit={rateLimit}
        isNearLimit={isNearLimit}
        isDemo={isDemo}
        currentSuit={suit}
        onSelectSuit={changeSuit}
        onSearchUser={(username) => setActiveUsername(username)}
        onRefresh={refresh}
        isLoading={isLoading}
      />

      {/* Top Tactical Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-4 shadow-lg backdrop-blur-md tech-bracket">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>Total Repos</span>
            <Layers size={14} className="text-[var(--web-shooter-blue)]" />
          </div>
          <p className="text-2xl font-extrabold text-white">{repositories.length}</p>
          <span className="text-[10px] text-[var(--web-shooter-blue)] font-bold">Active Archives</span>
        </div>

        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-4 shadow-lg backdrop-blur-md tech-bracket">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>Stars Earned</span>
            <Star size={14} className="text-[var(--webbing-gold)] fill-[var(--webbing-gold)]/20" />
          </div>
          <p className="text-2xl font-extrabold text-[var(--webbing-gold)]">{totalStars}</p>
          <span className="text-[10px] text-[var(--webbing-gold)] font-bold">Community Stars</span>
        </div>

        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-4 shadow-lg backdrop-blur-md tech-bracket">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>Forks Spawned</span>
            <Zap size={14} className="text-[var(--radioactive-green)]" />
          </div>
          <p className="text-2xl font-extrabold text-[var(--radioactive-green)]">{totalForks}</p>
          <span className="text-[10px] text-[var(--radioactive-green)] font-bold">Network Forks</span>
        </div>

        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-4 shadow-lg backdrop-blur-md tech-bracket">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>Threat Alerts</span>
            <ShieldAlert size={14} className="text-[var(--crimson-red)]" />
          </div>
          <p className="text-2xl font-extrabold text-[var(--crimson-red)]">{activeAlerts.length}</p>
          <span className="text-[10px] text-[var(--crimson-red)] font-bold">Spider-Sense Signals</span>
        </div>
      </div>

      {/* Spider-Grid Contribution Heatmap */}
      <ContributionHeatmap calendar={viewer?.contributionsCollection?.contributionCalendar} />

      {/* Web-Network Graph & Language Composition Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <WebNetworkGraph viewer={viewer} repositories={repositories} />
        </div>
        <div className="lg:col-span-1">
          <LanguageDistribution repositories={repositories} />
        </div>
      </div>

      {/* Oscorp Tech Vault Repository Grid */}
      <RepoGrid repositories={repositories} isLoading={isLoading} />

      {/* Police Scanner & Activity Feed */}
      <ActivityScanner feed={MOCK_ACTIVITY_FEED} />

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40 font-hud">
        <p className="flex items-center justify-center gap-2 font-bold text-white/60">
          <Zap size={13} className="text-[var(--webbing-gold)]" />
          WEB-HEAD OS &bull; Spider-Sense HUD v1.0
        </p>
        <p className="mt-1 text-[11px] text-white/30 max-w-xl mx-auto">
          Original Spider-Man-inspired visual telemetry HUD & DevOps developer profile center. Built with Next.js 14, Octokit GraphQL, Framer Motion, and Tailwind CSS.
        </p>
      </footer>
    </main>
  );
}
