"use client";

import { useEffect, useRef, useState } from "react";
import { WHATSAPP } from "@/lib/site";
import { FAQ_ITEMS, type FaqItem } from "./faq-data";
import { normalizeSearch, scrollToFaqList, useFaqFilter } from "./FaqFilterContext";
import { SupportNow } from "./SupportStatus";

type Message = { id: number; from: "user" | "bot"; text: string; faq?: FaqItem };

const WELCOME: Message = {
  id: 1,
  from: "bot",
  text: "Bonjour ! Je suis l'assistant automatique de MadaVoyage : je cherche la réponse dans notre FAQ, à toute heure. Je ne suis pas une personne : pour un échange avec la conciergerie (notre équipe à Madagascar), utilisez le bouton « Parler à la conciergerie ».",
};

const QUICK_REPLIES = ["Météo à Nosy Be", "Vaccins et paludisme", "Change en Ariary"];

const STOP_WORDS = new Set(
  "pour avec dans faut quel quelle quels quelles comment combien est-ce sont peut peux faire prix cout voyage madagascar votre vous nous".split(
    " ",
  ),
);

const tokens = (text: string) =>
  normalizeSearch(text)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

/** Question de la FAQ qui partage le plus de mots entiers (au pluriel près) avec le message, ou aucune. */
function bestAnswer(text: string) {
  const words = tokens(text);
  let best: { item: FaqItem; score: number } | null = null;
  for (const item of FAQ_ITEMS) {
    const vocabulary = new Set(tokens(`${item.question} ${item.keywords}`).map((w) => w.replace(/s$/, "")));
    const score = words.filter((w) => vocabulary.has(w.replace(/s$/, ""))).length;
    if (score > 0 && (!best || score > best.score)) best = { item, score };
  }
  return best?.item;
}

/** Vrai quand le pied de page est à l'écran : le bouton s'efface pour ne pas recouvrir les liens légaux. */
function useFooterVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  return visible;
}

export default function ConciergeChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);
  const { setQuery, setCategory } = useFaqFilter();
  const footerVisible = useFooterVisible();

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const faq = bestAnswer(trimmed);
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, from: "user", text: trimmed },
      faq
        ? { id: nextId.current++, from: "bot", text: "Cette question de la FAQ devrait vous aider :", faq }
        : {
            id: nextId.current++,
            from: "bot",
            text: "Je n'ai pas trouvé de réponse dans la FAQ. La conciergerie peut vous répondre sur WhatsApp.",
          },
    ]);
    setDraft("");
  }

  function showFaq(item: FaqItem) {
    setCategory("all");
    setQuery(item.question);
    scrollToFaqList();
  }

  return (
    <div
      className={`fixed right-4 sm:right-8 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-6 z-40 flex flex-col items-end transition-all duration-300 ${
        footerVisible && !open ? "translate-y-24 opacity-0 pointer-events-none" : ""
      }`}
    >
      {open && (
        <div
          id="assistant-chat"
          className="w-[calc(100vw-2rem)] max-w-96 max-h-[calc(100dvh-9rem)] bg-surface-container-lowest rounded shadow-2xl overflow-y-auto mb-space-sm flex flex-col"
          role="dialog"
          aria-label="Assistant"
        >
          <div className="shrink-0 bg-primary p-space-md text-on-primary flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center">
                <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                  smart_toy
                </span>
              </div>
              <div>
                <h2 className="font-label-lg text-label-lg font-bold text-on-primary leading-tight">Assistant</h2>
                <span className="font-body-sm text-body-sm text-on-primary block">Réponses automatiques tirées de la FAQ</span>
              </div>
            </div>
            <button
              className="w-8 h-8 rounded-full hover:bg-on-primary/10 flex items-center justify-center text-on-primary transition-colors"
              onClick={() => setOpen(false)}
              type="button"
              aria-label="Réduire l'assistant"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                minimize
              </span>
            </button>
          </div>

          <div
            ref={listRef}
            className="h-64 min-h-24 shrink p-space-md overflow-y-auto flex flex-col gap-space-sm bg-surface-container-low/40"
            aria-live="polite"
          >
            {messages.map((m) =>
              m.from === "user" ? (
                <div
                  key={m.id}
                  className="max-w-[85%] self-end bg-primary text-on-primary p-space-sm rounded shadow-sm font-body-md text-body-md whitespace-pre-wrap break-words"
                >
                  {m.text}
                </div>
              ) : (
                <div
                  key={m.id}
                  className="max-w-[85%] self-start bg-surface-container-lowest p-space-sm rounded shadow-sm text-on-surface font-body-md text-body-md flex flex-col gap-1"
                >
                  <span>{m.text}</span>
                  {m.faq && (
                    <button
                      className="text-left font-label-md text-label-md text-primary font-bold underline underline-offset-2"
                      onClick={() => showFaq(m.faq!)}
                      type="button"
                    >
                      {m.faq.question}
                    </button>
                  )}
                </div>
              ),
            )}
          </div>

          <div className="shrink-0 px-space-md py-1.5 bg-surface-container-lowest flex gap-1.5 overflow-x-auto whitespace-nowrap">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                className="px-2 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm transition-colors"
                onClick={() => send(q)}
                type="button"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            className="shrink-0 p-space-sm bg-surface-container-lowest flex items-center gap-space-xs"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              className="flex-1 min-w-0 h-10 px-space-md bg-surface-container-low rounded-full font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary"
              aria-label="Votre question"
              placeholder="Votre question…"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              className="w-10 h-10 rounded-full bg-primary hover:bg-on-primary-fixed-variant text-on-primary flex items-center justify-center shrink-0 transition-all shadow-sm disabled:opacity-50"
              type="submit"
              disabled={!draft.trim()}
              aria-label="Envoyer"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                send
              </span>
            </button>
          </form>

          <div className="shrink-0 px-space-md py-space-sm border-t border-outline-variant/40 flex flex-col gap-space-xs">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Besoin d&apos;une personne ? La conciergerie, c&apos;est notre équipe à Madagascar : elle répond sur WhatsApp et peut agir sur
              votre dossier.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <SupportNow />
              <a
                className="h-9 px-space-md rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center gap-1 shrink-0 hover:bg-on-primary-fixed-variant"
                href={WHATSAPP.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  support_agent
                </span>
                Parler à la conciergerie
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        className="h-14 w-14 sm:w-auto sm:px-space-lg rounded-full bg-primary hover:bg-on-primary-fixed-variant text-on-primary shadow-2xl flex items-center justify-center gap-space-sm transition-transform active:scale-95"
        aria-label="Assistant, réponses automatiques"
        tabIndex={footerVisible && !open ? -1 : undefined}
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-expanded={open}
        aria-controls="assistant-chat"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
          smart_toy
        </span>
        <span aria-hidden="true" className="hidden sm:flex flex-col text-left">
          <span className="font-label-lg text-label-lg font-bold leading-none">Assistant</span>
          <span className="font-label-sm text-label-sm text-on-primary leading-tight">Réponses automatiques</span>
        </span>
      </button>
    </div>
  );
}
