"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { DestinationId } from "./booking-store";
import { useDestinationText } from "./destination-i18n";

/** [longitude, latitude] en degrés décimaux. */
type LonLat = [number, number];

const W = 388;
const H = 720;
const project = ([lon, lat]: LonLat) => ({ x: (lon - 42.8) * 47.3, y: (-lat - 11.6) * 50 });
const at = (p: LonLat): CSSProperties => {
  const { x, y } = project(p);
  return { left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` };
};

/** Trait de côte simplifié, dans le sens horaire depuis le cap d'Ambre. */
const COAST: LonLat[] = [
  [49.26, -11.95],
  [49.42, -12.13],
  [49.55, -12.42],
  [49.88, -12.85],
  [49.95, -13.3],
  [50.05, -13.75],
  [50.17, -14.27],
  [50.22, -14.7],
  [50.3, -15.0],
  [50.48, -15.27],
  [50.42, -15.6],
  [50.18, -15.98],
  [49.95, -15.7],
  [49.75, -15.42],
  [49.65, -15.6],
  [49.68, -16.0],
  [49.6, -16.4],
  [49.55, -16.9],
  [49.42, -17.35],
  [49.4, -17.8],
  [49.4, -18.15],
  [49.2, -18.75],
  [48.98, -19.4],
  [48.78, -19.95],
  [48.55, -20.6],
  [48.35, -21.23],
  [48.15, -21.8],
  [48.02, -22.15],
  [47.83, -22.82],
  [47.6, -23.35],
  [47.35, -24.0],
  [47.1, -24.6],
  [46.98, -25.03],
  [46.6, -25.2],
  [46.3, -25.5],
  [45.8, -25.58],
  [45.15, -25.6],
  [44.6, -25.3],
  [44.07, -24.98],
  [43.75, -24.5],
  [43.67, -23.8],
  [43.62, -23.35],
  [43.55, -22.8],
  [43.4, -22.2],
  [43.3, -21.75],
  [43.6, -21.25],
  [43.95, -20.8],
  [44.28, -20.28],
  [44.45, -19.7],
  [44.35, -19.1],
  [44.1, -18.5],
  [44.0, -18.06],
  [43.95, -17.5],
  [44.2, -16.8],
  [44.43, -16.2],
  [44.9, -16.1],
  [45.4, -16.0],
  [45.9, -15.85],
  [46.32, -15.72],
  [46.7, -15.4],
  [47.1, -15.15],
  [47.5, -14.85],
  [47.75, -14.6],
  [47.9, -14.2],
  [48.2, -13.9],
  [48.45, -13.68],
  [48.55, -13.4],
  [48.75, -13.05],
  [48.95, -12.7],
  [49.05, -12.4],
  [49.15, -12.15],
];

const coastPath =
  COAST.map((p, i) => {
    const { x, y } = project(p);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + " Z";

const TANA: LonLat = [47.52, -18.91];

export const MAP_ZONES: Record<DestinationId, { name: string; at: LonLat; side: "left" | "right" }> = {
  "nosy-be": { name: "Nosy Be", at: [48.27, -13.33], side: "left" },
  "grand-nord": { name: "Diego Suarez", at: [49.29, -12.28], side: "left" },
  "sainte-marie": { name: "Sainte-Marie", at: [49.88, -16.88], side: "left" },
};

/** Ordre de navigation au clavier entre les pins : du nord au sud. */
const ORDER = (Object.keys(MAP_ZONES) as DestinationId[]).sort((a, b) => MAP_ZONES[b].at[1] - MAP_ZONES[a].at[1]);

/** Points creux : chacun ouvre l'Explorer filtré sur la région de ses circuits. */
const CIRCUIT_SPOTS: { name: string; at: LonLat; href: string }[] = [
  { name: "Allée des Baobabs", at: [44.42, -20.25], href: "/circuits?region=ouest" },
  { name: "Andasibe", at: [48.42, -18.94], href: "/circuits?region=est" },
  { name: "Isalo", at: [45.35, -22.55], href: "/circuits?region=hautes-terres" },
];

const REGION_LABELS: { name: string; at: LonLat; rotate?: number }[] = [
  { name: "NORD", at: [49.1, -14.6] },
  { name: "HAUTES TERRES", at: [46.2, -20.9] },
  { name: "OUEST", at: [44.95, -18.3] },
  { name: "CÔTE EST", at: [48.0, -21.3], rotate: -72 },
];

function flightPath(to: LonLat) {
  const a = project(TANA);
  const b = project(to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const cx = mx - (b.y - a.y) * 0.15;
  const cy = my + (b.x - a.x) * 0.15;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function ZoneDot({ selected = false }: { selected?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded-full bg-primary ring-2 ring-surface-container-lowest shadow ${
        selected ? "w-5 h-5 shadow-[0_0_0_6px_rgba(0,105,114,0.28)]" : "w-3.5 h-3.5"
      }`}
    ></span>
  );
}

export function CircuitDot() {
  return <span aria-hidden="true" className="block w-3 h-3 rounded-full bg-surface-container-lowest border-2 border-secondary"></span>;
}

export function AirportDot() {
  return (
    <span aria-hidden="true" className="w-5 h-5 rounded-full bg-on-surface text-surface flex items-center justify-center shadow">
      <span className="material-symbols-outlined text-[12px]">flight</span>
    </span>
  );
}

type Props = {
  selected: DestinationId | null;
  highlighted: DestinationId | null;
  visible: DestinationId[];
  /** Zones fermées à une partie du séjour. */
  unavailable: DestinationId[];
  priceOf: (id: DestinationId) => string;
  onHover: (id: DestinationId | null) => void;
  /** Amène la carte de la zone à l'écran dans la liste. */
  onShow: (id: DestinationId) => void;
};

export function DestinationMap({ selected, highlighted, visible, unavailable, priceOf, onHover, onShow }: Props) {
  const ids = Object.keys(MAP_ZONES) as DestinationId[];
  const [current, setCurrent] = useState<DestinationId | null>(null);
  const pins = useRef<Partial<Record<DestinationId, HTMLButtonElement | null>>>({});
  const tabStop = current ?? selected ?? ORDER[0];
  const tx = useDestinationText();

  const move = (e: KeyboardEvent<HTMLButtonElement>, id: DestinationId) => {
    const i = ORDER.indexOf(id);
    const to: Record<string, number> = {
      ArrowDown: i + 1,
      ArrowRight: i + 1,
      ArrowUp: i - 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: ORDER.length - 1,
    };
    if (!(e.key in to)) return;
    e.preventDefault();
    const next = ORDER[(to[e.key] + ORDER.length) % ORDER.length];
    setCurrent(next);
    pins.current[next]?.focus();
  };

  return (
    <div className="relative mx-auto aspect-[388/720] h-[520px] lg:h-[clamp(360px,calc(100vh_-_31rem),600px)]">
      <svg aria-label={tx.mapAlt} className="absolute inset-0 w-full h-full overflow-visible" role="img" viewBox={`0 0 ${W} ${H}`}>
        <path className="fill-surface-container-lowest stroke-outline" d={coastPath} strokeLinejoin="round" strokeWidth="1.5" />
        {(() => {
          const nb = project(MAP_ZONES["nosy-be"].at);
          return <ellipse className="fill-surface-container-lowest stroke-outline" cx={nb.x} cy={nb.y} rx="7" ry="5" strokeWidth="1.2" />;
        })()}
        {(() => {
          const sm = project([49.9, -16.9]);
          return (
            <ellipse
              className="fill-surface-container-lowest stroke-outline"
              cx={sm.x}
              cy={sm.y}
              rx="3"
              ry="13"
              strokeWidth="1.2"
              transform={`rotate(20 ${sm.x} ${sm.y})`}
            />
          );
        })()}
        {ids.map((id) => (
          <path
            className="stroke-primary"
            d={flightPath(MAP_ZONES[id].at)}
            fill="none"
            key={id}
            opacity={id === selected || id === highlighted ? 0.9 : 0.35}
            strokeDasharray="5 5"
            strokeWidth={id === selected ? 2 : 1.5}
          />
        ))}
      </svg>

      {REGION_LABELS.map((r, i) => (
        <span
          aria-hidden="true"
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] font-bold tracking-[0.12em] text-on-surface-variant pointer-events-none"
          key={r.name}
          style={{ ...at(r.at), rotate: r.rotate ? `${r.rotate}deg` : undefined }}
        >
          {tx.mapRegions[i]}
        </span>
      ))}

      <div aria-describedby="destination-map-keys" aria-label={tx.pinsGroup} className="absolute inset-0 pointer-events-none" role="group">
        {ORDER.map((id) => {
          const zone = MAP_ZONES[id];
          const isSelected = id === selected;
          const isHighlighted = id === highlighted;
          const closed = unavailable.includes(id);
          const dimmed = !visible.includes(id) && !isSelected;
          const detail = closed ? tx.pinClosed : tx.pinFrom(priceOf(id));
          return (
            <button
              aria-label={tx.pinAria(zone.name, detail, isSelected)}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full pointer-events-auto transition-opacity focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-on-surface ${
                isHighlighted || isSelected ? "z-30" : "z-20"
              } ${dimmed ? "opacity-40" : closed && !isSelected ? "grayscale" : ""}`}
              key={id}
              onBlur={() => onHover(null)}
              onClick={() => onShow(id)}
              onFocus={() => {
                setCurrent(id);
                onHover(id);
              }}
              onKeyDown={(e) => move(e, id)}
              onMouseEnter={() => onHover(id)}
              onMouseLeave={() => onHover(null)}
              ref={(el) => {
                pins.current[id] = el;
              }}
              style={at(zone.at)}
              tabIndex={id === tabStop ? 0 : -1}
              type="button"
            >
              <span className="block transition-transform motion-reduce:transition-none group-hover:scale-125 group-focus-visible:scale-125">
                <ZoneDot selected={isSelected} />
              </span>
              <span
                className={`absolute top-1/2 -translate-y-1/2 ${zone.side === "left" ? "right-full" : "left-full"} whitespace-nowrap rounded px-1.5 py-0.5 text-[12px] font-bold shadow transition-colors ${
                  isHighlighted
                    ? "bg-on-surface text-surface"
                    : isSelected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-lowest text-on-surface"
                }`}
              >
                {zone.name}
                {closed && !isHighlighted && <span className="font-medium"> · {tx.pinClosedTag}</span>}
                {isHighlighted && <span className="font-medium"> · {detail}</span>}
              </span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" id="destination-map-keys">
        {tx.pinKeys}
      </p>

      {CIRCUIT_SPOTS.map((s, i) => (
        <Link
          aria-label={tx.circuitAria(tx.circuitSpots[i])}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 p-1.5 group rounded-full focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
          href={s.href}
          key={s.name}
          style={at(s.at)}
        >
          <span className="block transition-transform motion-reduce:transition-none group-hover:scale-125 group-focus-visible:scale-125">
            <CircuitDot />
          </span>
          <span className="absolute left-full top-1/2 -translate-y-1/2 -ml-0.5 whitespace-nowrap rounded px-1 text-[12px] font-semibold text-secondary bg-surface-container-lowest/90 group-hover:underline group-focus-visible:underline">
            {tx.circuitSpots[i]}
          </span>
        </Link>
      ))}

      <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={at(TANA)}>
        <AirportDot />
        <span className="absolute bottom-full mb-0.5 whitespace-nowrap rounded px-1 text-[12px] font-bold text-on-surface bg-surface-container-lowest/90">
          Antananarivo
        </span>
      </div>
    </div>
  );
}
