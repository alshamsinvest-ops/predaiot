"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MotionPref = "off" | "auto" | "on";

interface MotionContextValue {
  pref: MotionPref;
  osPrefersReduced: boolean;
  shouldAnimate: boolean;
  cycle: () => void;
}

const MotionContext = createContext<MotionContextValue | null>(null);

const STORAGE_KEY = "predaiot.motion.pref";

const nextPref: Record<MotionPref, MotionPref> = {
  auto: "off",
  off: "on",
  on: "auto",
};

export function MotionProvider({ children }: { children: ReactNode }) {
  const [pref, setPref] = useState<MotionPref>("auto");
  const [osPrefersReduced, setOsPrefersReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as MotionPref | null;
      if (stored === "off" || stored === "on" || stored === "auto") {
        setPref(stored);
      }
    } catch {
      // localStorage blocked — stick with "auto"
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setOsPrefersReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setOsPrefersReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cycle = () => {
    setPref((prev) => {
      const nxt = nextPref[prev];
      try {
        window.localStorage.setItem(STORAGE_KEY, nxt);
      } catch {
        /* ignore */
      }
      return nxt;
    });
  };

  const shouldAnimate = useMemo(() => {
    if (!hydrated) return false; // SSR / first paint: opt out to avoid jank
    if (pref === "off") return false;
    if (pref === "on") return true;
    return !osPrefersReduced;
  }, [pref, osPrefersReduced, hydrated]);

  const value = useMemo<MotionContextValue>(
    () => ({ pref, osPrefersReduced, shouldAnimate, cycle }),
    [pref, osPrefersReduced, shouldAnimate],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion(): MotionContextValue {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    // Called outside provider — return a safe default so components don't crash.
    return {
      pref: "auto",
      osPrefersReduced: false,
      shouldAnimate: false,
      cycle: () => {},
    };
  }
  return ctx;
}
