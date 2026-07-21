import { GitHubDashboardResponse, ActivityFeedItem } from "@/types/github";

export const MOCK_GITHUB_DATA: GitHubDashboardResponse = {
  isDemo: true,
  rateLimit: {
    limit: 5000,
    remaining: 4620,
    resetAt: new Date(Date.now() + 3600000).toISOString(),
  },
  viewer: {
    login: "peter-parker",
    name: "Peter Parker (Web-Head)",
    avatarUrl: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=300&auto=format&fit=crop&q=80",
    bio: "Friendly Neighborhood Full-Stack Architect @ Oscorp Tech Lab. Building reactive quantum HUD systems & bio-synth algorithms.",
    location: "Queens, New York",
    followers: { totalCount: 1420 },
    following: { totalCount: 180 },
    repositories: {
      totalCount: 14,
      nodes: [
        {
          id: "repo-1",
          name: "web-shooter-os",
          description: "High-frequency micro-fluidic pressure controller for bio-synthetic polymer deployment.",
          stargazerCount: 1240,
          forkCount: 188,
          url: "https://github.com/peter-parker/web-shooter-os",
          primaryLanguage: { name: "TypeScript", color: "#3178C6" },
          pushedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          pullRequests: {
            totalCount: 2,
            nodes: [
              {
                title: "Refactor pressure valve calibration formula",
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
                url: "#",
              },
            ],
          },
        },
        {
          id: "repo-2",
          name: "spider-sense-hud",
          description: "Real-time augmented sensory feedback HUD protocol for threat detection & tactical analytics.",
          stargazerCount: 890,
          forkCount: 94,
          url: "https://github.com/peter-parker/spider-sense-hud",
          primaryLanguage: { name: "Rust", color: "#DEA584" },
          pushedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          pullRequests: {
            totalCount: 1,
            nodes: [
              {
                title: "Fix radial pulse sonar latency",
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                url: "#",
              },
            ],
          },
        },
        {
          id: "repo-3",
          name: "oscorp-quantum-ai",
          description: "Neural net weight optimization for bio-molecular molecular modeling.",
          stargazerCount: 450,
          forkCount: 32,
          url: "https://github.com/peter-parker/oscorp-quantum-ai",
          primaryLanguage: { name: "Python", color: "#3572A5" },
          pushedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
          pullRequests: { totalCount: 0, nodes: [] },
        },
        {
          id: "repo-4",
          name: "nanotech-suit-firmware",
          description: "Embedded C++ driver layer for self-healing carbon nanotube armor plates.",
          stargazerCount: 2100,
          forkCount: 412,
          url: "https://github.com/peter-parker/nanotech-suit-firmware",
          primaryLanguage: { name: "C++", color: "#F34B7D" },
          pushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          pullRequests: {
            totalCount: 3,
            nodes: [
              {
                title: "Thermal dissipation fail-safe routine",
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
                url: "#",
              },
            ],
          },
        },
        {
          id: "repo-5",
          name: "symbiote-isolation-protocol",
          description: "Acoustic frequency scanner to neutralize non-terrestrial parasitic organisms.",
          stargazerCount: 620,
          forkCount: 89,
          url: "https://github.com/peter-parker/symbiote-isolation-protocol",
          primaryLanguage: { name: "Go", color: "#00ADD8" },
          pushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          pullRequests: { totalCount: 0, nodes: [] },
        },
        {
          id: "repo-6",
          name: "daily-bugle-photo-scraper",
          description: "Automated high-speed camera trigger and cloud sync for high-altitude action photos.",
          stargazerCount: 310,
          forkCount: 22,
          url: "https://github.com/peter-parker/daily-bugle-photo-scraper",
          primaryLanguage: { name: "JavaScript", color: "#F7DF1E" },
          pushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 110).toISOString(), // Stale repo
          pullRequests: { totalCount: 0, nodes: [] },
        },
        {
          id: "repo-7",
          name: "glider-trajectory-calculator",
          description: "Aerodynamic simulation model for aerial evasion maneuvers.",
          stargazerCount: 180,
          forkCount: 15,
          url: "https://github.com/peter-parker/glider-trajectory-calculator",
          primaryLanguage: { name: "Python", color: "#3572A5" },
          pushedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          pullRequests: { totalCount: 0, nodes: [] },
        },
        {
          id: "repo-8",
          name: "stark-link-telemetry",
          description: "Encrypted satellite uplink relay for real-time tactical communications.",
          stargazerCount: 1540,
          forkCount: 230,
          url: "https://github.com/peter-parker/stark-link-telemetry",
          primaryLanguage: { name: "TypeScript", color: "#3178C6" },
          pushedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          pullRequests: { totalCount: 0, nodes: [] },
        },
      ],
    },
    contributionsCollection: {
      contributionCalendar: generateMockContributionCalendar(),
    },
  },
};

export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: "act-1",
    type: "commit",
    repo: "web-shooter-os",
    message: "feat: add high-viscosity web fluid polymer formula",
    timestamp: "12 mins ago",
    severity: "info",
  },
  {
    id: "act-2",
    type: "ci_failure",
    repo: "nanotech-suit-firmware",
    message: "build: CI pipeline failed on ARM64 cross-compile target",
    timestamp: "28 mins ago",
    severity: "critical",
  },
  {
    id: "act-3",
    type: "pr_merge",
    repo: "spider-sense-hud",
    message: "pull request #42 merged: Optic HUD overlay refresh rate boosted to 120Hz",
    timestamp: "1 hour ago",
    severity: "success",
  },
  {
    id: "act-4",
    type: "issue_alert",
    repo: "web-shooter-os",
    message: "alert: Stale PR #12 detected (open > 14 days without review)",
    timestamp: "3 hours ago",
    severity: "warning",
  },
  {
    id: "act-5",
    type: "release",
    repo: "stark-link-telemetry",
    message: "release v2.4.0: Encrypted satellite channel handshake protocol",
    timestamp: "5 hours ago",
    severity: "success",
  },
  {
    id: "act-6",
    type: "commit",
    repo: "symbiote-isolation-protocol",
    message: "fix: adjust sonic emitter resonance frequency to 4200Hz",
    timestamp: "8 hours ago",
    severity: "info",
  },
];

function generateMockContributionCalendar() {
  const weeks = [];
  const now = new Date();
  
  for (let w = 52; w >= 0; w--) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      
      // Randomize activity pattern with high intensity on mid-week days
      const rand = Math.random();
      let count = 0;
      if (rand > 0.4) count = Math.floor(Math.random() * 5) + 1;
      if (rand > 0.8) count = Math.floor(Math.random() * 12) + 6;
      if (rand > 0.95) count = Math.floor(Math.random() * 18) + 18;

      days.push({
        date: date.toISOString().split("T")[0],
        contributionCount: count,
        weekday: d,
      });
    }
    weeks.push({ contributionDays: days });
  }

  const totalContributions = weeks.reduce(
    (acc, w) => acc + w.contributionDays.reduce((dAcc, d) => dAcc + d.contributionCount, 0),
    0
  );

  return { totalContributions, weeks };
}
