import React from 'react';
import Header from './components/Header';
import Catalog from './components/Catalog';
import InfoSection from './components/InfoSection';

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);

function App() {
  return (
    <div className="app-container">
      <Header />

      <div className="trust-bar">
        <div className="trust-bar-inner">
          <div className="trust-item"><span>✓</span> Calidad Thai AAA+</div>
          <div className="trust-item"><span>📦</span> Envío gratis a España</div>
          <div className="trust-item"><span>💬</span> Atención por WhatsApp</div>
        </div>
      </div>

      <section className="hero">
        <div className="container">
          <div className="hero-badge">⚽ Temporada 2024/25</div>
          <h1>Camisetas de fútbol<br /><span className="accent">al mejor precio</span></h1>
          <p>Calidad Thai AAA+. Elige tu equipo y pide por WhatsApp en 1 minuto.</p>
          <a
            href="https://wa.me/34600000000?text=Hola!%20Quiero%20info%20sobre%20vuestras%20camisetas"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta"
          >
            {WA_ICON}
            Pedir ahora
          </a>
        </div>
      </section>

      <section className="how-to-order">
        <div className="container">
          <div className="steps-row">
            <div className="step-card">
              <span className="step-icon">👕</span>
              <div className="step-num">1</div>
              <h3>Elige camiseta</h3>
              <p>Busca tu equipo en el catálogo</p>
            </div>
            <div className="step-card">
              <span className="step-icon">💬</span>
              <div className="step-num">2</div>
              <h3>Escribe por WhatsApp</h3>
              <p>Dinos qué camiseta quieres</p>
            </div>
            <div className="step-card">
              <span className="step-icon">📦</span>
              <div className="step-num">3</div>
              <h3>Recibe en casa</h3>
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
            <a href="https://instagram.com/soccer.camisetas1" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
            <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          </div>
          <div className="footer-divider"></div>
          <p>© {new Date().getFullYear()} Soccer.Camisetas — Todos los derechos reservados</p>
        </div>
      </footer>

      <a
        href="https://wa.me/34600000000?text=Hola!%20Quiero%20info%20sobre%20vuestras%20camisetas"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-wa"
        aria-label="Contactar por WhatsApp"
      >
        {WA_ICON}
      </a>
    </div>
  );
}

export default App;
