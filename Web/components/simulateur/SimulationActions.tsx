"use client";

import { useState } from "react";

const action =
  "h-11 px-4 rounded-full border border-on-primary/70 text-on-primary font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-on-primary hover:text-primary transition-colors";

/** L'adresse de la page contient tous les critères : la partager ou l'ajouter aux favoris suffit à retrouver la simulation. */
export function SimulationActions({ methodHref }: { methodHref: string }) {
  const [status, setStatus] = useState("");

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ma simulation de budget MadaVoyage", url });
      } catch {
        // Partage annulé par le voyageur : rien à signaler.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Lien copié : il contient tous vos critères. Ajoutez-le à vos favoris pour retrouver cette simulation.");
    } catch {
      setStatus("Copie impossible : copiez l'adresse de la page depuis la barre du navigateur.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <button className={action} onClick={share} type="button">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            share
          </span>
          Partager le lien
        </button>
        <button className={action} onClick={() => window.print()} type="button">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            picture_as_pdf
          </span>
          Imprimer ou PDF
        </button>
      </div>
      <p aria-live="polite" className="font-body-sm text-body-sm text-on-primary min-h-0 empty:hidden">
        {status}
      </p>
      <a
        className="self-center font-label-md text-label-md text-on-primary font-bold underline underline-offset-4 inline-flex items-center gap-1"
        href={methodHref}
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
          calculate
        </span>
        Comment calculons-nous ?
      </a>
    </div>
  );
}
