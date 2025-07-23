"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { GripVertical, Heart, Archive } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

interface SortableNoteProps {
  note: {
    id: string;
    title: string;
    content: string;
    updated_at: string;
    tags: { id: string; name: string; }[];
    is_archived: boolean;
    is_favorite: boolean;
  };
}

export function SortableNote({ note }: SortableNoteProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { selectedNote, setSelectedNote } = useStore();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 cursor-pointer transition-colors hover:bg-accent",
        isDragging && "opacity-50",
        selectedNote?.id === note.id && "bg-accent"
      )}
      onClick={() => setSelectedNote(note)}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-primary"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate flex-1">{note.title}</h3>
            <div className="flex gap-1">
              {note.is_favorite && (
                <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
              )}
              {note.is_archived && (
                <Archive className="h-4 w-4 text-blue-500" />
              )}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground truncate">{note.content}</p>
          
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {format(new Date(note.updated_at), 'MMM d, yyyy')}
            </span>
            
            <div className="flex gap-1">
              {note.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full bg-secondary text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}