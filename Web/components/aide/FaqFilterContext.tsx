"use client";

import { createContext, useContext, useState } from "react";
import type { FaqCategory } from "./faq-data";

type FaqFilter = {
  query: string;
  setQuery: (q: string) => void;
  category: FaqCategory | "all";
  setCategory: (c: FaqCategory | "all") => void;
};

const FaqFilterContext = createContext<FaqFilter | null>(null);

export function FaqFilterProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory | "all">("all");
  return (
    <FaqFilterContext.Provider value={{ query, setQuery, category, setCategory }}>
      {children}
    </FaqFilterContext.Provider>
  );
}

export function useFaqFilter() {
  const ctx = useContext(FaqFilterContext);
  if (!ctx) throw new Error("useFaqFilter doit être utilisé dans <FaqFilterProvider>");
  return ctx;
}

export function normalizeSearch(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export const FAQ_LIST_ID = "faq-list";

export function scrollToFaqList() {
  document.getElementById(FAQ_LIST_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
