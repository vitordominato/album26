/**
 * Gera os PNGs de ícone do PWA a partir de public/icons/icon.svg
 * Uso: node scripts/generate-icons.mjs
 *
 * Requer `sharp` instalado: npm i -D sharp
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
];

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Sharp não instalado. Rode: npm i -D sharp');
    process.exit(1);
  }

  const iconsDir = path.resolve('public/icons');
  if (!existsSync(iconsDir)) await mkdir(iconsDir, { recursive: true });

  const svg = await readFile(path.join(iconsDir, 'icon.svg'));

  for (const { name, size } of sizes) {
    const out = path.join(iconsDir, name);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log(`✔ ${name} (${size}x${size})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
