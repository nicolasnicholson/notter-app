"use client";

import { useStore } from '@/lib/store';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { TagInput } from './tag-input';
import { Download, Trash, Heart, Archive, Eye, Edit } from 'lucide-react';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

export function NoteEditor() {
  const { selectedNote, updateNote, deleteNote, toggleArchived, toggleFavorite } = useStore();
  const [isPreview, setIsPreview] = useState(false);
  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [localTags, setLocalTags] = useState<{ id: string; name: string; }[]>([]);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  // Update local state when selectedNote changes
  useEffect(() => {
    if (selectedNote) {
      setLocalTitle(selectedNote.title);
      setLocalContent(selectedNote.content);
      setLocalTags(selectedNote.tags);
    } else {
      setLocalTitle('');
      setLocalContent('');
      setLocalTags([]);
    }
  }, [selectedNote?.id]); // Only trigger when note ID changes, not on every update

  const debouncedUpdate = useCallback((updatedNote: any) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      updateNote(updatedNote);
    }, 500); // Wait 500ms after user stops typing
  }, [updateNote]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedNote) return;
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    
    const updatedNote = {
      ...selectedNote,
      title: newTitle,
      updated_at: new Date().toISOString(),
    };
    debouncedUpdate(updatedNote);
  }, [selectedNote, debouncedUpdate]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedNote) return;
    const newContent = e.target.value;
    setLocalContent(newContent);
    
    const updatedNote = {
      ...selectedNote,
      content: newContent,
      updated_at: new Date().toISOString(),
    };
    debouncedUpdate(updatedNote);
  }, [selectedNote, debouncedUpdate]);

  const handleTagsChange = useCallback((tags: { id: string; name: string; }[]) => {
    if (!selectedNote) return;
    setLocalTags(tags);
    
    const updatedNote = {
      ...selectedNote,
      tags,
      updated_at: new Date().toISOString(),
    };
    updateNote(updatedNote); // Tags update immediately
  }, [selectedNote, updateNote]);

  const handleExportPDF = useCallback(() => {
    if (!selectedNote) return;
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(localTitle, 20, 20);
    
    doc.setFontSize(12);
    const contentLines = doc.splitTextToSize(localContent, 170);
    doc.text(contentLines, 20, 40);
    
    doc.save(`${localTitle}.pdf`);
  }, [localTitle, localContent]);

  const handleDelete = useCallback(() => {
    if (!selectedNote) return;
    deleteNote(selectedNote.id);
  }, [selectedNote, deleteNote]);

  if (!selectedNote) {
    return (
      <Card className="h-[calc(100vh-16rem)] flex items-center justify-center text-muted-foreground">
        {t('note.select')}
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-16rem)] flex flex-col p-4">
      <div className="flex items-center gap-4 mb-4">
        <Input
          value={localTitle}
          onChange={handleTitleChange}
          placeholder={t('note.title')}
          className="text-lg font-medium"
        />
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleFavorite(selectedNote.id)}
            className={selectedNote.is_favorite ? "text-red-500" : ""}
          >
            <Heart className="h-4 w-4" fill={selectedNote.is_favorite ? "currentColor" : "none"} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleArchived(selectedNote.id)}
            className={selectedNote.is_archived ? "text-blue-500" : ""}
          >
            <Archive className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleExportPDF}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <TagInput
        value={localTags}
        onChange={handleTagsChange}
        className="mb-4"
      />

      {isPreview ? (
        <div className="flex-1 overflow-auto prose prose-sm dark:prose-invert max-w-none p-4">
          <ReactMarkdown>{localContent}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          value={localContent}
          onChange={handleContentChange}
          placeholder={t('note.content')}
          className="flex-1 resize-none"
        />
      )}
    </Card>
  );
}