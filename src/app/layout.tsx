import type { Metadata } from "next";
import { Figtree, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bravo México | Programa de Ahorro y Negociación de Deudas",
  description:
    "Revisamos tu situación y te explicamos alternativas reales para liquidar tus deudas en México sin comprometer tu patrimonio.",
  icons: {
    icon: "/bravo-v-icon.svg",
    shortcut: "/bravo-v-icon.svg",
    apple: "/bravo-v-icon.svg",
  },
};

import { ScrollObserver } from "@/components/animations/ScrollObserver";
import { DynamicTrackingHead, DynamicTrackingBodyNoScript } from "@/components/analytics/DynamicTrackingInjector";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { LiveInPageHeatmapOverlay } from "@/components/analytics/LiveInPageHeatmapOverlay";
import { FloatingWhatsAppWidget } from "@/components/interactive/FloatingWhatsAppWidget";
import { CmsProvider } from "@/context/CmsContext";
import { ContactChannelsProvider } from "@/context/ContactContext";
import { TrackingTagsProvider } from "@/context/TrackingTagsContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrackingTagsProvider>
      <html
        lang="es-MX"
        className={`${figtree.variable} ${sourceSerif4.variable} h-full antialiased`}
      >
        <head>
          <DynamicTrackingHead />
        </head>
        <body className="min-h-full flex flex-col font-sans bg-[#F1EEF3] text-[#17131F]">
          <DynamicTrackingBodyNoScript />
          <ContactChannelsProvider>
            <CmsProvider>
              <ScrollObserver />
              <AnalyticsTracker />
              {process.env.NODE_ENV === "development" && <LiveInPageHeatmapOverlay />}
              <FloatingWhatsAppWidget />
              {children}
            </CmsProvider>
          </ContactChannelsProvider>
        </body>
      </html>
    </TrackingTagsProvider>
  );
}
