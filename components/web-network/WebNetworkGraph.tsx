"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GitHubRepository, GitHubViewerData } from "@/types/github";
import { Network, ZoomIn } from "lucide-react";
import { hudAudio } from "@/lib/soundEffects";

// Dynamically import ForceGraph2D with SSR disabled (Canvas API requirement)
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-xs text-white/50">
      Initializing Web-Network Graph Canvas...
    </div>
  ),
});

interface WebNetworkGraphProps {
  viewer?: GitHubViewerData;
  repositories: GitHubRepository[];
}

export function WebNetworkGraph({ viewer, repositories }: WebNetworkGraphProps) {
  const fgRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Build Graph Nodes & Edges
  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];

    // Center viewer node
    const rootId = viewer?.login || "WEB-HEAD";
    nodes.push({
      id: rootId,
      name: viewer?.name || "WEB-HEAD",
      val: 20,
      color: "#E62429",
      type: "root",
    });

    // Language clusters
    const langMap = new Map<string, string>();
    repositories.forEach((repo) => {
      if (repo.primaryLanguage) {
        langMap.set(repo.primaryLanguage.name, repo.primaryLanguage.color);
      }
    });

    langMap.forEach((color, langName) => {
      nodes.push({
        id: `lang-${langName}`,
        name: langName,
        val: 12,
        color: color || "#00A4E4",
        type: "language",
      });
      links.push({
        source: rootId,
        target: `lang-${langName}`,
      });
    });

    // Repo nodes
    repositories.forEach((repo) => {
      nodes.push({
        id: repo.id,
        name: repo.name,
        val: Math.max(8, Math.min(25, repo.stargazerCount / 100 + 8)),
        stars: repo.stargazerCount,
        color: repo.primaryLanguage?.color || "#00A4E4",
        type: "repo",
        url: repo.url,
      });

      const targetLangId = repo.primaryLanguage
        ? `lang-${repo.primaryLanguage.name}`
        : rootId;

      links.push({
        source: targetLangId,
        target: repo.id,
      });
    });

    return { nodes, links };
  }, [viewer, repositories]);

  return (
    <div className="mb-8 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-overlay)] p-5 font-hud backdrop-blur-xl shadow-xl tech-bracket">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Network size={18} className="text-[var(--webbing-gold)]" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
            Web-Network Topological Graph
          </h3>
          <span className="rounded bg-[var(--web-shooter-blue)]/20 px-2 py-0.5 text-xs font-bold text-[var(--web-shooter-blue)]">
            {graphData.nodes.length} Nodes connected
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/50">
          <ZoomIn size={14} />
          <span>Drag or hover nodes to inspect web strands</span>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div className="relative h-80 w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-inner">
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          nodeLabel={(node: any) => `${node.name} ${node.stars ? `(⭐ ${node.stars})` : ""}`}
          nodeVal={(node: any) => node.val}
          nodeColor={(node: any) => node.color}
          linkColor={() => "rgba(0, 164, 228, 0.35)"}
          linkWidth={1.5}
          linkDirectionalParticles={reducedMotion ? 0 : 2}
          linkDirectionalParticleSpeed={0.006}
          linkDirectionalParticleWidth={2.5}
          linkDirectionalParticleColor={() => "#F2A900"}
          onNodeHover={(node: any) => {
            if (node) hudAudio.playBlip(1000, 0.02);
            setHoveredNode(node);
          }}
          onNodeClick={(node: any) => {
            if (node?.url) {
              hudAudio.playBlip(1400);
              window.open(node.url, "_blank");
            }
          }}
          cooldownTicks={reducedMotion ? 0 : 100}
        />

        {/* Hover Inspector Tooltip Overlay */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-3 rounded-lg border border-[var(--webbing-gold)]/50 bg-black/90 p-3 text-xs shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
              {hoveredNode.name}
            </div>
            <p className="mt-1 text-[11px] text-white/70">
              Type: <span className="uppercase text-[var(--webbing-gold)] font-mono">{hoveredNode.type}</span>
              {hoveredNode.stars !== undefined && ` • Stars: ⭐ ${hoveredNode.stars}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
