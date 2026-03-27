"use client";

import { SessionProvider } from "next-auth/react";
import { ReadingSettingsProvider } from "@/components/reading-settings";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReadingSettingsProvider>{children}</ReadingSettingsProvider>
    </SessionProvider>
  );
}
