# Notter 📝

A modern and feature-rich note-taking application built with Next.js and Supabase.

Created by [Nicolás Nicholson](https://www.linkedin.com/in/nicolasnicholson/)

## Features

- 📝 Create, edit, and delete notes with Markdown support
- 🔍 Real-time search functionality
- 🏷️ Tag and categorize notes
- ⭐ Favorite and archive notes
- 🌓 Dark/Light theme with system preference detection
- 🌎 English and Spanish language support
- 🔄 Drag & Drop organization
- 💾 Offline support with IndexedDB
- 📤 Export notes to PDF or Markdown
- 🔒 Delete confirmation dialog

## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, ShadCN
- **State Management**: Zustand
- **Backend**: Supabase
- **Additional Features**: 
  - Markdown support with react-markdown
  - Drag & Drop with @dnd-kit
  - Offline storage with IndexedDB
  - PDF export with html2pdf.js

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── app/
│   ├── [lang]/          # Language-specific routes
│   ├── components/      # Reusable components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities and configurations
│   └── store/          # Zustand store
├── public/             # Static assets
└── supabase/          # Supabase configurations and migrations
```

## Features in Detail

### Note Management
- Create, edit, and delete notes with confirmation
- Rich text editing with Markdown support
- Drag & Drop organization
- Favorite and archive functionality

### Search and Organization
- Real-time search
- Tag-based organization
- Custom categories
- Sort by various criteria

### Offline Support
- IndexedDB integration
- Automatic sync when online
- Offline editing capabilities

### Customization
- Dark/Light theme
- Language switching (English/Spanish)

### Export Options
- Export to PDF
- Export to Markdown

## Performance Optimizations

- Server Components for improved initial load
- Suspense for better loading states
- Optimistic updates for better UX
- Efficient state management with Zustand
- IndexedDB for offline capabilities

## License

MIT License