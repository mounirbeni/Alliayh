import "./globals.css";
import { Prata, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale } from "@/i18n/config";

const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      suppressHydrationWarning
      className={`${prata.variable} ${montserrat.variable}`}
    >
      <body className="font-body antialiased selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
