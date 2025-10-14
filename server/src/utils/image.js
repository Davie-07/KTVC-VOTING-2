const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processAndSaveImage(file, outputDir) {
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const outPath = path.join(outputDir, filename);

  const image = sharp(file.path);
  const resized = image.resize({ width: 800, withoutEnlargement: true }).jpeg({ quality: 75 });
  await resized.toFile(outPath);

  const metadata = await sharp(outPath).metadata();
  // remove original temp file if exists
  try { fs.unlinkSync(file.path); } catch (_) {}

  return {
    url: `/uploads/${filename}`,
    meta: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      sizeKb: Math.round((fs.statSync(outPath).size / 1024) * 100) / 100
    }
  };
}

module.exports = { processAndSaveImage };

