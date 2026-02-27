import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// All scraped albums with images from Yupoo kids category
const albums = [
  // Page 1 - with images from category listing
  {"title":"Kids FC Porto 2025/26 Fourth Kit","albumId":"225073690","img":"https://photo.yupoo.com/royal-sports/a1d435e5/medium.jpg"},
  {"title":"Kids Venezuela 2026 World Cup Home Kit","albumId":"220744681","img":"https://photo.yupoo.com/royal-sports/c0335100/medium.jpg"},
  {"title":"Kids Sporting CP 2025/26 Goalkeeper Kit","albumId":"220744668","img":"https://photo.yupoo.com/royal-sports/dc8d50cc/medium.jpg"},
  {"title":"Kids Real Madrid 2025/26 Pre-Match Kit","albumId":"220744658","img":"https://photo.yupoo.com/royal-sports/56e40970/medium.jpg"},
  {"title":"Kids Portugal 2026 World Cup Home Kit","albumId":"220744622","img":"https://photo.yupoo.com/royal-sports/5a60e47a/medium.jpg"},
  {"title":"Kids Barcelona 2025/26 Goalkeeper Kit","albumId":"220744614","img":"https://photo.yupoo.com/royal-sports/91bf5a95/medium.jpg"},
  {"title":"Kids Algeria 2026 World Cup Home Kit","albumId":"220744576","img":"https://photo.yupoo.com/royal-sports/4285423b/medium.jpg"},
  {"title":"Kids Colombia 2026 World Cup Home Kit","albumId":"219078850","img":"https://photo.yupoo.com/royal-sports/34493759/medium.jpg"},
  {"title":"Kids Sporting de Gijón 2025/26 Third Jersey Kit","albumId":"216213672","img":"https://photo.yupoo.com/royal-sports/be31c3ea/medium.jpg"},
  // Batch 1 - visited individually
  {"title":"Kids Racing de Santander 2025/26 Home Kit","albumId":"216213651","img":"https://photo.yupoo.com/royal-sports/af1f0ce9/medium.jpg"},
  {"title":"Kids Portugal 2026 World Cup Away Jersey Kit","albumId":"216213632","img":"https://photo.yupoo.com/royal-sports/113c5fc1/medium.jpg"},
  {"title":"Kids Manchester City 2025/26 Fourth Kit","albumId":"216213615","img":"https://photo.yupoo.com/royal-sports/acc69b2f/medium.jpg"},
  {"title":"Kids Levante UD 2025/26 Home Jersey Kit","albumId":"216213596","img":"https://photo.yupoo.com/royal-sports/f9c0f534/medium.jpg"},
  {"title":"Kids Germany 2026 World Cup Home Jersey Kit","albumId":"216213580","img":"https://photo.yupoo.com/royal-sports/23db383a/medium.jpg"},
  {"title":"Kids Germany 2026 World Cup Away Jersey Kit","albumId":"216213557","img":"https://photo.yupoo.com/royal-sports/23878c4a/medium.jpg"},
  {"title":"Kids England 2026 World Cup Home Jersey Kit","albumId":"216213528","img":"https://photo.yupoo.com/royal-sports/f232151a/medium.jpg"},
  {"title":"Kids Vasco Da Gama 2025/26 Home Kit","albumId":"215454676","img":"https://photo.yupoo.com/royal-sports/514eb2ba/medium.jpg"},
  {"title":"Kids Palmeiras 2025/26 Third Kit","albumId":"215454661","img":"https://photo.yupoo.com/royal-sports/65b8f98f/medium.jpg"},
  {"title":"Kids Palmeiras 2025/26 Away Kit","albumId":"215454652","img":"https://photo.yupoo.com/royal-sports/d5aa496c/medium.jpg"},
  {"title":"Kids Napoli 2025/26 Home Kit","albumId":"215454626","img":"https://photo.yupoo.com/royal-sports/d21734f3/medium.jpg"},
  {"title":"Kids Manchester City 2025/26 Away Kit","albumId":"215454604","img":"https://photo.yupoo.com/royal-sports/9020549f/medium.jpg"},
  {"title":"Kids Flamengo 2025/26 Away Kit","albumId":"215454584","img":"https://photo.yupoo.com/royal-sports/873ea796/medium.jpg"},
  {"title":"Kids Botafogo 2025/26 Third Kit","albumId":"215454566","img":"https://photo.yupoo.com/royal-sports/0c891391/medium.jpg"},
  {"title":"Kids Botafogo 2025/26 Away Kit","albumId":"215454540","img":"https://photo.yupoo.com/royal-sports/71068a89/medium.jpg"},
  {"title":"Kids Boca Juniors 2025/26 Home Kit","albumId":"215454524","img":"https://photo.yupoo.com/royal-sports/bfe1c207/medium.jpg"},
  {"title":"Kids Bahia 2025/26 Superman Collaboration Kit","albumId":"215454499","img":"https://photo.yupoo.com/royal-sports/f0d26711/medium.jpg"},
  {"title":"Kids Arsenal 2025/26 Third Kit","albumId":"215454471","img":"https://photo.yupoo.com/royal-sports/87070e6c/medium.jpg"},
  // Batch 2
  {"title":"Kids Al-Nassr FC 2025/26 Home Kit","albumId":"215454442","img":"https://photo.yupoo.com/royal-sports/b68d1389/medium.jpg"},
  {"title":"Kids Sporting de Gijón 2025/26 Away Kit","albumId":"214584180","img":"https://photo.yupoo.com/royal-sports/bd6c0e88/medium.jpg"},
  {"title":"Kids Real Zaragoza 2025/26 Away Kit","albumId":"214584158","img":"https://photo.yupoo.com/royal-sports/7664c54b/medium.jpg"},
  {"title":"Kids Real Oviedo 2025/26 Third Kit","albumId":"214584133","img":"https://photo.yupoo.com/royal-sports/c08fa779/medium.jpg"},
  {"title":"Kids Real Oviedo 2025/26 Away Kit","albumId":"214584107","img":"https://photo.yupoo.com/royal-sports/27b3c347/medium.jpg"},
  {"title":"Kids Barcelona 2025/26 Oktoberfest Kit","albumId":"214584017","img":"https://photo.yupoo.com/royal-sports/2ea4bc8b/medium.jpg"},
  {"title":"Kids Albacete 2025/26 Home Kit","albumId":"214583984","img":"https://photo.yupoo.com/royal-sports/f42aded2/medium.jpg"},
  {"title":"Barcelona 2025/26 Green Goalkeeper Kids Kit","albumId":"206581886","img":"https://photo.yupoo.com/royal-sports/654a9d87/medium.jpg"},
  {"title":"Braga 2025/26 Home Kids Kit","albumId":"206581831","img":"https://photo.yupoo.com/royal-sports/e7e6935f/medium.jpg"},
  {"title":"Sporting CP 2025/26 Green Goalkeeper Kids Kit","albumId":"206581541","img":"https://photo.yupoo.com/royal-sports/d4246bb9/medium.jpg"},
  {"title":"Athletic Bilbao 2025/26 Away Kids Kit","albumId":"206571033","img":"https://photo.yupoo.com/royal-sports/672e1bd3/medium.jpg"},
  {"title":"Athletic Bilbao 2025/26 Home Kids Kit","albumId":"206570970","img":"https://photo.yupoo.com/royal-sports/5bf45125/medium.jpg"},
  {"title":"Athletic Bilbao 2025/26 Third Kids Kit","albumId":"206570936","img":"https://photo.yupoo.com/royal-sports/86cba84c/medium.jpg"},
  {"title":"Borussia Dortmund 2025/26 Yellow Special Kids Kit","albumId":"206570856","img":"https://photo.yupoo.com/royal-sports/c65410ec/medium.jpg"},
  {"title":"FC Porto 2025/26 Third Kids Kit","albumId":"206570661","img":"https://photo.yupoo.com/royal-sports/ba0556a6/medium.jpg"},
  {"title":"Newcastle United 2025/26 Third Kids Kit","albumId":"206570350","img":"https://photo.yupoo.com/royal-sports/a8da5d17/medium.jpg"},
  {"title":"Sporting CP 2025/26 Black Goalkeeper Kids Kit","albumId":"206570099","img":"https://photo.yupoo.com/royal-sports/aa85b512/medium.jpg"},
  {"title":"Sporting de Gijon 2025/26 Home Kids Kit","albumId":"206570059","img":"https://photo.yupoo.com/royal-sports/3468800c/medium.jpg"},
  {"title":"Birmingham City F.C. 2025/26 Home Jersey Kids Kit","albumId":"204445921","img":"https://photo.yupoo.com/royal-sports/b0ca04e3/medium.jpg"},
  {"title":"Leeds United F.C. 2025/26 Home Jersey Kids Kit","albumId":"204445832","img":"https://photo.yupoo.com/royal-sports/719b3f90/medium.jpg"},
  {"title":"Sevilla FC 2025/26 Home Jersey Kids Kit","albumId":"204445694","img":"https://photo.yupoo.com/royal-sports/32f24898/medium.jpg"},
  {"title":"West Ham United 2025/26 Home Jersey Kids Kit","albumId":"204445630","img":"https://photo.yupoo.com/royal-sports/8673ff4a/medium.jpg"},
  {"title":"Real Betis 2025/26 Home Kids Kit","albumId":"202703932","img":"https://photo.yupoo.com/royal-sports/d8344376/medium.jpg"},
  {"title":"Benfica 2025/26 Black pre-match Kids Kit","albumId":"202703864","img":"https://photo.yupoo.com/royal-sports/01c2de2b/medium.jpg"},
  {"title":"Benfica 2025/26 Yellow Goalkeeper Kids Kit","albumId":"202609211","img":"https://photo.yupoo.com/royal-sports/d6bde65e/medium.jpg"},
  {"title":"Olympique Marseille 2025/26 Away Kids Kit","albumId":"202608766","img":"https://photo.yupoo.com/royal-sports/3a419da6/medium.jpg"},
  {"title":"Olympique Marseille 2025/26 Home Kids Kit","albumId":"202608739","img":"https://photo.yupoo.com/royal-sports/09f307df/medium.jpg"},
  {"title":"Real Madrid 2025/26 Orange Goalkeeper Kids Kit","albumId":"202608524","img":"https://photo.yupoo.com/royal-sports/c789024b/medium.jpg"},
  {"title":"Tottenham Hotspur 2025/26 Home Kids Kit","albumId":"202524524","img":"https://photo.yupoo.com/royal-sports/5b1ca35f/medium.jpg"},
  {"title":"Real Madrid 2025/26 Yellow Goalkeeper Kids Kit","albumId":"202524448","img":"https://photo.yupoo.com/royal-sports/bce16c28/medium.jpg"},
  {"title":"RC Lens 2025/26 Home Kids Kit","albumId":"202524397","img":"https://photo.yupoo.com/royal-sports/a835936b/medium.jpg"},
  {"title":"RC Lens 2025/26 Away Kids Kit","albumId":"202524384","img":"https://photo.yupoo.com/royal-sports/9ea7cbb4/medium.jpg"},
  {"title":"Malaga 2025/26 Home Kids Kit","albumId":"202524267","img":"https://photo.yupoo.com/royal-sports/56dabc04/medium.jpg"},
  {"title":"FC Porto 2025/26 Away Kids Kit","albumId":"202524244","img":"https://photo.yupoo.com/royal-sports/809ef1d7/medium.jpg"},
  {"title":"Bayern Munich 2025/26 Home Kids Kit","albumId":"202524169","img":"https://photo.yupoo.com/royal-sports/0c4d1c1e/medium.jpg"},
  {"title":"Atletico Madrid 2025/26 Yellow Goalkeeper Kids Kit","albumId":"202524151","img":"https://photo.yupoo.com/royal-sports/fc502a37/medium.jpg"},
  {"title":"Ajax 2025/26 Away Kids Kit","albumId":"202524132","img":"https://photo.yupoo.com/royal-sports/1246d3a3/medium.jpg"},
  {"title":"Barcelona 2025/26 Flower Special Edition Kids Kit","albumId":"201157634","img":"https://photo.yupoo.com/royal-sports/00dad091/medium.jpg"},
  {"title":"Barcelona 2025/26 Away Kids Kit","albumId":"201157627","img":"https://photo.yupoo.com/royal-sports/2dda9856/medium.jpg"},
  {"title":"Atletico Madrid 2025/26 Home Kids Kit","albumId":"201157601","img":"https://photo.yupoo.com/royal-sports/e541d4f1/medium.jpg"},
  // Batch 3
  {"title":"Al-Nassr 2025/26 Third Kids Kit","albumId":"201157490","img":"https://photo.yupoo.com/royal-sports/b165ca48/medium.jpg"},
  {"title":"Benfica 2025/26 Home Kids Kit","albumId":"200808825","img":"https://photo.yupoo.com/royal-sports/5dd39f0c/medium.jpg"},
  {"title":"Benfica 2025/26 Away Kids Kit","albumId":"200808736","img":"https://photo.yupoo.com/royal-sports/ed578b19/medium.jpg"},
  {"title":"USA 2025/26 Home Kids Kit","albumId":"200445963","img":"https://photo.yupoo.com/royal-sports/3428e1f4/medium.jpg"},
  {"title":"USA 2025/26 Away Kids Kit","albumId":"200445947","img":"https://photo.yupoo.com/royal-sports/951a5345/medium.jpg"},
  {"title":"Paris Saint-Germain 2024/25 Home Kids Kit","albumId":"200445880","img":"https://photo.yupoo.com/royal-sports/508f9847/medium.jpg"},
  {"title":"Feyenoord Rotterdam 2025/26 Home Kids Kit","albumId":"200445682","img":"https://photo.yupoo.com/royal-sports/a7a31af0/medium.jpg"},
  {"title":"Deportivo de La Coruna 2025/26 25th Anniversary Kids Kit","albumId":"200445358","img":"https://photo.yupoo.com/royal-sports/9a0b2f5b/medium.jpg"},
  {"title":"Borussia Mönchengladbach 2025/26 Home Kids Kit","albumId":"200444958","img":"https://photo.yupoo.com/royal-sports/c4937dbf/medium.jpg"},
  {"title":"Atletico Madrid 2025/26 Away Kids Kit","albumId":"200444826","img":"https://photo.yupoo.com/royal-sports/61f1f923/medium.jpg"},
  {"title":"Aston Villa 2025/26 Away Kids Kit","albumId":"200444799","img":"https://photo.yupoo.com/royal-sports/4193f7f5/medium.jpg"},
  {"title":"1. FC Nurnberg 2025/26 125th Anniversary Kids Kit","albumId":"200444754","img":"https://photo.yupoo.com/royal-sports/c2dbb895/medium.jpg"},
  {"title":"Sporting CP 2025/26 Home Kids Kit","albumId":"198551911","img":"https://photo.yupoo.com/royal-sports/bdb24e96/medium.jpg"},
  {"title":"Cristiano Ronaldo 2025/26 Real Madrid Kids Kit","albumId":"198551890","img":"https://photo.yupoo.com/royal-sports/cfc9665e/medium.jpg"},
  {"title":"Barcelona 2025/26 pink special edition Kids Kit","albumId":"198551829","img":"https://photo.yupoo.com/royal-sports/6235c1a1/medium.jpg"},
  {"title":"Barcelona 2025/26 Color special edition Kids Kit","albumId":"198551752","img":"https://photo.yupoo.com/royal-sports/fedcfce6/medium.jpg"},
  {"title":"Barcelona 2025/26 blue special edition Kids Kit","albumId":"198551730","img":"https://photo.yupoo.com/royal-sports/1f1af282/medium.jpg"},
  {"title":"Rangers 2025/26 Home Kids Kit","albumId":"197913871","img":"https://photo.yupoo.com/royal-sports/e4555e12/medium.jpg"},
  {"title":"Monterrey 2025/26 Home Kids Kit","albumId":"197913855","img":"https://photo.yupoo.com/royal-sports/d4f0a746/medium.jpg"},
  {"title":"Cruz Azul 2025/26 Home Kids Kit","albumId":"197913782","img":"https://photo.yupoo.com/royal-sports/395991af/medium.jpg"},
  {"title":"Cruz Azul 2025/26 Away Kids Kit","albumId":"197913769","img":"https://photo.yupoo.com/royal-sports/edee3a91/medium.jpg"},
  {"title":"Borussia Dortmund 2025/26 Home Kids Kit","albumId":"197913727","img":"https://photo.yupoo.com/royal-sports/971995ef/medium.jpg"},
  {"title":"Benfica 2024/25 Fourth Away Concept Kids Kit","albumId":"197913718","img":"https://photo.yupoo.com/royal-sports/584935e5/medium.jpg"},
  {"title":"Ajax 2025/26 Home Kids Kit","albumId":"197153260","img":"https://photo.yupoo.com/royal-sports/b81d1c71/medium.jpg"},
  {"title":"Barcelona 2024/25 Away Travis Scott Edition Kids Kit","albumId":"197153058","img":"https://photo.yupoo.com/royal-sports/c3ab1618/medium.jpg"},
  {"title":"Barcelona 2024/25 Third Travis Scott Edition Kids Kit","albumId":"197153036","img":"https://photo.yupoo.com/royal-sports/3771a654/medium.jpg"},
  {"title":"Bayern Munich 2025/26 Away Kids Kit","albumId":"197152987","img":"https://photo.yupoo.com/royal-sports/3696e347/medium.jpg"},
  {"title":"Newcastle United 2025/26 Home Kids Kit","albumId":"197152584","img":"https://photo.yupoo.com/royal-sports/b3f9bc45/medium.jpg"},
  {"title":"Real Betis 2025/26 League Final Special Edition Kids Kit","albumId":"197152484","img":"https://photo.yupoo.com/royal-sports/8a4c4097/medium.jpg"},
  {"title":"Vasco da Gama 2024/25 Black Kids Kit","albumId":"197152423","img":"https://photo.yupoo.com/royal-sports/65f0271e/medium.jpg"},
  {"title":"Real Madrid 2025/26 Third Kids Kit","albumId":"196206398","img":"https://photo.yupoo.com/royal-sports/03e36048/medium.jpg"},
  {"title":"Real Madrid 2025/26 Purple Goalkeeper Kids Kit","albumId":"196206390","img":"https://photo.yupoo.com/royal-sports/d78aa6f6/medium.jpg"},
  {"title":"Real Madrid 2023/24 Pink Dragon Kids Kit","albumId":"196206384","img":"https://photo.yupoo.com/royal-sports/a386b08f/medium.jpg"},
  {"title":"Real Madrid 2022/23 Dragon Kids Kit","albumId":"196206378","img":"https://photo.yupoo.com/royal-sports/b662f22c/medium.jpg"},
  {"title":"Real Betis 2025/26 Special Edition Kids Kit","albumId":"196206365","img":"https://photo.yupoo.com/royal-sports/043ef4dd/medium.jpg"},
  {"title":"Inter Milan 2024/25 VR46 Special Edition Kids Kit","albumId":"196206182","img":"https://photo.yupoo.com/royal-sports/bacdcb0e/medium.jpg"},
  {"title":"Hamburger SV 2024/25 Pre-Match Kids Kit","albumId":"196206164","img":"https://photo.yupoo.com/royal-sports/928c8095/medium.jpg"},
  {"title":"Celtic 2025/26 Home Kids Kit","albumId":"196206137","img":"https://photo.yupoo.com/royal-sports/04314286/medium.jpg"},
  {"title":"Bayern Munich 2025/26 Terrace Icons Kids Kit","albumId":"196205419","img":"https://photo.yupoo.com/royal-sports/9fba7deb/medium.jpg"},
  {"title":"Bayern Munich 2025/26 Green Goalkeeper Kids Kit","albumId":"196205409","img":"https://photo.yupoo.com/royal-sports/464a6364/medium.jpg"},
  // Batch 4
  {"title":"Bayern Munich 2025/26 Blue Goalkeeper Kids Kit","albumId":"196205394","img":"https://photo.yupoo.com/royal-sports/37288a61/medium.jpg"},
  {"title":"Bayern Munich 2025/26 Black Goalkeeper Kids Kit","albumId":"196205258","img":"https://photo.yupoo.com/royal-sports/78bff36a/medium.jpg"},
  {"title":"Barcelona 2025/26 One Piece Kids Kit","albumId":"195470949","img":"https://photo.yupoo.com/royal-sports/c73b7df0/medium.jpg"},
  {"title":"Barcelona 2024/25 Travis Scott Edition Kids Kit","albumId":"195470909","img":"https://photo.yupoo.com/royal-sports/88751a7c/medium.jpg"},
  {"title":"Spain 2025/26 Away Kids Kit","albumId":"195260538","img":"https://photo.yupoo.com/royal-sports/07a62a59/medium.jpg"},
  {"title":"Paris Saint-Germain 2025/26 Home Kids Kit","albumId":"195260465","img":"https://photo.yupoo.com/royal-sports/240ae840/medium.jpg"},
];

// Map team names to leagues
function getLeague(team) {
  const laLiga = ['Real Madrid','Barcelona','Atletico Madrid','Sevilla','Real Betis','Valencia','Athletic Bilbao','Real Zaragoza','Real Oviedo','Malaga','Sporting de Gijón','Sporting de Gijon','Levante UD','Albacete','Racing de Santander','Deportivo de La Coruna','Celta Vigo','Osasuna','UD Las Palmas','Cadiz','Elche'];
  const premierLeague = ['Manchester City','Arsenal','Chelsea','Tottenham Hotspur','Newcastle United','Aston Villa','Leeds United','Birmingham City','West Ham United','Nottingham Forest','Fulham','Leicester City'];
  const serieA = ['Inter Milan','Napoli','AC Milan','AS Roma','Lazio','Fiorentina'];
  const bundesliga = ['Bayern Munich','Borussia Dortmund','Hamburger SV','Borussia Mönchengladbach','1. FC Nurnberg'];
  const ligue1 = ['Paris Saint-Germain','Olympique Marseille','RC Lens'];
  const ligaPortugal = ['Benfica','Sporting CP','FC Porto','Braga'];
  const ligaMX = ['Monterrey','Cruz Azul','Chivas'];
  const brasileirao = ['Flamengo','Palmeiras','Botafogo','Vasco Da Gama','Vasco da Gama','Bahia','Fluminense','Boca Juniors'];
  const scottish = ['Celtic','Rangers'];
  const eredivisie = ['Ajax','Feyenoord Rotterdam'];
  const otherLeagues = ['Al-Nassr','Al-Nassr FC','Birmingham City','Leeds United','Deportivo de La Coruna','Sporting de Gijón','Sporting de Gijon','Hamburger SV','1. FC Nurnberg','Feyenoord Rotterdam','Borussia Mönchengladbach','Aston Villa','RC Lens'];
  const nationalTeams = ['Spain','Portugal','Germany','England','France','Italy','Brazil','Argentina','Colombia','Venezuela','Algeria','USA','Mexico','Japan','Netherlands','Ireland','Chile'];

  if (nationalTeams.some(t => team.includes(t))) return 'Selecciones';
  if (laLiga.some(t => team.includes(t))) return 'La Liga';
  if (premierLeague.some(t => team.includes(t))) return 'Premier League';
  if (serieA.some(t => team.includes(t))) return 'Serie A';
  if (bundesliga.some(t => team.includes(t))) return 'Bundesliga';
  if (ligue1.some(t => team.includes(t))) return 'Ligue 1';
  if (ligaPortugal.some(t => team.includes(t))) return 'Liga Portugal';
  if (ligaMX.some(t => team.includes(t))) return 'Liga MX';
  if (brasileirao.some(t => team.includes(t))) return 'Brasileirão';
  if (scottish.some(t => team.includes(t))) return 'Scottish League';
  if (eredivisie.some(t => team.includes(t))) return 'Eredivisie';
  return 'Otras Ligas';
}

// Extract team and type from album title
function parseTitle(title) {
  // Remove "Kids" prefix and "Kids Kit" suffix
  let clean = title
    .replace(/^Kids\s+/i, '')
    .replace(/\s+Kids Kit$/i, '')
    .replace(/\s+Kids\s+Kit$/i, '')
    .trim();

  // Extract type keyword
  let type = 'EQUIPACION NIÑO';
  const titleLower = clean.toLowerCase();
  
  if (titleLower.includes('away')) type = 'AWAY NIÑO';
  else if (titleLower.includes('third')) type = 'TERCERA NIÑO';
  else if (titleLower.includes('home')) type = 'HOME NIÑO';
  else if (titleLower.includes('goalkeeper')) type = 'PORTERO NIÑO';
  else if (titleLower.includes('pre-match') || titleLower.includes('training')) type = 'ENTRENAMIENTO NIÑO';
  else if (titleLower.includes('tracksuit') || titleLower.includes('chándal') || titleLower.includes('chandal')) type = 'CHÁNDAL NIÑO';
  else if (titleLower.includes('special') || titleLower.includes('edition') || titleLower.includes('dragon') || 
           titleLower.includes('travis') || titleLower.includes('one piece') || titleLower.includes('oktoberfest') ||
           titleLower.includes('flower') || titleLower.includes('pink') || titleLower.includes('blue') ||
           titleLower.includes('color') || titleLower.includes('green') || titleLower.includes('yellow') ||
           titleLower.includes('purple') || titleLower.includes('orange') || titleLower.includes('black') ||
           titleLower.includes('vr46') || titleLower.includes('anniversary') || titleLower.includes('concept') ||
           titleLower.includes('terrace') || titleLower.includes('superman') || titleLower.includes('ronaldo')) {
    type = 'EDICION ESPECIAL NIÑO';
  }

  // Extract team name - remove season pattern and type words
  let team = clean
    .replace(/\s+\d{4}\/\d{2,4}\s+/g, ' ')
    .replace(/\s+\d{4}\s+/g, ' ')
    .replace(/\s+(Home|Away|Third|Fourth|Goalkeeper|Pre-Match|Special|Edition|Kit|Training|Terrace|Icons|Concept|Collaboration|Superman|Anniversary|League|Final|World\s+Cup|Dragon|Travis\s+Scott|Oktoberfest|Flower|One\s+Piece|Ronaldo|VR46|Blackn|Yellow|Green|Blue|Purple|Orange|Pink|Color|Black)\b.*/gi, '')
    .replace(/\s+(Away|Home|Third|Fourth)$/gi, '')
    .trim();

  // Clean up team name
  team = team
    .replace(/\s+/g, ' ')
    .replace(/^(Barcelona|Real Madrid|Bayern Munich|Manchester City|Arsenal).*$/, '$1')
    .trim();

  // For special cases
  if (clean.includes('Cristiano Ronaldo')) team = 'Real Madrid';
  if (clean.includes('One Piece') || clean.includes('ワンピース')) team = 'Barcelona';
  if (clean.includes('Travis Scott') && clean.includes('Barcelona')) team = 'Barcelona';
  if (clean.includes('Travis Scott') && clean.includes('Bayern')) team = 'Bayern Munich';

  return { team, type };
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://royal-sports.x.yupoo.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        fs.unlink(filepath, () => {});
        resolve(false);
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      resolve(false);
    });
  });
}

async function main() {
  const productsPath = path.join(__dirname, 'src/data/products.json');
  const imagesDir = path.join(__dirname, 'public/images/products');
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  let nextId = Math.max(...products.map(p => p.id)) + 1;
  
  const newProducts = [];
  let downloaded = 0;
  let failed = 0;
  
  for (const album of albums) {
    if (!album.img) {
      console.log(`⚠️  Sin imagen: ${album.title}`);
      failed++;
      continue;
    }
    
    const { team, type } = parseTitle(album.title);
    const league = getLeague(album.title);
    
    // Generate filename from albumId
    const filename = `kids_${album.albumId}.jpg`;
    const filepath = path.join(imagesDir, filename);
    const localPath = `/images/products/${filename}`;
    
    // Skip if already downloaded
    if (!fs.existsSync(filepath)) {
      process.stdout.write(`📥 Descargando: ${album.title}... `);
      const success = await downloadImage(album.img, filepath);
      if (success) {
        console.log('✅');
        downloaded++;
      } else {
        console.log('❌ Error descargando imagen');
        failed++;
        continue;
      }
    } else {
      console.log(`⏭️  Ya existe: ${album.title}`);
      downloaded++;
    }
    
    newProducts.push({
      id: nextId++,
      league,
      team,
      type,
      image: localPath,
      price: 18
    });
  }
  
  // Add new products to the array
  const updatedProducts = [...products, ...newProducts];
  fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
  
  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Imágenes descargadas: ${downloaded}`);
  console.log(`   - Errores: ${failed}`);
  console.log(`   - Nuevos productos añadidos: ${newProducts.length}`);
  console.log(`   - Total productos en catálogo: ${updatedProducts.length}`);
}

main().catch(console.error);
