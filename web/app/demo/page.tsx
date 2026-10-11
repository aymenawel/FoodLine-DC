import type { Metadata } from 'next';
import Phone from '@/components/Phone';
import MapScreen from '@/components/MapScreen';

export const metadata: Metadata = { title: 'Demo · FoodLine DC' };

// Presentation layout for a screen share: the text line and the live map side by side.
// Keys: ← → step views, 1/2/3 jump, P hides controls, Shift+S loads sample data. Clearing live requests is button-only.
export default function DemoPage() {
  return (
    <main className="grid w-full grid-cols-1 bg-bg lg:h-dvh lg:grid-cols-[24rem_1fr]">
      <section className="flex items-center justify-center border-line bg-panel p-0 sm:p-4 lg:border-r" aria-label="Text line">
        <Phone />
      </section>
      <section className="relative min-h-[80dvh] lg:min-h-0" aria-label="Live demand map">
        <MapScreen compact initialView="focus" />
      </section>
    </main>
  );
}
