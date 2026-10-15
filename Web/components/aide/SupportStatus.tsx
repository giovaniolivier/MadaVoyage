"use client";

import { useEffect, useState } from "react";
import { SUPPORT_CHANNELS, SUPPORT_OPEN, SUPPORT_TIMEZONE } from "@/lib/site";

/** Madagascar n'applique pas l'heure d'été : UTC+3 toute l'année. */
const MADAGASCAR_OFFSET_MIN = 180;

type Clock = { hour: number; minute: number; visitorOffsetMin: number; visitorZone: string };

function readClock(): Clock {
  const parts = new Intl.DateTimeFormat("fr-FR", { hour: "numeric", minute: "numeric", hourCycle: "h23", timeZone: SUPPORT_TIMEZONE })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  return {
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    visitorOffsetMin: -new Date().getTimezoneOffset(),
    visitorZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
  };
}

/** Lu après le montage seulement : le serveur ne connaît ni l'heure du visiteur ni son fuseau. */
function useClock() {
  const [clock, setClock] = useState<Clock | null>(null);
  useEffect(() => {
    setClock(readClock());
    const timer = setInterval(() => setClock(readClock()), 60_000);
    return () => clearInterval(timer);
  }, []);
  return clock;
}

const hourText = (minutes: number) => {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}\u00a0h\u00a0${String(rest).padStart(2, "0")}` : `${h}\u00a0h`;
};

function status(clock: Clock) {
  const now = clock.hour * 60 + clock.minute;
  const open = now >= SUPPORT_OPEN.from * 60 && now < SUPPORT_OPEN.to * 60;
  if (open) return { open, text: `Ouvert maintenant, jusqu'à ${SUPPORT_OPEN.to}\u00a0h` };
  const when = now < SUPPORT_OPEN.from * 60 ? "aujourd'hui" : "demain";
  return { open, text: `Fermé, réponse ${when} à partir de ${SUPPORT_OPEN.from}\u00a0h` };
}

/** « À votre heure (Paris), nous sommes joignables de 7 h à 19 h », ou rien si le visiteur est déjà à l'heure de Madagascar. */
function visitorHours(clock: Clock) {
  const shift = clock.visitorOffsetMin - MADAGASCAR_OFFSET_MIN;
  if (shift === 0) return null;
  const city = clock.visitorZone.split("/").pop()?.replace(/_/g, " ");
  return `À votre heure${city ? ` (${city})` : ""}, nous sommes joignables de ${hourText(SUPPORT_OPEN.from * 60 + shift)} à ${hourText(SUPPORT_OPEN.to * 60 + shift)}`;
}

/** Pastille d'état, calculée sur l'heure de Madagascar. */
export function SupportNow({ className = "" }: { className?: string }) {
  const clock = useClock();
  if (!clock)
    return (
      <span className={`inline-flex items-center gap-1.5 font-body-md text-body-md font-bold text-on-surface-variant ${className}`}>
        <span aria-hidden="true" className="w-2 h-2 shrink-0 rounded-full bg-outline" />
        {SUPPORT_OPEN.from}&nbsp;h – {SUPPORT_OPEN.to}&nbsp;h, heure de Madagascar
      </span>
    );
  const s = status(clock);
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-body-md text-body-md font-bold ${s.open ? "text-secondary" : "text-on-surface-variant"} ${className}`}
    >
      <span aria-hidden="true" className={`w-2 h-2 shrink-0 rounded-full ${s.open ? "bg-secondary" : "bg-outline"}`} />
      {s.text}
    </span>
  );
}

/** Détail repliable sous les cartes : les cartes portent déjà les horaires, ceci ne sert qu'aux cas particuliers. */
export function SupportHours() {
  const clock = useClock();
  const local = clock ? visitorHours(clock) : null;
  return (
    <details className="group bg-surface-container-lowest rounded shadow-sm">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden px-space-lg py-space-md flex flex-wrap items-center gap-x-space-sm gap-y-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <span className="font-label-lg text-label-lg font-bold text-on-surface">Horaires détaillés par canal</span>
        <span className="font-body-md text-body-md text-on-surface-variant">
          {local ? `${local}.` : "Heure de Madagascar (UTC+3, sans heure d'été)."}
        </span>
        <span
          aria-hidden="true"
          className="material-symbols-outlined text-[22px] text-on-surface-variant ml-auto transition-transform group-open:rotate-180"
        >
          expand_more
        </span>
      </summary>
      <div className="px-space-lg pb-space-lg flex flex-col gap-space-sm">
        {clock && local && (
          <p className="font-body-md text-body-md text-on-surface-variant">
            Horaires à l&apos;heure de Madagascar (UTC+3, sans heure d&apos;été), où il est {hourText(clock.hour * 60 + clock.minute)}.
          </p>
        )}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
          {SUPPORT_CHANNELS.map((c) => (
            <div
              key={c.id}
              className={`p-space-md rounded flex flex-col gap-1 ${c.id === "urgent" ? "bg-error-container/40" : "bg-surface-container-low"}`}
            >
              <dt className="font-label-md text-label-md text-on-surface font-bold">{c.label}</dt>
              <dd className="font-label-md text-label-md text-on-surface">{c.hours}</dd>
              <dd className="font-body-md text-body-md text-on-surface-variant">{c.after}</dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
