"use client";

import { useSyncExternalStore } from "react";

export type Lang = "FR" | "MG" | "EN";

/** Clé partagée avec l'écran de connexion. */
export const LANG_KEY = "mv_lang";

export const LANGS: { code: Lang; label: string; html: string }[] = [
  { code: "FR", label: "Français", html: "fr" },
  { code: "MG", label: "Malagasy", html: "mg" },
  { code: "EN", label: "English", html: "en" },
];

const listeners = new Set<() => void>();

function read(): Lang {
  const saved = localStorage.getItem(LANG_KEY);
  return saved === "MG" || saved === "EN" ? saved : "FR";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === LANG_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function setLang(lang: Lang) {
  localStorage.setItem(LANG_KEY, lang);
  listeners.forEach((l) => l());
}

export function useLang() {
  return useSyncExternalStore(subscribe, read, (): Lang => "FR");
}
