'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotesStore } from '@/store/notes';
import { useSettingsStore } from '@/store/settings';
import { TRANSLATIONS } from '@/lib/constants';
import { NOTE_COLORS } from '@/constants/note-colors'; // Asegurate de tener este archivo
import type { Note } from '@/types/notes'; // Ruta según tu estructura de proyecto

export function CreateNoteButton() {
  const createNote = useNotesStore(state => state.createNote);
  const language = useSettingsStore(state => state.language);
  const t = TRANSLATIONS[language];

  // Obtené el color por defecto del array de colores
  const defaultColor = NOTE_COLORS.find(c => c.id === 'default') || NOTE_COLORS[0];

  const handleCreate = () => {
    const newNote: Partial<Note> = {
      title: '',
      content: '',
      color: defaultColor, // <- Usamos el objeto, no el string
      is_favorite: false,
      is_archived: false
    };

    createNote(newNote);
  };

  return (
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      {t.newNote}
    </Button>
  );
}
