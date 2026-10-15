import type { Metadata } from "next";
import RateLabel from "@/components/currency/RateLabel";
import BudgetSimulator from "@/components/simulateur/BudgetSimulator";

export const metadata: Metadata = {
  title: "Simulateur de budget — MadaVoyage",
  description:
    "Estimez le budget de votre voyage à Madagascar selon la région, les dates, la durée et le nombre de voyageurs, et voyez les circuits qui y correspondent.",
};

export default function Page() {
  return (
    <main className="w-full pt-20 bg-surface min-h-[calc(100vh-20rem)]">
      <div className="max-w-[80rem] mx-auto px-6 lg:px-12 pt-8 pb-20 flex flex-col gap-10">
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-lowest shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8 p-8 lg:p-12 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                    info
                  </span>
                  Estimation indicative
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm shadow-sm">
                  <span aria-hidden="true" className="material-symbols-outlined text-[15px] text-primary">
                    currency_exchange
                  </span>
                  <RateLabel />
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg lg:text-display-lg text-on-surface tracking-tight">Simulateur de budget</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Indiquez votre voyage et votre budget : nous estimons la répartition des dépenses et les circuits qui y correspondent. Les
                montants en Ariary suivent le taux du jour.
              </p>
            </div>
            <div className="lg:col-span-4 h-56 lg:h-full min-h-[220px] relative">
              <div
                aria-hidden="true"
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCD-Nv3lglX6XdltryjJkdtEQ8_XW9xW6Kd-Y5-ejfonwuUi9EhyzI8kGTBoJcNTNcRg_4CWKZhnL9btx6c9w5OMfa-oBWaGSG5YR56SKilE7h4JWJkn7HLnY3daou9-mjyImtP0UPFDmXHtTWfx0fzBgn2e7019h6bkCwJ6F16UP9doXsWbxHCSTfFlhXjcJF4JMBQkdZSDrru458s2qeYe-6e_jI6D7rp8BeedgodR-swdENwUwI')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-surface-container via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        <BudgetSimulator />
      </div>
    </main>
  );
}
