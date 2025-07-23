"use client";

import { useState, useCallback } from 'react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  className?: string;
}

export function TagInput({ value, onChange, className }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const newTag = {
        id: crypto.randomUUID(),
        name: input.trim(),
      };
      onChange([...value, newTag]);
      setInput('');
    }
  }, [input, value, onChange]);

  const removeTag = useCallback((tagId: string) => {
    onChange(value.filter((tag) => tag.id !== tagId));
  }, [value, onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {value.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="gap-1 text-xs">
            {tag.name}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive touch-none"
              onClick={() => removeTag(tag.id)}
            />
          </Badge>
        ))}
      </div>
      
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags... (Press Enter)"
        className="text-sm"
      />
    </div>
  );
}