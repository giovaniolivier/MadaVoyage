"use client";

import { FAQ_ITEMS } from "./faq-data";
import { normalizeSearch, scrollToFaqList, useFaqFilter } from "./FaqFilterContext";

/** Chaque puce correspond à au moins une question de la FAQ ; une puce sans résultat n'est pas affichée. */
const QUICK_TAGS = [
  { query: "visa", label: "Visa", icon: "badge" },
  { query: "sante", label: "Santé", icon: "medical_services" },
  { query: "assurance", label: "Assurance", icon: "health_and_safety" },
  { query: "tsaradia", label: "Vols intérieurs", icon: "flight" },
  { query: "annul", label: "Annulation", icon: "event_busy" },
].filter((tag) => FAQ_ITEMS.some((item) => normalizeSearch(`${item.question} ${item.keywords}`).includes(tag.query)));

export default function FaqSearch() {
  const { query, setQuery, setCategory } = useFaqFilter();

  function search(q: string) {
    setQuery(q);
    setCategory("all");
    scrollToFaqList();
  }

  return (
    <>
      <form
        role="search"
        className="w-full max-w-2xl bg-surface-container-lowest rounded-full p-1.5 shadow-lg ring-1 ring-outline-variant flex items-center gap-space-sm mb-space-sm"
        onSubmit={(e) => {
          e.preventDefault();
          scrollToFaqList();
        }}
      >
        <div className="pl-space-md flex items-center text-primary">
          <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
            search
          </span>
        </div>
        <input
          className="flex-1 min-w-0 bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant"
          aria-label="Rechercher dans la FAQ"
          placeholder="Visa, vaccins, Ariary, bagages…"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="h-11 px-space-lg rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-all flex items-center gap-space-xs"
          type="submit"
        >
          <span>Trouver</span>
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </form>

      <div className="flex items-center gap-space-xs flex-wrap justify-center max-w-3xl">
        <span className="w-full lg:w-auto text-center font-label-md text-label-md text-on-surface font-bold lg:mr-space-xs">
          Questions fréquentes :
        </span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag.query}
            className="px-space-md py-1.5 rounded-full bg-surface-container-lowest ring-1 ring-outline-variant hover:bg-surface-container-high font-label-md text-label-md text-on-surface transition-all flex items-center gap-1"
            onClick={() => search(tag.query)}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">
              {tag.icon}
            </span>
            <span>{tag.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
