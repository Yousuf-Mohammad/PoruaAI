import {Outfit} from "next/font/google";
import "./globals.scss";
import Provider from "./Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";


export const metadata = {
  title: "Porua AI", 
  description: "Porua AI ",
};

const outfit =Outfit({subsets:["latin"]});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

    <html lang="en" suppressHydrationWarning >
      <body
      className={`${outfit.className} `}
      >
        <Provider>{children}</Provider>
        <Toaster/>
      </body>
    </html>
    </ClerkProvider>

  )
}
