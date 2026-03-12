import React from 'react';
import { InstagramIcon, INSTAGRAM_URL } from './Icons';

function getBadgeClass(type) {
  const t = type.toLowerCase();
  if (t.includes('niño')) return 'badge badge-nino';
  if (t.includes('retro')) return 'badge badge-retro';
  if (t.includes('player')) return 'badge badge-player';
  if (t.includes('third') || t.includes('away')) return 'badge badge-away';
  return 'badge badge-home';
}

const handleImgError = (event) => {
  event.currentTarget.style.display = 'none';
};

export default function ProductCard({ product, onQuickView }) {
  const { team, type, image } = product;
  const price = product.price ? `${product.price}€` : '15€';

  return (
    <article className="product-card">
      <button type="button" className="product-card-trigger" onClick={onQuickView} aria-label={`Ver detalles de ${team} ${type}`}>
        <div className="image-container">
          <img src={image} alt={`Camiseta ${team} - ${type}`} loading="lazy" decoding="async" onError={handleImgError} />
          <span className={getBadgeClass(type)}>{type}</span>
        </div>
      </button>

      <div className="product-info">
        <h3>{team}</h3>
        <div className="product-price">
          <strong>{price}</strong> · Envío incluido
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-instagram">
          <InstagramIcon size={14} />
          Pedir por Instagram
        </a>
      </div>
    </article>
  );
}
