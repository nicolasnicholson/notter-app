import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app.title": "Notter",
      "note.new": "New Note",
      "note.search": "Search notes...",
      "note.select": "Select a note to edit",
      "note.title": "Note title",
      "note.content": "Write your note here... (Markdown supported)",
      "note.archived": "Archived",
      "note.favorite": "Favorite",
      "note.export": "Export to PDF",
      "note.delete": "Delete note",
      "note.preview": "Preview",
      "note.edit": "Edit",
      "tags.add": "Add tags... (Press Enter)",
      "filter.all": "All Notes",
      "filter.favorites": "Favorites",
      "filter.archived": "Archived",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "theme.system": "System",
      "language": "Language",
      "language.en": "English",
      "language.es": "Spanish"
    }
  },
  es: {
    translation: {
      "app.title": "Notter",
      "note.new": "Nueva Nota",
      "note.search": "Buscar notas...",
      "note.select": "Selecciona una nota para editar",
      "note.title": "Título de la nota",
      "note.content": "Escribe tu nota aquí... (Markdown soportado)",
      "note.archived": "Archivada",
      "note.favorite": "Favorita",
      "note.export": "Exportar a PDF",
      "note.delete": "Eliminar nota",
      "note.preview": "Vista previa",
      "note.edit": "Editar",
      "tags.add": "Agregar etiquetas... (Presiona Enter)",
      "filter.all": "Todas las Notas",
      "filter.favorites": "Favoritas",
      "filter.archived": "Archivadas",
      "theme.light": "Claro",
      "theme.dark": "Oscuro",
      "theme.system": "Sistema",
      "language": "Idioma",
      "language.en": "Inglés",
      "language.es": "Español"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;