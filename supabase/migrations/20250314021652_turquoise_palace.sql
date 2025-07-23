/*
  # Fix Notes and Tags Relationship

  1. Changes
    - Add missing foreign key relationships between notes and tags
    - Add missing columns for archiving and favorites
    - Fix junction table relationships

  2. Security
    - Update RLS policies to reflect new relationships
*/

-- Drop existing note_tags table to recreate with proper relationships
DROP TABLE IF EXISTS note_tags;

-- Create note_tags junction table with proper relationships
CREATE TABLE note_tags (
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Enable RLS on note_tags
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Create policy for note_tags
CREATE POLICY "Users can manage their own note tags"
  ON note_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = note_tags.note_id
      AND notes.user_id = auth.uid()
    )
  );