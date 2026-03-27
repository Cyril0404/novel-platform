import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "NovelFlow - Read Your Favorite Stories",
  description: "A modern novel reading platform for English readers worldwide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased transition-colors duration-300">
        <Providers>
          <ThemeProvider>
            <Header />
            <main className="pb-20 md:pb-0">{children}</main>
            <footer className="hidden border-t border-stone-200 bg-white py-12 md:block">
              <div className="mx-auto max-w-7xl px-4 text-center text-stone-500">
                <p>NovelFlow - Your gateway to endless stories</p>
              </div>
            </footer>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
