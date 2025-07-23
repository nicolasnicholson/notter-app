"use client";

import { useStore } from '@/lib/store';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useTranslation } from 'react-i18next';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useStore();
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('note.search')}
        className="pl-9 text-sm sm:text-base"
      />
    </div>
  );
}