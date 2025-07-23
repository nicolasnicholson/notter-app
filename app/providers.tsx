"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}