'use client';

import { create } from 'zustand';
import { Note, Tag } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeFilter: 'favorite' | 'archived' | null;
  activeTag: string | null;
  online: boolean;
  fetchNotes: () => Promise<void>;
  createNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  reorderNotes: (notes: Note[]) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: 'favorite' | 'archived' | null) => void;
  setActiveTag: (tagId: string | null) => void;
  setOnlineStatus: (status: boolean) => void;
  syncWithSupabase: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,
  searchQuery: '',
  activeFilter: null,
  activeTag: null,
  online: true,

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('position');

      if (notesError) throw notesError;
      if (!notesData) return;

      // Fetch tags for each note
      const notesWithTags = await Promise.all(
        notesData.map(async (note) => {
          const { data: tagData } = await supabase
            .from('note_tags')
            .select('tags:tag_id(id, name, created_at)')
            .eq('note_id', note.id);

          return {
            ...note,
            tags: tagData?.map(t => t.tags) || []
          };
        })
      );

      set({ notes: notesWithTags });
    } catch (error) {
      console.error('Error fetching notes:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createNote: async (note) => {
    try {
      const { data: notes } = await supabase
        .from('notes')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);

      const position = (notes?.[0]?.position ?? 0) + 1;
      const timestamp = new Date().toISOString();
      
      const newNote = {
        ...note,
        position,
        created_at: timestamp,
        updated_at: timestamp,
        id: crypto.randomUUID(),
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      // Initialize with empty tags array
      const noteWithTags = { ...data, tags: [] };

      set(state => ({
        notes: [...state.notes, noteWithTags]
      }));
    } catch (error) {
      console.error('Error creating note:', error);
      set({ error: (error as Error).message });
    }
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    try {
      const timestamp = new Date().toISOString();
      const noteUpdates = {
        title: updates.title,
        content: updates.content,
        updated_at: timestamp,
      };

      // Update note
      const { data, error } = await supabase
        .from('notes')
        .update(noteUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      // Update tags if provided
      if (updates.tags) {
        // Delete existing tags
        await supabase
          .from('note_tags')
          .delete()
          .eq('note_id', id);

        // Insert new tags
        for (const tag of updates.tags) {
          // Insert or update tag
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .upsert({ id: tag.id, name: tag.name })
            .select()
            .single();

          if (tagError) throw tagError;
          if (tagData) {
            // Link tag to note
            const { error: linkError } = await supabase
              .from('note_tags')
              .insert({ note_id: id, tag_id: tagData.id });

            if (linkError) throw linkError;
          }
        }
      }

      // Fetch updated tags
      const { data: tagData } = await supabase
        .from('note_tags')
        .select('tags:tag_id(id, name, created_at)')
        .eq('note_id', id);

      const updatedNote = {
        ...data,
        tags: tagData?.map(t => t.tags) || []
      };

      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? updatedNote : note
        )
      }));
    } catch (error) {
      console.error('Error updating note:', error);
      set({ error: (error as Error).message });
    }
  },

  deleteNote: async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        notes: state.notes.filter(note => note.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting note:', error);
      set({ error: (error as Error).message });
    }
  },

  toggleFavorite: async (id: string) => {
    try {
      const note = get().notes.find(n => n.id === id);
      if (!note) throw new Error('Note not found');

      const timestamp = new Date().toISOString();
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          is_favorite: !note.is_favorite,
          updated_at: timestamp
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      // Keep existing tags
      const updatedNote = {
        ...data,
        tags: note.tags
      };

      set(state => ({
        notes: state.notes.map(n =>
          n.id === id ? updatedNote : n
        )
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      set({ error: (error as Error).message });
    }
  },

  toggleArchive: async (id: string) => {
    try {
      const note = get().notes.find(n => n.id === id);
      if (!note) throw new Error('Note not found');

      const timestamp = new Date().toISOString();
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          is_archived: !note.is_archived,
          updated_at: timestamp
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      // Keep existing tags
      const updatedNote = {
        ...data,
        tags: note.tags
      };

      set(state => ({
        notes: state.notes.map(n =>
          n.id === id ? updatedNote : n
        )
      }));
    } catch (error) {
      console.error('Error toggling archive:', error);
      set({ error: (error as Error).message });
    }
  },

  reorderNotes: async (notes: Note[]) => {
    try {
      const updates = notes.map((note, index) => ({
        id: note.id,
        position: index,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('notes')
        .upsert(updates);

      if (error) throw error;

      set({ notes });
    } catch (error) {
      console.error('Error reordering notes:', error);
      set({ error: (error as Error).message });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilter: (filter: 'favorite' | 'archived' | null) => set({ activeFilter: filter }),
  setActiveTag: (tagId: string | null) => set({ activeTag: tagId }),
  setOnlineStatus: (status: boolean) => set({ online: status }),
  
  syncWithSupabase: async () => {
    await get().fetchNotes();
  }
}));