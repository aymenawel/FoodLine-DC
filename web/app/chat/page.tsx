import type { Metadata } from 'next';
import Phone from '@/components/Phone';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = { title: 'Text line · FoodLine DC' };

export default function ChatPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-bg sm:p-6">
      <ThemeToggle className="fixed right-4 top-4 z-10 hidden sm:inline-flex" />
      <Phone />
    </main>
  );
}
