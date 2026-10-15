"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ROUTES: [RegExp, string][] = [
  [/rn7|isalo|route nationale/, "/circuits/rn7"],
  [/simul|budget|devis|ariary|change/, "/simulateur"],
  [/lodge|heberg|hotel|manga soa/, "/hebergements/manga-soa-lodge"],
  [/carnet|voucher|billet/, "/carnet"],
  [/annul|modif/, "/modification"],
  [/reserv/, "/reservation/destination"],
  [/aide|faq|visa|sante|paludisme|contact|assistance/, "/aide"],
  [/avis|temoignage|recit/, "/avis"],
  [/compte|connexion|profil/, "/compte"],
  [/charte|engagement|fihavanana/, "/engagement"],
  [/mention|cgv|confidentialite|cookie/, "/mentions-legales"],
];

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function resolveSearch(query: string) {
  const q = normalize(query);
  if (!q || /^(circuits?|parcs?|mnp|expeditions?)$/.test(q)) return "/circuits";
  return ROUTES.find(([re]) => re.test(q))?.[1] ?? `/circuits?q=${encodeURIComponent(query.trim())}`;
}

export default function LostSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      className="w-full max-w-xl relative flex items-center bg-surface-container-lowest rounded-full shadow-md p-1.5 mb-6"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(resolveSearch(query));
      }}
      role="search"
    >
      <div className="pl-4 text-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-[22px]">search</span>
      </div>
      <label className="sr-only" htmlFor="lost-search">
        Que cherchiez-vous ?
      </label>
      <input
        className="w-full bg-transparent px-3 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
        id="lost-search"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Que cherchiez-vous ? (ex: Circuit RN7, Lodge Nosy Be, Simulateur...)"
        type="search"
        value={query}
      />
      <button
        className="px-6 py-2.5 rounded-full bg-primary hover:bg-on-primary-container text-on-primary font-label-md text-label-md transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        type="submit"
      >
        <span>Retrouver</span>
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </form>
  );
}
