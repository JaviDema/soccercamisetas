import React from 'react';

export default function InfoSection() {
    return (
        <section id="info" className="info-section">
            <div className="container">
                <div className="info-grid">
                    <div className="info-card">
                        <h3>Tallas</h3>
                        <p><strong>Normal:</strong> Tallaje estándar europeo.</p>
                        <p><strong>Player:</strong> Más ajustada. Pide una talla más si dudas.</p>
                        <p><strong>Niño:</strong> Desde talla 16 a 28.</p>
                    </div>
                    <div className="info-card">
                        <h3>Envíos</h3>
                        <p><strong>10-15 días laborables.</strong></p>
                        <p>Envío incluido en el precio.</p>
                        <p>Seguimiento disponible en 3-5 días.</p>
                    </div>
                    <div className="info-card">
                        <h3>Pago</h3>
                        <ul>
                            <li>Bizum</li>
                            <li>PayPal</li>
                            <li>Transferencia</li>
                        </ul>
                    </div>
                </div>

                <div className="faq-box" id="faq">
                    <h3 className="faq-title">Preguntas frecuentes</h3>
                    <details>
                        <summary>¿Las camisetas son de calidad?</summary>
                        <p>Calidad Thai AAA+ con todos los detalles, etiquetas y escudos bordados.</p>
                    </details>
                    <details>
                        <summary>¿Puedo personalizar nombre y número?</summary>
                        <p>Sí, por +2€ puedes poner el nombre y dorsal que quieras.</p>
                    </details>
                    <details>
                        <summary>¿Hacéis devoluciones?</summary>
                        <p>Solo en caso de defecto de fábrica. Revisa bien la talla antes de pedir.</p>
                    </details>
                    <details>
                        <summary>¿Cuánto tarda en llegar?</summary>
                        <p>Entre 10 y 15 días laborables con número de seguimiento.</p>
                    </details>
                </div>
            </div>
        </section>
    );
}
