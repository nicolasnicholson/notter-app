import { NoteList } from '@/components/note-list';
import { Header } from '@/components/header';
import { CreateNoteButton } from '@/components/create-note-button';
import { Sidebar } from '@/components/sidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 lg:py-8 flex flex-col lg:flex-row gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="mb-6">
            <CreateNoteButton />
          </div>
          <NoteList />
        </main>
      </div>
    </div>
  );
}