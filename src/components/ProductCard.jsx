import React from 'react';
import { InstagramIcon, INSTAGRAM_URL } from './Icons';

function getBadgeClass(type) {
  const t = type.toLowerCase();
  if (t.includes('niño')) return 'badge badge-nino';
  if (t.includes('retro')) return 'badge badge-retro';
  if (t.includes('player')) return 'badge badge-player';
  if (t.includes('third')) return 'badge badge-away';
  if (t.includes('away')) return 'badge badge-away';
  return 'badge badge-home';
}

// CORREGIDO: fallback cuando la imagen no carga
const handleImgError = (e) => {
  e.currentTarget.style.display = 'none';
};

export default function ProductCard({ product, onQuickView }) {
  const { team, type, image } = product;

  return (
    <article className="product-card" onClick={onQuickView} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onQuickView(); } }}
    >
      <div className="image-container">
        <img
          src={image}
          alt={`Camiseta ${team} - ${type}`}
          loading="lazy"
          decoding="async"
          onError={handleImgError}
        />
        <span className={getBadgeClass(type)}>{type}</span>
      </div>
      <div className="product-info">
        <h3>{team}</h3>
        <div className="product-price">
          <strong>{product.price ? `${product.price}€` : '15€'}</strong> · Envío incluido
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-instagram"
          onClick={(e) => e.stopPropagation()}
        >
          <InstagramIcon size={14} />
          Pedir por Instagram
        </a>
      </div>
    </article>
  );
}
