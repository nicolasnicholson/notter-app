# Notter - Advanced Note Taking App

A modern, feature-rich note-taking application built with Next.js, TypeScript, and Supabase. Created by [Nicolás Nicholson](https://www.linkedin.com/in/nicolasnicholson/).

## Features

- 📝 Create, edit, and delete notes with Markdown support
- 🔄 Drag & Drop organization
- 🏷️ Tag system for better organization
- 🔍 Real-time search functionality
- ⭐ Favorite notes for quick access
- 📦 Archive notes to reduce clutter
- 🌓 Light/Dark theme with system preference detection
- 🌎 Internationalization (English/Spanish)
- 📱 Responsive design
- 💾 Offline support with automatic sync
- 📤 Export notes to PDF
- 👀 Markdown preview mode

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **State Management**: Zustand
- **Database**: Supabase
- **UI Components**: shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Internationalization**: i18next
- **Markdown**: react-markdown
- **PDF Export**: jsPDF
- **Styling**: TailwindCSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Supabase environment variables in `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Features in Detail

### Note Management
- Create, edit, and delete notes
- Rich text editing with Markdown support
- Real-time preview of Markdown content
- Export notes to PDF format

### Organization
- Drag and drop notes to reorder
- Tag system for categorization
- Archive notes to reduce clutter
- Mark notes as favorites for quick access
- Real-time search across titles and content

### User Experience
- Light and dark theme support
- System theme detection
- English and Spanish language support
- Responsive design for all devices
- Offline support with automatic synchronization

### Data Persistence
- Supabase backend for reliable data storage
- Offline support with IndexedDB
- Automatic synchronization when connection is restored

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created by [Nicolás Nicholson](https://www.linkedin.com/in/nicolasnicholson/)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)