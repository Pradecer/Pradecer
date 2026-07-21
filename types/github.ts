export interface GitHubLanguage {
  name: string;
  color: string;
}

export interface GitHubCommitHistory {
  totalCount: number;
}

export interface GitHubPullRequest {
  title: string;
  createdAt: string;
  url: string;
}

export interface GitHubRepository {
  id: string;
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  url: string;
  primaryLanguage: GitHubLanguage | null;
  pushedAt: string;
  defaultBranchRef?: {
    target?: {
      history?: GitHubCommitHistory;
    };
  };
  pullRequests: {
    totalCount: number;
    nodes: GitHubPullRequest[];
  };
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubViewerData {
  login: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  followers?: { totalCount: number };
  following?: { totalCount: number };
  repositories: {
    totalCount: number;
    nodes: GitHubRepository[];
  };
  contributionsCollection: {
    contributionCalendar: ContributionCalendar;
  };
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  resetAt: string;
}

export interface GitHubDashboardResponse {
  viewer: GitHubViewerData;
  rateLimit: RateLimitStatus;
  isDemo?: boolean;
}

export interface ActivityFeedItem {
  id: string;
  type: "commit" | "pr_open" | "pr_merge" | "release" | "issue_alert" | "ci_failure";
  repo: string;
  message: string;
  timestamp: string;
  severity: "info" | "warning" | "critical" | "success";
}
