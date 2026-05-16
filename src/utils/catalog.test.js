import { describe, expect, it } from 'vitest';
import { buildCatalog, getBadgePath } from './catalog';

const sampleProducts = [
  { id: 1, league: 'La Liga', team: 'Real Madrid', type: 'Home 24/25', image: '/a.jpg', price: 25 },
  { id: 2, league: 'La Liga', team: 'Real Madrid', type: 'Home 25/26', image: '/b.jpg', price: 30 },
  { id: 3, league: 'Premier League', team: 'Arsenal', type: 'Retro 98/99', image: '/c.jpg', price: 30 },
  { id: 4, league: 'Premier League', team: 'Chelsea', type: 'Away', image: '/d.jpg', price: 20 },
];

describe('catalog utils', () => {
  it('builds a normalized catalog with counts, ordering, and deduplication', () => {
    const { normalizedProducts, leagueCounts, leagues, teamsByLeague } = buildCatalog(sampleProducts);
    const madridProducts = normalizedProducts.filter((product) => product.team === 'Real Madrid');
    const madrid = madridProducts[0];
    const arsenal = normalizedProducts.find((product) => product.team === 'Arsenal');

    expect(normalizedProducts).toHaveLength(3);
    expect(madridProducts).toHaveLength(1);
    expect(madrid.normalizedType).toBe('Home');
    expect(arsenal.typeCategory).toBe('retro');
    expect(madrid.searchIndex).toContain('real madrid la liga home 24/25');
    expect(leagueCounts).toEqual({ 'La Liga': 1, 'Premier League': 2 });
    expect(leagues).toEqual(['Premier League', 'La Liga']);
    expect(teamsByLeague['Premier League']).toEqual(['Arsenal', 'Chelsea']);
  });

  it('builds a badge path from a sanitized team name', () => {
    expect(getBadgePath('Atlético Madrid!')).toBe('/images/escudos/Atlético_Madrid.png');
  });
});
