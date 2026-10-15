import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanel, AuthProvider, GuestLink, LanguageSwitcher } from "@/components/auth/Connexion";
import { SUPPORT_HOURS, TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Connexion · Espace voyageur | MadaVoyage",
  description: "Connectez-vous par code WhatsApp/SMS ou e-mail pour retrouver vos séjours, vouchers et carnets de voyage à Madagascar.",
  robots: { index: false },
};

const PERKS = [
  {
    icon: "forest",
    color: "bg-secondary text-on-secondary",
    title: "100% Compensation Carbone",
    text: "Programmes de reboisement certifiés à Andasibe",
  },
  {
    icon: "headset_mic",
    color: "bg-primary-container text-on-primary",
    title: "Conciergerie Dédiée WhatsApp 24/7",
    text: "Assistance terrain en temps réel à Antananarivo",
  },
  {
    icon: "volunteer_activism",
    color: "bg-tertiary text-on-tertiary",
    title: "Traçabilité Impact Solidaire",
    text: "Suivi des bourses scolaires et dispensaires ruraux",
  },
];

export default function Page() {
  return (
    <main className="w-full min-h-screen lg:h-dvh lg:min-h-0 flex items-center justify-center p-space-sm md:p-space-lg lg:p-space-md tiny:p-space-xs bg-surface">
      <AuthProvider>
        <div className="w-full max-w-[1400px] mx-auto lg:h-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col relative">
          <header className="w-full h-16 short:h-14 tiny:h-12 px-space-lg lg:px-margin-desktop flex items-center justify-between gap-space-sm z-20 bg-surface-container-lowest/80 backdrop-blur-md">
            <Link aria-label="MadaVoyage, retour à l'accueil" className="flex items-center gap-space-sm" href="/">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                  forest
                </span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-extrabold leading-none">
                  Mada<span className="text-primary">Voyage</span>
                </span>
                <span className="font-label-sm text-label-sm tracking-widest uppercase text-secondary font-bold mt-0.5">{TAGLINE}</span>
              </div>
            </Link>

            <div className="flex items-center gap-space-md">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                <span className="font-label-sm text-label-sm">Connexion sécurisée</span>
              </div>
              <GuestLink className="hidden sm:flex" />
              <LanguageSwitcher />
            </div>
          </header>

          <div className="w-full flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 lg:min-h-0 lg:overflow-y-auto flex flex-col px-space-lg md:px-margin-tablet lg:px-margin-desktop py-space-lg short:py-space-md tiny:py-space-xs z-10">
              <div>
                <AuthPanel />

                <div className="max-w-[480px] w-full mx-auto mt-space-lg pt-space-md border-t border-surface-container flex flex-wrap items-center justify-between gap-y-2 text-on-surface-variant short:hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                    <span className="font-body-sm text-body-sm">RGPD &amp; Passeports sécurisés</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">mark_email_read</span>
                    <span className="font-body-sm text-body-sm">Aucun spam garanti</span>
                  </div>
                  <Link className="flex items-center gap-1.5 hover:text-primary" href="/aide">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">support_agent</span>
                    <span className="font-body-sm text-body-sm">Assistance {SUPPORT_HOURS.short}</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-5 relative p-space-lg flex-col justify-between overflow-hidden">
              <img
                alt="Vue aérienne de l'archipel de Nosy Be : lagon turquoise, plage de sable blanc bordée de cocotiers et pirogue à balancier"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPrL3U80oEPqDau96uxP3rTvhKFPWMg4k15UG894Y-5akV7w0Bd13cA_sdaLmqaaVDQuTCR4EpNFGyUM3vzSAxUcbMGbCpiQYzqiCvAs4UjLM9pofJ_i7qXqhIbX87783HOKaDksoNtMO8-_gy-tIdUqepRr3zvgwyBuvETj-ApRv7SCt-yjKhxQE-WFKXB1lSBhGDG5OXj4kiYosCWojOD2gyLajn6jZB-sTTXN6eLSrSur1lT8s"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/95 via-on-surface/50 to-primary/30 mix-blend-multiply"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
                  <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    eco
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface">Écotourisme solidaire</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-surface/40 backdrop-blur-md text-surface text-[12px] font-label-sm">
                  <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                  <span>Nosy Be, Madagascar</span>
                </div>
              </div>

              <div className="relative z-10 my-auto py-space-md">
                <div className="p-space-lg rounded bg-surface-container-lowest/15 backdrop-blur-lg border border-surface-container-lowest/20 shadow-xl text-surface">
                  <span className="material-symbols-outlined text-secondary-fixed text-headline-lg mb-2 block">format_quote</span>
                  <h2 className="font-headline-sm text-headline-sm text-surface mb-2 font-bold leading-snug">
                    Voyagez en harmonie avec la Grande Île.
                  </h2>
                  <p className="font-body-sm text-body-sm text-surface-container-low leading-relaxed">
                    Accédez instantanément à vos carnets de voyage hors-ligne, vos réservations d&apos;écolodges exclusifs et vos guides
                    francophones et anglophones certifiés par Madagascar National Parks.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-2.5">
                <span className="font-label-sm text-label-sm text-surface-variant uppercase tracking-wider font-semibold">
                  Vos engagements solidaires inclus :
                </span>
                {PERKS.map((perk) => (
                  <div
                    key={perk.title}
                    className="flex items-center gap-3 p-3 rounded bg-surface-container-lowest/10 backdrop-blur-sm text-surface"
                  >
                    <div className={`w-9 h-9 rounded-full ${perk.color} flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-[18px]">{perk.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm font-semibold truncate">{perk.title}</span>
                      <span className="font-body-sm text-body-sm text-surface-container-high/80 text-[11px] truncate">{perk.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AuthProvider>
    </main>
  );
}
