import type { Metadata } from "next";
import Link from "next/link";
import ReviewForm from "@/components/avis/ReviewForm";

export const metadata: Metadata = {
  title: "Laisser un avis vérifié — MadaVoyage",
  description: "Évaluez votre expédition RN7 avec MadaVoyage : note globale, critères d'impact, témoignage et photos souvenirs.",
};

export default function Page() {
  return (
      <main className="flex-1 w-full pt-20 bg-surface"><div className="flex flex-col w-full">

        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-12 right-12 w-[420px] h-[420px] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-[1440px] mx-auto px-margin-desktop py-space-xl relative z-10">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
              <nav aria-label="Fil d'ariane" className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md flex-wrap">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Accueil</span>
                </Link>
                <span className="text-outline-variant font-body-sm">/</span>
                <Link className="hover:text-primary transition-colors" href="/compte">Mon Compte</Link>
                <span className="text-outline-variant font-body-sm">/</span>
                <Link className="hover:text-primary transition-colors" href="/carnet">Carnet Passé</Link>
                <span className="text-outline-variant font-body-sm">/</span>
                <span className="text-on-surface font-semibold bg-surface-container-high px-space-sm py-0.5 rounded-full">Laisser un avis vérifié</span>
              </nav>
              <div className="flex items-center gap-space-sm">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Dossier :</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-lowest text-primary font-bold px-3 py-1 rounded-full shadow-sm">
                  #MDV-2025-4102
                </span>
              </div>
            </div>

            <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06),0_1px_3px_0_rgba(31,41,51,0.04)] mb-space-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl">
                <div className="space-y-space-xs max-w-3xl">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Expédition certifiée terminée
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">calendar_month</span>
                      04 - 14 Octobre 2025 (10 jours)
                    </span>
                  </div>
                  <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-extrabold">
                    Partagez votre expérience éco-responsable
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Expédition <span className="font-semibold text-on-surface">« La Mythique Route Nationale 7 & Sanctuaires du Sud »</span> de Tananarive à Ifaty. Votre témoignage alimente l'audit écologique indépendant et rémunère équitablement votre équipe de terrain.
                  </p>
                </div>

                <div className="flex items-center gap-space-md p-space-md bg-surface-container-low rounded min-w-[280px]">
                  <div className="w-16 h-16 rounded overflow-hidden shrink-0 shadow-sm">
                    <img className="w-full h-full object-cover" alt="Formations de grès et canyons du parc national de l'Isalo au coucher du soleil" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjXon-mGmB1MSp1jca_Dy9mAxQtvQpKmeURe4L05Dd_R_IQ2o7vdDVROCJ0p9pEZ4lIAGKHShPwemPUGvhcg5BJrsaxEW9DfqC9hbXgovmzi2_x-qY3jlLtbU5uholGb9g6SjyJCF8yTkAYqPzySlVox5YCJBtpUiBH6Kr7Ibuw6XPCUF4bafmV-s-fpkVa6mPgwJldQq0fOmYv9HCwSGwIw-3ItgdgIdeau2Glh_UJc4KLYgOQjY" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Circuit RN7</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">Antananarivo à Ifaty</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">person</span> Guide : Faly Ramanoelina
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">

              <ReviewForm />

              <aside className="lg:col-span-4 flex flex-col gap-space-xl">

                <div className="bg-surface-container-lowest rounded-lg p-space-xl shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06),0_1px_3px_0_rgba(31,41,51,0.04)]">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">Votre Profil Public</span>
                  <div className="flex items-center gap-space-md mt-space-md mb-space-lg">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover" alt="Portrait d'Alexandre Fontaine en tenue de randonnée" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvZ02PNFOH5leYB1m4ia-GEbwcSAEhQlKKqhSYe6C7zvWW65MKDMxKdhS9Ih5OjndcJOCLFCBeDpgC8NkY9s4ECXXrxa3ORmJ6pnoeV2GNywOE6heyIbO1oz6VVCvlB6qOFZYbwPNAqIrohT0wfTa8slVMPsT3167TjPSED3W6x-fH40elFusy1td2xaEcj_8RD5upby0fPiTOR3zej9_F3KR2n6NLh0XCvEL_aevFio_zRorwNPc" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm" title="Vérifié">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">Alexandre Fontaine</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Membre depuis 2023 · Paris, FR</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[12px]">eco</span>
                          Voyageur Éco-Certifié
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-space-md bg-surface-container-low rounded flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Score Responsable</span>
                      <span className="font-label-md text-label-md font-extrabold text-secondary">98 / 100</span>
                    </div>

                    <div className="relative w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "98%" }}></div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">park</span>
                      3 expéditions Madagascar sans empreinte plastique
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-lg p-space-xl shadow-[0_2px_8px_-2px_rgba(15,163,177,0.06),0_1px_3px_0_rgba(31,41,51,0.04)] space-y-space-lg">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Transparence Totale</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">Pourquoi vos retours comptent ?</h3>
                  </div>
                  <div className="space-y-space-md">

                    <div className="flex items-start gap-space-md">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg text-label-lg text-on-surface font-bold">100% Voyageurs Vérifiés</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Seuls les voyageurs ayant complété l'expédition avec dossier certifié (comme votre #MDV-2025-4102) peuvent publier un avis.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-md">
                      <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg text-label-lg text-on-surface font-bold">Prime Directe au Guide</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Un avis supérieur à 4.5/5 déclenche automatiquement une prime d'excellence reversée à <span className="font-semibold text-on-surface">Faly Ramanoelina</span> via la caisse solidaire Fihavanana.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-space-md">
                      <div className="w-10 h-10 rounded-full bg-tertiary-container/15 text-tertiary-container flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">policy</span>
                      </div>
                      <div>
                        <h4 className="font-label-lg text-label-lg text-on-surface font-bold">Modération Éthique MNP</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          Aucun avis n'est supprimé ou altéré. Les signalements environnementaux font l'objet d'un audit de terrain sous 72 heures.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-space-md rounded bg-surface-container-high/60 flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-primary text-[24px]">support_agent</span>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Une remarque confidentielle ?</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Écrivez directement au comité éthique à <a className="text-primary underline" href="mailto:ethique@madavoyage.mg">ethique@madavoyage.mg</a>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-space-lg flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-headline-sm font-bold">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <span>Délai de parution</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Après soumission, votre avis est synchronisé sur la blockchain d'audit de l'écotourisme malgache sous 24 à 48 heures. Vos photos apparaîtront dans la galerie collective du carnet RN7.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>


      </div></main>
  );
}
