#!/usr/bin/env node
/**
 * integrate-scraped-images.js
 * Integra las imágenes descargadas por el soccer-scraper en el catálogo.
 *
 * Uso:
 *   node scripts/integrate-scraped-images.js           # Ejecución real
 *   node scripts/integrate-scraped-images.js --dry-run # Solo mostrar sin escribir
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// eslint-disable-next-line no-undef
const DRY_RUN = process.argv.includes('--dry-run');

// ── Rutas ────────────────────────────────────────────────────────────────────
const SCRAPER_ROOT   = path.resolve(__dirname, '../../soccer-scraper');
const MANIFEST_FILE  = path.join(SCRAPER_ROOT, 'output', 'catalog_images_manifest.json');
const PRODUCTS_FILE  = path.resolve(__dirname, '../src/data/products.json');
const IMAGES_DEST    = path.resolve(__dirname, '../public/images/products');
const REPORT_FILE    = path.resolve(__dirname, '../integration-report.json');

// ── Configuración ─────────────────────────────────────────────────────────────
const PRICE_NEW = 19.99;

// Mapping: audience + kitType → { typeStr, suffix }
const TYPE_MAP = {
  adult: {
    home:  { typeStr: 'Home 25/26', suffix: 'HOME_2526' },
    away:  { typeStr: 'Away 25/26', suffix: 'AWAY_2526' },
    third: { typeStr: 'Third 25/26', suffix: '3RD_2526' },
  },
  kids: {
    home:  { typeStr: 'Home Niño',  suffix: 'HOME_NINO' },
    away:  { typeStr: 'Away Niño',  suffix: 'AWAY_NINO' },
    third: { typeStr: 'Third Niño', suffix: '3RD_NINO' },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function sanitizeTeamName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar diacríticos
    .replace(/[^a-zA-Z0-9 ]/g, '')  // solo alfanumérico y espacios
    .trim()
    .replace(/ +/g, '_');
}

function isAlbumStyleImage(imagePath) {
  const filename = path.basename(imagePath);
  return (
    filename.startsWith('album_') ||
    filename.startsWith('kids_') ||
    filename.startsWith('adult_') ||
    imagePath.includes('placehold')
  );
}

function isIdBasedImage(imagePath) {
  const filename = path.basename(imagePath);
  // Formato: NNNN_Team_SUFFIX.jpg  (empieza con dígitos)
  return /^\d{4,}_/.test(filename);
}

function generateFilename(id, teamName, suffix, ext) {
  const teamSanitized = sanitizeTeamName(teamName);
  return `${id}_${teamSanitized}_${suffix}${ext}`;
}

function resolveScraperPath(relPath) {
  // El manifest usa paths como "./output/arsenal/adult/home.jpg"
  // Los resolvemos desde SCRAPER_ROOT
  const normalized = relPath.replace(/^\.\/output\//, '');
  return path.join(SCRAPER_ROOT, 'output', normalized);
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  console.log(`\n🚀 Soccer Scraper Integration${DRY_RUN ? ' [DRY RUN]' : ''}\n`);

  // 1. Cargar datos
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  const products  = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));

  console.log(`📦 Manifest: ${manifest.length} equipos`);
  console.log(`📋 Productos existentes: ${products.length}`);

  // 2. Construir índice de catálogo: "team||type" → producto
  const catalogIndex = new Map();
  for (const p of products) {
    catalogIndex.set(`${p.team}||${p.type}`, p);
  }

  // 3. Construir mapa equipo → liga desde products.json
  const teamLeagueMap = new Map();
  for (const p of products) {
    if (!teamLeagueMap.has(p.team)) {
      teamLeagueMap.set(p.team, p.league);
    }
  }

  // 4. Calcular siguiente ID disponible
  let nextId = Math.max(...products.map(p => p.id)) + 1;
  console.log(`🆔 Próximo ID disponible: ${nextId}\n`);

  // 5. Contadores y log
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    summary: { added: 0, replaced: 0, skipped_exists: 0, skipped_no_source: 0, skipped_no_file: 0 },
    added: [],
    replaced: [],
    skipped: [],
  };

  const newProducts = [];

  // 6. Iterar manifest
  for (const entry of manifest) {
    const { team } = entry;
    const league = teamLeagueMap.get(team) ?? 'Otras Ligas';

    for (const audience of ['adult', 'kids']) {
      for (const kitType of ['home', 'away', 'third']) {
        const relPath = entry[audience]?.[kitType];
        const { typeStr, suffix } = TYPE_MAP[audience][kitType];
        const key = `${team}||${typeStr}`;

        // GATE 1: ¿existe path en manifest?
        if (!relPath) {
          report.summary.skipped_no_source++;
          report.skipped.push({ reason: 'no_source', team, audience, kitType });
          continue;
        }

        // GATE 2: ¿existe el archivo en disco?
        const srcAbs = resolveScraperPath(relPath);
        if (!fs.existsSync(srcAbs)) {
          report.summary.skipped_no_file++;
          report.skipped.push({ reason: 'file_not_on_disk', team, audience, kitType, path: srcAbs });
          continue;
        }

        const ext = path.extname(srcAbs).toLowerCase() || '.jpg';
        const existing = catalogIndex.get(key);

        if (!existing) {
          // CASE A: Producto nuevo
          const newId = nextId++;
          const filename = generateFilename(newId, team, suffix, ext);
          const destAbs = path.join(IMAGES_DEST, filename);
          const imageRef = `/images/products/${filename}`;

          const newProduct = { id: newId, league, team, type: typeStr, image: imageRef, price: PRICE_NEW };

          if (!DRY_RUN) {
            fs.copyFileSync(srcAbs, destAbs);
            newProducts.push(newProduct);
            catalogIndex.set(key, newProduct);
          }

          report.summary.added++;
          report.added.push({ id: newId, team, type: typeStr, filename, league });
          console.log(`  ✅ AÑADIDO  [${newId}] ${team} — ${typeStr}`);

        } else if (isAlbumStyleImage(existing.image)) {
          // CASE B: Reemplazar imagen album_*/kids_* con scraped
          const filename = generateFilename(existing.id, team, suffix, ext);
          const destAbs = path.join(IMAGES_DEST, filename);
          const oldImage = existing.image;
          const imageRef = `/images/products/${filename}`;

          if (!DRY_RUN) {
            fs.copyFileSync(srcAbs, destAbs);
            existing.image = imageRef;
          }

          report.summary.replaced++;
          report.replaced.push({ id: existing.id, team, type: typeStr, oldImage, newFilename: filename });
          console.log(`  🔄 REEMPLAZADO [${existing.id}] ${team} — ${typeStr}`);
          console.log(`     ${oldImage} → /images/products/${filename}`);

        } else if (isIdBasedImage(existing.image)) {
          // CASE C: Ya tiene imagen con naming correcto, no tocar
          report.summary.skipped_exists++;
          report.skipped.push({ reason: 'already_has_id_image', team, type: typeStr, image: existing.image });
        } else {
          // CASE D: Imagen con formato desconocido, reemplazar por seguridad
          const filename = generateFilename(existing.id, team, suffix, ext);
          const destAbs = path.join(IMAGES_DEST, filename);
          const oldImage = existing.image;
          const imageRef = `/images/products/${filename}`;

          if (!DRY_RUN) {
            fs.copyFileSync(srcAbs, destAbs);
            existing.image = imageRef;
          }

          report.summary.replaced++;
          report.replaced.push({ id: existing.id, team, type: typeStr, oldImage, newFilename: filename });
          console.log(`  🔄 REEMPLAZADO (unknown fmt) [${existing.id}] ${team} — ${typeStr}`);
        }
      }
    }
  }

  // 7. Escribir resultados
  if (!DRY_RUN) {
    const allProducts = [...products, ...newProducts].sort((a, b) => a.id - b.id);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(allProducts, null, 2), 'utf8');
    console.log(`\n💾 products.json actualizado: ${allProducts.length} productos`);
  }

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');

  // 8. Resumen final
  console.log('\n──────────────────────────────────────────');
  console.log('📊 RESUMEN FINAL');
  console.log('──────────────────────────────────────────');
  console.log(`  ✅ Añadidos:              ${report.summary.added}`);
  console.log(`  🔄 Reemplazados:          ${report.summary.replaced}`);
  console.log(`  ⏭️  Omitidos (ya existe):  ${report.summary.skipped_exists}`);
  console.log(`  ⚠️  Omitidos (sin source): ${report.summary.skipped_no_source}`);
  console.log(`  ⚠️  Omitidos (sin archivo):${report.summary.skipped_no_file}`);
  console.log(`\n📄 Reporte completo: integration-report.json`);
  if (DRY_RUN) {
    console.log('\n⚠️  DRY RUN completado — no se han escrito cambios.');
    console.log('   Ejecuta sin --dry-run para aplicar.\n');
  }
}

main();
