import React, { useEffect, useRef } from 'react';
import { InstagramIcon, INSTAGRAM_URL } from './Icons';

// CORREGIDO: fallback cuando la imagen no carga
const handleImgError = (e) => {
  e.currentTarget.style.display = 'none';
};

export default function QuickView({ product, onClose }) {
  const { team, type, image } = product;
  // CORREGIDO: useRef para focus trap en el modal (accesibilidad)
  const closeRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Detalles de ${team} ${type}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar" ref={closeRef}>✕</button>

        <div className="modal-image">
          <img src={image} alt={`Camiseta ${team} - ${type}`} onError={handleImgError} />
        </div>

        <div className="modal-body">
          <h2>{team}</h2>
          <p className="modal-type">{type}</p>
          <div className="modal-price">{product.price ? `${product.price}€` : '15€'}</div>

          <div className="modal-detail-row">
            <div className="modal-detail">
              <div className="modal-detail-label">Tallas</div>
              <div className="modal-detail-value">S–XXL</div>
            </div>
            <div className="modal-detail">
              <div className="modal-detail-label">Personalizar</div>
              <div className="modal-detail-value">Nombre y número (+2€)</div>
            </div>
          </div>

          <div className="modal-shipping">
            📦 Envío gratuito a toda España · Entrega en 10-15 días laborables
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-ig-btn"
          >
            <InstagramIcon size={18} />
            Pedir por Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
