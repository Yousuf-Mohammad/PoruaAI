import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.scss";
import Provider from "./Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const metadata = {
  title: "Porua — read closer",
  description:
    "Porua reads your PDF, then answers from it. Highlight a passage, ask, and keep the answer in your notes.",
};

const display = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${display.variable} ${sans.variable} ${mono.variable} font-sans antialiased`}
        >
          <Provider>{children}</Provider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast:
                  "!bg-page !text-ink !border !border-rule !rounded-lg !shadow-lift !font-sans",
                description: "!text-ink-soft",
                error: "!border-flag",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
