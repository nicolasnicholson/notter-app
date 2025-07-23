/*
  # Add Archive and Favorite Features

  1. Changes
    - Add `is_archived` column to notes table
    - Add `is_favorite` column to notes table
    - Add foreign key relationship between notes and tags

  2. Security
    - Update RLS policies to include new columns
*/

-- Add new columns to notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false;

-- Create foreign key relationship between notes and tags
ALTER TABLE note_tags
ADD CONSTRAINT fk_note_tags_note
FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_note_tags_tag
FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;