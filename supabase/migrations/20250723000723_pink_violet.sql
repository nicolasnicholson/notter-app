/*
  # Notes Application Complete Schema

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, nullable for anonymous usage)
      - `title` (text)
      - `content` (text)
      - `position` (integer) for drag and drop ordering
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_archived` (boolean)
      - `is_favorite` (boolean)
    
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, references auth.users, nullable for anonymous usage)
      - `created_at` (timestamp)
    
    - `note_tags`
      - Junction table for notes and tags
      - `note_id` (uuid, references notes)
      - `tag_id` (uuid, references tags)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anonymous users
    - Allow public access for demo purposes

  3. Features
    - Support for both authenticated and anonymous users
    - Full CRUD operations on notes and tags
    - Drag and drop ordering
    - Archive and favorite functionality
*/

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  content text DEFAULT '',
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_archived boolean DEFAULT false,
  is_favorite boolean DEFAULT false
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create note_tags junction table
CREATE TABLE IF NOT EXISTS note_tags (
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for notes (allow both authenticated and anonymous access)
CREATE POLICY "Allow all operations on notes for authenticated users"
  ON notes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow all operations on notes for anonymous users"
  ON notes
  FOR ALL
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- Create policies for tags (allow both authenticated and anonymous access)
CREATE POLICY "Allow all operations on tags for authenticated users"
  ON tags
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow all operations on tags for anonymous users"
  ON tags
  FOR ALL
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- Create policies for note_tags (allow both authenticated and anonymous access)
CREATE POLICY "Allow all operations on note_tags for authenticated users"
  ON note_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = note_tags.note_id
      AND (notes.user_id = auth.uid() OR notes.user_id IS NULL)
    )
  );

CREATE POLICY "Allow all operations on note_tags for anonymous users"
  ON note_tags
  FOR ALL
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM notes
      WHERE notes.id = note_tags.note_id
      AND notes.user_id IS NULL
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS notes_updated_at_idx ON notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS notes_position_idx ON notes(position);
CREATE INDEX IF NOT EXISTS tags_user_id_idx ON tags(user_id);
CREATE INDEX IF NOT EXISTS tags_name_idx ON tags(name);

-- Add unique constraint for tag names per user (allowing nulls)
CREATE UNIQUE INDEX IF NOT EXISTS tags_name_user_unique 
ON tags(name, user_id) 
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS tags_name_anonymous_unique 
ON tags(name) 
WHERE user_id IS NULL;