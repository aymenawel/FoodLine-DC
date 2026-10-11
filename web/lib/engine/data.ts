import placesJson from '@/data/places.json';
import resourcesJson from '@/data/resources.json';
import addressesJson from '@/data/addresses.json';
import type { Places, Resource } from './types';

// Offline bundle built by scripts/geo/build-app-data.mjs (Open Data DC + researched directory).
export const places = {
  ...(placesJson as unknown as Places),
  addresses: (addressesJson as unknown as { streets: Places['addresses'] }).streets,
} as Places;
export const resources = (resourcesJson as unknown as { resources: Resource[] }).resources;
