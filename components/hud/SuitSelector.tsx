"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Volume2, VolumeX } from "lucide-react";
import { SuitTheme, SUIT_LIST } from "@/hooks/useSuitTheme";
import { hudAudio } from "@/lib/soundEffects";

interface SuitSelectorProps {
  currentSuit: SuitTheme;
  onSelectSuit: (suit: SuitTheme) => void;
}

export function SuitSelector({ currentSuit, onSelectSuit }: SuitSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const toggleAudio = () => {
    const newState = hudAudio.toggleSound();
    setSoundEnabled(newState);
    if (newState) {
      hudAudio.playBlip(1200, 0.08);
    }
  };

  const activeSuit = SUIT_LIST.find((s) => s.id === currentSuit) || SUIT_LIST[0];

  return (
    <div className="relative flex items-center gap-2 font-hud">
      {/* Audio Cue Toggle Button */}
      <button
        onClick={toggleAudio}
        onMouseEnter={() => hudAudio.playBlip(900)}
        title={soundEnabled ? "Mute HUD Audio" : "Enable HUD Audio"}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
          soundEnabled
            ? "border-[var(--webbing-gold)] bg-[var(--webbing-gold)]/10 text-[var(--webbing-gold)] shadow-[0_0_12px_rgba(242,169,0,0.3)]"
            : "border-white/10 bg-black/40 text-white/50 hover:text-white"
        }`}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {/* Radial / Dropdown Suit Theme Dial Button */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            hudAudio.playBlip(700);
          }}
          onMouseEnter={() => hudAudio.playBlip(800)}
          className="flex items-center gap-2 rounded-lg border border-[var(--web-shooter-blue)]/40 bg-[var(--glass-overlay)] px-3 py-1.5 text-xs text-[var(--web-white)] shadow-[0_0_15px_rgba(0,164,228,0.2)] transition hover:border-[var(--web-shooter-blue)]"
        >
          <Shield size={14} className="text-[var(--webbing-gold)] animate-pulse" />
          <span className="font-semibold">{activeSuit.name}</span>
          <span className="rounded bg-[var(--webbing-gold)]/20 px-1.5 py-0.5 text-[10px] font-bold text-[var(--webbing-gold)]">
            {activeSuit.badge}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-[var(--glass-border)] bg-[var(--suit-black)] p-2 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between border-b border-white/10 px-2 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--webbing-gold)]">
                  Suit Firmware Skins
                </span>
                <Sparkles size={13} className="text-[var(--webbing-gold)]" />
              </div>

              <div className="space-y-1">
                {SUIT_LIST.map((suitItem) => {
                  const isSelected = suitItem.id === currentSuit;
                  return (
                    <button
                      key={suitItem.id}
                      onClick={() => {
                        onSelectSuit(suitItem.id);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => hudAudio.playBlip(950)}
                      className={`flex w-full items-center justify-between rounded-lg p-2 text-left text-xs transition-all ${
                        isSelected
                          ? "border border-[var(--web-shooter-blue)] bg-[var(--web-shooter-blue)]/20 text-white font-bold"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: suitItem.primaryColor }}
                          />
                          <span>{suitItem.name}</span>
                        </div>
                        <p className="text-[10px] text-white/50 font-normal mt-0.5">
                          {suitItem.vibe}
                        </p>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-white/60">
                        {suitItem.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
