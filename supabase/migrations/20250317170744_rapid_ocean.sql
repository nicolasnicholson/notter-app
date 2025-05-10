/*
  # Add Tags Support

  1. New Tables
    - tags
      - id (uuid, primary key)
      - name (text, unique)
      - created_at (timestamp)
    
    - note_tags (junction table)
      - note_id (uuid, foreign key)
      - tag_id (uuid, foreign key)
      - created_at (timestamp)

  2. Changes
    - Add foreign key relationships
    - Enable RLS on new tables
    - Add policies for tag management
*/

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for tags
CREATE POLICY "Enable read access for all users" ON tags
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Enable insert access for all users" ON tags
  FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON tags
  FOR UPDATE TO PUBLIC USING (true);

CREATE POLICY "Enable delete access for all users" ON tags
  FOR DELETE TO PUBLIC USING (true);

-- Create policies for note_tags
CREATE POLICY "Enable read access for all users" ON note_tags
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Enable insert access for all users" ON note_tags
  FOR INSERT TO PUBLIC WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON note_tags
  FOR UPDATE TO PUBLIC USING (true);

CREATE POLICY "Enable delete access for all users" ON note_tags
  FOR DELETE TO PUBLIC USING (true);