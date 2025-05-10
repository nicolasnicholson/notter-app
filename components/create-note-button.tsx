'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotesStore } from '@/store/notes';
import { useSettingsStore } from '@/store/settings';
import { TRANSLATIONS } from '@/lib/constants';

export function CreateNoteButton() {
  const createNote = useNotesStore(state => state.createNote);
  const language = useSettingsStore(state => state.language);
  const t = TRANSLATIONS[language];

  const handleCreate = () => {
    createNote({
      title: '',
      content: '',
      color: 'default',
      is_favorite: false,
      is_archived: false
    });
  };

  return (
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      {t.newNote}
    </Button>
  );
}