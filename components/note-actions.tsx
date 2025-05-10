'use client';

import dynamic from 'next/dynamic';
import {
  Archive,
  MoreVertical,
  Star,
  Trash2,
  FileEdit,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Note } from '@/lib/types';
import { useNotesStore } from '@/store/notes';
import { useSettingsStore } from '@/store/settings';
import { TRANSLATIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NoteActionsProps {
  note: Note;
  onEdit: () => void;
}

export function NoteActions({ note, onEdit }: NoteActionsProps) {
  const toggleFavorite = useNotesStore(state => state.toggleFavorite);
  const toggleArchive = useNotesStore(state => state.toggleArchive);
  const deleteNote = useNotesStore(state => state.deleteNote);
  const language = useSettingsStore(state => state.language);
  const t = TRANSLATIONS[language];

  const handleExportPDF = async () => {
    try {
      // Import html2pdf dynamically only when needed
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Create a temporary div for the PDF content
      const element = document.createElement('div');
      element.className = 'p-8';
      
      // Add title
      const titleElement = document.createElement('h1');
      titleElement.style.fontSize = '24px';
      titleElement.style.fontWeight = 'bold';
      titleElement.style.marginBottom = '16px';
      titleElement.textContent = note.title || 'Untitled';
      element.appendChild(titleElement);
      
      // Add content
      const contentElement = document.createElement('div');
      contentElement.style.whiteSpace = 'pre-wrap';
      contentElement.innerHTML = note.content;
      element.appendChild(contentElement);

      const opt = {
        margin: 1,
        filename: `${note.title || 'note'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportMarkdown = () => {
    try {
      const blob = new Blob([note.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title || 'note'}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Markdown:', error);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(note.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleArchive(note.id);
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNote(note.id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={handleFavorite}
        type="button"
      >
        <Star
          className={cn(
            'h-4 w-4',
            note.is_favorite && 'fill-yellow-400 text-yellow-400'
          )}
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={handleArchive}
        type="button"
      >
        <Archive
          className={cn(
            'h-4 w-4',
            note.is_archived && 'text-blue-500'
          )}
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" type="button">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <FileEdit className="h-4 w-4 mr-2" />
            {t.edit}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            {t.exportAsPDF}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportMarkdown}>
            <Download className="h-4 w-4 mr-2" />
            {t.exportAsMarkdown}
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t.delete}
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.deleteConfirmDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {t.delete}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}