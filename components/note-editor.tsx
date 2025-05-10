'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Note, Tag } from '@/lib/types';
import { useNotesStore } from '@/store/notes';
import { useSettingsStore } from '@/store/settings';
import { TRANSLATIONS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onClose: () => void;
}

export function NoteEditor({ note, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<Tag[]>(note.tags || []);
  const [newTag, setNewTag] = useState('');
  const updateNote = useNotesStore(state => state.updateNote);
  const language = useSettingsStore(state => state.language);
  const t = TRANSLATIONS[language];

  const handleSave = async () => {
    await updateNote(note.id, {
      title,
      content,
      tags,
    });
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.some(tag => tag.name === newTag.trim())) {
      setTags([...tags, { 
        id: crypto.randomUUID(),
        name: newTag.trim(),
        created_at: new Date().toISOString()
      }]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Card className="border-2 border-border bg-card">
      <CardHeader className="space-y-3 lg:space-y-4 p-3 lg:p-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="text-base lg:text-lg font-semibold bg-background"
        />
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="flex items-center gap-1 text-xs lg:text-sm">
              {tag.name}
              <button
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <div className="flex gap-1 lg:gap-2 w-full sm:w-auto">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.addTag}
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 lg:p-4 pt-0">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here... (Markdown supported)"
          className="min-h-[200px] resize-none bg-background text-sm lg:text-base"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} size="sm" className="text-sm">
            {t.cancel}
          </Button>
          <Button onClick={handleSave} size="sm" className="text-sm">
            {t.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}