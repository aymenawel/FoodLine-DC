import type { Metadata } from 'next';
import MapScreen from '@/components/MapScreen';

export const metadata: Metadata = { title: 'Live demand map · FoodLine DC' };

export default function MapPage() {
  return <main className="h-dvh w-full"><MapScreen /></main>;
}
