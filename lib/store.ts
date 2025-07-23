import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

export interface Note {
  id: string;
  title: string;
  content: string;
  position: number;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  is_archived: boolean;
  is_favorite: boolean;
}

interface Tag {
  id: string;
  name: string;
}

type Filter = "all" | "favorites" | "archived";

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  searchQuery: string;
  selectedTags: string[];
  filter: Filter;
  setNotes: (notes: Note[]) => void;
  setSelectedNote: (note: Note | null) => void;
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setFilter: (filter: Filter) => void;
  reorderNotes: (notes: Note[]) => Promise<void>;
  toggleArchived: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  syncOfflineChanges: () => Promise<void>;
}

export const useStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      selectedNote: null,
      isLoading: false,
      searchQuery: '',
      selectedTags: [],
      filter: "all",

      setNotes: (notes) => set({ notes }),
      
      setSelectedNote: (note) => set({ selectedNote: note }),
      
      addNote: async (note) => {
        try {
          // First try to save to Supabase
          const { tags, ...noteWithoutTags } = note;
          const noteToSave = {
            ...noteWithoutTags,
            user_id: null // Allow anonymous users
          };

          const { data: noteData, error: noteError } = await supabase
            .from('notes')
            .insert(noteToSave)
            .select()
            .single();

          if (noteError) throw noteError;

          // Insert tags
          for (const tag of tags) {
            // First check if tag exists
            const { data: existingTag, error: selectError } = await supabase
              .from('tags')
              .select('*')
              .eq('name', tag.name)
              .is('user_id', null)
              .maybeSingle();

            if (selectError) throw selectError;

            let tagData;
            if (existingTag) {
              // Use existing tag
              tagData = existingTag;
            } else {
              // Create new tag
              const { data: newTag, error: insertError } = await supabase
                .from('tags')
                .insert({ 
                  name: tag.name, 
                  user_id: null
                })
                .select()
                .single();

              if (insertError) throw insertError;
              tagData = newTag;
            }

            // Create the note_tags relationship
            const { error: relationError } = await supabase
              .from('note_tags')
              .insert({
                note_id: noteData.id,
                tag_id: tagData.id
              });

            if (relationError) throw relationError;
          }

          // Update local state with the saved note including tags
          const noteWithTags = { ...noteData, tags };
          set((state) => ({ notes: [...state.notes, noteWithTags] }));
        } catch (error) {
          console.error('Error adding note:', error);
          // If Supabase fails, save locally
          set((state) => ({ notes: [...state.notes, note] }));
        }
      },

      updateNote: async (note) => {
        try {
          const { error: noteError } = await supabase
            .from('notes')
            .update({
              title: note.title,
              content: note.content,
              position: note.position,
              updated_at: note.updated_at,
              is_archived: note.is_archived,
              is_favorite: note.is_favorite
            })
            .eq('id', note.id);

          if (noteError) throw noteError;

          // Delete existing tag relationships
          const { error: deleteError } = await supabase
            .from('note_tags')
            .delete()
            .eq('note_id', note.id);

          if (deleteError) throw deleteError;

          // Insert new tag relationships
          for (const tag of note.tags) {
            // First check if tag exists
            const { data: existingTag, error: selectError } = await supabase
              .from('tags')
              .select('*')
              .eq('name', tag.name)
              .is('user_id', null)
              .maybeSingle();

            if (selectError) throw selectError;

            let tagData;
            if (existingTag) {
              // Use existing tag
              tagData = existingTag;
            } else {
              // Create new tag
              const { data: newTag, error: insertError } = await supabase
                .from('tags')
                .insert({ 
                  name: tag.name, 
                  user_id: null
                })
                .select()
                .single();

              if (insertError) throw insertError;
              tagData = newTag;
            }

            // Create the note_tags relationship
            const { error: relationError } = await supabase
              .from('note_tags')
              .insert({
                note_id: note.id,
                tag_id: tagData.id
              });

            if (relationError) throw relationError;
          }

          // Update local state after successful save
          set((state) => ({
            notes: state.notes.map((n) => (n.id === note.id ? note : n)),
            selectedNote: note,
          }));
        } catch (error) {
          console.error('Error updating note:', error);
          // If Supabase fails, update locally
          set((state) => ({
            notes: state.notes.map((n) => (n.id === note.id ? note : n)),
            selectedNote: note,
          }));
        }
      },

      deleteNote: async (id) => {
        try {
          const { error } = await supabase.from('notes').delete().eq('id', id);
          if (error) throw error;

          // Update local state after successful delete
          set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
            selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
          }));
        } catch (error) {
          console.error('Error deleting note:', error);
          // If Supabase fails, delete locally
          set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
            selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
          }));
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSelectedTags: (tags) => set({ selectedTags: tags }),

      setFilter: (filter) => set({ filter }),

      toggleArchived: async (id) => {
        const note = get().notes.find(n => n.id === id);
        if (note) {
          const updatedNote = { ...note, is_archived: !note.is_archived };
          await get().updateNote(updatedNote);
        }
      },

      toggleFavorite: async (id) => {
        const note = get().notes.find(n => n.id === id);
        if (note) {
          const updatedNote = { ...note, is_favorite: !note.is_favorite };
          await get().updateNote(updatedNote);
        }
      },

      reorderNotes: async (notes) => {
        set({ notes });
        try {
          const updates = notes.map((note, index) => ({
            id: note.id,
            position: index,
          }));
          const { error } = await supabase.from('notes').upsert(updates);
          if (error) throw error;
        } catch (error) {
          console.error('Error reordering notes:', error);
          throw error;
        }
      },

      syncWithSupabase: async () => {
        try {
          set({ isLoading: true });
          
          // First get all notes
          const { data: notesData, error: notesError } = await supabase
            .from('notes')
            .select('*')
            .order('position');

          if (notesError) throw notesError;

          // Then get all tags for these notes
          const notesWithTags = await Promise.all(
            notesData.map(async (note) => {
              const { data: tagData, error: tagError } = await supabase
                .from('note_tags')
                .select(`
                  tags (
                    id,
                    name
                  )
                `)
                .eq('note_id', note.id);

              if (tagError) throw tagError;

              return {
                ...note,
                tags: tagData?.map((t) => t.tags) || []
              };
            })
          );

          set({ notes: notesWithTags });
        } catch (error) {
          console.error('Error syncing with Supabase:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      syncOfflineChanges: async () => {
        // This is now handled by the error handling in each operation
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);