"use client";

import { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";
import { hudAudio } from "@/lib/soundEffects";

export type SuitTheme = "classic" | "miles-morales" | "spider-armor-iii" | "symbiote";

export interface SuitConfig {
  id: SuitTheme;
  name: string;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  vibe: string;
}

export const SUIT_LIST: SuitConfig[] = [
  {
    id: "classic",
    name: "Classic Red / Blue",
    badge: "MARK I",
    primaryColor: "#E62429",
    secondaryColor: "#00A4E4",
    accentColor: "#F2A900",
    vibe: "High-contrast tactical default",
  },
  {
    id: "miles-morales",
    name: "Miles Morales",
    badge: "STRIKE",
    primaryColor: "#E62429",
    secondaryColor: "#8B5CF6",
    accentColor: "#39FF14",
    vibe: "Bio-electric stealth dark mode",
  },
  {
    id: "spider-armor-iii",
    name: "Spider-Armor Mark III",
    badge: "ARMOR",
    primaryColor: "#38BDF8",
    secondaryColor: "#2563EB",
    accentColor: "#E5E7EB",
    vibe: "Stealth alloy titanium HUD",
  },
  {
    id: "symbiote",
    name: "Symbiote Protocol",
    badge: "VENOM",
    primaryColor: "#DC2626",
    secondaryColor: "#312E81",
    accentColor: "#39FF14",
    vibe: "High-focus deep void mode",
  },
];

export function useSuitTheme() {
  const [suit, setSuitState] = useState<SuitTheme>("classic");

  useEffect(() => {
    const savedSuit = getCookie("webhead-suit") as SuitTheme;
    if (savedSuit && SUIT_LIST.some((s) => s.id === savedSuit)) {
      setSuitState(savedSuit);
      document.documentElement.setAttribute("data-suit", savedSuit);
    }
  }, []);

  const changeSuit = (newSuit: SuitTheme) => {
    setSuitState(newSuit);
    document.documentElement.setAttribute("data-suit", newSuit);
    setCookie("webhead-suit", newSuit, { maxAge: 60 * 60 * 24 * 365 });
    hudAudio.playSuitSwap();
  };

  const currentSuitConfig = SUIT_LIST.find((s) => s.id === suit) || SUIT_LIST[0];

  return {
    suit,
    changeSuit,
    currentSuitConfig,
    SUIT_LIST,
  };
}
