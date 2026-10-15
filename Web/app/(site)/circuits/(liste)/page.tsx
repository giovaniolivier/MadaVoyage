import type { Metadata } from "next";
import Link from "next/link";
import { CatalogFilters, CatalogProvider, CatalogResults, CatalogSearch } from "@/components/circuits/CircuitCatalog";
import { CIRCUITS } from "@/components/circuits/catalog-data";
import { GUIDES, SOLIDARITY_RATE, SOLIDARITY_TEXT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Circuits éco-responsables à Madagascar | MadaVoyage",
  description:
    "Filtrez nos circuits guidés à Madagascar par région, mois de départ, durée, âge des enfants, niveau physique et budget : RN7, Nosy Be, Tsingy, Sainte-Marie, Andasibe…",
};

export default function Page() {
  return (
    <>
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
        <CatalogProvider>
          <div className="flex flex-col w-full">
            <section className="w-full relative overflow-hidden bg-gradient-to-b from-surface-container-low to-surface pb-space-lg">
              <div className="absolute -top-32 right-10 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none"></div>
              <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none"></div>
              <div className="max-w-[1440px] mx-auto px-margin-desktop pt-space-md relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm lg:gap-space-lg mb-space-md">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">
                    Explorer Madagascar&nbsp;: sanctuaires et circuits authentiques
                  </h1>

                  <ul className="flex flex-wrap items-center gap-space-sm shrink-0" aria-label="En bref">
                    <li className="h-9 px-3 rounded-full bg-surface-container-lowest shadow-sm flex items-center gap-2 font-label-md text-label-md font-semibold text-on-surface">
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
                        route
                      </span>
                      {CIRCUITS.length} circuits au catalogue
                    </li>
                    <li className="h-9 px-3 rounded-full bg-surface-container-lowest shadow-sm flex items-center gap-2 font-label-md text-label-md font-semibold text-on-surface">
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-secondary">
                        badge
                      </span>
                      {GUIDES.claim}
                    </li>
                  </ul>
                </div>

                <div className="w-full bg-surface-container-lowest rounded-lg p-space-sm md:p-space-md shadow-md">
                  <CatalogSearch />
                </div>
              </div>
            </section>

            <div className="max-w-[1440px] w-full mx-auto px-margin-desktop py-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
                <aside aria-label="Filtrer les circuits" className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 self-start">
                  <CatalogFilters />
                </aside>

                <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-space-lg">
                  <CatalogResults />

                  <div className="w-full bg-gradient-to-r from-secondary/15 via-primary-container/20 to-surface-container-high p-space-lg rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg">
                    <div className="flex items-start gap-space-md max-w-2xl">
                      <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                            Engagement Fihavanana Solidaire
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                            {SOLIDARITY_RATE} reversé
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">{SOLIDARITY_TEXT}</p>
                      </div>
                    </div>
                    <Link
                      className="shrink-0 h-11 px-6 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-bold flex items-center gap-2 shadow-sm transition-all"
                      href="/engagement"
                    >
                      <span>Lire notre charte</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </CatalogProvider>
      </main>
    </>
  );
}
