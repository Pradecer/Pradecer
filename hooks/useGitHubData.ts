"use client";

import { useState } from "react";
import useSWR from "swr";
import { GitHubDashboardResponse } from "@/types/github";

const fetcher = async (url: string): Promise<GitHubDashboardResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || "Failed to retrieve GitHub telemetry");
  }
  return res.json();
};

export function useGitHubData(initialUsername: string = "") {
  const [activeUsername, setActiveUsername] = useState<string>(initialUsername);

  const endpoint = activeUsername
    ? `/api/github/dashboard?username=${encodeURIComponent(activeUsername)}`
    : "/api/github/dashboard";

  const { data, error, isLoading, mutate } = useSWR<GitHubDashboardResponse>(
    endpoint,
    fetcher,
    {
      refreshInterval: 90_000, // gentle polling every 90 seconds
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
      errorRetryCount: 3,
    }
  );

  const rateLimit = data?.rateLimit;
  const isNearLimit = rateLimit ? rateLimit.remaining / rateLimit.limit < 0.1 : false;

  return {
    viewer: data?.viewer,
    rateLimit,
    isNearLimit,
    isDemo: data?.isDemo,
    isLoading,
    error,
    activeUsername,
    setActiveUsername,
    refresh: mutate,
  };
}
