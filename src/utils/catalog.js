export const LEAGUE_ORDER = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Selecciones',
  'Retro',
  'Otras Ligas',
];

const TYPE_PATTERNS = {
  home: /(home|local)/i,
  away: /(away|visitante)/i,
  third: /(third|tercera|3ª)/i,
  kids: /(niño|niña|kids|junior)/i,
  player: /player/i,
  retro: /retro/i,
};

export const LEAGUE_IMAGES = {
  'Premier League': '/images/escudos/leagues/Premier_League.png',
  'La Liga': '/images/escudos/leagues/La_Liga.png',
  'Serie A': '/images/escudos/leagues/Serie_A.png',
  Bundesliga: '/images/escudos/leagues/Bundesliga.png',
  'Ligue 1': '/images/escudos/leagues/Ligue_1.png',
  Selecciones: '/images/escudos/leagues/Selecciones.png',
  Retro: '/images/escudos/leagues/Retro.svg',
  'Otras Ligas': '/images/escudos/leagues/Otras_Ligas.svg',
};

const normalizeTypeLabel = (type) => type.replace(/\s*\d{2}\/\d{2}\s*/g, ' ').replace(/\s+/g, ' ').trim();

const getTypeCategory = (type) => {
  if (TYPE_PATTERNS.kids.test(type)) return 'kids';
  if (TYPE_PATTERNS.retro.test(type)) return 'retro';
  if (TYPE_PATTERNS.player.test(type)) return 'player';
  if (TYPE_PATTERNS.third.test(type)) return 'third';
  if (TYPE_PATTERNS.away.test(type)) return 'away';
  if (TYPE_PATTERNS.home.test(type)) return 'home';
  return 'other';
};

export function getBadgePath(teamName) {
  const safe = teamName.replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/ /g, '_');
  return `/images/escudos/${safe}.png`;
}

export function buildCatalog(products) {
  const seen = new Set();

  const normalizedProducts = products
    .map((product) => {
      const normalizedType = normalizeTypeLabel(product.type);
      const typeCategory = getTypeCategory(product.type);
      return {
        ...product,
        normalizedType,
        typeCategory,
        searchIndex: `${product.team} ${product.league} ${product.type}`.toLowerCase(),
      };
    })
    .filter((product) => {
      const key = `${product.league}|${product.team}|${product.normalizedType}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const leagueCounts = Object.create(null);
  const teamsByLeague = Object.create(null);

  normalizedProducts.forEach((product) => {
    leagueCounts[product.league] = (leagueCounts[product.league] || 0) + 1;
    if (!teamsByLeague[product.league]) {
      teamsByLeague[product.league] = new Set();
    }
    teamsByLeague[product.league].add(product.team);
  });

  return {
    normalizedProducts,
    leagueCounts,
    leagues: LEAGUE_ORDER.filter((league) => leagueCounts[league]),
    teamsByLeague: Object.fromEntries(
      Object.entries(teamsByLeague).map(([league, teams]) => [league, [...teams].sort((a, b) => a.localeCompare(b))]),
    ),
  };
}
