import Link from "next/link";
import { WHATSAPP } from "@/lib/site";
import LostSearch from "./LostSearch";

export default function LostTrail() {
  return (
    <>
      <main className="w-full pt-20 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden py-12 lg:py-20 px-margin-desktop">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-b from-primary-fixed/30 via-secondary-fixed/20 to-transparent blur-3xl pointer-events-none rounded-full"></div>
            <div className="absolute top-1/3 -right-24 w-96 h-96 bg-tertiary-fixed/25 blur-3xl pointer-events-none rounded-full"></div>
            <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
              <div className="flex items-center gap-space-xs bg-surface-container px-4 py-1.5 rounded-full shadow-sm mb-6">
                <span className="material-symbols-outlined text-tertiary text-[18px]">explore_off</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Boussole égarée · Piste introuvable
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary ml-1"></span>
              </div>

              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
                <div className="lg:col-span-5 flex flex-col items-center lg:items-start relative">
                  <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden shadow-xl bg-surface-container-high group">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt="Maki catta perché sur un panneau indicateur dans l'Allée des Baobabs au coucher du soleil"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnsHONEp-HxwYR_TazMFRID8IbnGZBomPm955q7-u863ayPrkgVfUTADlQ8GtPL62nNtwco2gU95pupTtIVXZ_nTTGzKPVlTCO9PSPHyOlg7eqFW4r5HQSwipQ3z5ouPVHcocSRucNe2lwvq-cSlsKK0YmuhdrFCQIXU1eDXtSA-S_s6fSRMCi7vnV-CMae8nVGwfMfNxyquokH4kidTUaXsi5SrPWrqsmBDjyWI65SnS3BdbhYbE"
                    />

                    <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-3 rounded shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">location_searching</span>
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface leading-tight">Coordonnées GPS perdues</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Forêt sèche du Menabe · Allée des Baobabs</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm">
                        404 SOS
                      </span>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center gap-2 mt-4 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">south_west</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
                      Lat. 20.2519° S — Long. 44.4184° E
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pl-0 lg:pl-6">
                  <div className="flex items-baseline gap-2 mb-2 select-none">
                    <span className="font-display-lg text-[108px] lg:text-[132px] leading-none font-extrabold tracking-tighter bg-gradient-to-r from-primary via-primary-container to-tertiary-container bg-clip-text text-transparent">
                      404
                    </span>
                    <div className="hidden sm:flex flex-col -mb-4">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                        Erreur de route
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">Madagascar Inland Grid</span>
                    </div>
                  </div>

                  <h1 className="font-headline-lg text-headline-lg lg:text-[34px] lg:leading-[42px] text-on-surface mb-4 tracking-tight max-w-2xl">
                    <span className="text-tertiary font-extrabold">« Tsy Hita ! »</span> Cette piste s'est perdue dans la brousse...
                  </h1>

                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl">
                    Comme une piste oubliée du Menabe pendant la saison des pluies ou un sentier secret dissimulé sous la canopée
                    d'Andasibe, la page que vous cherchez n'existe pas, a changé de cap ou a été déplacée.
                  </p>

                  <LostSearch />

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full">
                    <Link
                      className="px-6 py-3 rounded-full bg-tertiary hover:bg-on-tertiary-fixed-variant text-on-tertiary font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                      href="/"
                    >
                      <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">cottage</span>
                      <span>Camp de base (Accueil)</span>
                    </Link>
                    <Link
                      className="px-6 py-3 rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                      href="/circuits"
                    >
                      <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                      <span>Explorer les parcs MNP</span>
                    </Link>
                    <a
                      className="px-5 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg transition-colors flex items-center gap-2"
                      href={`${WHATSAPP.href}?text=Bonjour%2C%20je%20cherche%20une%20page%20sur%20votre%20site`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">support_agent</span>
                      <span>Conciergerie WhatsApp 24/7</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-full flex items-center justify-center gap-4 my-8">
                <div className="h-[1px] bg-surface-variant flex-1 max-w-xs"></div>
                <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full">
                  <span className="material-symbols-outlined text-secondary text-[16px]">park</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant italic">
                    « Ny ala no miangona dia vory ny fody » — Les pistes recommandées
                  </span>
                </div>
                <div className="h-[1px] bg-surface-variant flex-1 max-w-xs"></div>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop mt-4 mb-16">
                <Link
                  className="group flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  href="/circuits?q=nosy"
                >
                  <div className="relative w-full h-48 overflow-hidden bg-surface-variant">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Pirogues à voile Vezo sur les eaux turquoise de l'archipel de Nosy Be"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQMaE9UFIit-_ba6FSYk1-Gb9FeHZdeL8aB3j-AAMSjCxTsPdNMGuQDxDB22-JYgkve8AEZ0zdhU6kOG9jxgdmyOtRV-7dJ2xa5X-IOq0ORZyhtMyTfNed2b4IJx3EmAxveNuEfvC9X3jqVxOzAcyhhC-psC8l7Nj5a8nZRKZ1t7GV7PkElbtIy6glg8HJqeLGite2gePdRv39jnz1SYMChwroNp_0Lt4cOdsgV3ixj1hK3IvB96E"
                    />
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[14px]">sailing</span>
                      <span className="font-label-sm text-label-sm text-on-surface">Canal du Mozambique</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-primary/90 text-on-primary px-2.5 py-0.5 rounded-full font-label-sm text-label-sm">
                      Dès 450 € · 2 250 000 Ar
                    </div>
                  </div>
                  <div className="p-space-lg flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-secondary mb-1">
                        <span className="material-symbols-outlined text-[16px]">eco</span>
                        <span className="font-label-sm text-label-sm uppercase">Sanctuaires &amp; Récifs</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-2">
                        Sanctuaires Marins &amp; Nosy Be
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        Plages vierges de l'Archipel Mitsio, pirogues Vezo traditionnelles et observation des tortues imbriquées en réserve
                        marine.
                      </p>
                    </div>
                    <div className="pt-4 flex items-center justify-between text-primary font-label-md text-label-md">
                      <span>Découvrir les lagons</span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>

                <Link
                  className="group flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  href="/circuits/rn7"
                >
                  <div className="relative w-full h-48 overflow-hidden bg-surface-variant">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Canyons de grès et piscine naturelle du parc national de l'Isalo"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp4xfGJ8Z-zOqu5Gwyu_0f9ql1KKxtNqFhoAVoQfxvtC5ytlg6UINFIRksFz8ukAmw8m1cCNuAAbnyuHrFRVzTsFFsi-2DtCv0xpkN-5-MeNTJeVIs9ONSGeGeXz6x6vCzY6AxgcGjyorxvq44YV9ecCEvsLXqIDuhe--bqAX70H5l2q_plg0h1Y_p0vWfM9z0yZYk4LXa2epPoC3pk9gKvFvfJPBzWxxcRA6hjWCRqEyHowwk12M"
                    />
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-tertiary text-[14px]">hiking</span>
                      <span className="font-label-sm text-label-sm text-on-surface">10 Jours immersifs</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-tertiary text-on-tertiary px-2.5 py-0.5 rounded-full font-label-sm text-label-sm">
                      Circuit Phare MNP
                    </div>
                  </div>
                  <div className="p-space-lg flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-tertiary mb-1">
                        <span className="material-symbols-outlined text-[16px]">landscape</span>
                        <span className="font-label-sm text-label-sm uppercase">Trek &amp; Canyons</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-2">
                        La Mythique RN7 &amp; Massif de l'Isalo
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        Des hauts-plateaux d'Antsirabe aux piscines naturelles de l'Isalo, rencontrez les Makis Catta avec nos guides
                        naturalistes certifiés.
                      </p>
                    </div>
                    <div className="pt-4 flex items-center justify-between text-primary font-label-md text-label-md">
                      <span>Voir l'itinéraire guidé</span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>

                <Link
                  className="group flex flex-col bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  href="/simulateur"
                >
                  <div className="relative w-full h-48 overflow-hidden bg-primary p-6 flex flex-col justify-between text-on-primary">
                    <svg className="absolute right-0 bottom-0 w-44 h-44 text-white/10" fill="none" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeDasharray="251"
                        strokeDashoffset="60"
                        strokeWidth="8"
                      ></circle>
                      <path d="M50 20 L50 50 L75 65" stroke="currentColor" strokeLinecap="round" strokeWidth="6"></path>
                    </svg>
                    <div className="flex items-center justify-between relative z-10">
                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm font-label-sm text-label-sm uppercase tracking-wider">
                        Outil en ligne
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">calculate</span>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-baseline gap-2">
                        <span className="font-headline-lg text-headline-lg leading-tight">± 0 %</span>
                        <span className="font-label-sm text-label-sm text-white/80">Transparence totale</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-white/90">Conversion temps réel EUR / Ariary (MGA)</p>
                    </div>
                  </div>
                  <div className="p-space-lg flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-primary mb-1">
                        <span className="material-symbols-outlined text-[16px]">payments</span>
                        <span className="font-label-sm text-label-sm uppercase">Sur-Mesure &amp; Équité</span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-2">
                        Simulateur d'Expédition Intelligent
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        Composez votre 4x4, vos éco-lodges et votre guide de parc. Recevez instantanément un chiffrage détaillé sans frais
                        cachés.
                      </p>
                    </div>
                    <div className="pt-4 flex items-center justify-between text-primary font-label-md text-label-md">
                      <span>Lancer le simulateur</span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-space-sm bg-surface-container px-6 py-3 rounded-full text-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Serveur Antananarivo Opérationnel</span>
                </div>
                <span className="hidden sm:inline text-outline">·</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Code d'erreur : <strong className="font-mono text-tertiary">HTTP 404 (Not Found)</strong> · Protocole Éco-Réseau MV-TN2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
