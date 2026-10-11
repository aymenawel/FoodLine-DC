// Copies MapLibre's worker into /public so the map works offline and without bundler worker config.
import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('public/vendor', { recursive: true });
copyFileSync('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs', 'public/vendor/maplibre-gl-worker.mjs');
console.log('copied maplibre worker');
