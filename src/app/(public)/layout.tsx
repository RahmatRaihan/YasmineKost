import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { WhatsappFab } from "@/components/public/whatsapp-button";
import { SplashScreen } from "@/components/public/splash-screen";
import { getSiteSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <SplashScreen />
      <SiteHeader siteName={settings.siteName} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <WhatsappFab
        number={settings.whatsapp}
        message={`Halo ${settings.siteName}, saya ingin bertanya tentang ketersediaan kamar.`}
      />
    </div>
  );
}
