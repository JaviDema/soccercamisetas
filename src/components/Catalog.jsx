import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import products from '../data/products.json';

const leagueOrder = ['La Liga', 'Premier League', 'Serie A', 'Bundesliga', 'Ligue 1', 'Retro', 'Player'];

const leaguesByOrder = leagueOrder.filter(l =>
    products.some(p => p.league === l)
);

const productsByLeague = leaguesByOrder.reduce((acc, league) => {
    acc[league] = products.filter(p => p.league === league);
    return acc;
}, {});

export default function Catalog() {
    const [activeLeague, setActiveLeague] = useState(leaguesByOrder[0]);
    const sectionRefs = useRef({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveLeague(entry.target.dataset.league);
                    }
                }
            },
            { rootMargin: '-140px 0px -60% 0px', threshold: 0 }
        );

        Object.values(sectionRefs.current).forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToLeague = (league) => {
        const el = sectionRefs.current[league];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setActiveLeague(league);
        }
    };

    return (
        <>
            <nav className="league-nav" id="catalogo">
                <div className="league-nav-inner">
                    {leaguesByOrder.map(league => (
                        <button
                            key={league}
                            className={`league-tab ${activeLeague === league ? 'active' : ''}`}
                            onClick={() => scrollToLeague(league)}
                        >
                            {league}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="container">
                {leaguesByOrder.map(league => (
                    <section
                        key={league}
                        className="league-section"
                        data-league={league}
                        ref={el => sectionRefs.current[league] = el}
                    >
                        <div className="league-header">
                            <h2>{league}<span>{productsByLeague[league].length} camisetas</span></h2>
                        </div>
                        <div className="product-grid">
                            {productsByLeague[league].map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}
