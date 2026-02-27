import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// All scraped albums from https://royal-sports.x.yupoo.com/albums (10 pages)
// Filtered: only home/away/third jerseys, no kids, no women, no goalkeeper, no shorts, no long sleeve, no player version, no retro
// Images fetched individually for those missing from category listing
const rawAlbums = [
  {"title":"Mens Brazil 2026 World Cup Home Jersey","albumId":"224653680","img":"https://photo.yupoo.com/royal-sports/30791320/medium.jpg"},
  {"title":"Mens Uruguay 2026 World Cup Away Jersey","albumId":"224246110","img":"https://photo.yupoo.com/royal-sports/cdb2c8c6/medium.jpg"},
  {"title":"Mens Ghana 2026 World Cup Home Jersey","albumId":"224245853","img":"https://photo.yupoo.com/royal-sports/7a466924/medium.jpg"},
  {"title":"Mens Egypt 2026 World Cup Away Jersey","albumId":"224245830","img":"https://photo.yupoo.com/royal-sports/dc17aa67/medium.jpg"},
  {"title":"Mens Czech Republic 2026 World Cup Home Jersey","albumId":"224245820","img":"https://photo.yupoo.com/royal-sports/c8eccc90/medium.jpg"},
  {"title":"Mens Belgium 2026 World Cup Away Jersey","albumId":"224245797","img":"https://photo.yupoo.com/royal-sports/e4c61326/medium.jpg"},
  {"title":"Mens Argentina 2026 World Cup Away Jersey","albumId":"224245771","img":"https://photo.yupoo.com/royal-sports/6edff664/medium.jpg"},
  {"title":"Mens Morocco 2026 World Cup Home Jersey","albumId":"222988768","img":"https://photo.yupoo.com/royal-sports/0947871b/medium.jpg"},
  {"title":"Mens Italy 2026 World Cup Home Jersey","albumId":"222988744","img":"https://photo.yupoo.com/royal-sports/f1e28666/medium.jpg"},
  {"title":"Mens Haiti 2026 World Cup Third Jersey","albumId":"222988730","img":"https://photo.yupoo.com/royal-sports/4004d550/medium.jpg"},
  {"title":"Mens Haiti 2026 World Cup Home Jersey","albumId":"222988711","img":"https://photo.yupoo.com/royal-sports/928f67a0/medium.jpg"},
  {"title":"Mens Haiti 2026 World Cup Away Jersey","albumId":"222988707","img":"https://photo.yupoo.com/royal-sports/3b917d24/medium.jpg"},
  {"title":"Mens Curaçao 2026 World Cup Away Jersey","albumId":"222988679","img":"https://photo.yupoo.com/royal-sports/ba9aa61e/medium.jpg"},
  {"title":"Mens Jordan 2026 World Cup Third Jersey","albumId":"222820982","img":"https://photo.yupoo.com/royal-sports/c4ed5e4f/medium.jpg"},
  {"title":"Mens Jordan 2026 World Cup Home Jersey","albumId":"222820975","img":"https://photo.yupoo.com/royal-sports/8eab59fc/medium.jpg"},
  {"title":"Mens Jordan 2026 World Cup Away Jersey","albumId":"222820970","img":"https://photo.yupoo.com/royal-sports/1ba86149/medium.jpg"},
  {"title":"Mens Curaçao 2026 World Cup Home Jersey","albumId":"222820962","img":"https://photo.yupoo.com/royal-sports/184ab3e6/medium.jpg"},
  {"title":"Mens Croatia 2026 World Cup Home Jersey","albumId":"222820958","img":"https://photo.yupoo.com/royal-sports/098fa0f7/medium.jpg"},
  {"title":"Mens Croatia 2026 World Cup Away Jersey","albumId":"222820948","img":"https://photo.yupoo.com/royal-sports/ea16400c/medium.jpg"},
  {"title":"Mens Vasco Da Gama 2026/27 Home Jersey","albumId":"225189717","img":"https://photo.yupoo.com/royal-sports/b1496c1e/medium.jpg"},
  {"title":"Mens Fluminense 2026/27 Home Jersey","albumId":"225189714","img":"https://photo.yupoo.com/royal-sports/d20d4bec/medium.jpg"},
  {"title":"Mens Fluminense 2026/27 Away Jersey","albumId":"225189709","img":"https://photo.yupoo.com/royal-sports/be8e0cfd/medium.jpg"},
  {"title":"Mens Atlético Mineiro 2026/27 Home Jersey","albumId":"225189700","img":"https://photo.yupoo.com/royal-sports/66c53a81/medium.jpg"},
  {"title":"Mens Palmeiras 2026/27 Home Jersey","albumId":"225073748","img":"https://photo.yupoo.com/royal-sports/e679e64a/medium.jpg"},
  {"title":"Mens Manchester City 2026/27 Home Jersey","albumId":"225073713","img":"https://photo.yupoo.com/royal-sports/449dfc37/medium.jpg"},
  {"title":"Mens Flamengo 2026/27 Home Jersey","albumId":"224956057","img":"https://photo.yupoo.com/royal-sports/9e998607/medium.jpg"},
  {"title":"Mens Palmeiras 2026/27 Away Jersey","albumId":"224246378","img":"https://photo.yupoo.com/royal-sports/372ecd6a/medium.jpg"},
  {"title":"Mens Mali 2026 Home Jersey","albumId":"224245909","img":"https://photo.yupoo.com/royal-sports/4f6ec4a0/medium.jpg"},
  {"title":"Mens Mali 2026 Away Jersey","albumId":"224245890","img":"https://photo.yupoo.com/royal-sports/8f526738/medium.jpg"},
  {"title":"Mens Cultural Leonesa 2025/26 Home Jersey","albumId":"222988663","img":"https://photo.yupoo.com/royal-sports/535140f7/medium.jpg"},
  {"title":"Mens Cultural Leonesa 2025/26 Away Jersey","albumId":"222988622","img":"https://photo.yupoo.com/royal-sports/3ece66d0/medium.jpg"},
  {"title":"Mens Real Murcia 2025/26 Away Jersey","albumId":"218379772","img":"https://photo.yupoo.com/royal-sports/e9057d9a/medium.jpg"},
  {"title":"Mens Cartagena 2025/26 Home Jersey","albumId":"218379684","img":"https://photo.yupoo.com/royal-sports/ebd0cbe9/medium.jpg"},
  {"title":"Mens AD Ceuta FC 2025/26 Home Jersey","albumId":"218379617","img":"https://photo.yupoo.com/royal-sports/2f1e5dca/medium.jpg"},
  {"title":"Mens AD Ceuta FC 2025/26 Away Jersey","albumId":"218379605","img":"https://photo.yupoo.com/royal-sports/8a9f8b67/medium.jpg"},
  {"title":"Mens Albacete 2025/26 Third Jersey","albumId":"218287222","img":"https://photo.yupoo.com/royal-sports/5b65922d/medium.jpg"},
  {"title":"Mens FC Famalicao 2025/26 Home Jersey","albumId":"214585216","img":"https://photo.yupoo.com/royal-sports/a06da973/medium.jpg"},
  {"title":"Mens FC Famalicao 2025/26 Away Jersey","albumId":"214585196","img":"https://photo.yupoo.com/royal-sports/96910ec3/medium.jpg"},
  {"title":"Mens Brentford 2025/26 Home Jersey","albumId":"222988598","img":"https://photo.yupoo.com/royal-sports/1739773c/medium.jpg"},
  {"title":"Mens Como 1907 2025/26 Third Jersey","albumId":"222820945","img":"https://photo.yupoo.com/royal-sports/64db5a5f/medium.jpg"},
  {"title":"Mens US Cremonese 2025/26 Third Jersey","albumId":"215423764","img":"https://photo.yupoo.com/royal-sports/5646a98d/medium.jpg"},
  {"title":"Mens Bologna 2025/26 Third Jersey","albumId":"215423670","img":"https://photo.yupoo.com/royal-sports/2a975dea/medium.jpg"},
  {"title":"Mens Venezia FC 2025/26 Third Jersey","albumId":"214586693","img":"https://photo.yupoo.com/royal-sports/922ad754/medium.jpg"},
  {"title":"Mens Unione Sportiva Cremonese 2025/26 Home Jersey","albumId":"214586591","img":"https://photo.yupoo.com/royal-sports/c9b2249c/medium.jpg"},
  {"title":"Mens Unione Sportiva Cremonese 2025/26 Away Jersey","albumId":"214586548","img":"https://photo.yupoo.com/royal-sports/9657d8b3/medium.jpg"},
  {"title":"Mens U.S. Sassuolo Calcio 2025/26 Third Jersey","albumId":"214586521","img":"https://photo.yupoo.com/royal-sports/b4089fd8/medium.jpg"},
  {"title":"Mens U.S. Sassuolo Calcio 2025/26 Away Jersey","albumId":"214586504","img":"https://photo.yupoo.com/royal-sports/e30245ba/medium.jpg"},
  {"title":"Mens Hamburger SV 2025/26 Away Jersey","albumId":"216986120","img":"https://photo.yupoo.com/royal-sports/2b84770d/medium.jpg"},
  {"title":"Mens 1. FC Köln 2025/26 Third Jersey","albumId":"210861843","img":"https://photo.yupoo.com/royal-sports/967d039d/medium.jpg"},
  {"title":"Rangers 2025/26 Away Jersey","albumId":"204445792","img":"https://photo.yupoo.com/royal-sports/f0e51de0/medium.jpg"},
  {"title":"Boca Juniors 2025/26 Away Jersey","albumId":"201727131","img":"https://photo.yupoo.com/royal-sports/922ba758/medium.jpg"},
  {"title":"River Plate 2025/26 Away Jersey","albumId":"200263889","img":"https://photo.yupoo.com/royal-sports/f71786dc/medium.jpg"},
  {"title":"San Lorenzo de Almagro 2025/26 Home Jersey","albumId":"193357557","img":"https://photo.yupoo.com/royal-sports/4440d491/medium.jpg"},
  {"title":"Rosario Central 2025/26 Home Jersey","albumId":"193357540","img":"https://photo.yupoo.com/royal-sports/b2ef3652/medium.jpg"},
  {"title":"Rosario Central 2025/26 Away Jersey","albumId":"193357515","img":"https://photo.yupoo.com/royal-sports/b0090684/medium.jpg"},
  {"title":"Emelec Guayaquil 2025/26 Home Jersey","albumId":"193357027","img":"https://photo.yupoo.com/royal-sports/4c0c1633/medium.jpg"},
  {"title":"CA Independiente 2025/26 Third Jersey","albumId":"193356504","img":"https://photo.yupoo.com/royal-sports/4550cffa/medium.jpg"},
  {"title":"Argentinos Juniors 2025/26 Home Jersey","albumId":"193356206","img":"https://photo.yupoo.com/royal-sports/d24b8de1/medium.jpg"},
  {"title":"Lanus 2025/26 Home Jersey","albumId":"193038798","img":"https://photo.yupoo.com/royal-sports/383ca9b1/medium.jpg"},
  {"title":"Argentinos Juniors 2025/26 Away Jersey","albumId":"193038355","img":"https://photo.yupoo.com/royal-sports/38762aab/medium.jpg"},
  {"title":"San Lorenzo de Almagro 2025/26 Away Jersey","albumId":"192919530","img":"https://photo.yupoo.com/royal-sports/2c5d4b1b/medium.jpg"},
  {"title":"Mens Olympique Lyonnais 2025/26 Third Jersey","albumId":"214586106","img":"https://photo.yupoo.com/royal-sports/613d732e/medium.jpg"},
  {"title":"Mens AJ Auxerre 2025/26 Home Jersey","albumId":"214584268","img":"https://photo.yupoo.com/royal-sports/e853ce0a/medium.jpg"},
  {"title":"Mens Olympique Marseille 2025/26 Third Jersey","albumId":"210862206","img":"https://photo.yupoo.com/royal-sports/22c4b923/medium.jpg"},
  {"title":"Mens AS Monaco 2025/26 Third Jersey","albumId":"210861867","img":"https://photo.yupoo.com/royal-sports/41747ce8/medium.jpg"},
  {"title":"Mens Paris FC 2025/26 Home Jersey","albumId":"210419894","img":"https://photo.yupoo.com/royal-sports/73a9e902/medium.jpg"},
  {"title":"Mens Paris FC 2025/26 Away Jersey","albumId":"210419865","img":"https://photo.yupoo.com/royal-sports/2e9dfa23/medium.jpg"},
  {"title":"Paris Saint-Germain 2025/26 Third Jersey","albumId":"206570316","img":"https://photo.yupoo.com/royal-sports/c72abb7e/medium.jpg"},
  {"title":"AS Saint-Etienne 2025/26 Home Jersey","albumId":"205546770","img":"https://photo.yupoo.com/royal-sports/8814a2a3/medium.jpg"},
  {"title":"AS Monaco 2025/26 Away Jersey","albumId":"205546765","img":"https://photo.yupoo.com/royal-sports/43d668ff/medium.jpg"},
  {"title":"Angers SCO 2025/26 Home Jersey","albumId":"203492848","img":"https://photo.yupoo.com/royal-sports/2d058ff1/medium.jpg"},
  {"title":"Mens Deportivo Toluca F.C. 2025/26 Third Jersey","albumId":"217533736","img":"https://photo.yupoo.com/royal-sports/5c506369/medium.jpg"},
  {"title":"Monterrey 2025/26 Away Jersey","albumId":"206570455","img":"https://photo.yupoo.com/royal-sports/d96bbe9e/medium.jpg"},
  {"title":"Monterrey 2025/26 Home Jersey","albumId":"206570426","img":"https://photo.yupoo.com/royal-sports/ffbdbecb/medium.jpg"},
  {"title":"Chivas 2025/26 Away Jersey","albumId":"201726806","img":"https://photo.yupoo.com/royal-sports/2ecfd8ba/medium.jpg"},
  {"title":"Mens Girona FC 2025/26 Third Jersey","albumId":"218379734","img":null},
  {"title":"Mens Deportivo Alaves 2025/26 Third Jersey","albumId":"218379702","img":null},
  {"title":"Mens Sevilla FC 2025/26 Third Jersey","albumId":"216986145","img":null},
  {"title":"Mens Valencia CF 2025/26 Third Jersey","albumId":"214586006","img":null},
  {"title":"Mens Espanyol 2025/26 Third Jersey","albumId":"213878261","img":null},
  {"title":"Mens Real Madrid 2025/26 Third Jersey","albumId":"210861888","img":null},
  {"title":"Mens FC Barcelona 2025/26 Third Jersey","albumId":"210861823","img":null},
  {"title":"Mens Atletico Madrid 2025/26 Third Jersey","albumId":"206935466","img":null},
  {"title":"Mens Real Betis 2025/26 Third Jersey","albumId":"206935430","img":null},
  {"title":"Real Betis 2025/26 Away Jersey","albumId":"206570585","img":null},
  {"title":"Real Betis 2025/26 Home Jersey","albumId":"206570571","img":null},
  {"title":"Real Sociedad 2025/26 Away Jersey","albumId":"206570521","img":null},
  {"title":"Real Sociedad 2025/26 Home Jersey","albumId":"206570500","img":null},
  {"title":"Girona FC 2025/26 Away Jersey","albumId":"206570489","img":null},
  {"title":"Girona FC 2025/26 Home Jersey","albumId":"206570471","img":null},
  {"title":"Mens Tottenham Hotspur 2025/26 Third Jersey","albumId":"216986094","img":null},
  {"title":"Mens Nottingham Forest 2025/26 Third Jersey","albumId":"216986070","img":null},
  {"title":"Mens Manchester City 2025/26 Third Jersey","albumId":"210861757","img":null},
  {"title":"Mens Everton 2025/26 Third Jersey","albumId":"210861710","img":null},
  {"title":"Mens Crystal Palace 2025/26 Third Jersey","albumId":"210861696","img":null},
  {"title":"Mens Chelsea 2025/26 Third Jersey","albumId":"210861618","img":null},
  {"title":"Mens Arsenal 2025/26 Third Jersey","albumId":"210861584","img":null},
  {"title":"Mens Leeds United 2025/26 Third Jersey","albumId":"206935408","img":null},
  {"title":"Mens Bournemouth 2025/26 Third Jersey","albumId":"206935399","img":null},
  {"title":"Mens Aston Villa 2025/26 Third Jersey","albumId":"206935392","img":null},
  {"title":"Leeds United 2025/26 Away Jersey","albumId":"206570396","img":null},
  {"title":"Leeds United 2025/26 Home Jersey","albumId":"206570376","img":null},
  {"title":"Bournemouth 2025/26 Away Jersey","albumId":"206570354","img":null},
  {"title":"Bournemouth 2025/26 Home Jersey","albumId":"206570342","img":null},
  {"title":"Brighton & Hove Albion 2025/26 Home Jersey","albumId":"206570328","img":null},
  {"title":"Brighton & Hove Albion 2025/26 Away Jersey","albumId":"206570322","img":null},
  {"title":"Rangers 2025/26 Third Jersey","albumId":"204445775","img":"https://photo.yupoo.com/royal-sports/81016c90/medium.jpg"},
  {"title":"Celtic 2025/26 Home Jersey","albumId":"200445027","img":"https://photo.yupoo.com/royal-sports/7768f259/medium.jpg"},
  {"title":"Rangers 2025/26 Home Jersey","albumId":"197152499","img":"https://photo.yupoo.com/royal-sports/a9756f03/medium.jpg"},
  {"title":"Celtic 2025/26 Away Jersey","albumId":"193490020","img":"https://photo.yupoo.com/royal-sports/8dd98fe6/medium.jpg"},
  {"title":"Mens Colo Colo 2025/26 Third Jersey","albumId":"216054813","img":"https://photo.yupoo.com/royal-sports/1ae621fd/medium.jpg"},
  {"title":"Mens Universidad De Chile 2025/26 Third Jersey","albumId":"214586649","img":"https://photo.yupoo.com/royal-sports/e36b3833/medium.jpg"},
  {"title":"CD Palestino 2025/26 Third Jersey","albumId":"193356690","img":"https://photo.yupoo.com/royal-sports/b213c432/medium.jpg"},
  {"title":"CD Palestino 2025/26 Home Jersey","albumId":"193356642","img":"https://photo.yupoo.com/royal-sports/4e10c92a/medium.jpg"},
  {"title":"CD Palestino 2025/26 Away Jersey","albumId":"193356595","img":"https://photo.yupoo.com/royal-sports/0c78f1eb/medium.jpg"},
  {"title":"Inter Miami 2025/26 Third Jersey","albumId":"191121796","img":"https://photo.yupoo.com/royal-sports/04dd007a/medium.jpg"},
  {"title":"Vancouver Whitecaps FC 2025/26 Home Jersey","albumId":"189778242","img":"https://photo.yupoo.com/royal-sports/b9d8dcf4/medium.jpg"},
  {"title":"Toronto FC 2025/26 Home Jersey","albumId":"189778207","img":"https://photo.yupoo.com/royal-sports/70e02290/medium.jpg"},
  {"title":"San Jose Earthquakes 2025/26 Home Jersey","albumId":"189778175","img":"https://photo.yupoo.com/royal-sports/b74b19fa/medium.jpg"},
  {"title":"San Diego FC 2025/26 Home Jersey","albumId":"189778165","img":"https://photo.yupoo.com/royal-sports/9d21d167/medium.jpg"},
  {"title":"Portland Timbers 2025/26 Home Jersey","albumId":"189778134","img":"https://photo.yupoo.com/royal-sports/74ce4bda/medium.jpg"},
  {"title":"Philadelphia Union 2025/26 Away Jersey","albumId":"189778120","img":"https://photo.yupoo.com/royal-sports/850ec153/medium.jpg"},
  {"title":"New York City 2025/26 Home Jersey","albumId":"189778098","img":"https://photo.yupoo.com/royal-sports/e5d3f52c/medium.jpg"},
  {"title":"New England Revolution 2025/26 Away Jersey","albumId":"189778085","img":"https://photo.yupoo.com/royal-sports/0ce181de/medium.jpg"},
  {"title":"D.C. United 2025/26 Away Jersey","albumId":"189778022","img":"https://photo.yupoo.com/royal-sports/8a7c2d32/medium.jpg"},
  {"title":"Charlotte FC 2025/26 Away Jersey","albumId":"189777920","img":"https://photo.yupoo.com/royal-sports/18c25e56/medium.jpg"},
  {"title":"CF Montreal 2025/26 Home Jersey","albumId":"189777897","img":"https://photo.yupoo.com/royal-sports/0ee43e20/medium.jpg"},
  {"title":"Austin FC 2025/26 Home Jersey","albumId":"189777833","img":"https://photo.yupoo.com/royal-sports/1f8b82f1/medium.jpg"},
  {"title":"Al-Nassr 2025/26 Home Jersey","albumId":"206571103","img":"https://photo.yupoo.com/royal-sports/684c5566/medium.jpg"},
  {"title":"Al-Nassr 2025/26 Third Jersey","albumId":"201608613","img":"https://photo.yupoo.com/royal-sports/219b5462/medium.jpg"},
  {"title":"Al Hilal SC 2025/26 Home Jersey","albumId":"201157470","img":"https://photo.yupoo.com/royal-sports/8d008875/medium.jpg"},
  {"title":"Mens Club Brugge KV 2025/26 Away Jersey","albumId":"214585007","img":"https://photo.yupoo.com/royal-sports/485ff39d/medium.jpg"},
  {"title":"Mens Galatasaray 2025/26 Third Jersey","albumId":"209233869","img":"https://photo.yupoo.com/royal-sports/27dbdfa7/medium.jpg"},
  {"title":"Servette FC 2025/26 Home Jersey","albumId":"204446775","img":"https://photo.yupoo.com/royal-sports/85cb5138/medium.jpg"},
  {"title":"Panathinaikos F.C. 2025/26 Away Jersey","albumId":"204445805","img":"https://photo.yupoo.com/royal-sports/2162c5b0/medium.jpg"}
];

// Strip "Mens " / "Men's " prefix, clean title
function cleanTitle(t) {
  return t.replace(/^Mens?\s+/i, '').replace(/^Men's\s+/i, '').trim();
}

// Extra filter: remove shorts, long sleeve, player version, vest, leaked, all sponsors, NBA
function isValidJersey(title) {
  const t = title.toLowerCase();
  return !t.includes('short') && !t.includes('long sleeve') && !t.includes('player version') &&
         !t.includes('vest') && !t.includes('leaked') && !t.includes('all sponsors') &&
         !t.includes('nba') && !t.includes('kobe') && !t.includes('wembanyana') &&
         !t.includes('footy') && !t.includes('s-xxl') && !t.includes('s-xxxxl') &&
         !t.includes('limited');
}

// Parse team name from title like "FC Barcelona 2025/26 Home Jersey"
function parseTeam(title) {
  const clean = cleanTitle(title);
  // Remove season pattern and everything after
  return clean
    .replace(/\s+\d{4}\/\d{2,4}.*$/, '')
    .replace(/\s+\d{4}\s+World Cup.*$/, '')
    .replace(/\s+2026\s+.*$/, '')
    .replace(/\s+2025\/26.*$/, '')
    .replace(/\s+2024\/25.*$/, '')
    .replace(/\s+2026\/27.*$/, '')
    .replace(/\s+2024\/25.*$/, '')
    .replace(/\s+UEFA.*$/, '')
    .trim();
}

// Parse type
function parseType(title) {
  const t = title.toLowerCase();
  if (t.includes(' third')) return 'TERCERA';
  if (t.includes(' away')) return 'VISITANTE';
  if (t.includes(' home')) return 'LOCAL';
  return null;
}

// Map team to league
function getLeague(team, title) {
  const t = (team + ' ' + title).toLowerCase();
  // La Liga
  if (/real madrid|barcelona|atletico madrid|sevilla|valencia|real betis|real sociedad|villarreal|athletic bilbao|osasuna|girona|celta|espanyol|getafe|rayo|mallorca|las palmas|leganes|alaves|deportivo alaves|valladolid|granada|almeria|cadiz|elche|levante|real oviedo|real zaragoza|sporting gij|racing santander|albacete|cartagena|real murcia|cultural leonesa|ceuta|huesca|tenerife|cd tenerife|fc cartagena/.test(t)) return 'La Liga';
  // Premier League
  if (/manchester city|manchester united|liverpool|arsenal|chelsea|tottenham|newcastle|aston villa|brighton|west ham|brentford|fulham|crystal palace|wolves|nottingham|everton|bournemouth|leeds united|leicester|ipswich|southampton/.test(t)) return 'Premier League';
  // Bundesliga
  if (/bayern munich|borussia dortmund|bayer leverkusen|rb leipzig|eintracht frankfurt|vfb stuttgart|wolfsburg|freiburg|hoffenheim|union berlin|hamburger|1. fc köln|hertha|schalke|st. pauli|werder|heidenheim|borussia mönchengladbach/.test(t)) return 'Bundesliga';
  // Serie A
  if (/juventus|inter milan|ac milan|napoli|roma|lazio|fiorentina|atalanta|torino|bologna|venezia|como 1907|sassuolo|cremonese|parma|lecce|genoa/.test(t)) return 'Serie A';
  // Ligue 1
  if (/paris saint-germain|psg|olympique marseille|olympique lyon|lyonnais|monaco|lille|rennes|nice|lens|auxerre|saint-etienne|angers|paris fc/.test(t)) return 'Ligue 1';
  // Selecciones
  if (/world cup|national|brazil|argentina|france|germany|spain|england|italy|portugal|netherlands|belgium|croatia|uruguay|colombia|mexico|chile|japan|south korea|senegal|morocco|nigeria|ghana|mali|egypt|jordan|curacao|haiti|czech republic|sweden|denmark|norway|poland/.test(t)) return 'Selecciones';
  // Otras Ligas (todo lo demás)
  return 'Otras Ligas';
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://royal-sports.x.yupoo.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      }
    };
    const file = fs.createWriteStream(filepath);
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) { file.close(); fs.unlinkSync(filepath); return reject(new Error(`HTTP ${res.statusCode}`)); }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => { fs.existsSync(filepath) && fs.unlinkSync(filepath); reject(e); });
  });
}

async function main() {
  const productsPath = path.join(__dirname, 'src/data/products.json');
  const imagesDir = path.join(__dirname, 'public/images/products');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  let nextId = Math.max(...products.map(p => p.id)) + 1;

  // Build set of existing (team+type) to avoid duplicates
  const existing = new Set(products.map(p => `${p.team}|${p.type}`));
  // Also existing image album IDs
  const existingAlbumIds = new Set(
    products.filter(p => p.image && p.image.includes('_')).map(p => {
      const m = p.image.match(/_(\d+)\./);
      return m ? m[1] : null;
    }).filter(Boolean)
  );

  // Filter valid jerseys
  const albums = rawAlbums.filter(a => isValidJersey(a.title));

  // Deduplicate: keep only first occurrence per team+type combo (prefer ones with img)
  const seen = new Map();
  for (const a of albums) {
    const team = parseTeam(a.title);
    const type = parseType(a.title);
    if (!type) continue;
    const key = `${team}|${type}`;
    if (!seen.has(key) || (!seen.get(key).img && a.img)) {
      seen.set(key, { ...a, team, type });
    }
  }

  const deduped = Array.from(seen.values());

  // Filter out already in catalog
  const toAdd = deduped.filter(a => {
    const typeMap = { 'LOCAL': 'LOCAL', 'VISITANTE': 'VISITANTE', 'TERCERA': 'TERCERA' };
    return !existing.has(`${a.team}|${typeMap[a.type]}`) && !existingAlbumIds.has(a.albumId);
  });

  console.log(`📊 Total filtered albums: ${albums.length}`);
  console.log(`📊 After dedup: ${deduped.length}`);
  console.log(`📊 New (not in catalog): ${toAdd.length}`);

  const newProducts = [];
  let downloaded = 0, errors = 0, skipped = 0;

  for (const album of toAdd) {
    if (!album.img) { skipped++; continue; }

    const league = getLeague(album.team, album.title);
    const filename = `album_${album.albumId}.jpg`;
    const filepath = path.join(imagesDir, filename);

    if (!fs.existsSync(filepath)) {
      process.stdout.write(`📥 ${album.title}... `);
      try {
        await downloadImage(album.img, filepath);
        console.log('✅');
        downloaded++;
      } catch (e) {
        console.log(`❌ ${e.message}`);
        errors++;
        continue;
      }
    } else {
      downloaded++;
    }

    newProducts.push({
      id: nextId++,
      league,
      team: album.team,
      type: album.type,
      image: `/images/products/${filename}`,
      price: 18
    });
  }

  const updatedProducts = [...products, ...newProducts];
  fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Imágenes descargadas: ${downloaded}`);
  console.log(`   - Sin imagen (saltados): ${skipped}`);
  console.log(`   - Errores: ${errors}`);
  console.log(`   - Nuevos productos añadidos: ${newProducts.length}`);
  console.log(`   - Total productos en catálogo: ${updatedProducts.length}`);

  // Show what was skipped (no image)
  const noImg = toAdd.filter(a => !a.img);
  if (noImg.length > 0) {
    console.log(`\n⚠️  Sin imagen (${noImg.length}):`);
    noImg.forEach(a => console.log(`   - [${a.albumId}] ${a.title}`));
  }
}

main().catch(console.error);
