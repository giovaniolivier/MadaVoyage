"use client";

import { useEffect, useId, useRef } from "react";

export default function Dialog({
  title,
  icon,
  onClose,
  children,
  footer,
  size = "md",
}: {
  title: string;
  icon?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden="true" className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm" onClick={onClose}></div>
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={`bg-white rounded-xl w-full max-h-[90vh] overflow-y-auto p-space-lg shadow-2xl relative flex flex-col gap-space-md ${
          size === "xl" ? "max-w-5xl" : size === "lg" ? "max-w-2xl" : "max-w-md"
        }`}
        role="dialog"
      >
        <button
          ref={closeRef}
          aria-label="Fermer"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
        <div className="flex items-center gap-space-sm text-primary pr-10">
          {icon && <span className="material-symbols-outlined text-[26px]">{icon}</span>}
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface" id={titleId}>
            {title}
          </h3>
        </div>
        {children}
        {footer && <div className="flex flex-wrap gap-space-sm justify-end">{footer}</div>}
      </div>
    </div>
  );
}

export function QrCode({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm-4-6h2v2h-2V8zm4 0h2v2h-2V8zm-2 2h2v2h-2v-2z"></path>
    </svg>
  );
}
