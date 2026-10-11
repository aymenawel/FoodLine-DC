import type { Metadata } from 'next';
import Phone from '@/components/Phone';

export const metadata: Metadata = { title: 'Text line · FoodLine DC' };

export default function ChatPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-bg sm:p-6">
      <Phone />
    </main>
  );
}
