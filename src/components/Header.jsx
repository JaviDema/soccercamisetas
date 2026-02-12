import React from 'react';
import { InstagramIcon, INSTAGRAM_URL } from './Icons';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">Soccer<span className="logo-dot">.</span>Camisetas</h1>
        <div className="header-right">
          <nav className="nav-links">
            <a href="#catalogo">Catálogo</a>
            <a href="#info">Info</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="header-ig">
            <InstagramIcon size={16} />
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
