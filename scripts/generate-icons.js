import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PWA icons...');
  await sharp(svgBuffer).resize(192, 192).png().toFile('public/pwa-192x192.png');
  console.log('Generated pwa-192x192.png');

  await sharp(svgBuffer).resize(512, 512).png().toFile('public/pwa-512x512.png');
  console.log('Generated pwa-512x512.png');

  await sharp(svgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');

  // Maskable icon with 10% safe zone padding
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 180, g: 83, b: 9, alpha: 1 },
    })
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Generated pwa-maskable-512x512.png');

  console.log('All PWA icons generated successfully!');
}

generate().catch(console.error);
