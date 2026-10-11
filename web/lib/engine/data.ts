import placesJson from '@/data/places.json';
import resourcesJson from '@/data/resources.json';
import type { Places, Resource } from './types';

// Offline bundle built by scripts/geo/build-app-data.mjs (Open Data DC + researched directory).
export const places = placesJson as unknown as Places;
export const resources = (resourcesJson as unknown as { resources: Resource[] }).resources;
