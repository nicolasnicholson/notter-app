import { NoteColor } from './types';

export const COLORS: NoteColor[] = [
  {
    id: 'default',
    name: 'Default',
    bg: 'bg-card',
    border: 'border-border',
    hover: 'hover:border-border/80'
  },
  {
    id: 'red',
    name: 'Red',
    bg: 'bg-red-50 dark:bg-red-950/50',
    border: 'border-red-200 dark:border-red-800/50',
    hover: 'hover:border-red-300 dark:hover:border-red-700/50'
  },
  {
    id: 'green',
    name: 'Green',
    bg: 'bg-green-50 dark:bg-green-950/50',
    border: 'border-green-200 dark:border-green-800/50',
    hover: 'hover:border-green-300 dark:hover:border-green-700/50'
  },
  {
    id: 'blue',
    name: 'Blue',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-200 dark:border-blue-800/50',
    hover: 'hover:border-blue-300 dark:hover:border-blue-700/50'
  },
  {
    id: 'purple',
    name: 'Purple',
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    border: 'border-purple-200 dark:border-purple-800/50',
    hover: 'hover:border-purple-300 dark:hover:border-purple-700/50'
  }
];

export const TRANSLATIONS = {
  en: {
    appName: 'Notter',
    newNote: 'New Note',
    search: 'Search notes...',
    noNotes: 'No notes found',
    favorite: 'Favorite',
    archive: 'Archive',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    tags: 'Tags',
    addTag: 'Add tag',
    export: 'Export',
    exportAsPDF: 'Export as PDF',
    exportAsMarkdown: 'Export as Markdown',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    deleteConfirmTitle: 'Delete Note',
    deleteConfirmDescription: 'Are you sure you want to delete this note? This action cannot be undone.'
  },
  es: {
    appName: 'Notter',
    newNote: 'Nueva Nota',
    search: 'Buscar notas...',
    noNotes: 'No se encontraron notas',
    favorite: 'Favorito',
    archive: 'Archivar',
    delete: 'Eliminar',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    tags: 'Etiquetas',
    addTag: 'Agregar etiqueta',
    export: 'Exportar',
    exportAsPDF: 'Exportar como PDF',
    exportAsMarkdown: 'Exportar como Markdown',
    settings: 'Configuración',
    theme: 'Tema',
    language: 'Idioma',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    deleteConfirmTitle: 'Eliminar Nota',
    deleteConfirmDescription: '¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.'
  }
} as const;