import React from 'react';

export default function ProductCard({ product }) {
    // Configura aquí tu número de WhatsApp (con código de país, sin +)
    const PHONE_NUMBER = "34600000000";

    const message = `Hola, me interesa la camiseta: ${product.team} - ${product.type}. ¿Tenéis talla...?`;
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    return (
        <div className="product-card">
            <div className="image-container">
                <img src={product.image} alt={`${product.team} ${product.type}`} loading="lazy" />
                <span className="badge">{product.type}</span>
            </div>
            <div className="product-info">
                <h3>{product.team}</h3>
                <p className="price-hidden">Consultar precio</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    Pedir por WhatsApp
                </a>
            </div>
        </div>
    );
}
