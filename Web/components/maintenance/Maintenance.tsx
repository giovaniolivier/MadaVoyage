"use client";

import { createContext, useContext, useEffect, useState } from "react";

const NOTIFY_KEY = "mv_maintenance_notify";
const START_PERCENT = 82;
const REMAINING_SECONDS = 38 * 60;

export function MaintenanceProgress() {
  const [left, setLeft] = useState(REMAINING_SECONDS);

  useEffect(() => {
    const end = Date.now() + REMAINING_SECONDS * 1000;
    const id = window.setInterval(() => {
      const next = Math.max(0, Math.round((end - Date.now()) / 1000));
      setLeft(next);
      if (next === 0) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const percent = Math.round(START_PERCENT + ((100 - START_PERCENT) * (REMAINING_SECONDS - left)) / REMAINING_SECONDS);
  const minutes = Math.floor(left / 60);
  const seconds = String(left % 60).padStart(2, "0");
  const done = left === 0;

  return (
    <div className="mt-space-sm bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-sm max-w-2xl">
      <div className="flex items-center justify-between text-on-surface">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-primary text-[20px] ${done ? "" : "animate-spin"}`}>
            {done ? "check_circle" : "sync"}
          </span>
          <span className="font-label-lg text-label-lg text-on-surface" id="maintenance-progress-label">
            Maintenance système &amp; API partenaires
          </span>
        </div>
        <span className="font-headline-sm text-headline-sm text-primary font-bold">{percent}%</span>
      </div>

      <div
        aria-labelledby="maintenance-progress-label"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        className="w-full bg-surface-variant h-3 rounded-full overflow-hidden"
        role="progressbar"
      >
        <div
          className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-1">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
          {done ? (
            <strong>Réouverture imminente, actualisez la page</strong>
          ) : (
            <>
              Temps estimé restant :{" "}
              <strong className="tabular-nums">
                {minutes} min {seconds} s
              </strong>
            </>
          )}
        </span>
        <span className="text-secondary font-semibold">Étape finale : Contrôle d'intégrité</span>
      </div>
    </div>
  );
}

export function NotifyForm() {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    setSaved(window.localStorage.getItem(NOTIFY_KEY));
  }, []);

  return (
    <>
      <form
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-xs mt-space-sm max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          const value = email.trim();
          window.localStorage.setItem(NOTIFY_KEY, value);
          setSaved(value);
          setEmail("");
        }}
      >
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            mail
          </span>
          <label className="sr-only" htmlFor="notify-email">
            Adresse email
          </label>
          <input
            autoComplete="email"
            className="w-full h-12 pl-11 pr-4 bg-surface rounded font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm"
            id="notify-email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email pour être alerté"
            required
            type="email"
            value={email}
          />
        </div>
        <button
          className="h-12 px-space-lg rounded bg-primary hover:bg-primary/90 text-on-primary font-label-lg text-label-lg transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 flex-shrink-0"
          type="submit"
        >
          <span>Me notifier</span>
          <span className="material-symbols-outlined text-[18px]">notifications_active</span>
        </button>
      </form>
      <div aria-live="polite" role="status">
        {saved && (
          <p className="text-secondary font-label-sm text-label-sm flex items-center gap-1.5 -mt-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Demande enregistrée pour {saved}. Vous recevrez une alerte prioritaire dès la réouverture.
          </p>
        )}
      </div>
    </>
  );
}

type Bulletin = { updatedAt: number; refreshing: boolean; refresh: () => void };

const BulletinContext = createContext<Bulletin | null>(null);

function useBulletin() {
  const ctx = useContext(BulletinContext);
  if (!ctx) throw new Error("useBulletin doit être utilisé dans <BulletinProvider>");
  return ctx;
}

export function BulletinProvider({ children }: { children: React.ReactNode }) {
  const [updatedAt, setUpdatedAt] = useState(() => Date.now() - 22 * 60_000);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setUpdatedAt(Date.now());
      setRefreshing(false);
    }, 800);
  };

  return <BulletinContext.Provider value={{ updatedAt, refreshing, refresh }}>{children}</BulletinContext.Provider>;
}

export function BulletinTimestamp() {
  const { updatedAt, refreshing } = useBulletin();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const minutes = Math.max(0, Math.floor((Math.max(now, updatedAt) - updatedAt) / 60_000));
  const label = refreshing
    ? "Mise à jour en cours…"
    : minutes === 0
      ? "Relevé terrain : à l'instant"
      : `Relevé terrain : il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;

  return (
    <span
      aria-live="polite"
      className="font-label-sm text-label-sm bg-surface-container px-3 py-1 rounded-full text-on-surface font-semibold"
    >
      {label}
    </span>
  );
}

export function BulletinRefreshButton() {
  const { refreshing, refresh } = useBulletin();
  return (
    <button
      aria-busy={refreshing}
      className="px-3 py-1.5 rounded-full bg-surface text-primary font-label-sm text-label-sm hover:bg-surface-container-high transition-colors shadow-sm flex items-center gap-1 flex-shrink-0 disabled:opacity-70"
      disabled={refreshing}
      onClick={refresh}
      type="button"
    >
      <span className={`material-symbols-outlined text-[14px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
      {refreshing ? "Actualisation…" : "Rafraîchir"}
    </button>
  );
}
