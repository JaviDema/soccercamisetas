import React, { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container">
        <a href="#" onClick={closeMenu}>
          <h1 className="logo">Soccer.Camisetas</h1>
        </a>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#catalogo" onClick={closeMenu}>Catálogo</a>
          <a href="#info" onClick={closeMenu}>Info</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
          <a href="https://instagram.com/soccer.camisetas1" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Instagram</a>
        </nav>
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}
