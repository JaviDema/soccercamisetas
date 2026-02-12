import React from 'react';
import { InstagramIcon, INSTAGRAM_URL } from './Icons';

function getBadgeClass(type) {
  const t = type.toLowerCase();
  if (t.includes('retro')) return 'badge badge-retro';
  if (t.includes('player')) return 'badge badge-player';
  if (t.includes('away')) return 'badge badge-away';
  return 'badge badge-home';
}

export default function ProductCard({ product, onQuickView }) {
  const { team, type, image } = product;

  return (
    <div className="product-card" onClick={onQuickView}>
      <div className="image-container">
        <img src={image} alt={`${team} ${type}`} loading="lazy" decoding="async" />
        <span className={getBadgeClass(type)}>{type}</span>
      </div>
      <div className="product-info">
        <h3>{team}</h3>
        <div className="product-price">
          <strong>15€</strong> · Envío incluido
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
    </div>
  );
}
