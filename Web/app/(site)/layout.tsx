import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter, { TunnelFooter } from "@/components/layout/SiteFooter";
import TunnelAware from "@/components/layout/TunnelAware";
import { CookieConsentProvider } from "@/components/consent/CookieConsent";
import ExchangeRateSync from "@/components/currency/ExchangeRateSync";
import { getDailyRate } from "@/lib/exchange-rate";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const rate = await getDailyRate();
  return (
    <ExchangeRateSync rate={rate}>
      <CookieConsentProvider>
        <SiteHeader />
        {children}
        <TunnelAware tunnel={<TunnelFooter />}>
          <SiteFooter />
        </TunnelAware>
      </CookieConsentProvider>
    </ExchangeRateSync>
  );
}
