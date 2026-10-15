"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Dialog from "@/components/ui/Dialog";
import { BALANCE_DUE_DAYS, CANCELLATION, DEPOSIT_RATE, SOLIDARITY_RATE } from "@/lib/site";
import { mga } from "@/components/reservation/pricing";

const SELECTION_KEY = "mv_lodge_manga_soa";
const FAVORITES_KEY = "mv_favorite_lodges";
const LODGE_ID = "manga-soa-lodge";

const eur = (n: number) => `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} €`;
export const ROOMS = {
  baobab: { name: "Suite Baobab", view: "Vue Océan", price: 85, maxAdults: 2, capacity: 3 },
  ylang: { name: "Bungalow Ylang-Ylang", view: "Vue Jardin Fleuri", price: 70, maxAdults: 2, capacity: 2 },
  ravinala: { name: "Villa Familiale Ravinala", view: "Piscine Privative", price: 130, maxAdults: 4, capacity: 6 },
} as const;

export type RoomId = keyof typeof ROOMS;

type Selection = { room: RoomId; arrival: string; nights: number; adults: number; children: number };

const DEFAULT_SELECTION: Selection = { room: "baobab", arrival: "2026-10-14", nights: 10, adults: 2, children: 1 };

const parseDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function formatStay(arrival: string, nights: number) {
  const start = parseDate(arrival);
  const end = addDays(start, nights);
  const long = (d: Date, withYear: boolean) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", ...(withYear ? { year: "numeric" } : {}) });
  return `${long(start, start.getFullYear() !== end.getFullYear())} au ${long(end, true)}`;
}

export const fits = (room: RoomId, adults: number, children: number) =>
  adults <= ROOMS[room].maxAdults && adults + children <= ROOMS[room].capacity;

type LodgeState = Selection & {
  update: (patch: Partial<Selection>) => void;
};

const LodgeContext = createContext<LodgeState | null>(null);

function useLodge() {
  const ctx = useContext(LodgeContext);
  if (!ctx) throw new Error("useLodge doit être utilisé dans <LodgeProvider>");
  return ctx;
}

export function LodgeProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>(DEFAULT_SELECTION);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SELECTION_KEY);
      if (stored) setSelection({ ...DEFAULT_SELECTION, ...JSON.parse(stored) });
    } catch {
      window.localStorage.removeItem(SELECTION_KEY);
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current) window.localStorage.setItem(SELECTION_KEY, JSON.stringify(selection));
  }, [selection]);

  const update = useCallback((patch: Partial<Selection>) => setSelection((s) => ({ ...s, ...patch })), []);

  return <LodgeContext.Provider value={{ ...selection, update }}>{children}</LodgeContext.Provider>;
}

const ACTION_BUTTON =
  "h-10 px-4 rounded-full bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-2 font-label-md text-label-md shadow-sm";

export function LodgeActions() {
  const [favorite, setFavorite] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    try {
      setFavorite((JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]") as string[]).includes(LODGE_ID));
    } catch {
      window.localStorage.removeItem(FAVORITES_KEY);
    }
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const flash = (message: string) => {
    setNotice(message);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(null), 4000);
  };

  const toggleFavorite = () => {
    let list: string[] = [];
    try {
      list = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]");
    } catch {}
    const next = list.includes(LODGE_ID) ? list.filter((id) => id !== LODGE_ID) : [...list, LODGE_ID];
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    setFavorite(next.includes(LODGE_ID));
    flash(next.includes(LODGE_ID) ? "Manga Soa Lodge ajouté à vos favoris" : "Manga Soa Lodge retiré de vos favoris");
  };

  const share = async () => {
    const data = { title: "Manga Soa Lodge 4★ · Nosy Be", url: window.location.href };
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
      flash("Lien du lodge copié dans le presse-papiers");
    } catch {
      flash("Copie impossible : utilisez l'adresse de la page");
    }
  };

  return (
    <div className="flex flex-col items-start lg:items-end gap-1 shrink-0">
      <div className="flex flex-wrap items-center gap-space-xs">
        <button className={ACTION_BUTTON} onClick={share} type="button">
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span>Partager</span>
        </button>
        <button aria-pressed={favorite} className={ACTION_BUTTON} onClick={toggleFavorite} type="button">
          <span
            className="material-symbols-outlined text-[18px] text-tertiary"
            style={favorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
          <span>{favorite ? "Dans mes favoris" : "Favoris"}</span>
        </button>
        <a
          className="h-10 px-4 rounded-full bg-surface-container-low text-primary hover:bg-surface-container-high transition-all flex items-center gap-2 font-label-md text-label-md"
          href="https://www.google.com/maps/search/?api=1&query=Befefika%2C%20Nosy%20Be%2C%20Madagascar"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined text-[18px]">map</span>
          <span>Voir sur la carte</span>
        </a>
      </div>
      <p aria-live="polite" className="min-h-[1.25rem] font-body-sm text-body-sm text-secondary" role="status">
        {notice}
      </p>
    </div>
  );
}

const IMG = "https://lh3.googleusercontent.com/";

const PHOTOS = [
  {
    src: `${IMG}aida-public/AB6AXuCicxaEeHzZN_Dv1iG36Qhi0mahVWg65VNejSnrL1bJsPeocAV9rUgD-ShT8E91nKmBRv7U32wdHxsH1zVjpEyOqeLey3bXG_E_eckmfPg4k4mhypWPy-TUHvRJrN-_S9w-TA1n7vlZAF3dWFGb9SZc8RSaPXvrvXFB7xNp7a0l6CBqiOm5jRIYJlw3O91PLFFq4E6YBqK7vtdcmaO9sTeuxaLIZaDq1ZyM86XDaIWk4vF-6K8z43Y`,
    alt: "Bungalows en bois de Manga Soa Lodge perchés sur les rochers de granit au-dessus des eaux turquoise de Nosy Be, au coucher du soleil",
    caption: "Écrin de verdure en bordure du canal du Mozambique",
  },
  {
    src: `${IMG}aida-public/AB6AXuDL-wHS51WRhaGF3P4_nG1vsrxEmHcyj9H2II2gb9dGwubwt6V792bvJpV4MhDFrFPus7Q-dbIiJK1jjjEN3EdB4JxerYC3JH7BybEWv0VoAB3Idw0SCMiHFsc_QubZz_feOjDCWLKhFlY6LAKH1wx_Yg5OZNbweHNXArS_nP8rOX4Ryvf3GCeI44IKOMpAO6ClUvNo53C47aKCE3c8oXtl-RUv9DWz3rpoP1SrATHEPuCGDOuWTPc`,
    alt: "Intérieur de la Suite Baobab : lit à baldaquin en bois exotique, moustiquaire en lin et baie vitrée sur la forêt",
    caption: "Suite Baobab & Baldaquin",
  },
  {
    src: `${IMG}aida-public/AB6AXuAQgOLbjBnqbUu5hIAzbkjwgV1pD4ifw4Rv_l1gzI8mcDYi27F7ARaW258zeH4Fy1SCkrIMCFwaDdR3lCVrUj-XGikNXltz_49ZMfcM68_AWMfCGXLRCeZGGYdQEegYx8pr5ZKKOLd9vsf-SiMnC7vOWmDu6-vQjgsuFBsD2EaReAPQiH5MtqBnBOzOTyDQ37A-1QdBV_5tYnFcv4YYPTziX3sjMyvr7SmvsLf18goCfRp-NwD5TKI`,
    alt: "Terrasse privée sur pilotis avec chaises longues en teck face au lagon",
    caption: "Terrasse privée sur l'Océan",
  },
  {
    src: `${IMG}aida-public/AB6AXuB6CmRhaulvMBjTYMqndmvSRTAyYprVv5uG226aczKSgn0LaqbHfebEIZr1zLK2C6QiZhEGZ31Q1uI2i6GSfshN0WAMwmmpfqPsnS82x-tOI1d0ey9pEBU4LqeEMS7Jdt0v4Cxs42EktvRQvOIGtqIh7w5JWEkZMUZmFP6p_7pTWjDNmISZoGBGJTd9tIlGymLJ9oA5tFM2HIeGM0awRPV8DEjnIy68vaVxkP9sh1HHsE6dis3JLjc`,
    alt: "Restaurant en plein air dressé au coucher du soleil sur la baie de Befefika",
    caption: "Restaurant La Table Locavore",
  },
  {
    src: `${IMG}aida-public/AB6AXuDPEfInNxZ_eX0hMc2hkRevUFjRLIa5X5BT5asgu2DjPnlbqAyhek7eA7jV6VIRi_IP9NEpuY1Cjh95qgDsPi7pTgZtmwpNFolVoh8XKI1byOvki9U6Zj4KE6T6Ud7hS3OGtozeLXLFGnFq1wYt87BZkBxqCleSglV30h6SmBbr4QaoFW1F3XI5TK5JiTy9pQONPoFBtKydzaNPHEhTHvXokg8N5MEeaAkuzusnIKZlT73Elcn6roc`,
    alt: "Crique de sable doré bordée de palmiers avec une pirogue à balancier sur le rivage",
    caption: "Plage privée & Pirogue",
  },
];

function Lightbox({ start, onClose }: { start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const photo = PHOTOS[index];
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + PHOTOS.length) % PHOTOS.length), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);

  const nav =
    "w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center";

  return (
    <Dialog icon="photo_library" onClose={onClose} size="lg" title="Galerie Manga Soa Lodge">
      <figure className="flex flex-col gap-space-xs">
        <img alt={photo.alt} className="w-full aspect-[4/3] object-cover rounded" src={photo.src} />
        <figcaption className="flex items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
          <span>{photo.caption}</span>
          <span aria-live="polite" className="font-label-sm text-label-sm shrink-0">
            {index + 1} / {PHOTOS.length}
          </span>
        </figcaption>
      </figure>
      <div className="flex items-center justify-between gap-space-sm">
        <button aria-label="Photo précédente" className={nav} onClick={() => go(-1)} type="button">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="flex gap-1.5 overflow-x-auto">
          {PHOTOS.map((p, i) => (
            <button
              key={p.src}
              aria-current={i === index ? "true" : undefined}
              aria-label={`Voir la photo ${i + 1} : ${p.caption}`}
              className={`w-14 h-10 rounded overflow-hidden shrink-0 ${i === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"}`}
              onClick={() => setIndex(i)}
              type="button"
            >
              <img alt="" className="w-full h-full object-cover" src={p.src} />
            </button>
          ))}
        </div>
        <button aria-label="Photo suivante" className={nav} onClick={() => go(1)} type="button">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </Dialog>
  );
}

export function LodgeGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const [main, ...rest] = PHOTOS;

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-space-sm md:h-[480px] mb-space-xl rounded-lg overflow-hidden shadow-md bg-surface-container-low p-2">
      <button
        aria-label={`Agrandir : ${main.caption}`}
        className="md:col-span-7 h-72 md:h-full relative group overflow-hidden rounded-md text-left"
        onClick={() => setOpen(0)}
        type="button"
      >
        <img alt={main.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={main.src} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-on-primary">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md font-label-sm text-label-sm uppercase tracking-wider">
              Vue panoramique principale
            </span>
            <p className="font-headline-sm text-headline-sm font-semibold mt-1 drop-shadow-sm">{main.caption}</p>
          </div>
          <span className="shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm shadow-md">
            <span className="material-symbols-outlined text-[16px]">photo_camera</span> 1 / {PHOTOS.length}
          </span>
        </div>
      </button>

      <div className="md:col-span-5 grid grid-cols-2 grid-rows-2 gap-space-sm h-72 md:h-full">
        {rest.map((photo, i) => {
          const last = i === rest.length - 1;
          return (
            <button
              key={photo.src}
              aria-label={last ? `Afficher les ${PHOTOS.length} photos` : `Agrandir : ${photo.caption}`}
              className="relative group overflow-hidden rounded-md"
              onClick={() => setOpen(last ? 0 : i + 1)}
              type="button"
            >
              <img
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={photo.src}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${last ? "from-black/70" : "from-black/50"} via-transparent to-transparent`}
              ></div>
              {last && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                  <span className="px-3 py-1.5 rounded-full bg-white text-on-surface font-label-md text-label-md shadow-lg flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">grid_view</span> Afficher les {PHOTOS.length} photos
                  </span>
                </div>
              )}
              <span className="absolute bottom-2 left-2 text-white font-label-sm text-label-sm font-medium drop-shadow-sm">
                {photo.caption}
              </span>
            </button>
          );
        })}
      </div>
      {open !== null && <Lightbox onClose={close} start={open} />}
    </section>
  );
}

export function RoomCard({ id, children }: { id: RoomId; children: React.ReactNode }) {
  const { room } = useLodge();
  const selected = room === id;
  return (
    <div
      className={`bg-surface-container-lowest p-space-lg rounded-lg relative flex flex-col md:flex-row gap-space-lg transition-all ${
        selected ? "shadow-md ring-2 ring-primary" : "shadow-sm opacity-90 hover:opacity-100"
      }`}
    >
      {selected && (
        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">check_circle</span> Hébergement retenu pour votre séjour
        </div>
      )}
      {children}
    </div>
  );
}

export function RoomSelectButton({ id, label }: { id: RoomId; label: string }) {
  const { room, adults, children, update } = useLodge();
  if (room === id) {
    return (
      <span className="h-10 px-5 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm">
        <span className="material-symbols-outlined text-[16px]">check</span> Inclus dans le devis
      </span>
    );
  }
  const ok = fits(id, adults, children);
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        className="h-10 px-4 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!ok}
        onClick={() => update({ room: id })}
        type="button"
      >
        {label}
      </button>
      {!ok && <span className="font-body-sm text-body-sm text-tertiary">Capacité insuffisante pour {adults + children} voyageurs</span>}
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const btn =
    "w-8 h-8 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center justify-between gap-space-sm">
      <span className="font-body-sm text-body-sm text-on-surface">{label}</span>
      <div className="flex items-center gap-2">
        <button aria-label={`Retirer : ${label}`} className={btn} disabled={value <= min} onClick={() => onChange(value - 1)} type="button">
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
        <span aria-live="polite" className="w-5 text-center font-label-md text-label-md font-bold">
          {value}
        </span>
        <button aria-label={`Ajouter : ${label}`} className={btn} disabled={value >= max} onClick={() => onChange(value + 1)} type="button">
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>
    </div>
  );
}

export function BookingSummary() {
  const router = useRouter();
  const { room, arrival, nights, adults, children, update } = useLodge();
  const [editing, setEditing] = useState<"dates" | "travelers" | null>(null);
  const [today, setToday] = useState<string | undefined>(undefined);

  useEffect(() => setToday(toIso(new Date())), []);

  const r = ROOMS[room];
  const total = r.price * nights;
  const travelers = adults + children;
  const ok = fits(room, adults, children);

  const toggle = (panel: "dates" | "travelers") => setEditing((p) => (p === panel ? null : panel));
  const editButton = (panel: "dates" | "travelers", label: string) => (
    <button
      aria-expanded={editing === panel}
      className="text-primary hover:underline font-label-sm text-label-sm font-semibold"
      onClick={() => toggle(panel)}
      type="button"
    >
      {editing === panel ? (
        "Fermer"
      ) : (
        <>
          Modifier<span className="sr-only"> {label}</span>
        </>
      )}
    </button>
  );

  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-xl ring-1 ring-black/5 flex flex-col gap-space-md">
      <div className="flex items-start justify-between border-b border-surface-container-high pb-space-md">
        <div>
          <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">Séjour Personnalisé</span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">Manga Soa Lodge</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {r.name} · {r.view}
          </p>
        </div>
        <div className="text-right">
          <span className="font-headline-md text-headline-md font-extrabold text-primary">{eur(r.price)}</span>
          <p className="font-body-sm text-body-sm text-outline">/ nuit</p>
        </div>
      </div>

      <div className="flex flex-col gap-space-xs">
        <div className="p-3 bg-surface-container-low rounded-md flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">{formatStay(arrival, nights)}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{nights} nuits consécutives</span>
              </div>
            </div>
            {editButton("dates", "les dates")}
          </div>
          {editing === "dates" && (
            <div className="grid grid-cols-2 gap-space-sm">
              <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface-variant">
                Arrivée
                <input
                  className="h-10 px-2 rounded bg-surface-container-lowest text-on-surface font-body-sm text-body-sm"
                  min={today}
                  onChange={(e) => e.target.value && update({ arrival: e.target.value })}
                  type="date"
                  value={arrival}
                />
              </label>
              <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface-variant">
                Nuits
                <select
                  className="h-10 px-2 rounded bg-surface-container-lowest text-on-surface font-body-sm text-body-sm"
                  onChange={(e) => update({ nights: Number(e.target.value) })}
                  value={nights}
                >
                  {Array.from({ length: 19 }, (_, i) => i + 2).map((n) => (
                    <option key={n} value={n}>
                      {n} nuits
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="p-3 bg-surface-container-low rounded-md flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">group</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  {travelers} voyageur{travelers > 1 ? "s" : ""}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {adults} adulte{adults > 1 ? "s" : ""}
                  {children > 0 && `, ${children} enfant${children > 1 ? "s" : ""}`}
                </span>
              </div>
            </div>
            {editButton("travelers", "les voyageurs")}
          </div>
          {editing === "travelers" && (
            <div className="flex flex-col gap-space-xs">
              <Stepper label="Adultes" max={4} min={1} onChange={(n) => update({ adults: n })} value={adults} />
              <Stepper label="Enfants (2-12 ans)" max={4} min={0} onChange={(n) => update({ children: n })} value={children} />
            </div>
          )}
        </div>
        {!ok && (
          <p className="font-body-sm text-body-sm text-tertiary flex items-start gap-1" role="alert">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            {r.name} accueille {r.maxAdults} adultes et {r.capacity} personnes au maximum. Choisissez un autre hébergement.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-1 border-t border-surface-container-high">
        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>
            Hébergement ({eur(r.price)} × {nights} nuits)
          </span>
          <span className="font-medium text-on-surface">{eur(total)}</span>
        </div>
        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>Petit-déjeuner bio &amp; locavore ({travelers} pers.)</span>
          <span className="text-secondary font-medium">Inclus offert</span>
        </div>
        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>Taxes de séjour touristique &amp; Vignette ONTM</span>
          <span className="text-on-surface font-medium">Inclus</span>
        </div>
        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>Fonds Fihavanana ({SOLIDARITY_RATE})</span>
          <span className="text-secondary font-medium">Pris en charge</span>
        </div>
        <div className="pt-3 mt-1 border-t border-surface-container-high flex flex-col gap-1">
          <div className="flex items-baseline justify-between">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Total hébergement</span>
            <span aria-live="polite" className="font-headline-lg text-headline-lg font-extrabold text-primary leading-none">
              {eur(total)}
            </span>
          </div>
          <div className="text-right">
            <span className="font-label-md text-label-md text-outline font-medium">soit ~ {mga(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-space-xs pt-2">
        <button
          className="w-full h-12 rounded-full bg-tertiary text-on-tertiary hover:bg-tertiary-container hover:text-on-tertiary-container transition-all active:scale-[0.98] font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(167,57,30,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!ok}
          onClick={() => {
            const params = new URLSearchParams({
              hebergement: LODGE_ID,
              chambre: room,
              arrivee: arrival,
              nuits: String(nights),
              adultes: String(adults),
              enfants: String(children),
            });
            router.push(`/reservation/options?${params}`);
          }}
          type="button"
        >
          <span>Intégrer à mon Séjour Nosy Be</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <p className="font-body-sm text-body-sm text-center text-outline-variant mt-1">Aucun débit immédiat · Validation étape par étape</p>
      </div>

      <div className="p-3 bg-surface-container-low/60 rounded-md flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">check_circle</span>
          <span>
            <strong>Annulation gratuite</strong> jusqu'au{" "}
            {addDays(parseDate(arrival), -CANCELLATION.freeDays).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">credit_card</span>
          <span>
            Acompte de {DEPOSIT_RATE} à la commande ({eur(total * 0.3)}), solde {BALANCE_DUE_DAYS} jours avant le départ
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">support_agent</span>
          <span>
            Conciergerie MadaVoyage joignable <strong>24/7 sur place</strong> à Nosy Be
          </span>
        </div>
      </div>

      <button
        className="w-full py-2 text-center text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md flex items-center justify-center gap-1"
        onClick={() => window.print()}
        type="button"
      >
        <span className="material-symbols-outlined text-[16px]">print</span>
        <span>Imprimer la fiche lodge (PDF)</span>
      </button>
    </div>
  );
}
