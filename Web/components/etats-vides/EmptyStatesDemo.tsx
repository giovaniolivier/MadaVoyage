"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";

type DemoState = "search" | "carnet";

type DemoContextValue = {
  state: DemoState;
  setState: (state: DemoState) => void;
  openAdvisor: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo doit être utilisé dans <EmptyStatesProvider>");
  return ctx;
}

export function EmptyStatesProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<DemoState>("search");
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const closeAdvisor = useCallback(() => setAdvisorOpen(false), []);

  const setState = (next: DemoState) => {
    setStateRaw(next);
    document.getElementById("empty-state-views")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <DemoContext.Provider value={{ state, setState, openAdvisor: () => setAdvisorOpen(true) }}>
      {children}
      {advisorOpen && <AdvisorDialog onClose={closeAdvisor} />}
    </DemoContext.Provider>
  );
}

const TAB_BASE = "px-space-md py-2 rounded-full font-label-md text-label-md transition-all duration-200 flex items-center gap-2";

export function StateTabs() {
  const { state, setState } = useDemo();
  const tabs: { id: DemoState; icon: string; label: string }[] = [
    { id: "search", icon: "search_off", label: "1. Recherche sans résultat" },
    { id: "carnet", icon: "menu_book", label: "2. Carnet Nouveau Compte" },
  ];
  return (
    <div className="bg-surface-container p-1 rounded-full flex items-center shadow-sm" role="group" aria-label="Scénario affiché">
      {tabs.map((t) => (
        <button
          key={t.id}
          aria-pressed={state === t.id}
          className={`${TAB_BASE} ${state === t.id ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
          onClick={() => setState(t.id)}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export function StateViews({ search, carnet }: { search: React.ReactNode; carnet: React.ReactNode }) {
  const { state } = useDemo();
  return (
    <div className="scroll-mt-28" id="empty-state-views">
      <div className={`${state === "search" ? "flex" : "hidden"} flex-col gap-space-xl`}>{search}</div>
      <div className={`${state === "carnet" ? "flex" : "hidden"} flex-col gap-space-xl`}>{carnet}</div>
    </div>
  );
}

export function SwitchStateButton({ to, className, children }: { to: DemoState; className?: string; children: React.ReactNode }) {
  const { state, setState } = useDemo();
  return (
    <button aria-pressed={state === to} className={className} onClick={() => setState(to)} type="button">
      {children}
    </button>
  );
}

export function OpenAdvisorButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { openAdvisor } = useDemo();
  return (
    <button aria-haspopup="dialog" className={className} onClick={openAdvisor} type="button">
      {children}
    </button>
  );
}

const INITIAL_FILTERS = [
  { id: "budget", label: "Budget max :", value: "300 €", tone: "tertiary" },
  { id: "region", label: "Région :", value: "Tsingy de Bemaraha", tone: "primary" },
  { id: "periode", label: "Période :", value: "Février (Saison des pluies)", tone: "tertiary" },
  { id: "style", label: "Style :", value: "Bivouac de luxe éco-responsable", tone: "secondary" },
] as const;

const TONE_TEXT = { primary: "text-primary", secondary: "text-secondary", tertiary: "text-tertiary" } as const;
const TONE_HOVER = { primary: "hover:text-primary", secondary: "hover:text-secondary", tertiary: "hover:text-tertiary" } as const;

export function FilterSummary() {
  const [filters, setFilters] = useState<readonly (typeof INITIAL_FILTERS)[number][]>(INITIAL_FILTERS);
  const cleared = filters.length === 0;

  return (
    <div className="bg-surface-container-low rounded-lg p-space-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md shadow-sm">
      <div className="flex flex-col gap-1" aria-live="polite">
        {cleared ? (
          <>
            <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Filtres réinitialisés</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface mt-1">
              <strong>28 expéditions éco-responsables</strong> sont à présent disponibles.{" "}
              <Link className="text-primary font-semibold underline hover:no-underline" href="/circuits">
                Voir les circuits
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px] text-tertiary">tune</span>
              <span>
                Filtres stricts appliqués (
                {filters.length < INITIAL_FILTERS.length ? "résultats en cours de recalcul" : "0 sanctuaire répertorié"})
              </span>
            </div>
            <ul className="flex flex-wrap items-center gap-2 mt-1">
              {filters.map((f) => (
                <li
                  key={f.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface text-on-surface font-label-sm text-label-sm shadow-sm"
                >
                  <span className={`${TONE_TEXT[f.tone]} font-bold`}>{f.label}</span> {f.value}
                  <button
                    aria-label={`Retirer le filtre ${f.label.replace(" :", "")} ${f.value}`}
                    className={`material-symbols-outlined text-[14px] text-outline rounded-full ${TONE_HOVER[f.tone]}`}
                    onClick={() => setFilters((prev) => prev.filter((x) => x.id !== f.id))}
                    type="button"
                  >
                    close
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
        {cleared ? (
          <button
            className="px-space-md py-2.5 rounded-full bg-surface text-on-surface-variant hover:bg-surface-container font-label-md text-label-md transition-all shadow-sm flex items-center gap-2"
            onClick={() => setFilters(INITIAL_FILTERS)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">undo</span>
            <span>Restaurer mes filtres</span>
          </button>
        ) : (
          <button
            className="px-space-md py-2.5 rounded-full bg-surface text-primary hover:bg-surface-container font-label-md text-label-md transition-all shadow-sm flex items-center gap-2"
            onClick={() => setFilters([])}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Réinitialiser en 1 clic</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function SmartAdjustment() {
  const { openAdvisor } = useDemo();
  const [applied, setApplied] = useState(false);

  return (
    <div
      className="mt-space-lg pt-space-md flex flex-wrap items-center gap-space-md bg-surface-container-low p-space-md rounded"
      aria-live="polite"
    >
      {applied ? (
        <>
          <span className="font-label-md text-label-md text-secondary font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">event_available</span>
            <span>Période mise à jour sur Mai 2027 : 4 départs confirmés vers les Tsingy de Bemaraha.</span>
          </span>
          <Link
            className="px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity shadow-sm"
            href="/circuits"
          >
            Voir les départs
          </Link>
          <button
            className="px-space-md py-2 rounded-full text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors"
            onClick={() => setApplied(false)}
            type="button"
          >
            Annuler l&apos;ajustement
          </button>
        </>
      ) : (
        <>
          <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">auto_fix_high</span>
            <span>Solution immédiate recommandée :</span>
          </span>
          <button
            className="px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity shadow-sm"
            onClick={() => setApplied(true)}
            type="button"
          >
            Ajuster automatiquement les dates sur Mai 2027
          </button>
          <button
            aria-haspopup="dialog"
            className="px-space-md py-2 rounded-full bg-surface text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors shadow-sm"
            onClick={openAdvisor}
            type="button"
          >
            Contacter l&apos;assistance
          </button>
        </>
      )}
    </div>
  );
}

function AdvisorDialog({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);
  const ids = useId();

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    textareaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      previous?.focus();
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setError(true);
      textareaRef.current?.focus();
      return;
    }
    setStatus("sending");
    timerRef.current = window.setTimeout(() => setStatus("sent"), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden="true" className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose}></div>
      <div
        aria-labelledby={`${ids}-title`}
        aria-modal="true"
        className="bg-surface rounded-xl max-w-lg w-full p-space-xl shadow-2xl relative flex flex-col gap-space-md"
        role="dialog"
      >
        <button
          aria-label="Fermer"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
        <div className="flex items-center gap-space-sm text-primary pr-8">
          <span className="material-symbols-outlined text-[28px]">support_agent</span>
          <h3 className="font-headline-md text-headline-md" id={`${ids}-title`}>
            Assistance itinérance MadaVoyage
          </h3>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col gap-space-md" role="status">
            <div className="flex items-start gap-space-sm p-space-md rounded bg-secondary/10 text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[22px]">mark_email_read</span>
              <p className="font-body-md text-body-md">
                Votre demande d&apos;itinéraire alternatif a été transmise à notre guide naturaliste. Une réponse avec 2 alternatives vous
                parviendra d&apos;ici 24 h.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm"
                onClick={onClose}
                type="button"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-space-md" noValidate onSubmit={submit}>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Laissez votre message à notre équipe basée à Antananarivo. Nous vous répondrons avec 2 alternatives équilibrées selon vos
              contraintes précises.
            </p>
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor={`${ids}-message`}>
                Vos priorités
              </label>
              <textarea
                ref={textareaRef}
                aria-describedby={error ? `${ids}-error` : undefined}
                aria-invalid={error}
                className="w-full bg-surface-container-low rounded p-3 font-body-md text-body-md text-on-surface outline-none focus:bg-surface focus:ring-2 focus:ring-primary shadow-inner"
                id={`${ids}-message`}
                maxLength={1000}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error && e.target.value.trim().length >= 10) setError(false);
                }}
                placeholder="Ex: Voyage de 10 jours en février, passionné de faune marine et flore, budget souple..."
                rows={3}
                value={message}
              />
              {error && (
                <p className="font-body-sm text-body-sm text-error flex items-center gap-1" id={`${ids}-error`} role="alert">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  Décrivez vos priorités en quelques mots (10 caractères minimum).
                </p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                className="px-space-md py-2 rounded-full text-on-surface-variant font-label-md text-label-md hover:bg-surface-container"
                onClick={onClose}
                type="button"
              >
                Annuler
              </button>
              <button
                className="px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm disabled:opacity-60"
                disabled={status === "sending"}
                type="submit"
              >
                {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande (Gratuit)"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
