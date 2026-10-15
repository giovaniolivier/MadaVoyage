"use client";

import { useState } from "react";
import Dialog from "@/components/ui/Dialog";

type Kind = "coast" | "forest" | "trek" | "city";

const KINDS: Record<Kind, { label: string; fill: string; dot: string }> = {
  coast: { label: "Côtes et îles", fill: "fill-primary", dot: "bg-primary" },
  forest: { label: "Forêts et lémuriens", fill: "fill-secondary", dot: "bg-secondary" },
  trek: { label: "Pistes, canyons et baobabs", fill: "fill-tertiary", dot: "bg-tertiary" },
  city: { label: "Capitale, point d'arrivée", fill: "fill-on-surface", dot: "bg-on-surface" },
};

/** Coordonnées dans le repère du `viewBox` (longitude et latitude projetées), étiquettes placées pour ne jamais se chevaucher. */
const PLACES: { name: string; kind: Kind; region: string; x: number; y: number; label: "left" | "right" | "below" }[] = [
  { name: "Diego Suarez", kind: "coast", region: "nord", x: 464, y: 24, label: "right" },
  { name: "Nosy Be", kind: "coast", region: "nord", x: 410, y: 70, label: "left" },
  { name: "Sainte-Marie", kind: "coast", region: "est", x: 500, y: 232, label: "right" },
  { name: "Tsingy de Bemaraha", kind: "trek", region: "ouest", x: 236, y: 317, label: "left" },
  { name: "Antananarivo", kind: "city", region: "hautes-terres", x: 376, y: 327, label: "below" },
  { name: "Andasibe", kind: "forest", region: "est", x: 424, y: 328, label: "right" },
  { name: "Allée des Baobabs", kind: "trek", region: "ouest", x: 224, y: 389, label: "left" },
  { name: "Ranomafana", kind: "forest", region: "hautes-terres", x: 372, y: 435, label: "right" },
  { name: "Isalo", kind: "trek", region: "hautes-terres", x: 268, y: 494, label: "left" },
];

export const MAP_VIEWBOX = { x: 40, y: -20, width: 620, height: 680 };

export const ISLAND =
  "M463 7 L500 74 L514 143 L524 160 L510 184 L470 258 L470 292 L418 432 L400 476 L392 506 L349 609 L305 621 L258 635 L184 531 L169 458 L214 391 L200 288 L265 198 L315 179 L388 129 L423 87 L428 62 L450 23 Z";

function MapSvg({ className, title }: { className: string; title: string }) {
  return (
    <svg className={className} role="img" viewBox="40 -20 620 680" xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <text className="fill-on-surface-variant/60 italic" fontSize="16" x="56" y="250">
        Canal du Mozambique
      </text>
      <text className="fill-on-surface-variant/60 italic" fontSize="16" x="540" y="420">
        Océan Indien
      </text>
      <path className="fill-surface-container-lowest stroke-outline-variant" d={ISLAND} strokeLinejoin="round" strokeWidth="2" />
      <ellipse className="fill-surface-container-lowest stroke-outline-variant" cx="406" cy="70" rx="9" ry="6" strokeWidth="2" />
      <ellipse className="fill-surface-container-lowest stroke-outline-variant" cx="503" cy="232" rx="4" ry="15" strokeWidth="2" />
      {PLACES.map((p) => {
        const tx = p.label === "left" ? p.x - 14 : p.label === "right" ? p.x + 14 : p.x;
        const ty = p.label === "below" ? p.y + 28 : p.y + 6;
        const anchor = p.label === "left" ? "end" : p.label === "right" ? "start" : "middle";
        return (
          <a key={p.name} aria-label={`${p.name} : voir les circuits de la région`} className="group" href={`/circuits?region=${p.region}`}>
            <circle className="fill-surface-container-lowest" cx={p.x} cy={p.y} r="11" />
            <circle className={`${KINDS[p.kind].fill} group-hover:opacity-80`} cx={p.x} cy={p.y} r="8" />
            <text
              className="fill-on-surface stroke-surface-container-lowest font-bold group-hover:fill-primary"
              fontSize="17"
              paintOrder="stroke"
              strokeLinejoin="round"
              strokeWidth="5"
              textAnchor={anchor}
              x={tx}
              y={ty}
            >
              {p.name}
            </text>
          </a>
        );
      })}
    </svg>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 font-body-md text-body-md text-on-surface">
      {(Object.keys(KINDS) as Kind[]).map((k) => (
        <li key={k} className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded-full ${KINDS[k].dot}`}></span>
          {KINDS[k].label}
        </li>
      ))}
    </ul>
  );
}

export default function MadagascarMap() {
  const [zoomed, setZoomed] = useState(false);
  const title = "Carte simplifiée de Madagascar et des sites de nos circuits";

  return (
    <div className="p-4 sm:p-6 bg-surface-container-lowest rounded-3xl shadow-lg flex flex-col gap-4">
      <div className="relative rounded-2xl bg-secondary-fixed/30 overflow-hidden">
        <MapSvg className="w-full h-auto max-h-[560px]" title={title} />
        <button
          className="absolute bottom-3 right-3 h-11 px-4 rounded-full bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-md flex items-center gap-1.5 hover:text-primary transition-colors"
          onClick={() => setZoomed(true)}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">zoom_in</span> Agrandir
        </button>
      </div>
      <Legend />
      <p className="font-body-md text-body-md text-on-surface-variant">Touchez un lieu pour voir les circuits de la région.</p>

      {zoomed && (
        <Dialog icon="map" onClose={() => setZoomed(false)} size="xl" title="Carte de Madagascar">
          <div className="rounded-2xl bg-secondary-fixed/30">
            <MapSvg className="w-full h-auto max-h-[70vh]" title={title} />
          </div>
          <Legend />
        </Dialog>
      )}
    </div>
  );
}
