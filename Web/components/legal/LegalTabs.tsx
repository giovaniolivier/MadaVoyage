"use client";

import { useEffect, useRef, useState } from "react";

const TABS = [
  { id: "mentions", icon: "gavel", label: "1. Mentions Légales & Éditeur" },
  { id: "cgv", icon: "handshake", label: "2. CGV Écotourisme & Tarifs" },
  { id: "rgpd", icon: "privacy_tip", label: "3. RGPD & Confidentialité" },
  { id: "cookies", icon: "cookie", label: "4. Cookies & Traçabilité" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const isTabId = (value: string): value is TabId => TABS.some((t) => t.id === value);

export default function LegalTabs({ panes }: { panes: Record<TabId, React.ReactNode> }) {
  const [active, setActive] = useState<TabId>("mentions");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const activateFromHash = (hash: string) => {
      const id = hash.replace(/^#/, "");
      if (!isTabId(id)) return false;
      setActive(id);
      window.requestAnimationFrame(() => {
        const top = wrapperRef.current?.getBoundingClientRect().top;
        if (top !== undefined) window.scrollTo({ top: window.scrollY + top - 100, behavior: "smooth" });
      });
      return true;
    };
    const onHashChange = () => activateFromHash(window.location.hash);
    // Sur la même page, <Link> de Next.js change l'URL via history.pushState (sans hashchange)
    // puis remonte en haut : on intercepte le clic en phase de capture pour gérer l'onglet nous-mêmes.
    const onDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      if (!url.hash) setActive("mentions");
      else if (activateFromHash(url.hash)) {
        e.preventDefault();
        window.history.pushState(window.history.state, "", url.hash);
      }
    };

    // Lors d'une navigation client depuis une autre page, l'URL est mise à jour après le montage.
    const timer = window.setTimeout(onHashChange, 0);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onDocumentClick, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, []);

  const select = (id: TabId, focus = false) => {
    setActive(id);
    window.history.replaceState(null, "", id === "mentions" ? window.location.pathname : `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect && rect.top < 100) {
      window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: "smooth" });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = TABS.findIndex((t) => t.id === active);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(TABS[next].id, true);
  };

  return (
    <>
      <div className="w-full">
        <div
          ref={wrapperRef}
          aria-label="Sections du document légal"
          className="flex items-center gap-2 p-1.5 bg-surface-container-high rounded-full overflow-x-auto shadow-inner"
          role="tablist"
          onKeyDown={onKeyDown}
        >
          {TABS.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                aria-controls={`tab-${tab.id}`}
                aria-selected={selected}
                className={`flex-1 min-w-[210px] py-3 px-4 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-2 ${
                  selected ? "bg-surface-container-lowest text-primary shadow-sm font-bold" : "text-on-surface-variant hover:text-on-surface"
                }`}
                id={`tab-btn-${tab.id}`}
                role="tab"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(tab.id)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.id}
          aria-labelledby={`tab-btn-${tab.id}`}
          className={`${tab.id === active ? "flex" : "hidden"} flex-col gap-space-lg`}
          id={`tab-${tab.id}`}
          role="tabpanel"
          tabIndex={0}
        >
          {panes[tab.id]}
        </div>
      ))}
    </>
  );
}
