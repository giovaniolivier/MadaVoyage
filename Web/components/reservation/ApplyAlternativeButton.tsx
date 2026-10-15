"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  variant: "primary" | "secondary";
  applied: boolean;
  onApply: () => void;
};

const VARIANT_CLASSES = {
  primary: "bg-primary hover:bg-on-primary-container text-on-primary",
  secondary: "bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary",
};

export default function ApplyAlternativeButton({ variant, applied, onApply }: Props) {
  const [pending, setPending] = useState(false);
  const onApplyRef = useRef(onApply);
  onApplyRef.current = onApply;

  useEffect(() => {
    if (!pending) return;
    const timeout = setTimeout(() => {
      setPending(false);
      onApplyRef.current();
    }, 600);
    return () => clearTimeout(timeout);
  }, [pending]);

  const colors = applied ? VARIANT_CLASSES.secondary : VARIANT_CLASSES[variant];

  return (
    <button
      className={`w-full h-[50px] rounded-full ${colors} font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:cursor-default disabled:active:scale-100`}
      type="button"
      disabled={pending || applied}
      aria-pressed={applied}
      onClick={() => setPending(true)}
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
          <span>Application en cours...</span>
        </>
      ) : applied ? (
        <>
          <span className="material-symbols-outlined text-[18px]">done</span>
          <span>Alternative appliquée !</span>
        </>
      ) : variant === "secondary" ? (
        <>
          <span className="material-symbols-outlined text-[20px]">check</span>
          <span>Appliquer cette alternative</span>
        </>
      ) : (
        <>
          <span>Appliquer cette alternative</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </>
      )}
    </button>
  );
}
