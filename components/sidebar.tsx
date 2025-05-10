'use client';

import { Archive, Search, Star, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNotesStore } from '@/store/notes';
import { useSettingsStore } from '@/store/settings';
import { TRANSLATIONS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export function Sidebar() {
  const { notes, setSearchQuery, setFilter, setActiveTag, activeFilter, activeTag } = useNotesStore();
  const language = useSettingsStore(state => state.language);
  const t = TRANSLATIONS[language];

  // Get unique tags from all notes
  const allTags = Array.from(new Set(
    notes.flatMap(note => note.tags || [])
      .map(tag => JSON.stringify(tag))
  )).map(tag => JSON.parse(tag));

  return (
    <aside className="w-full lg:w-64 space-y-4 lg:space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={t.search}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <nav className="flex lg:flex-col gap-2">
        <Button 
          variant={activeFilter === 'favorite' ? 'secondary' : 'ghost'} 
          className="flex-1 lg:flex-none lg:w-full justify-start"
          onClick={() => setFilter(activeFilter === 'favorite' ? null : 'favorite')}
        >
          <Star className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{t.favorite}</span>
        </Button>
        <Button 
          variant={activeFilter === 'archived' ? 'secondary' : 'ghost'} 
          className="flex-1 lg:flex-none lg:w-full justify-start"
          onClick={() => setFilter(activeFilter === 'archived' ? null : 'archived')}
        >
          <Archive className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{t.archive}</span>
        </Button>
      </nav>
      <div className="pt-2 lg:pt-4">
        <div className="flex items-center mb-2">
          <Tag className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{t.tags}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={activeTag === tag.id ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </aside>
  );
}