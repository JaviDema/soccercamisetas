import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Catalog from './components/Catalog';
import InfoSection from './components/InfoSection';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="app-container">
      <Header />

      <section className="hero">
        <div className="container">
          <h1>Camisetas de fútbol<br />al mejor precio</h1>
          <p>Calidad Thai AAA+. Escudos bordados, etiquetas originales y envío incluido en toda España.</p>
          <a href="#catalogo" className="hero-cta">Ver catálogo</a>
        </div>
      </section>

      <main>
        <Catalog />
        <InfoSection />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <p>© {new Date().getFullYear()} Soccer.Camisetas</p>
            <div className="footer-links">
              <a href="https://instagram.com/soccer.camisetas1" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      </footer>

      <button
        className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver arriba"
      >
        ↑
      </button>
    </div>
  );
}

export default App;
