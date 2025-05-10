'use client';

import { useSettingsStore } from '@/store/settings';
import { TRANSLATIONS } from '@/lib/constants';
import { ModeToggle } from './mode-toggle';
import { LanguageToggle } from './language-toggle';
import { Pen } from 'lucide-react';

export function Header() {
  const language = useSettingsStore(state => state.language);
  const t = TRANSLATIONS[language];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-14 lg:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pen className="h-5 w-5 lg:h-6 lg:w-6" />
          <span className="text-lg lg:text-xl font-bold">{t.appName}</span>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}