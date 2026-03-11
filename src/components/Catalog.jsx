import React, { useState, useMemo } from 'react';
import products from '../data/products.json';
import ProductCard from './ProductCard';
import QuickView from './QuickView';

const LEAGUE_ORDER = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Selecciones",
  "Retro",
  "Otras Ligas",
];

const normalizeType = (type) => {
  let t = type.toLowerCase().trim();
  t = t.replace(/\s*\d{2}\/\d{2}\s*/g, '');  // remove season suffix like "25/26"
  t = t.replace('3ª equipación', 'third').replace('tercera', 'third');
  t = t.replace('local', 'home').replace('visitante', 'away');
  return t.trim();
};

const deduplicateProducts = (list) => {
  const seen = new Set();
  return list.filter((product) => {
    const key = `${product.league}|${product.team}|${normalizeType(product.type)}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const catalogProducts = deduplicateProducts(products);

const leaguesInData = new Set(catalogProducts.map(p => p.league));
const leagues = LEAGUE_ORDER.filter(l => leaguesInData.has(l));

function getBadgePath(teamName) {
  const safe = teamName.replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/ /g, '_');
  return `/images/escudos/${safe}.png`;
}

const LEAGUE_IMAGES = {
  "Premier League": "/images/escudos/leagues/Premier_League.png",
  "La Liga": "/images/escudos/leagues/La_Liga.png",
  "Serie A": "/images/escudos/leagues/Serie_A.png",
  "Bundesliga": "/images/escudos/leagues/Bundesliga.png",
  "Ligue 1": "/images/escudos/leagues/Ligue_1.png",
  "Selecciones": "/images/escudos/leagues/Selecciones.png",
  "Retro": "/images/escudos/leagues/Retro.svg",
  "Otras Ligas": "/images/escudos/leagues/Otras_Ligas.svg",
};

// CORREGIDO: fallback cuando la imagen del escudo no carga
const handleBadgeError = (e) => {
  e.currentTarget.style.display = 'none';
};

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // CORREGIDO: busqueda tambien filtra por liga para mayor usabilidad
  const filtered = search.trim()
    ? catalogProducts.filter(p => {
        const q = search.toLowerCase();
        return p.team.toLowerCase().includes(q) ||
               p.type.toLowerCase().includes(q) ||
               p.league.toLowerCase().includes(q);
      })
    : null;

  const handleLeagueSelect = (league) => {
    setSearch('');
    setSelectedLeague(league);
    setSelectedTeam(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedTeam) {
      setSelectedTeam(null);
    } else if (selectedLeague) {
      setSelectedLeague(null);
    }
    setSearch('');
  };

  const handleBackToCatalog = () => {
    setSelectedLeague(null);
    setSelectedTeam(null);
    setSearch('');
  };

  // CORREGIDO: useMemo para evitar recalculos innecesarios en cada render
  const leagueProducts = useMemo(() =>
    selectedLeague ? catalogProducts.filter(p => p.league === selectedLeague) : [],
    [selectedLeague]
  );

  const teamsInLeague = useMemo(() =>
    selectedLeague ? [...new Set(leagueProducts.map(p => p.team))] : [],
    [selectedLeague, leagueProducts]
  );

  const teamProducts = useMemo(() =>
    selectedTeam ? leagueProducts.filter(p => p.team === selectedTeam) : [],
    [selectedTeam, leagueProducts]
  );

  // CORREGIDO: pre-calcular conteo de camisetas por liga una sola vez
  const leagueCounts = useMemo(() => {
    const counts = {};
    for (const league of leagues) {
      counts[league] = catalogProducts.filter(p => p.league === league).length;
    }
    return counts;
  }, []);

  return (
    <section id="catalogo">
      <div className="catalog-controls">
        <div className="search-row">
          {/* CORREGIDO: label accesible para el input de busqueda */}
          <div className="search-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <label htmlFor="catalog-search" className="sr-only">Buscar equipo</label>
            <input
              id="catalog-search"
              type="text"
              className="search-input"
              placeholder="Buscar equipo o liga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <nav className="league-nav-inner" aria-label="Filtro por liga">
          <button
            className={`league-tab ${!selectedLeague && !search ? 'active' : ''}`}
            onClick={handleBackToCatalog}
          >
            Catálogo
          </button>
          {leagues.map((league) => (
            <button
              key={league}
              className={`league-tab ${selectedLeague === league && !search ? 'active' : ''}`}
              onClick={() => handleLeagueSelect(league)}
            >
              {league}
            </button>
          ))}
        </nav>
      </div>

      <div className="container">
        {filtered ? (
          filtered.length > 0 ? (
            <div style={{ paddingTop: 24 }}>
              <div className="league-header">
                <h2>Resultados</h2>
                <span>{filtered.length} camisetas</span>
              </div>
              <div className="product-grid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onQuickView={() => setSelectedProduct(p)} />
                ))}
              </div>
            </div>
          ) : (
            <div className="no-results">
              <p>No hay resultados para "{search}"</p>
            </div>
          )
        ) : selectedLeague && selectedTeam ? (
          <div style={{ paddingTop: 24 }}>
            <div className="league-header">
              <button className="back-btn" onClick={handleBack} aria-label="Volver">←</button>
              <h2>{selectedTeam}</h2>
              <span>{teamProducts.length} {teamProducts.length === 1 ? 'camiseta' : 'camisetas'}</span>
            </div>
            <div className="product-grid">
              {teamProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={() => setSelectedProduct(p)} />
              ))}
            </div>
          </div>
        ) : selectedLeague ? (
          <div style={{ paddingTop: 24 }}>
            <div className="league-header">
              <button className="back-btn" onClick={handleBack} aria-label="Volver">←</button>
              <h2>{selectedLeague}</h2>
              <span>{teamsInLeague.length} equipos</span>
            </div>
            <div className="league-grid">
              {teamsInLeague.map((team) => {
                const teamProds = leagueProducts.filter(p => p.team === team);
                const teamImg = getBadgePath(team);
                return (
                  <button
                    key={team}
                    className="league-card"
                    onClick={() => handleTeamSelect(team)}
                  >
                    <div className="league-card-img">
                      <img src={teamImg} alt={`Escudo de ${team}`} loading="lazy" onError={handleBadgeError} />
                    </div>
                    <div className="league-card-info">
                      <h3>{team}</h3>
                      <span>{teamProds.length} {teamProds.length === 1 ? 'camiseta' : 'camisetas'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ paddingTop: 24 }}>
            <div className="league-header">
              <h2>Catálogo</h2>
              <span>{leagues.length} ligas</span>
            </div>
            <div className="league-grid">
              {leagues.map((league) => (
                <button
                  key={league}
                  className="league-card"
                  onClick={() => handleLeagueSelect(league)}
                >
                  <div className="league-card-img">
                    <img src={LEAGUE_IMAGES[league]} alt={`Logo ${league}`} loading="lazy" onError={handleBadgeError} />
                  </div>
                  <div className="league-card-info">
                    <h3>{league}</h3>
                    <span>{leagueCounts[league]} camisetas</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <QuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}
