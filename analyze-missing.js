import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const scraped = JSON.parse(fs.readFileSync('/tmp/yupoo-scraped.json'));
const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/products.json')));

function normalizeTeam(t) {
  return t.toLowerCase()
    .replace(/[áàä]/g,'a').replace(/[éèë]/g,'e').replace(/[íì]/g,'i')
    .replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/ñ/g,'n')
    .replace(/\./g,'').replace(/\s+/g,' ').trim();
}

// Build catalog lookup
const catalogSet = new Set();
catalog.forEach(p => {
  const nt = normalizeTeam(p.team);
  const tp = (p.type || '').toLowerCase();
  catalogSet.add(nt + '|' + tp);
});

console.log('Catalog entries:', catalog.length);
console.log('Catalog unique team+type:', catalogSet.size);

// Show all catalog types
const types = [...new Set(catalog.map(p => p.type))].sort();
console.log('\nCatalog types:', types);

function parseYupoo(title) {
  const t = title.toLowerCase();
  const isKids = t.startsWith('kids ') || t.includes(' kids kit') || t.includes(' kids jersey') || t.includes(' kids ');

  let type = '';
  if (/\bhome\b/.test(t)) type = 'home';
  else if (/\baway\b/.test(t)) type = 'away';
  else if (/\bthird\b/.test(t)) type = 'third';

  let team = title
    .replace(/^Kids\s+/i, '')
    .replace(/^Mens?\s+/i, '')
    .replace(/^Men's\s+/i, '')
    .replace(/\s+2025\/26.*$/i, '')
    .replace(/\s+25\/26.*$/i, '')
    .trim();

  return { team: normalizeTeam(team), teamRaw: team, type, isKids };
}

const missing = [];
scraped.forEach(item => {
  const { team, teamRaw, type, isKids } = parseYupoo(item.title);
  if (!type) return;

  // Kids in catalog are stored as 'home niño', 'away niño', 'third niño'
  const catalogType = isKids ? (type + ' niño') : type;
  const key = team + '|' + catalogType;

  if (!catalogSet.has(key)) {
    missing.push({ ...item, parsedTeam: teamRaw, parsedTeamNorm: team, parsedType: type, isKids, catalogKey: key });
  }
});

console.log('\n=== MISSING FROM CATALOG ===');
console.log('Total missing:', missing.length);

const kidsM = missing.filter(m => m.isKids);
const adultM = missing.filter(m => !m.isKids);
console.log('Adults missing:', adultM.length);
console.log('Kids missing:', kidsM.length);

console.log('\n--- ADULTS MISSING ---');
adultM.forEach(m => console.log(`  [${m.parsedType.toUpperCase()}] ${m.parsedTeam} | ${m.title}`));

console.log('\n--- KIDS MISSING ---');
kidsM.forEach(m => console.log(`  [${m.parsedType.toUpperCase()}] ${m.parsedTeam} | ${m.title}`));

fs.writeFileSync('/tmp/yupoo-missing.json', JSON.stringify(missing, null, 2));
console.log('\nSaved to /tmp/yupoo-missing.json');
