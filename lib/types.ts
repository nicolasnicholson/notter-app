export interface Note {
  id: string;
  title: string;
  content: string;
  is_favorite: boolean;
  is_archived: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  color?: NoteColor; 
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export type Language = 'en' | 'es';

export interface NoteColor {
  id: string;
  name: string;
  bg: string;
  border: string;
  hover: string;
}