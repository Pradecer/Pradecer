"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { GitHubRepository } from "@/types/github";
import { Code2 } from "lucide-react";

interface LanguageDistributionProps {
  repositories: GitHubRepository[];
}

export function LanguageDistribution({ repositories }: LanguageDistributionProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, { count: number; color: string }> = {};

    repositories.forEach((repo) => {
      const lang = repo.primaryLanguage?.name || "Other";
      const color = repo.primaryLanguage?.color || "#888888";

      if (!counts[lang]) {
        counts[lang] = { count: 0, color };
      }
      counts[lang].count += 1;
    });

    return Object.entries(counts)
      .map(([name, { count, color }]) => ({ name, value: count, color }))
      .sort((a, b) => b.value - a.value);
  }, [repositories]);

  if (chartData.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-5 font-hud backdrop-blur-xl shadow-xl tech-bracket">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-[var(--web-shooter-blue)]" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Language Composition
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[var(--webbing-gold)]">
          {chartData.length} Languages
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Recharts Donut Canvas */}
        <div className="h-44 w-full md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-white/20 bg-black/90 px-3 py-2 text-xs font-hud shadow-xl">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
                          {data.name}
                        </div>
                        <p className="mt-1 text-[11px] text-white/70">
                          {data.value} Repositories ({Math.round((data.value / repositories.length) * 100)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div className="w-full md:w-1/2 space-y-2 max-h-40 overflow-y-auto pr-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-white/80">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-white/50">{item.value}</span>
                <span className="w-12 text-right font-bold text-[var(--webbing-gold)] text-[11px]">
                  {Math.round((item.value / repositories.length) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
