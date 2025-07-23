"use client";

import { useStore } from '@/lib/store';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableNote } from './sortable-note';
import { ScrollArea } from './ui/scroll-area';

export function NotesList() {
  const { notes, searchQuery, selectedTags, filter, reorderNotes } = useStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      note.tags.some((tag) => selectedTags.includes(tag.id));
    
    const matchesFilter = 
      (filter === "all") ||
      (filter === "favorites" && note.is_favorite) ||
      (filter === "archived" && note.is_archived);
    
    return matchesSearch && matchesTags && matchesFilter;
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = filteredNotes.findIndex((note) => note.id === active.id);
      const newIndex = filteredNotes.findIndex((note) => note.id === over.id);
      
      const newNotes = arrayMove(filteredNotes, oldIndex, newIndex);
      reorderNotes(newNotes);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-16rem)] rounded-lg border bg-card p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredNotes}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <SortableNote key={note.id} note={note} />
            ))}
            {filteredNotes.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">No notes found</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </ScrollArea>
  );
}