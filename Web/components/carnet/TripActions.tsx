"use client";

import { useEffect, useRef, useState } from "react";

const SECONDARY =
  "h-12 px-space-md rounded-full bg-surface-container-lowest/90 hover:bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center gap-space-xs backdrop-blur-md transition-all shadow-sm";

export default function TripActions() {
  const [notice, setNotice] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const flash = (message: string) => {
    setNotice(message);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setNotice(null), 4000);
  };

  const share = async () => {
    const data = { title: "Mon itinéraire MadaVoyage — Nosy Be", url: window.location.href };
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
      flash("Lien de l'itinéraire copié dans le presse-papiers");
    } catch {
      flash("Copie impossible : utilisez l'adresse de la page");
    }
  };

  return (
    <div className="flex flex-col gap-space-xs pt-space-xs">
      <div className="flex flex-wrap items-center gap-space-sm">
        <button
          className="h-12 px-space-lg rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-lg text-label-lg flex items-center gap-space-xs transition-transform active:scale-95 shadow-md"
          onClick={() => window.print()}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
          <span>Télécharger le Carnet Complet (PDF)</span>
        </button>
        <button
          className={SECONDARY}
          onClick={() => flash("L'ajout au Wallet se fait depuis l'application mobile MadaVoyage (Apple Wallet et Google Wallet).")}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">wallet</span>
          <span>Ajouter au Wallet</span>
        </button>
        <button className={SECONDARY} onClick={share} type="button">
          <span className="material-symbols-outlined text-[20px]">share</span>
          <span>Partager l'itinéraire</span>
        </button>
      </div>
      <p aria-live="polite" className="min-h-[1.5rem] font-body-sm text-body-sm text-surface-container-lowest" role="status">
        {notice}
      </p>
    </div>
  );
}
