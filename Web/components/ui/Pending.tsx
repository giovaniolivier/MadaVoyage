/** Signale un contenu provisoire qui ne doit pas passer pour une donnée réelle. */
export default function Pending({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <span
      className={`inline-flex self-start w-fit items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed font-label-md text-label-md ${
        onDark ? "border-surface/60 text-surface" : "border-outline text-on-surface-variant bg-surface-container-lowest"
      }`}
    >
      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
        pending
      </span>
      {children}
    </span>
  );
}
