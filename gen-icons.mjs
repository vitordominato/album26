// Regera os PNGs de PWA a partir de public/icon.svg.
// Rode `npm run gen-icons` quando trocar o desenho do ícone.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const publicDir = join(root, 'public');
const svg = readFileSync(join(publicDir, 'icon.svg'));

const targets = [
  { name: 'pwa-192.png', size: 192 },
  { name: 'pwa-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.png', size: 64 },
];

for (const { name, size } of targets) {
  const out = join(publicDir, name);
  await sharp(svg, { density: 600 }).resize(size, size).png().toFile(out);
  console.log(`wrote ${out}`);
}
