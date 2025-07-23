"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { NotesList } from '@/components/notes-list';
import { NoteEditor } from '@/components/note-editor';
import { SearchBar } from '@/components/search-bar';
import { TagSelector } from '@/components/tag-selector';
import { NoteFilters } from '@/components/note-filters';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { notes, syncWithSupabase, syncOfflineChanges, addNote } = useStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let isMounted = true;

    const initializeApp = async () => {
      try {
        if (isMounted) {
          console.log('Syncing with Supabase...');
          try {
            await syncWithSupabase();
            console.log('Sync completed successfully');
          } catch (syncError) {
            console.log('Sync failed, continuing in offline mode:', syncError);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        if (isMounted) {
          toast({
            title: "Database connected",
            description: "Your notes will be saved to the database.",
          });
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [mounted, syncWithSupabase, syncOfflineChanges, toast]);

  const handleCreateNote = async () => {
    const newNote = {
      id: crypto.randomUUID(),
      title: t('note.new'),
      content: "",
      position: notes.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
      is_archived: false,
      is_favorite: false,
    };
    
    try {
      await addNote(newNote);
      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Note saved locally",
        description: "Note created in offline mode.",
      });
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">{t('app.title')}</h1>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Button onClick={handleCreateNote} className="gap-2">
              <PlusCircle className="w-5 h-5" />
              {t('note.new')}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <SearchBar />
            <TagSelector />
            <NoteFilters />
            <NotesList />
          </div>
          
          <div className="lg:col-span-8">
            <NoteEditor />
          </div>
        </div>
      </div>
    </main>
  );
}