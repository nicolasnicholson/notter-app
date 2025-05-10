'use client';

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Note } from './types';

interface NotterDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: {
      'by-position': number;
    };
  };
}

class OfflineDB {
  private db: Promise<IDBPDatabase<NotterDB>> | null = null;

  private initDB() {
    if (typeof window === 'undefined') return null;
    
    return openDB<NotterDB>('notter-db', 1, {
      upgrade(db) {
        const notesStore = db.createObjectStore('notes', {
          keyPath: 'id'
        });
        notesStore.createIndex('by-position', 'position');
      }
    });
  }

  private async getDB() {
    if (!this.db) {
      this.db = this.initDB();
    }
    return this.db;
  }

  async getAllNotes(): Promise<Note[]> {
    const db = await this.getDB();
    if (!db) return [];
    return db.getAllFromIndex('notes', 'by-position');
  }

  async addNote(note: Note): Promise<void> {
    const db = await this.getDB();
    if (!db) return;
    return db.add('notes', note);
  }

  async updateNote(note: Note): Promise<void> {
    const db = await this.getDB();
    if (!db) return;
    return db.put('notes', note);
  }

  async deleteNote(id: string): Promise<void> {
    const db = await this.getDB();
    if (!db) return;
    return db.delete('notes', id);
  }

  async syncWithSupabase(supabaseNotes: Note[]): Promise<void> {
    const db = await this.getDB();
    if (!db) return;
    
    const tx = db.transaction('notes', 'readwrite');
    await tx.objectStore('notes').clear();
    
    for (const note of supabaseNotes) {
      await tx.store.add(note);
    }
    
    await tx.done;
  }
}

export const offlineDB = new OfflineDB();