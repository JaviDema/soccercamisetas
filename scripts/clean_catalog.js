import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../src/data/products.json');
let products = JSON.parse(readFileSync(dataPath, 'utf8'));

// ─── TEAM NAME NORMALIZATION ─────────────────────────────────────────────────
const TEAM_NAME_MAP = {
  'Barcelona': 'FC Barcelona',
  'Atletico Madrid': 'Atlético de Madrid',
  'Barcelona 2006': 'FC Barcelona 2006',
  'Atletico Madrid 2005': 'Atlético de Madrid 2005',
  "Men's Real Valladolid": 'Real Valladolid',
  "Men's Real Sociedad": 'Real Sociedad',
  "Men's Real Oviedo": 'Real Oviedo',
  "Men's Rayo Vallecano": 'Rayo Vallecano',
  "Men's Levante UD": 'Levante UD',
  "Men's Granada": 'Granada CF',
  "Men's CD Tenerife": 'CD Tenerife',
  "Men's CA Osasuna": 'Osasuna',
  "Men's Burgos CF": 'Burgos CF',
  "Men's Everton": 'Everton',
  "Men's Burnley F.C.": 'Burnley FC',
  "Men's Ajax": 'Ajax',
  "Men's Vitoria de Guimaraes": 'Vitoria de Guimaraes',
};

// ─── LEAGUES TO COLLAPSE INTO "Otras Ligas" ──────────────────────────────────
// Everything not in BIG_LEAGUES becomes "Otras Ligas"
const BIG_LEAGUES = new Set([
  'La Liga', 'Premier League', 'Serie A', 'Bundesliga', 'Ligue 1',
  'Selecciones', 'Retro',
]);

// ─── SPECIFIC TEAM+LEAGUE CORRECTIONS ────────────────────────────────────────
// Format: `team|||league` → target league
const REASSIGN = {
  // Misassigned clubs
  'Rangers|||Ligue 1': 'Otras Ligas',
  'Lille OSC|||Otras Ligas': 'Ligue 1',
  'Lille OSC|||Otras Ligas Europa': 'Ligue 1',
  'Genoa CFC|||Otras Ligas': 'Serie A',
  'Genoa CFC|||Otras Ligas Europa': 'Serie A',
  'Cagliari Calcio|||Otras Ligas': 'Serie A',
  'Cagliari Calcio|||Otras Ligas Europa': 'Serie A',
  'FC St. Pauli|||Otras Ligas': 'Bundesliga',
  'FC St. Pauli|||Otras Ligas Europa': 'Bundesliga',
  'FC Heidenheim|||Otras Ligas': 'Bundesliga',
  'FC Heidenheim|||Otras Ligas Europa': 'Bundesliga',
  'FC Augsburg|||Otras Ligas': 'Bundesliga',
  'FC Augsburg|||Otras Ligas Europa': 'Bundesliga',
  // Wrongly in Selecciones
  'FC Famalicao|||Selecciones': 'Otras Ligas',
  'Universidad de Chile|||Selecciones': 'Otras Ligas',
  'New England Revolution|||Selecciones': 'Otras Ligas',
  // Men's → correct league
  'Everton|||Otras Ligas': 'Premier League',
  'Real Valladolid|||Otras Ligas': 'La Liga',
  'Real Sociedad|||Otras Ligas': 'La Liga',
  'Rayo Vallecano|||Otras Ligas': 'La Liga',
  'Osasuna|||Otras Ligas': 'La Liga',
  // Not currently in top division
  'FC Red Bull Salzburg|||Bundesliga': 'Otras Ligas',
  'Hamburger SV|||Bundesliga': 'Otras Ligas',
  'Schalke 04|||Bundesliga': 'Otras Ligas',
  'Hertha BSC|||Bundesliga': 'Otras Ligas',
  '1. FC Köln|||Bundesliga': 'Otras Ligas',
  'Leeds United|||Premier League': 'Otras Ligas',
  'Sheffield United|||Premier League': 'Otras Ligas',
  'U.S. Sassuolo Calcio|||Serie A': 'Otras Ligas',
  'Palermo F.C.|||Serie A': 'Otras Ligas',
  'Unione Sportiva Cremonese|||Serie A': 'Otras Ligas',
  // English lower-league teams
  'Norwich City|||Otras Ligas Europa': 'Otras Ligas',
  'Port Vale|||Otras Ligas Europa': 'Otras Ligas',
  'Plymouth Argyle|||Otras Ligas Europa': 'Otras Ligas',
  'Bradford City|||Otras Ligas Europa': 'Otras Ligas',
  'AFC Richmond|||Otras Ligas Europa': 'Otras Ligas',
};

let changeCount = 0;

const cleaned = products.map(p => {
  // 1. Normalize team name
  const team = TEAM_NAME_MAP[p.team] || p.team;

  // 2. Determine league
  let league = p.league;

  // Specific reassignments (use normalized team name)
  const specificKey = `${team}|||${league}`;
  if (REASSIGN[specificKey]) {
    league = REASSIGN[specificKey];
  } else if (!BIG_LEAGUES.has(league)) {
    // All minor leagues → Otras Ligas
    league = 'Otras Ligas';
  }

  if (team !== p.team || league !== p.league) changeCount++;
  return { ...p, team, league };
});

// ─── SUMMARY ────────────────────────────────────────────────────────────────
const leagueCounts = {};
for (const p of cleaned) leagueCounts[p.league] = (leagueCounts[p.league] || 0) + 1;

console.log('=== LEAGUE SUMMARY ===');
for (const [l, c] of Object.entries(leagueCounts).sort()) console.log(`  ${l}: ${c}`);
console.log(`\nTotal products: ${cleaned.length}  |  Changes made: ${changeCount}`);
console.log(`Total leagues: ${Object.keys(leagueCounts).length}`);

writeFileSync(dataPath, JSON.stringify(cleaned, null, 2));
console.log('Wrote cleaned products.json');
