'use client';

import { useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useNotesStore } from '@/store/notes';
import { NoteCard } from './note-card';
import { useSettingsStore } from '@/store/settings';
import { TRANSLATIONS } from '@/lib/constants';
import { useState } from 'react';
import { Note } from '@/lib/types';

export function NoteList() {
  const { notes, searchQuery, activeFilter, activeTag, reorderNotes, fetchNotes } = useNotesStore();
  const language = useSettingsStore(state => state.language);
  const t = TRANSLATIONS[language];
  const [activeId, setActiveId] = useState<string | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === null ||
      (activeFilter === 'favorite' && note.is_favorite) ||
      (activeFilter === 'archived' && note.is_archived);

    const matchesTag = activeTag === null ||
      (note.tags && note.tags.some(tag => tag.id === activeTag));

    return matchesSearch && matchesFilter && matchesTag;
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = filteredNotes.findIndex((note) => note.id === active.id);
      const newIndex = filteredNotes.findIndex((note) => note.id === over.id);
      const newNotes = arrayMove(filteredNotes, oldIndex, newIndex);
      reorderNotes(newNotes);
    }
  };

  if (filteredNotes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {t.noNotes}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredNotes.map(note => note.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="opacity-50">
            <NoteCard note={filteredNotes.find(note => note.id === activeId) as Note} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}