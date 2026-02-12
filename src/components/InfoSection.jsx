import React from 'react';

export default function InfoSection() {
  return (
    <section id="info" className="info-section">
      <div className="container">
        <h2 className="info-section-title">¿Por qué elegirnos?</h2>
        <p className="info-section-subtitle">Miles de clientes satisfechos en toda España</p>
        <div className="trust-badges">
          <div className="trust-badge">
            <div className="trust-badge-icon">⭐</div>
            <h3>Calidad Thai AAA+</h3>
            <p>Escudos bordados, etiquetas originales, tejido transpirable</p>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">🚚</div>
            <h3>Envío gratis</h3>
            <p>A toda España. Entrega en 10-15 días laborables con seguimiento</p>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">💬</div>
            <h3>Atención directa</h3>
            <p>Respondemos por WhatsApp en menos de 2 horas</p>
          </div>
          <div className="trust-badge">
            <div className="trust-badge-icon">💳</div>
            <h3>Pago seguro</h3>
            <p>Bizum, PayPal o transferencia. Tú eliges</p>
          </div>
        </div>

        <div className="faq-box" id="faq">
          <h3 className="faq-title">Preguntas frecuentes</h3>
          <p className="faq-subtitle">Todo lo que necesitas saber antes de hacer tu pedido</p>

          <details>
            <summary>¿Qué calidad tienen las camisetas?</summary>
            <p>Calidad Thai AAA+: la más alta en réplicas. Escudos bordados, etiquetas oficiales, tejido idéntico al original. Indistinguibles a simple vista.</p>
          </details>

          <details>
            <summary>¿Cuánto tarda el envío?</summary>
            <p>Entre 10 y 15 días laborables. Recibirás un número de seguimiento en 3-5 días para rastrear tu pedido en todo momento. Envío incluido en el precio.</p>
          </details>

          <details>
            <summary>¿Puedo personalizar nombre y número?</summary>
            <p>Sí, por solo 2€ más. Indícanos el nombre y dorsal que quieras al hacer el pedido por WhatsApp.</p>
          </details>

          <details>
            <summary>¿Qué talla debo elegir?</summary>
            <p>El tallaje es europeo estándar. Si estás entre dos tallas o prefieres holgura, sube una talla. Las versiones "Player" son más ajustadas: pide una talla más de lo habitual.</p>
          </details>

          <details>
            <summary>¿Hacéis devoluciones?</summary>
            <p>Aceptamos devoluciones en caso de defecto de fabricación. Antes de pedir, consulta la guía de tallas para acertar a la primera.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
