import type { Metadata } from 'next';
import Phone from '@/components/Phone';
import MapScreen from '@/components/MapScreen';

export const metadata: Metadata = { title: 'Demo · FoodLine DC' };

// Presentation layout for a screen share: the text line and the live map side by side.
// Keys: ← → step views, 1/2/3 jump, P hides controls, Shift+S seeds sample data, Shift+R clears live requests.
export default function DemoPage() {
  return (
    <main className="grid h-dvh w-full grid-cols-[440px_1fr] bg-bg">
      <section className="flex items-center justify-center border-r border-line bg-panel p-6" aria-label="Text line">
        <Phone />
      </section>
      <section className="relative" aria-label="Live demand map">
        <MapScreen compact initialView="focus" />
      </section>
    </main>
  );
}
