import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const scraped = JSON.parse(fs.readFileSync('/tmp/yupoo-scraped.json'));
const productsPath = path.join(__dirname, 'src/data/products.json');
const catalog = JSON.parse(fs.readFileSync(productsPath));
const imagesDir = path.join(__dirname, 'public/images/products');
fs.mkdirSync(imagesDir, { recursive: true });

// ─── Normalize ───────────────────────────────────────────────────────────────
function normalize(t) {
  return (t || '').toLowerCase()
    .replace(/[áàä]/g,'a').replace(/[éèë]/g,'e').replace(/[íì]/g,'i')
    .replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/ñ/g,'n')
    .replace(/['']/g,"'").replace(/\./g,'').replace(/\s+/g,' ').trim();
}

// ─── Catalog existing set ─────────────────────────────────────────────────────
const catalogSet = new Set();
catalog.forEach(p => {
  const team = normalize(p.team);
  const type = (p.type || '').toLowerCase().trim();
  catalogSet.add(team + '|' + type);
});

// ─── League map ───────────────────────────────────────────────────────────────
const leagueMap = {
  // La Liga
  'real madrid':'La Liga','fc barcelona':'La Liga','barcelona':'La Liga',
  'atletico madrid':'La Liga','sevilla fc':'La Liga','real betis':'La Liga',
  'real sociedad':'La Liga','athletic bilbao':'La Liga','villarreal cf':'La Liga',
  'valencia cf':'La Liga','osasuna':'La Liga','ca osasuna':'La Liga',
  'girona':'La Liga','girona fc':'La Liga','rayo vallecano':'La Liga',
  'deportivo alaves':'La Liga','deportivo alaves':'La Liga',
  'getafe':'La Liga','leganes':'La Liga','cd leganes':'La Liga',
  'rcd mallorca':'La Liga','leganés':'La Liga','espanyol':'La Liga',
  'rcd espanyol':'La Liga','celta de vigo':'La Liga','las palmas':'La Liga',
  'ud las palmas':'La Liga','real valladolid':'La Liga',
  // Segunda División
  'albacete':'Segunda División','malaga':'Segunda División','elche':'La Liga',
  'elche cf':'La Liga','real oviedo':'Segunda División',
  'real zaragoza':'Segunda División','sporting de gijon':'Segunda División',
  'sporting de gijón':'Segunda División','cd tenerife':'Segunda División',
  'real murcia':'Segunda División','racing de santander':'Segunda División',
  'levante ud':'Segunda División','levante':'Segunda División',
  'burgos cf':'Segunda División','cordoba cf':'Segunda División',
  'deportivo de la coruna':'Segunda División','hercules cf':'Segunda División',
  'cd castellon':'Segunda División','cartagena':'Segunda División',
  'fc cartagena':'Segunda División','ad ceuta fc':'Segunda División',
  'cultural leonesa':'Segunda División','granada':'Segunda División',
  // Premier League
  'arsenal':'Premier League','chelsea':'Premier League','liverpool':'Premier League',
  'manchester city':'Premier League','manchester united':'Premier League',
  'tottenham hotspur':'Premier League','tottenham':'Premier League',
  'newcastle united':'Premier League','aston villa':'Premier League',
  'west ham united':'Premier League','west ham':'Premier League',
  'brighton':'Premier League','brighton & hove albion':'Premier League',
  'everton':'Premier League','crystal palace':'Premier League',
  'brentford':'Premier League','fulham':'Premier League',
  'nottingham forest':'Premier League','bournemouth':'Premier League',
  'leeds united':'Premier League','leeds united fc':'Premier League',
  'birmingham city fc':'Premier League','birmingham fc':'Premier League',
  // Championship
  'stoke city':'Championship','sheffield wednesday':'Championship',
  'middlesbrough':'Championship','sunderland':'Championship',
  'cardiff city':'Championship','swansea city':'Championship',
  'watford':'Championship','norwich city':'Championship',
  // Serie A
  'juventus':'Serie A','ac milan':'Serie A','inter milan':'Serie A',
  'as roma':'Serie A','napoli':'Serie A','lazio':'Serie A',
  'atalanta':'Serie A','fiorentina':'Serie A','bologna':'Serie A',
  'torino':'Serie A','como 1907':'Serie A','venezia fc':'Serie A',
  'venezia':'Serie A','us cremonese':'Serie A',
  'unione sportiva cremonese':'Serie A','us sassuolo calcio':'Serie A',
  'us sassuolo':'Serie A','parma':'Serie A','lecce':'Serie A',
  // Bundesliga
  'bayern munich':'Bundesliga','borussia dortmund':'Bundesliga',
  'bayer leverkusen':'Bundesliga','rb leipzig':'Bundesliga',
  'eintracht frankfurt':'Bundesliga','vfb stuttgart':'Bundesliga',
  'sc friburgo':'Bundesliga','union berlin':'Bundesliga',
  'wolfsburg':'Bundesliga','vfl wolfsburgo':'Bundesliga',
  'hamburger sv':'Bundesliga','1 fc koln':'Bundesliga','1. fc köln':'Bundesliga',
  'heidenheim':'Bundesliga','hertha berlin':'Bundesliga',
  'st pauli':'Bundesliga','borussia monchengladbach':'Bundesliga',
  'hoffenheim':'Bundesliga','fc red bull salzburg':'Bundesliga',
  // Ligue 1
  'paris saint-germain':'Ligue 1','olympique marseille':'Ligue 1',
  'olympique lyonnais':'Ligue 1','as monaco':'Ligue 1',
  'rc lens':'Ligue 1','stade rennais':'Ligue 1','lille':'Ligue 1',
  'as saint-etienne':'Ligue 1','angers sco':'Ligue 1','paris fc':'Ligue 1',
  'aj auxerre':'Ligue 1',
  // Nacional
  'real madrid':'La Liga','spain':'Selecciones','españa':'Selecciones',
  'alemania':'Selecciones','germany':'Selecciones','england':'Selecciones',
  'england':'Selecciones','italia':'Selecciones','italy':'Selecciones',
  'france':'Selecciones','francia':'Selecciones','portugal':'Selecciones',
  'netherlands':'Selecciones','holanda':'Selecciones','belgium':'Selecciones',
  'argentina':'Selecciones','brazil':'Selecciones','brasil':'Selecciones',
  'mexico':'Selecciones','mexico':'Selecciones','usa':'Selecciones',
  'colombia':'Selecciones','uruguay':'Selecciones','chile':'Selecciones',
  'croatia':'Selecciones','ghana':'Selecciones','morocco':'Selecciones',
  'marruecos':'Selecciones','senegal':'Selecciones','nigeria':'Selecciones',
  'japan':'Selecciones','japon':'Selecciones','korea':'Selecciones',
  'egypt':'Selecciones','mali':'Selecciones','jordan':'Selecciones',
  'haiti':'Selecciones','curacao':'Selecciones','czech republic':'Selecciones',
  'venezuela':'Selecciones','algeria':'Selecciones','sweden':'Selecciones',
  'denmark':'Selecciones','norway':'Selecciones','poland':'Selecciones',
  // Brasileirao
  'flamengo':'Brasileirão','palmeiras':'Brasileirão','atletico mineiro':'Brasileirão',
  'atletico mineiro':'Brasileirão','fluminense':'Brasileirão',
  'vasco da gama':'Brasileirão','botafogo':'Brasileirão','corinthians':'Brasileirão',
  'santos':'Brasileirão','sao paulo':'Brasileirão','são paulo':'Brasileirão',
  'cruzeiro':'Brasileirão','atletico mineiro':'Brasileirão',
  'gremio':'Brasileirão','sport recife':'Brasileirão',
  // Superliga Argentina
  'boca juniors':'Superliga Argentina','river plate':'Superliga Argentina',
  'san lorenzo de almagro':'Superliga Argentina','independiente':'Superliga Argentina',
  'ca independiente':'Superliga Argentina','racing club':'Superliga Argentina',
  'rosario central':'Superliga Argentina','argentinos juniors':'Superliga Argentina',
  'lanus':'Superliga Argentina','atletico nacional':'Superliga Argentina',
  'atletico nacional':'Superliga Argentina','junior barranquilla':'Superliga Argentina',
  'independiente de medellin':'Superliga Argentina',
  // Liga MX
  'chivas':'Liga MX','monterrey':'Liga MX','cruz azul':'Liga MX',
  'club america':'Liga MX','america':'Liga MX','tigres uanl':'Liga MX',
  'deportivo toluca fc':'Liga MX','deportivo toluca':'Liga MX',
  // MLS
  'inter miami':'MLS','la galaxy':'MLS','new york city':'MLS',
  'new england revolution':'MLS','toronto fc':'MLS',
  'vancouver whitecaps fc':'MLS','portland timbers':'MLS',
  'seattle sounders':'MLS','atlanta united':'MLS','austin fc':'MLS',
  'austin':'MLS','charlotte fc':'MLS','cf montreal':'MLS',
  'dc united':'MLS','d.c. united':'MLS','philadelphia union':'MLS',
  'san jose earthquakes':'MLS','san diego fc':'MLS',
  'new york red bulls':'MLS','los angeles fc':'MLS',
  'orlando city':'MLS','fc cincinnati':'MLS',
  // Scottish
  'celtic':'Scottish PL','rangers':'Scottish PL',
  'aberdeen fc':'Scottish PL','ayr united fc':'Scottish PL',
  // Liga Portugal
  'benfica':'Liga Portugal','fc porto':'Liga Portugal','sporting cp':'Liga Portugal',
  'braga':'Liga Portugal','vitoria sc':'Liga Portugal',
  // Dutch
  'ajax':'Eredivisie','psv eindhoven':'Eredivisie',
  'feyenoord rotterdam':'Eredivisie','feyenoord':'Eredivisie',
  'az alkmaar':'Eredivisie','twente':'Eredivisie',
  "men's ajax":'Eredivisie',
  // Saudi
  'al-nassr':'Saudi Pro League','al nassr':'Saudi Pro League',
  'al-nassr fc':'Saudi Pro League','al hilal sc':'Saudi Pro League',
  'al hilal':'Saudi Pro League','al-ittihad':'Saudi Pro League',
  // Other
  'galatasaray':'Süper Lig','besiktas':'Süper Lig',
  'club brugge kv':'Pro League','servette fc':'Swiss Super League',
  'panathinaikos fc':'Super League Greece',
  'red star belgrade':'SuperLiga Serbia',
  'fc shakhtar donetsk':'Primera Liga Ucraniana',
  'fc dinamo tbilisi':'Liga georgiana',
  'emelec guayaquil':'Liga Pro Ecuador','alianza lima':'Liga 1 Perú',
  'cerro porteno':'División de Honor Paraguay',
  'cd palestino':'Primera División Chile',
  'colo colo':'Primera División Chile','universidad de chile':'Primera División Chile',
  'bohemians':'League of Ireland',
  'young africans':'Tanzania Mainland Premier League',
};

function getLeague(teamNorm) {
  return leagueMap[teamNorm] || 'Otras Ligas';
}

// ─── Parse title ─────────────────────────────────────────────────────────────
function parseTitle(title) {
  const t = title.toLowerCase();
  const isKids = /^kids\s/i.test(title) || /\bkids\b/.test(t);

  let type = '';
  if (/\bhome\b/.test(t)) type = 'home';
  else if (/\baway\b/.test(t)) type = 'away';
  else if (/\bthird\b/.test(t)) type = 'third';
  if (!type) return null;

  let team = title
    .replace(/^Kids\s+/i, '')
    .replace(/^Mens?\s+/i, '')
    .replace(/^Men's\s+/i, '')
    .replace(/\s+2025\/26.*$/i, '')
    .replace(/\s+25\/26.*$/i, '')
    .trim();

  // Skip collab kits, basketball, concept versions
  if (/x ed sheeran|x dellafuente|x anuel|baloncesto|basketball|concept version/i.test(team)) return null;

  return { team, teamNorm: normalize(team), type, isKids };
}

// ─── Extra exclusions ─────────────────────────────────────────────────────────
function isExcluded(title) {
  const t = title.toLowerCase();
  return t.includes('s-xxl') || t.includes('s-xxxxl') || t.includes('concept version') ||
         t.includes('basketball') || t.includes('baloncesto') || t.includes('leaked') ||
         t.includes('all sponsor') || t.includes('x ed sheeran') || t.includes('x dellafuente') ||
         t.includes('x anuel') || t.includes('academy pro') || t.includes('2026/27') ||
         t.includes('2024/25') || t.includes('24/25');
}

// ─── Download image ───────────────────────────────────────────────────────────
function downloadImage(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) return resolve(true);
    const file = fs.createWriteStream(dest);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Referer': 'https://royal-sports.x.yupoo.com/',
      }
    }, res => {
      if (res.statusCode !== 200) { file.close(); fs.unlink(dest, ()=>{}); return resolve(false); }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    });
    req.on('error', () => { file.close(); fs.unlink(dest, ()=>{}); resolve(false); });
    req.setTimeout(15000, () => { req.destroy(); resolve(false); });
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const maxId = Math.max(...catalog.map(p => parseInt(p.id) || 0));
  let nextId = maxId + 1;

  // Deduplicate scraped by team+type (pick first one with an image)
  const bestByKey = new Map();
  for (const item of scraped) {
    if (isExcluded(item.title)) continue;
    const parsed = parseTitle(item.title);
    if (!parsed) continue;
    const { teamNorm, type, isKids } = parsed;
    const catalogType = isKids ? (type + ' niño') : type;
    const key = teamNorm + '|' + catalogType;
    // Skip if already in catalog
    if (catalogSet.has(key)) continue;
    // Keep best (prefer one with image)
    if (!bestByKey.has(key) || (!bestByKey.get(key).img && item.img)) {
      bestByKey.set(key, { ...item, parsed });
    }
  }

  console.log(`📊 New items to add: ${bestByKey.size}`);

  const newProducts = [];
  let downloaded = 0, skipped = 0, errors = 0;

  for (const [key, item] of bestByKey) {
    const { team, teamNorm, type, isKids } = item.parsed;
    const catalogType = isKids ? (type + ' niño') : type;

    if (!item.img) {
      console.log(`⚠️  Sin imagen: ${item.title}`);
      skipped++;
      continue;
    }

    const filename = `album_${item.albumId}.jpg`;
    const localPath = path.join(imagesDir, filename);
    const publicPath = `/images/products/${filename}`;

    process.stdout.write(`📥 ${item.title}... `);
    const ok = await downloadImage(item.img, localPath);
    if (!ok) {
      console.log('❌');
      errors++;
      continue;
    }
    console.log('✅');
    downloaded++;

    const league = getLeague(teamNorm);
    newProducts.push({
      id: nextId++,
      league,
      team,
      type: catalogType,
      image: publicPath,
      price: 19.99
    });
  }

  // Write to products.json
  const updated = [...catalog, ...newProducts];
  fs.writeFileSync(productsPath, JSON.stringify(updated, null, 2));

  console.log(`\n✅ Completado:`);
  console.log(`   - Imágenes descargadas: ${downloaded}`);
  console.log(`   - Sin imagen (saltados): ${skipped}`);
  console.log(`   - Errores: ${errors}`);
  console.log(`   - Nuevos productos añadidos: ${newProducts.length}`);
  console.log(`   - Total productos en catálogo: ${updated.length}`);
}

main().catch(console.error);
