"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type CookiePreferences = {
  itinerary: boolean;
  analytics: boolean;
};

type StoredConsent = CookiePreferences & { savedAt: string };

type CookieConsentValue = {
  /** null tant que l'utilisateur n'a fait aucun choix (ou avant lecture du stockage). */
  consent: StoredConsent | null;
  openManager: () => void;
};

const STORAGE_KEY = "mv_cookie_consent";
const TRANSITION_MS = 300;

const CookieConsentContext = createContext<CookieConsentValue | null>(null);

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent doit être utilisé dans <CookieConsentProvider>");
  return ctx;
}

function readStoredConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (typeof parsed.itinerary !== "boolean" || typeof parsed.analytics !== "boolean") return null;
    return { itinerary: parsed.itinerary, analytics: parsed.analytics, savedAt: String(parsed.savedAt ?? "") };
  } catch {
    return null;
  }
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<StoredConsent | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState<CookiePreferences>({ itinerary: true, analytics: true });
  const closeTimer = useRef<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const show = useCallback((prefs: CookiePreferences) => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    setDraft({ itinerary: prefs.itinerary, analytics: prefs.analytics });
    setMounted(true);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setVisible(true)));
  }, []);

  useEffect(() => {
    const stored = readStoredConsent();
    setConsent(stored);
    if (!stored) show({ itinerary: true, analytics: true });
  }, [show]);

  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    },
    []
  );

  const hide = useCallback(() => {
    setVisible(false);
    closeTimer.current = window.setTimeout(() => {
      setMounted(false);
      openerRef.current?.focus();
      openerRef.current = null;
    }, TRANSITION_MS);
  }, []);

  const save = useCallback(
    (prefs: CookiePreferences) => {
      const next: StoredConsent = { ...prefs, savedAt: new Date().toISOString() };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Stockage indisponible (navigation privée) : le choix reste valable pour la session.
      }
      setConsent(next);
      setDraft(prefs);
      hide();
    },
    [hide]
  );

  const openManager = useCallback(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    show(consent ?? { itinerary: true, analytics: true });
  }, [consent, show]);

  return (
    <CookieConsentContext.Provider value={{ consent, openManager }}>
      {children}
      {mounted && (
        <CookieBanner
          draft={draft}
          visible={visible}
          onDraftChange={setDraft}
          onAcceptAll={() => save({ itinerary: true, analytics: true })}
          onSave={() => save(draft)}
          onRejectOptional={() => save({ itinerary: false, analytics: false })}
          onClose={() => (consent ? hide() : save({ itinerary: false, analytics: false }))}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

type CookieBannerProps = {
  draft: CookiePreferences;
  visible: boolean;
  onDraftChange: (prefs: CookiePreferences) => void;
  onAcceptAll: () => void;
  onSave: () => void;
  onRejectOptional: () => void;
  onClose: () => void;
};

function CookieBanner({ draft, visible, onDraftChange, onAcceptAll, onSave, onRejectOptional, onClose }: CookieBannerProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  return (
    <aside
      ref={panelRef}
      aria-label="Gestion des cookies"
      aria-modal="false"
      role="dialog"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      className={`fixed bottom-6 right-6 left-6 sm:left-auto z-40 sm:w-full max-w-md bg-surface-container-lowest/95 backdrop-blur-xl rounded-lg shadow-2xl p-space-md flex flex-col gap-space-md outline-none transition-all duration-300 motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
      }`}
    >
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs">
          <span className="text-[24px] leading-none" aria-hidden="true">🍪</span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">Respect de votre vie privée</span>
            <span className="font-label-sm text-label-sm text-secondary font-medium">Sobriété Numérique &amp; Zéro Pub Tiers</span>
          </div>
        </div>
        <button
          aria-label="Fermer la bannière"
          className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        Nous limitons nos traceurs au strict nécessaire opérationnel : sauvegarde de votre itinéraire, conversion instantanée EUR/MGA et sécurité bancaire. Aucun cookie publicitaire tiers n&apos;est revendu.
      </p>

      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">Cookies Essentiels</span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Session, sécurisation &amp; devises</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[10px] font-bold">Obligatoire</span>
        </div>

        <ConsentToggle
          icon="travel_explore"
          iconClassName="text-secondary"
          title="Simulateur & Carnet"
          description="Garde en mémoire vos étapes"
          checked={draft.itinerary}
          checkedTrackClassName="peer-checked:bg-secondary"
          onChange={(itinerary) => onDraftChange({ ...draft, itinerary })}
        />
        <ConsentToggle
          icon="bar_chart"
          iconClassName="text-on-surface-variant"
          title="Mesure d'Audience Matomo"
          description="Statistiques éco-responsables (IP masquée)"
          checked={draft.analytics}
          checkedTrackClassName="peer-checked:bg-primary"
          onChange={(analytics) => onDraftChange({ ...draft, analytics })}
        />
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <button
          className="w-full py-2.5 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-on-primary-container transition-all text-center"
          onClick={onAcceptAll}
          type="button"
        >
          Tout Accepter
        </button>
        <div className="flex items-center gap-2">
          <button
            className="flex-1 py-2 px-3 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-colors text-center font-semibold"
            onClick={onSave}
            type="button"
          >
            Enregistrer les choix
          </button>
          <button
            className="flex-1 py-2 px-3 rounded-full bg-transparent font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors text-center underline"
            onClick={onRejectOptional}
            type="button"
          >
            Refuser les facultatifs
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 font-body-sm text-[11px] text-on-surface-variant text-center -mt-1">
        <span className="material-symbols-outlined text-[13px] text-secondary">verified</span>
        <span>Conforme CNIL &amp; Hébergement souverain Madagascar/France</span>
      </div>
    </aside>
  );
}

type ConsentToggleProps = {
  icon: string;
  iconClassName: string;
  title: string;
  description: string;
  checked: boolean;
  checkedTrackClassName: string;
  onChange: (checked: boolean) => void;
};

function ConsentToggle({ icon, iconClassName, title, description, checked, checkedTrackClassName, onChange }: ConsentToggleProps) {
  return (
    <label className="flex items-center justify-between p-2 rounded bg-surface-container-low cursor-pointer">
      <span className="flex items-center gap-2">
        <span className={`material-symbols-outlined text-[18px] ${iconClassName}`}>{icon}</span>
        <span className="flex flex-col">
          <span className="font-label-sm text-label-sm text-on-surface font-semibold">{title}</span>
          <span className="font-body-sm text-[11px] text-on-surface-variant">{description}</span>
        </span>
      </span>
      <span className="relative inline-flex items-center">
        <input aria-label={title} className="sr-only peer" type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span
          aria-hidden="true"
          className={`w-8 h-4 bg-surface-container-highest rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-surface-dim after:border after:rounded-full after:h-3 after:w-3 after:transition-all ${checkedTrackClassName}`}
        ></span>
      </span>
    </label>
  );
}

export function OpenCookieManagerButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { openManager } = useCookieConsent();
  return (
    <button className={className} onClick={openManager} type="button">
      {children}
    </button>
  );
}
