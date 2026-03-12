import React, { useMemo, useState } from 'react';
import products from '../data/products.json';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import { buildCatalog, getBadgePath, LEAGUE_IMAGES } from '../utils/catalog';

const TYPE_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'home', label: 'Local' },
  { value: 'away', label: 'Visitante' },
  { value: 'third', label: 'Tercera' },
  { value: 'kids', label: 'Niño' },
  { value: 'retro', label: 'Retro' },
  { value: 'player', label: 'Player' },
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'team-asc', label: 'Equipo A-Z' },
  { value: 'team-desc', label: 'Equipo Z-A' },
  { value: 'price-asc', label: 'Precio menor' },
  { value: 'price-desc', label: 'Precio mayor' },
];

const { normalizedProducts, leagueCounts, leagues, teamsByLeague } = buildCatalog(products);

const handleBadgeError = (event) => {
  event.currentTarget.style.display = 'none';
};

const getPrice = (product) => Number(product.price) || 15;

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const query = search.trim().toLowerCase();
  const activeTeamList = selectedLeague ? teamsByLeague[selectedLeague] || [] : [];

  const teamCounts = useMemo(() => {
    if (!selectedLeague) return {};
    return normalizedProducts
      .filter((product) => product.league === selectedLeague)
      .reduce((acc, product) => {
        acc[product.team] = (acc[product.team] || 0) + 1;
        return acc;
      }, {});
  }, [selectedLeague]);

  const baseProducts = useMemo(() => {
    if (query) return normalizedProducts.filter((product) => product.searchIndex.includes(query));
    if (selectedTeam) return normalizedProducts.filter((product) => product.league === selectedLeague && product.team === selectedTeam);
    return [];
  }, [query, selectedLeague, selectedTeam]);

  const visibleProducts = useMemo(() => {
    const productsByType =
      typeFilter === 'all' ? baseProducts : baseProducts.filter((product) => product.typeCategory === typeFilter);

    if (sortBy === 'team-asc') return [...productsByType].sort((a, b) => a.team.localeCompare(b.team));
    if (sortBy === 'team-desc') return [...productsByType].sort((a, b) => b.team.localeCompare(a.team));
    if (sortBy === 'price-asc') return [...productsByType].sort((a, b) => getPrice(a) - getPrice(b));
    if (sortBy === 'price-desc') return [...productsByType].sort((a, b) => getPrice(b) - getPrice(a));

    return productsByType;
  }, [baseProducts, sortBy, typeFilter]);

  const handleLeagueSelect = (league) => {
    setSearch('');
    setTypeFilter('all');
    setSortBy('relevance');
    setSelectedLeague(league);
    setSelectedTeam(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setTypeFilter('all');
    setSortBy('relevance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedTeam) {
      setSelectedTeam(null);
    } else if (selectedLeague) {
      setSelectedLeague(null);
    }
    setSearch('');
    setTypeFilter('all');
  };

  const handleBackToCatalog = () => {
    setSelectedLeague(null);
    setSelectedTeam(null);
    setSearch('');
    setTypeFilter('all');
    setSortBy('relevance');
  };

  const shouldRenderProducts = Boolean(query || selectedTeam);

  return (
    <section id="catalogo" aria-labelledby="catalog-title">
      <div className="catalog-controls">
        <div className="search-row">
          <div className="search-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <label htmlFor="catalog-search" className="sr-only">Buscar por equipo, liga o tipo</label>
            <input
              id="catalog-search"
              type="search"
              className="search-input"
              placeholder="Buscar equipo, liga, local, visitante, niño..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="catalog-toolbar" aria-label="Ordenar y filtrar resultados">
            <label className="sr-only" htmlFor="catalog-sort">Ordenar resultados</label>
            <select id="catalog-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="type-chips" role="group" aria-label="Filtro por tipo de camiseta">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`type-chip ${typeFilter === filter.value ? 'active' : ''}`}
                onClick={() => setTypeFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <nav className="league-nav-inner" aria-label="Filtro por liga">
          <button type="button" className={`league-tab ${!selectedLeague && !query ? 'active' : ''}`} onClick={handleBackToCatalog}>
            Catálogo
          </button>
          {leagues.map((league) => (
            <button
              key={league}
              type="button"
              className={`league-tab ${selectedLeague === league && !query ? 'active' : ''}`}
              onClick={() => handleLeagueSelect(league)}
            >
              {league}
            </button>
          ))}
        </nav>
      </div>

      <div className="container">
        {shouldRenderProducts ? (
          <div className="catalog-panel">
            <div className="league-header">
              {selectedTeam && <button type="button" className="back-btn" onClick={handleBack} aria-label="Volver">←</button>}
              <h2 id="catalog-title">{selectedTeam || (query ? `Resultados para “${search.trim()}”` : 'Catálogo')}</h2>
              <span aria-live="polite">{visibleProducts.length} resultados</span>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={() => setSelectedProduct(product)} />
                ))}
              </div>
            ) : (
              <div className="no-results" role="status">
                <p>No encontramos camisetas con esos filtros.</p>
                <button type="button" className="reset-filters-btn" onClick={() => { setSearch(''); setTypeFilter('all'); setSortBy('relevance'); }}>
                  Limpiar búsqueda y filtros
                </button>
              </div>
            )}
          </div>
        ) : selectedLeague ? (
          <div className="catalog-panel">
            <div className="league-header">
              <button type="button" className="back-btn" onClick={handleBack} aria-label="Volver">←</button>
              <h2 id="catalog-title">{selectedLeague}</h2>
              <span>{activeTeamList.length} equipos</span>
            </div>
            <div className="league-grid">
              {activeTeamList.map((team) => {
                return (
                  <button key={team} type="button" className="league-card" onClick={() => handleTeamSelect(team)}>
                    <div className="league-card-img">
                      <img src={getBadgePath(team)} alt={`Escudo de ${team}`} loading="lazy" onError={handleBadgeError} />
                    </div>
                    <div className="league-card-info">
                      <h3>{team}</h3>
                      <span>{teamCounts[team] || 0} camisetas</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="catalog-panel">
            <div className="league-header">
              <h2 id="catalog-title">Catálogo</h2>
              <span>{leagues.length} ligas</span>
            </div>
            <div className="league-grid">
              {leagues.map((league) => (
                <button key={league} type="button" className="league-card" onClick={() => handleLeagueSelect(league)}>
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

      {selectedProduct && <QuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}
