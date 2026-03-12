import React from 'react';
import { InstagramIcon, INSTAGRAM_URL } from './Icons';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <p className="logo" aria-label="Soccer Camisetas">Soccer<span className="logo-dot">.</span>Camisetas</p>
        <div className="header-right">
          <nav className="nav-links" aria-label="Navegación principal">
            <a href="#catalogo">Catálogo</a>
            <a href="#info">Info</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="header-ig" aria-label="Abrir Instagram de Soccer Camisetas">
            <InstagramIcon size={16} />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
