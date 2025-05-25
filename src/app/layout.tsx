import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProviderTanstack } from "./providers/ProviderTanstack";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { auth0 } from "@/lib/auth0";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quimera Sneakers",
  description: "Compara tus precios de zapatillas aquí",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener la sesión en el servidor para pasarla al Auth0Provider
  const session = await auth0.getSession();
  
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Auth0Provider user={session?.user}>
          <ProviderTanstack>{children}</ProviderTanstack>
        </Auth0Provider>
      </body>
    </html>
  );
}
