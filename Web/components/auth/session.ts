"use client";

import { useSyncExternalStore } from "react";

/** Session de démonstration : aucune authentification réelle, simple marqueur dans le navigateur. */
export type Session = { name: string };

export const SESSION_KEY = "mv_session";

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cached: Session | null = null;

function read(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cached = parsed && typeof parsed.name === "string" ? { name: parsed.name } : null;
  } catch {
    cached = null;
  }
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === SESSION_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function signIn(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  listeners.forEach((l) => l());
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
  listeners.forEach((l) => l());
}

export function useSession() {
  return useSyncExternalStore(subscribe, read, () => null);
}
