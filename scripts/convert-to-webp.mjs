import sharp from 'sharp';
import { readdir, unlink, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { glob } from 'glob';

const PUBLIC_DIR = path.resolve('public');
const SRC_DIR = path.resolve('src');

// Folders to scan for PNG files (non-SVG images worth converting)
const SCAN_DIRS = [
  PUBLIC_DIR,
  path.join(PUBLIC_DIR, 'partners'),
];

// Files to skip (logos / icons that may need transparency or are tiny)
const SKIP = new Set(['unicef.svg']);

async function convertDir(dir) {
  const files = await readdir(dir);
  const pngs = files.filter(f => f.endsWith('.png') && !SKIP.has(f));

  for (const file of pngs) {
    const inputPath = path.join(dir, file);
    const baseName = file.replace(/\.png$/, '');
    const outputPath = path.join(dir, `${baseName}.webp`);

    const inputStat = (await import('fs')).statSync(inputPath);
    const inputKB = (inputStat.size / 1024).toFixed(0);

    await sharp(inputPath)
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    const outputStat = (await import('fs')).statSync(outputPath);
    const outputKB = (outputStat.size / 1024).toFixed(0);
    const saving = (100 - (outputStat.size / inputStat.size) * 100).toFixed(0);

    console.log(`✅ ${file} → ${baseName}.webp  (${inputKB}KB → ${outputKB}KB, saved ${saving}%)`);
  }

  return pngs.map(f => ({
    oldName: f,
    newName: f.replace(/\.png$/, '.webp'),
    relDir: path.relative(PUBLIC_DIR, dir),
  }));
}

async function updateSourceRefs(conversions) {
  // Gather all TS/TSX/JS/JSX/JSON source files
  const srcFiles = await glob('src/**/*.{ts,tsx,js,jsx}', { cwd: process.cwd() });
  const configFiles = ['next.config.ts', 'next.config.js', 'next.config.mjs'];

  const allFiles = [...srcFiles, ...configFiles.filter(f => existsSync(f))];

  let totalReplacements = 0;

  for (const file of allFiles) {
    let content = await readFile(file, 'utf-8');
    let modified = false;

    for (const { oldName, newName, relDir } of conversions) {
      // Build the path as it appears in source code (forward slashes, starting with /)
      const oldRef = relDir
        ? `/${relDir}/${oldName}`.replace(/\\/g, '/')
        : `/${oldName}`;
      const newRef = relDir
        ? `/${relDir}/${newName}`.replace(/\\/g, '/')
        : `/${newName}`;

      if (content.includes(oldRef)) {
        content = content.replaceAll(oldRef, newRef);
        modified = true;
        totalReplacements++;
        console.log(`  📝 ${file}: "${oldRef}" → "${newRef}"`);
      }
    }

    if (modified) {
      await writeFile(file, content, 'utf-8');
    }
  }

  console.log(`\n📝 Updated ${totalReplacements} reference(s) across source files.`);
}

async function deleteOldPngs(conversions) {
  for (const { oldName, relDir } of conversions) {
    const fullPath = relDir
      ? path.join(PUBLIC_DIR, relDir, oldName)
      : path.join(PUBLIC_DIR, oldName);

    if (existsSync(fullPath)) {
      await unlink(fullPath);
      console.log(`🗑️  Deleted ${relDir ? relDir + '/' : ''}${oldName}`);
    }
  }
}

async function main() {
  console.log('🚀 Converting PNG → WebP...\n');

  const allConversions = [];
  for (const dir of SCAN_DIRS) {
    const conversions = await convertDir(dir);
    allConversions.push(...conversions);
  }

  console.log(`\n🔍 Updating source file references...\n`);
  await updateSourceRefs(allConversions);

  console.log('\n🗑️  Removing original PNGs...\n');
  await deleteOldPngs(allConversions);

  console.log('\n✨ Done! All images converted to WebP.');

  // Print summary
  const totalOld = allConversions.length;
  console.log(`\n📊 Converted ${totalOld} image(s).`);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
