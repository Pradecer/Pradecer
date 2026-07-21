"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";
import { hudAudio } from "@/lib/soundEffects";

export interface SpiderSenseAlertData {
  id: string;
  title: string;
  message: string;
  severity?: "warning" | "critical";
  repoUrl?: string;
}

interface SpiderSenseAlertProps {
  alerts: SpiderSenseAlertData[];
  onDismiss: (id: string) => void;
}

export function SpiderSenseAlert({ alerts, onDismiss }: SpiderSenseAlertProps) {
  useEffect(() => {
    if (alerts.length > 0) {
      hudAudio.playSpiderSenseAlarm();
    }
  }, [alerts.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none font-hud">
      <AnimatePresence>
        {alerts.slice(0, 3).map((alert) => {
          const isCritical = alert.severity === "critical";

          return (
            <motion.div
              key={alert.id}
              role="alert"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={[
                "pointer-events-auto relative flex items-start gap-3 rounded-xl border p-4 backdrop-blur-xl shadow-2xl tech-bracket",
                "bg-[var(--glass-overlay)]",
                isCritical
                  ? "border-[var(--crimson-red)] shadow-[0_0_24px_rgba(230,36,41,0.5)]"
                  : "border-[var(--webbing-gold)] shadow-[0_0_20px_rgba(242,169,0,0.4)]",
              ].join(" ")}
            >
              {/* Pulsing "Spider-Sense" concentric ring behind icon */}
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/50 border border-white/10">
                <motion.span
                  className={[
                    "absolute inline-flex h-full w-full rounded-lg",
                    isCritical ? "bg-[var(--crimson-red)]/50" : "bg-[var(--webbing-gold)]/50",
                  ].join(" ")}
                  animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                />
                {isCritical ? (
                  <ShieldAlert className="text-[var(--crimson-red)]" size={20} />
                ) : (
                  <AlertTriangle className="text-[var(--webbing-gold)]" size={20} />
                )}
              </span>

              {/* Alert Message */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {alert.title}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${
                      isCritical
                        ? "bg-[var(--crimson-red)]/20 text-[var(--crimson-red)]"
                        : "bg-[var(--webbing-gold)]/20 text-[var(--webbing-gold)]"
                    }`}
                  >
                    {isCritical ? "CRITICAL" : "SPIDER-SENSE"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/80 leading-relaxed">{alert.message}</p>
                {alert.repoUrl && (
                  <a
                    href={alert.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-[11px] font-semibold text-[var(--web-shooter-blue)] hover:underline"
                  >
                    View in Repository &rarr;
                  </a>
                )}
              </div>

              {/* Dismiss Action */}
              <button
                onClick={() => {
                  hudAudio.playBlip(600);
                  onDismiss(alert.id);
                }}
                aria-label="Dismiss Spider-Sense Alert"
                className="text-white/40 transition hover:text-white"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
