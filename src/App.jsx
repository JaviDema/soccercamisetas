import React from 'react';
import Header from './components/Header';
import Catalog from './components/Catalog';
import InfoSection from './components/InfoSection';
import { InstagramIcon, INSTAGRAM_URL } from './components/Icons';

function App() {
  return (
    <div className="app-container">
      <Header />

      <div className="trust-bar" role="region" aria-label="Beneficios de compra">
        <div className="trust-bar-inner">
          <div className="trust-item"><span>✓</span> Calidad Thai AAA+</div>
          <div className="trust-item"><span>📦</span> Envío gratis a España</div>
          <div className="trust-item"><span>📩</span> Atención por Instagram</div>
        </div>
      </div>

      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-badge">⚽ Temporada 2025/26</div>
          <h1 id="hero-title">Camisetas de fútbol<br /><span className="accent">al mejor precio</span></h1>
          <p>Calidad Thai AAA+. Elige tu equipo y pide por Instagram en 1 minuto.</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hero-cta">
            <InstagramIcon size={18} />
            Pedir ahora
          </a>
        </div>
      </section>

      <section className="how-to-order" aria-label="Cómo hacer tu pedido">
        <div className="container">
          <div className="steps-row">
            <div className="step-card">
              <span className="step-icon">👕</span>
              <div className="step-num">1</div>
              <h2>Elige camiseta</h2>
              <p>Busca tu equipo en el catálogo</p>
            </div>
            <div className="step-card">
              <span className="step-icon">📩</span>
              <div className="step-num">2</div>
              <h2>Escríbenos por Instagram</h2>
              <p>Dinos qué camiseta quieres</p>
            </div>
            <div className="step-card">
              <span className="step-icon">📦</span>
              <div className="step-num">3</div>
              <h2>Recibe en casa</h2>
              <p>Paga cómodamente. Llega en 10-15 días</p>
            </div>
          </div>
        </div>
      </section>

      <main>
        <Catalog />
        <InfoSection />
      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer-brand">Soccer<span className="accent">.</span>Camisetas</p>
          <p className="footer-tagline">Las mejores camisetas de fútbol al mejor precio</p>
          <div className="footer-links">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={14} />
              @soccer.camisetas1
            </a>
          </div>
          <div className="footer-divider" />
          <p>© {new Date().getFullYear()} Soccer.Camisetas — Todos los derechos reservados</p>
        </div>
      </footer>

      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-ig"
        aria-label="Contactar por Instagram"
      >
        <InstagramIcon size={28} />
      </a>
    </div>
  );
}

export default App;
