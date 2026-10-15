"use client";

import { useEffect, useRef, useState } from "react";

const SAVED_KEY = "mv_carnet_saved_circuits";
const CIRCUIT_ID = "rn7";
const BUTTON =
  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors font-label-md text-label-md shadow-sm";

function readSaved(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default function CircuitActions() {
  const [saved, setSaved] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setSaved(readSaved().includes(CIRCUIT_ID));
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const flash = (message: string) => {
    setShareNotice(message);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setShareNotice(null), 3000);
  };

  const share = async () => {
    const data = { title: document.title, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // Partage annulé par l'utilisateur.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(data.url);
      flash("Lien copié dans le presse-papiers");
    } catch {
      flash("Copie impossible : utilisez l'adresse de la page");
    }
  };

  const toggleSaved = () => {
    const current = readSaved();
    const next = saved ? current.filter((id) => id !== CIRCUIT_ID) : [...new Set([...current, CIRCUIT_ID])];
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      // Stockage indisponible : l'état reste valable pour cette visite.
    }
    setSaved(!saved);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 relative">
      <button className={`${BUTTON} bg-surface-container text-on-surface hover:bg-surface-container-high`} onClick={() => window.print()} type="button">
        <span className="material-symbols-outlined text-[18px] text-primary">download</span>
        <span>Télécharger la fiche PDF</span>
      </button>
      <button className={`${BUTTON} bg-surface-container text-on-surface hover:bg-surface-container-high`} onClick={share} type="button">
        <span className="material-symbols-outlined text-[18px] text-primary">share</span>
        <span>Partager</span>
      </button>
      <button
        aria-pressed={saved}
        className={`${BUTTON} ${
          saved ? "bg-secondary-container/40 text-on-secondary-container" : "bg-surface-container text-on-surface hover:bg-surface-container-high"
        }`}
        onClick={toggleSaved}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px] text-tertiary">{saved ? "bookmark_added" : "bookmark_add"}</span>
        <span>{saved ? "Enregistré dans mon Carnet" : "Sauvegarder dans mon Carnet"}</span>
      </button>
      <span aria-live="polite" className="sr-only">
        {saved ? "Circuit enregistré dans votre carnet" : ""}
      </span>
      {shareNotice && (
        <span
          className="absolute top-full right-0 mt-2 px-3 py-1.5 rounded-full bg-inverse-surface text-surface font-label-sm text-label-sm shadow-md whitespace-nowrap"
          role="status"
        >
          {shareNotice}
        </span>
      )}
    </div>
  );
}
