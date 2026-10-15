"use client";

import { useEffect, useState } from "react";
import { SUPPORT_TIMEZONE, WHATSAPP } from "@/lib/site";
import { TRAVEL_STATUS, type RouteStatus } from "@/lib/travel-status";

const updatedLabel = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: SUPPORT_TIMEZONE,
}).format(new Date(TRAVEL_STATUS.updatedAt));

const STATE = {
  normal: { dot: "bg-secondary", text: "text-secondary", label: "Normal" },
  disrupted: { dot: "bg-[#E69F00]", text: "text-[#8A5A00]", label: "Perturbé" },
  stale: { dot: "bg-outline", text: "text-on-surface-variant", label: "À vérifier" },
} as const;

/** Âge du bulletin en heures, lu après le montage pour ne pas figer l'heure du serveur. */
function useAgeHours() {
  const [age, setAge] = useState<number | null>(null);
  useEffect(() => {
    const read = () => setAge((Date.now() - new Date(TRAVEL_STATUS.updatedAt).getTime()) / 3_600_000);
    read();
    const timer = setInterval(read, 60_000);
    return () => clearInterval(timer);
  }, []);
  return age;
}

const whatsappWith = (text: string) => `${WHATSAPP.href}?text=${encodeURIComponent(text)}`;

function Row({ item, stale }: { item: RouteStatus; stale: boolean }) {
  const s = STATE[item.state === "disrupted" ? "disrupted" : stale ? "stale" : "normal"];
  return (
    <li className="p-space-md rounded bg-surface-container-low flex flex-col gap-1">
      <div className="flex items-start justify-between gap-space-sm">
        <span className="flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface font-semibold">
          <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
          {item.label}
        </span>
        <span className={`font-label-md text-label-md font-bold shrink-0 ${s.text}`}>{s.label}</span>
      </div>
      <span className="font-body-md text-body-md text-on-surface-variant pl-[18px]">
        {stale ? "Dernier état connu : " : ""}
        {item.detail} · source : {item.source}
      </span>
      {s !== STATE.normal && (
        <a
          className="self-start ml-[18px] mt-1 h-9 px-space-md rounded-full border border-outline-variant bg-surface-container-lowest font-label-md text-label-md font-bold text-primary hover:bg-surface-container-high flex items-center gap-1"
          href={whatsappWith(`Bonjour, quel est l'état actuel : ${item.label} ?`)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            chat
          </span>
          Nous contacter<span className="sr-only"> au sujet de : {item.label} (WhatsApp, nouvel onglet)</span>
        </a>
      )}
    </li>
  );
}

export default function TravelStatus() {
  const age = useAgeHours();
  const stale = age === null || age > TRAVEL_STATUS.maxAgeHours;
  const disrupted = TRAVEL_STATUS.items.filter((i) => i.state === "disrupted").length;

  return (
    <section
      aria-labelledby="etat-titre"
      id="etat-parcs"
      className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col gap-space-md scroll-mt-28"
    >
      <div className="flex flex-col gap-0.5">
        <h2 id="etat-titre" className="font-headline-sm text-headline-sm font-bold text-on-surface">
          État des vols et des routes
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Bulletin de notre équipe terrain, mis à jour le {updatedLabel} (heure de Madagascar).
        </p>
      </div>

      {age !== null && stale && (
        <p role="status" className="p-space-sm rounded bg-[#FFF4DC] text-[#5C3D00] font-body-md text-body-md flex gap-space-xs">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px] shrink-0">
            schedule
          </span>
          <span>Données non mises à jour depuis {Math.floor(age)}&nbsp;heures : vérifiez auprès de nous avant de partir sur la route.</span>
        </p>
      )}
      {!stale && disrupted > 0 && (
        <p role="status" className="font-body-md text-body-md text-[#5C3D00]">
          {disrupted === 1 ? "1 perturbation en cours." : `${disrupted} perturbations en cours.`}
        </p>
      )}

      <ul className="flex flex-col gap-space-sm">
        {TRAVEL_STATUS.items.map((item) => (
          <Row key={item.id} item={item} stale={stale} />
        ))}
      </ul>

      <a
        className="self-start font-label-md text-label-md font-bold text-primary underline underline-offset-2 flex items-center gap-1"
        href={whatsappWith("Bonjour, je signale un problème de route : ")}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[18px] no-underline">
          report
        </span>
        Signaler un problème de route<span className="sr-only"> (WhatsApp, nouvel onglet)</span>
      </a>
    </section>
  );
}
