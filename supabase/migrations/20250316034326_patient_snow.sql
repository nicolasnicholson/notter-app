/*
  # Initial Schema for Notter Application

  1. Tables
    - notes
      - id (uuid, primary key)
      - title (text)
      - content (text)
      - color (text)
      - is_favorite (boolean)
      - is_archived (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
      - position (integer)
    
    - tags
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamp)
    
    - note_tags
      - note_id (uuid, foreign key)
      - tag_id (uuid, foreign key)
      - created_at (timestamp)

  2. Functions
    - update_updated_at(): Automatically updates the updated_at timestamp
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  color text DEFAULT 'default',
  is_favorite boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create note_tags junction table
CREATE TABLE IF NOT EXISTS note_tags (
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (note_id, tag_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON notes FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Enable insert access for all users" ON notes FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON notes FOR UPDATE TO PUBLIC USING (true);
CREATE POLICY "Enable delete access for all users" ON notes FOR DELETE TO PUBLIC USING (true);

CREATE POLICY "Enable read access for all users" ON tags FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Enable insert access for all users" ON tags FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON tags FOR UPDATE TO PUBLIC USING (true);
CREATE POLICY "Enable delete access for all users" ON tags FOR DELETE TO PUBLIC USING (true);

CREATE POLICY "Enable read access for all users" ON note_tags FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Enable insert access for all users" ON note_tags FOR INSERT TO PUBLIC WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON note_tags FOR UPDATE TO PUBLIC USING (true);
CREATE POLICY "Enable delete access for all users" ON note_tags FOR DELETE TO PUBLIC USING (true);