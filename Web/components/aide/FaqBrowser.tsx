"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FAQ_CATEGORIES, FAQ_ITEMS, categoryLabel, type FaqItem } from "./faq-data";
import { FAQ_LIST_ID, normalizeSearch, useFaqFilter } from "./FaqFilterContext";
import { SupportNow } from "./SupportStatus";
import { WHATSAPP } from "@/lib/site";

const FILTER_BASE =
  "px-space-md py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors flex items-center gap-1.5";
const FILTER_ACTIVE = "font-bold bg-primary text-on-primary shadow-sm";
const FILTER_IDLE = "font-semibold bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high";

const anchorOf = (id: string) => `faq-${id}`;

/** Questions montrées avant « Voir les … questions », dans cet ordre. */
const FEATURED_IDS = ["visa", "paludisme", "assurance", "vols-interieurs", "ariary", "annulation"];

const reviewedLabel = (iso: string) => {
  const date = new Date(`${iso}T12:00:00Z`);
  const text = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  return date.getUTCDate() === 1 ? text.replace(/^1 /, "1er ") : text;
};

function Feedback({ item }: { item: FaqItem }) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  if (answer === "yes")
    return (
      <p role="status" className="font-body-md text-body-md text-on-surface">
        Merci pour votre retour.
      </p>
    );
  if (answer === "no")
    return (
      <p role="status" className="font-body-md text-body-md text-on-surface">
        Merci. Notre équipe peut vous répondre directement :{" "}
        <a
          className="font-bold text-primary underline underline-offset-2"
          href={`${WHATSAPP.href}?text=${encodeURIComponent(`Bonjour, une question sur : ${item.question}`)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          contacter la conciergerie
        </a>
        .
      </p>
    );
  return (
    <div className="flex items-center gap-space-sm flex-wrap">
      <span className="font-body-md text-body-md text-on-surface">Cette réponse vous a-t-elle aidé ?</span>
      {(["yes", "no"] as const).map((value) => (
        <button
          key={value}
          className="h-9 px-space-md rounded-full border border-outline-variant font-label-md text-label-md font-bold text-on-surface hover:bg-surface-container-high"
          onClick={() => setAnswer(value)}
          type="button"
        >
          {value === "yes" ? "Oui" : "Non"}
        </button>
      ))}
    </div>
  );
}

function CopyLink({ id }: { id: string }) {
  const [copied, setCopied] = useState<boolean | null>(null);
  async function copy() {
    const url = `${location.origin}${location.pathname}#${anchorOf(id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      history.replaceState(null, "", `#${anchorOf(id)}`);
      setCopied(false);
    }
  }
  return (
    <span className="flex items-center gap-space-xs">
      <button
        className="h-9 px-space-sm rounded-full font-label-md text-label-md font-bold text-primary hover:bg-surface-container-high flex items-center gap-1"
        onClick={copy}
        type="button"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
          link
        </span>
        Lien vers cette question
      </button>
      <span role="status" className="font-body-md text-body-md text-on-surface-variant">
        {copied === true && "Lien copié."}
        {copied === false && "Lien affiché dans la barre d'adresse."}
      </span>
    </span>
  );
}

function Meta({ item }: { item: FaqItem }) {
  if (!item.reviewed && !item.sources && !item.medical) return null;
  return (
    <div className="flex flex-col gap-space-xs border-t border-outline-variant/50 pt-space-sm font-body-md text-body-md">
      {item.medical && (
        <p className="flex gap-space-xs text-on-surface">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary shrink-0">
            stethoscope
          </span>
          <span>
            Ces informations ne remplacent pas un avis médical : consultez un médecin ou un centre de médecine des voyages, idéalement 4 à 6
            semaines avant le départ.
          </span>
        </p>
      )}
      {item.reviewed && <p className="text-on-surface-variant">Mise à jour le {reviewedLabel(item.reviewed)}.</p>}
      {item.sources && (
        <p className="text-on-surface-variant">
          Sources officielles :{" "}
          {item.sources.map((s, i) => (
            <span key={s.href}>
              {i > 0 && " ; "}
              <a
                className="text-primary font-semibold underline underline-offset-2"
                href={s.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {s.label}
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}

export default function FaqBrowser({ sidebar }: { sidebar: React.ReactNode }) {
  const { query, setQuery, category, setCategory } = useFaqFilter();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [showAll, setShowAll] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const matching = useMemo(() => {
    const term = normalizeSearch(query);
    return FAQ_ITEMS.filter((item) => !term || normalizeSearch(`${item.question} ${item.keywords}`).includes(term));
  }, [query]);
  const filtered = matching.filter((item) => category === "all" || item.category === category);
  const limited = !showAll && category === "all" && !normalizeSearch(query);
  const visible = limited ? FEATURED_IDS.flatMap((id) => filtered.filter((item) => item.id === id)) : filtered;

  const allOpen = visible.length > 0 && visible.every((item) => openIds.has(item.id));

  /** Lien direct `#faq-visa` : ouvre la question et la fait défiler à l'écran, au chargement comme au changement d'ancre. */
  useEffect(() => {
    function openFromHash() {
      const id = location.hash.replace(/^#faq-/, "");
      if (!id || id === location.hash || !FAQ_ITEMS.some((item) => item.id === id)) return;
      setQuery("");
      setCategory("all");
      setShowAll(true);
      setOpenIds((prev) => new Set(prev).add(id));
      requestAnimationFrame(() => document.getElementById(anchorOf(id))?.scrollIntoView({ block: "start" }));
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [setQuery, setCategory]);

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setOpenIds(allOpen ? new Set() : new Set(visible.map((item) => item.id)));
  }

  /** Flèches haut et bas, Début et Fin : passage d'une question à l'autre. */
  function onHeaderKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    const headers = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-faq-header]") ?? []);
    const index = headers.indexOf(e.currentTarget);
    const target =
      e.key === "ArrowDown"
        ? headers[(index + 1) % headers.length]
        : e.key === "ArrowUp"
          ? headers[(index - 1 + headers.length) % headers.length]
          : e.key === "Home"
            ? headers[0]
            : e.key === "End"
              ? headers[headers.length - 1]
              : null;
    if (!target) return;
    e.preventDefault();
    target.focus();
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-space-md mb-space-lg">
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Réponses de notre équipe à Madagascar</p>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">Questions fréquentes</h2>
        </div>
        <button
          className="px-space-md py-1.5 rounded-full font-label-sm text-label-sm text-on-surface bg-surface-container-lowest shadow-sm hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
          onClick={toggleAll}
          disabled={visible.length === 0}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
            {allOpen ? "unfold_less" : "unfold_more"}
          </span>
          <span>{allOpen ? "Tout replier" : "Tout déplier"}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-space-sm mb-space-lg" role="group" aria-label="Filtrer par thématique">
        {FAQ_CATEGORIES.map((cat) => {
          const active = category === cat.id;
          const count = matching.filter((item) => cat.id === "all" || item.category === cat.id).length;
          return (
            <button
              key={cat.id}
              aria-pressed={active}
              className={`${FILTER_BASE} ${active ? FILTER_ACTIVE : FILTER_IDLE}`}
              onClick={() => setCategory(cat.id)}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                {cat.icon}
              </span>
              <span>
                {cat.label} ({count})
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <div ref={listRef} className="lg:col-span-8 flex flex-col gap-space-sm scroll-mt-28" id={FAQ_LIST_ID}>
          {visible.length === 0 && (
            <div
              className="bg-surface-container-lowest rounded p-space-lg shadow-sm flex flex-col items-center text-center gap-space-md"
              role="status"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-outline text-[36px]">
                search_off
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Aucune réponse{query && <> pour « {query} »</>}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Essayez un mot plus court ou une autre thématique. Sinon, posez votre question à notre équipe : elle vous répond en
                  français, anglais ou malgache.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-space-sm">
                <a
                  className="h-12 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center gap-space-xs shadow-sm hover:bg-on-primary-fixed-variant"
                  href={WHATSAPP.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                    support_agent
                  </span>
                  Contacter la conciergerie
                </a>
                <button
                  className="h-12 px-space-lg rounded-full border-2 border-outline-variant text-on-surface font-label-lg text-label-lg font-bold hover:bg-surface-container-high"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                >
                  Voir toutes les questions
                </button>
              </div>
              <SupportNow />
            </div>
          )}

          {visible.map((item) => {
            const open = openIds.has(item.id);
            const panelId = `faq-panel-${item.id}`;
            const headerId = `faq-header-${item.id}`;
            return (
              <div
                key={item.id}
                id={anchorOf(item.id)}
                className={`${open ? "bg-surface-container-low" : "bg-surface-container-lowest"} rounded shadow-sm transition-colors scroll-mt-28`}
              >
                <h3>
                  <button
                    id={headerId}
                    data-faq-header
                    className="w-full text-left flex items-center justify-between gap-space-md px-space-lg py-space-md rounded group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => toggle(item.id)}
                    onKeyDown={onHeaderKey}
                    aria-expanded={open}
                    aria-controls={panelId}
                    type="button"
                  >
                    <span className="flex items-center gap-space-md">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-surface-container-high text-primary">
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                          {item.icon}
                        </span>
                      </span>
                      <span className="font-label-lg text-label-lg md:text-[17px] text-on-surface font-bold group-hover:underline group-hover:decoration-primary underline-offset-4">
                        {item.question}
                        <span className="sr-only"> ({categoryLabel(item.category)})</span>
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`material-symbols-outlined text-on-surface-variant text-[24px] transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
                    >
                      expand_more
                    </span>
                  </button>
                </h3>
                {open && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-space-lg pb-space-lg text-on-surface-variant font-body-md text-body-md flex flex-col gap-space-sm"
                  >
                    {item.answer}
                    <Meta item={item} />
                    <div className="flex items-center justify-between gap-space-sm flex-wrap border-t border-outline-variant/50 pt-space-sm">
                      <Feedback item={item} />
                      <CopyLink id={item.id} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {limited && filtered.length > visible.length && (
            <button
              className="self-start h-11 px-space-lg rounded-full border-2 border-outline-variant text-on-surface font-label-lg text-label-lg font-bold hover:bg-surface-container-high flex items-center gap-space-xs"
              onClick={() => setShowAll(true)}
              type="button"
            >
              Voir les {filtered.length} questions
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                expand_more
              </span>
            </button>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-space-lg">{sidebar}</div>
      </div>
    </>
  );
}
