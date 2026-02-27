import React, { useState } from 'react';
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

const leaguesInData = new Set(products.map(p => p.league));
const leagues = LEAGUE_ORDER.filter(l => leaguesInData.has(l));

function getBadgePath(teamName) {
  const safe = teamName.replace(/[^\p{L}\p{N}\s\-]/gu, '').trim().replace(/ /g, '_');
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

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered = search.trim()
    ? products.filter(p =>
        p.team.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
      )
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

  const leagueProducts = selectedLeague
    ? products.filter(p => p.league === selectedLeague)
    : [];

  const teamsInLeague = selectedLeague
    ? [...new Set(leagueProducts.map(p => p.team))]
    : [];

  const teamProducts = selectedTeam
    ? leagueProducts.filter(p => p.team === selectedTeam)
    : [];

  return (
    <section id="catalogo">
      <div className="catalog-controls">
        <div className="search-row">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="league-nav-inner">
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
        </div>
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
                      <img src={teamImg} alt={team} loading="lazy" />
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
              {leagues.map((league) => {
                const count = products.filter(p => p.league === league).length;
                return (
                  <button
                    key={league}
                    className="league-card"
                    onClick={() => handleLeagueSelect(league)}
                  >
                    <div className="league-card-img">
                      <img src={LEAGUE_IMAGES[league]} alt={league} loading="lazy" />
                    </div>
                    <div className="league-card-info">
                      <h3>{league}</h3>
                      <span>{count} camisetas</span>
                    </div>
                  </button>
                );
              })}
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
