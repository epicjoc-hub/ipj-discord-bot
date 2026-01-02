import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Inspectoratul de Poliție Județean Los Santos - Relații Publice",
  description: "Site-ul oficial de Relații Publice al Inspectoratului de Poliție Județean Los Santos. Știri, anunțuri, informații despre echipă și servicii.",
  keywords: ["poliție", "Los Santos", "relații publice", "anunțuri", "evenimente", "ghiduri"],
  authors: [{ name: "Victor Popescu" }],
  openGraph: {
    title: "Inspectoratul de Poliție Județean Los Santos - Relații Publice",
    description: "Site-ul oficial de Relații Publice al Inspectoratului de Poliție Județean Los Santos",
    type: "website",
    locale: "ro_RO",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "Inspectoratul de Poliție Județean Los Santos",
    "description": "Inspectoratul de Poliție Județean Los Santos este dedicat serviciului public și protecției comunității noastre.",
    "url": "https://ipj-los-santos.ro",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+40-XXX-XXX-XXX",
      "contactType": "customer service",
      "availableLanguage": "Romanian"
    }
  };

  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
