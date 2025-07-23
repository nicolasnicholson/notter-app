"use client";

import { useStore } from '@/lib/store';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

export function TagSelector() {
  const { notes, selectedTags, setSelectedTags } = useStore();

  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags))
  ).sort((a, b) => a.name.localeCompare(b.name));

  const toggleTag = (tagId: string) => {
    setSelectedTags(
      selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId]
    );
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {allTags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTag(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </ScrollArea>
  );
}