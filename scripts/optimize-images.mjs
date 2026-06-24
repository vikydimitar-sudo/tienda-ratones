// Optimiza las imágenes de producto: recorta (si procede), redimensiona a un
// ancho máximo y convierte a WebP (formato moderno, ~25-35% más ligero).
// Uso: node scripts/optimize-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "products");

const MAX_W = 800;
const QUALITY = 72;

// salida -> { src, cropLeftFraction? }
const JOBS = {
  "viper-v3-pro": { src: "_cand/g903.jpg" },
  "g-pro-x-superlight": { src: "_cand/gpro.jpg", cropLeftFraction: 0.5 },
  "aerox-3-wireless": { src: "_cand/g305.jpg" },
  "deathadder-essential": { src: "deathadder-essential.jpg" },
  "deathadder-essential-2": { src: "deathadder-essential-2.jpg" },
  "mx-master-4": { src: "mx-master-4.jpg" },
  "mx-master-4-2": { src: "mx-master-4-2.jpg" },
  "pebble-2": { src: "pebble-2.jpg" },
  "pebble-2-2": { src: "pebble-2-2.jpg" },
  "ergo-m575": { src: "ergo-m575.jpg" },
  "ergo-m575-2": { src: "ergo-m575-2.jpg" },
  "vertical-lift": { src: "vertical-lift.jpg" },
};

let total = 0;
for (const [out, job] of Object.entries(JOBS)) {
  const srcPath = path.join(dir, job.src);
  let img = sharp(srcPath);
  const meta = await img.metadata();

  if (job.cropLeftFraction) {
    const w = Math.round(meta.width * job.cropLeftFraction);
    img = img.extract({ left: 0, top: 0, width: w, height: meta.height });
  }

  const outPath = path.join(dir, `${out}.webp`);
  await img
    .resize({ width: MAX_W, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);

  const { size } = await fs.stat(outPath);
  total += size;
  console.log(`${out}.webp  ${(size / 1024).toFixed(1)} KB`);
}
console.log(`Total: ${(total / 1024).toFixed(1)} KB en ${Object.keys(JOBS).length} imágenes`);
