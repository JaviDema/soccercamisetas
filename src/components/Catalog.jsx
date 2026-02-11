import React, { useState } from 'react';
import products from '../data/products.json';
import ProductCard from './ProductCard';
import QuickView from './QuickView';

const leagues = [...new Set(products.map(p => p.league))];

const LEAGUE_IMAGES = {
  "La Liga": "https://placehold.co/600x400/f0f0f0/555?text=La+Liga",
  "Premier League": "https://placehold.co/600x400/f0f0f0/555?text=Premier+League",
  "Serie A": "https://placehold.co/600x400/f0f0f0/555?text=Serie+A",
  "Bundesliga": "https://placehold.co/600x400/f0f0f0/555?text=Bundesliga",
  "Ligue 1": "https://placehold.co/600x400/f0f0f0/555?text=Ligue+1",
  "Retro": "https://placehold.co/600x400/f0f0f0/555?text=Retro",
  "Player": "https://placehold.co/600x400/f0f0f0/555?text=Player+Version",
};

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [selectedLeague, setSelectedLeague] = useState(null);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedLeague(null);
    setSearch('');
  };

  const leagueProducts = selectedLeague
    ? products.filter(p => p.league === selectedLeague)
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
            onClick={handleBack}
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
        ) : selectedLeague ? (
          <div style={{ paddingTop: 24 }}>
            <div className="league-header">
              <button className="back-btn" onClick={handleBack} aria-label="Volver">←</button>
              <h2>{selectedLeague}</h2>
              <span>{leagueProducts.length} camisetas</span>
            </div>
            <div className="product-grid">
              {leagueProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={() => setSelectedProduct(p)} />
              ))}
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
