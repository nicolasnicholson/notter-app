'use client';

import { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Note } from '@/lib/types';
import { NoteEditor } from './note-editor';
import { NoteActions } from './note-actions';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <NoteEditor
        note={note}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group relative cursor-default border-2 border-border bg-card h-full"
    >
      <div {...attributes} {...listeners} className="absolute top-0 left-0 w-full h-8 cursor-move" />
      <CardHeader className="p-3 lg:p-4 pb-0">
        <h3 className="text-base lg:text-lg font-semibold line-clamp-2">
          {note.title || 'Untitled'}
        </h3>
        <div className="flex flex-wrap gap-1 lg:gap-2 mt-2">
          {note.tags?.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
        <p className="text-xs lg:text-sm text-muted-foreground">
          {format(new Date(note.created_at), 'MMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent className="p-3 lg:p-4">
        <div className="prose dark:prose-invert max-w-none text-sm lg:text-base line-clamp-3">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
        <NoteActions note={note} onEdit={() => setIsEditing(true)} />
      </CardContent>
    </Card>
  );
}