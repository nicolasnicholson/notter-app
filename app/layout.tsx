import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { OnlineStatusHandler } from './online-status-handler';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Notter - Modern Note Taking App',
  description: 'A modern note-taking application with Markdown support, tags, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <OnlineStatusHandler />
          {children}
        </Providers>
      </body>
    </html>
  );
}