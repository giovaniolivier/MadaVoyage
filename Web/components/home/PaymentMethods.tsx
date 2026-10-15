/** Marques reproduites en texte pour la maquette : à remplacer par les logos officiels fournis par les opérateurs. */
const METHODS = [
  { name: "Visa", node: <span className="font-black italic text-[22px] tracking-tight text-[#1A1F71]">VISA</span>, className: "bg-white" },
  {
    name: "MVola",
    node: (
      <span className="font-extrabold text-[18px] text-[#00552E]">
        M<span className="text-[#E30613]">Vola</span>
      </span>
    ),
    className: "bg-[#FFD200]",
  },
  {
    name: "Orange Money",
    node: (
      <span className="flex items-center gap-1.5 font-bold text-[15px] text-on-surface">
        <span className="w-5 h-5 bg-[#FF7900]"></span>Orange Money
      </span>
    ),
    className: "bg-white",
  },
  { name: "Airtel Money", node: <span className="font-bold text-[15px] text-white">airtel money</span>, className: "bg-[#E40000]" },
];

export function PaymentLogos({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <ul aria-label="Moyens de paiement acceptés" className="flex flex-wrap items-center gap-3">
      {METHODS.map((m) => (
        <li
          key={m.name}
          aria-label={m.name}
          className={`${size === "sm" ? "h-10 px-3" : "h-11 px-4"} rounded-xl border border-outline-variant/60 flex items-center justify-center ${m.className}`}
        >
          <span aria-hidden="true">{m.node}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PaymentMethods() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
      <div className="flex items-center gap-3 shrink-0">
        <span className="material-symbols-outlined text-secondary text-[28px]">lock</span>
        <div>
          <div className="font-label-lg text-label-lg text-on-surface font-bold">Payez comme à Madagascar</div>
          <div className="font-body-md text-body-md text-on-surface-variant">Carte ou Mobile Money, en euros ou en ariary</div>
        </div>
      </div>
      <PaymentLogos />
      <p className="flex items-start gap-2 font-body-lg text-body-lg text-on-surface lg:ml-auto lg:max-w-[24rem]">
        <span aria-hidden="true" className="material-symbols-outlined text-secondary text-[22px] leading-6">
          verified
        </span>
        <span>
          <strong className="font-semibold">Aucun frais de paiement :</strong> vous réglez le prix affiché, les commissions des opérateurs
          sont à notre charge.
        </span>
      </p>
    </div>
  );
}
