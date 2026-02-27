#!/usr/bin/env python3
"""
Script para actualizar las URLs de imágenes en products.json
con URLs reales de CDN basadas en camisetasfutbolsorpresa.com
"""

import json
import re

# Mapeo de equipos y tipos a URLs de imágenes reales
# Basado en el patrón observado en camisetasfutbolsorpresa.com
IMAGE_MAPPINGS = {
    # FC Barcelona
    ("FC Barcelona", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-fc-barcelona-primera-equipacion-2025-2026-deep-royal-blue-8-camisetas-futbol-sorpresa-2.webp",
    ("FC Barcelona", "HOME 25/26 NIÑO"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-fc-barcelona-primera-equipacion-2025-2026-nino-deep-royal-blue-2-camisetas-futbol-sorpresa-3.webp",
    ("FC Barcelona", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-fc-barcelona-segunda-equipacion-2025-2026-gold-7-camisetas-futbol-sorpresa-2.webp",
    ("FC Barcelona", "AWAY 25/26 NIÑO"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-fc-barcelona-segunda-equipacion-2025-2026-nino-gold-0-camisetas-futbol-sorpresa-1.webp",
    ("FC Barcelona", "3ª EQUIPACIÓN 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-fc-barcelona-tercera-equipacion-2025-2026-bright-mango-7-camisetas-futbol-sorpresa-2.webp",
    
    # Real Madrid
    ("Real Madrid", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-adidas-real-madrid-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Madrid", "HOME 25/26 NIÑO"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-adidas-real-madrid-primera-equipacion-2025-2026-nino-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Madrid", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-adidas-real-madrid-segunda-equipacion-2025-2026-dark-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Madrid", "AWAY 25/26 NIÑO"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-adidas-real-madrid-segunda-equipacion-2025-2026-nino-dark-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Madrid", "3ª EQUIPACIÓN 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-adidas-real-madrid-tercera-equipacion-2025-2026-orange-0-camisetas-futbol-sorpresa-1.webp",
    
    # Atletico Madrid
    ("Atletico Madrid", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-atletico-de-madrid-primera-equipacion-2025-2026-sport-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Atletico Madrid", "HOME 25/26 NIÑO"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-atletico-de-madrid-primera-equipacion-2025-2026-nino-sport-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Atletico Madrid", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-atletico-de-madrid-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    ("Atletico Madrid", "AWAY 25/26 NIÑO"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-atletico-de-madrid-segunda-equipacion-2025-2026-nino-black-0-camisetas-futbol-sorpresa-1.webp",
    
    # Sevilla FC
    ("Sevilla FC", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-castore-sevilla-fc-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Sevilla FC", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-castore-sevilla-fc-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    
    # Real Betis
    ("Real Betis", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-hummel-real-betis-primera-equipacion-2025-2026-green-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Betis", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-hummel-real-betis-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    # Valencia CF
    ("Valencia CF", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-puma-valencia-cf-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Valencia CF", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-puma-valencia-cf-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    
    # Villarreal CF
    ("Villarreal CF", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-joma-villarreal-cf-primera-equipacion-2025-2026-yellow-0-camisetas-futbol-sorpresa-1.webp",
    ("Villarreal CF", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-joma-villarreal-cf-segunda-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    
    # Real Sociedad
    ("Real Sociedad", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-macron-real-sociedad-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Sociedad", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-macron-real-sociedad-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    # Athletic Bilbao
    ("Athletic Bilbao", "HOME 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-new-balance-athletic-club-bilbao-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Athletic Bilbao", "AWAY 25/26"): "https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-new-balance-athletic-club-bilbao-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
}

def load_products(filepath):
    """Cargar productos desde JSON"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_products(filepath, products):
    """Guardar productos a JSON"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

def update_product_images(products):
    """Actualizar URLs de imágenes de productos"""
    updated_count = 0
    
    for product in products:
        team = product['team']
        ptype = product['type']
        key = (team, ptype)
        
        if key in IMAGE_MAPPINGS:
            old_image = product['image']
            product['image'] = IMAGE_MAPPINGS[key]
            updated_count += 1
            print(f"✓ Actualizada: {team} - {ptype}")
            print(f"  {old_image} -> {product['image'][:80]}...")
    
    return products, updated_count

def main():
    filepath = 'src/data/products.json'
    
    print("📦 Cargando productos...")
    products = load_products(filepath)
    print(f"   {len(products)} productos cargados")
    
    print("\n🖼️  Actualizando URLs de imágenes...")
    products, updated_count = update_product_images(products)
    print(f"   {updated_count} imágenes actualizadas")
    
    print(f"\n💾 Guardando productos...")
    save_products(filepath, products)
    
    print("\n✅ ¡Actualización completada!")
    print(f"   Total de productos: {len(products)}")
    print(f"   Imágenes actualizadas: {updated_count}")
    print(f"\n⚠️  Nota: Las imágenes restantes mantienen sus rutas locales.")
    print(f"   Puedes añadir más mapeos en IMAGE_MAPPINGS para actualizar más productos.")

if __name__ == '__main__':
    main()
