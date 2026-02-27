#!/usr/bin/env python3
"""
Script extenso para actualizar URLs de imágenes de TODAS las ligas
Basado en patrones de camisetasfutbolsorpresa.com
"""

import json
import re

# Base URL del CDN
CDN_BASE = "https://camisetasfutbolsorpresa.com/cdn/shop/files/"

# Mapeo extenso de equipos y tipos a URLs de imágenes
IMAGE_MAPPINGS = {
    # ========== LA LIGA ==========
    ("Real Madrid", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-real-madrid-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Madrid", "HOME 25/26 NIÑO"): f"{CDN_BASE}camiseta-adidas-real-madrid-primera-equipacion-2025-2026-nino-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Madrid", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-real-madrid-segunda-equipacion-2025-2026-dark-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Madrid", "AWAY 25/26 NIÑO"): f"{CDN_BASE}camiseta-adidas-real-madrid-segunda-equipacion-2025-2026-nino-dark-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Madrid", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-adidas-real-madrid-tercera-equipacion-2025-2026-orange-0-camisetas-futbol-sorpresa-1.webp",
    
    ("FC Barcelona", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-fc-barcelona-primera-equipacion-2025-2026-deep-royal-blue-8-camisetas-futbol-sorpresa-2.webp",
    ("FC Barcelona", "HOME 25/26 NIÑO"): f"{CDN_BASE}camiseta-nike-fc-barcelona-primera-equipacion-2025-2026-nino-deep-royal-blue-2-camisetas-futbol-sorpresa-3.webp",
    ("FC Barcelona", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-fc-barcelona-segunda-equipacion-2025-2026-gold-7-camisetas-futbol-sorpresa-2.webp",
    ("FC Barcelona", "AWAY 25/26 NIÑO"): f"{CDN_BASE}camiseta-nike-fc-barcelona-segunda-equipacion-2025-2026-nino-gold-0-camisetas-futbol-sorpresa-1.webp",
    ("FC Barcelona", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-nike-fc-barcelona-tercera-equipacion-2025-2026-bright-mango-7-camisetas-futbol-sorpresa-2.webp",
    
    ("Atletico Madrid", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-atletico-de-madrid-primera-equipacion-2025-2026-sport-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Atletico Madrid", "HOME 25/26 NIÑO"): f"{CDN_BASE}camiseta-nike-atletico-de-madrid-primera-equipacion-2025-2026-nino-sport-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Atletico Madrid", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-atletico-de-madrid-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    ("Atletico Madrid", "AWAY 25/26 NIÑO"): f"{CDN_BASE}camiseta-nike-atletico-de-madrid-segunda-equipacion-2025-2026-nino-black-0-camisetas-futbol-sorpresa-1.webp",
    ("Atletico Madrid", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-nike-atletico-de-madrid-tercera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Sevilla FC", "HOME 25/26"): f"{CDN_BASE}camiseta-castore-sevilla-fc-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Sevilla FC", "AWAY 25/26"): f"{CDN_BASE}camiseta-castore-sevilla-fc-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Real Betis", "HOME 25/26"): f"{CDN_BASE}camiseta-hummel-real-betis-primera-equipacion-2025-2026-green-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Betis", "AWAY 25/26"): f"{CDN_BASE}camiseta-hummel-real-betis-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Valencia CF", "HOME 25/26"): f"{CDN_BASE}camiseta-puma-valencia-cf-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Valencia CF", "AWAY 25/26"): f"{CDN_BASE}camiseta-puma-valencia-cf-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Villarreal CF", "HOME 25/26"): f"{CDN_BASE}camiseta-joma-villarreal-cf-primera-equipacion-2025-2026-yellow-0-camisetas-futbol-sorpresa-1.webp",
    ("Villarreal CF", "AWAY 25/26"): f"{CDN_BASE}camiseta-joma-villarreal-cf-segunda-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Real Sociedad", "HOME 25/26"): f"{CDN_BASE}camiseta-macron-real-sociedad-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Real Sociedad", "AWAY 25/26"): f"{CDN_BASE}camiseta-macron-real-sociedad-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Athletic Bilbao", "HOME 25/26"): f"{CDN_BASE}camiseta-new-balance-athletic-club-bilbao-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Athletic Bilbao", "AWAY 25/26"): f"{CDN_BASE}camiseta-new-balance-athletic-club-bilbao-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    # ========== PREMIER LEAGUE ==========
    ("Arsenal", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-arsenal-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Arsenal", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-arsenal-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    ("Arsenal", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-adidas-arsenal-tercera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Liverpool", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-liverpool-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Liverpool", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-liverpool-segunda-equipacion-2025-2026-green-0-camisetas-futbol-sorpresa-1.webp",
    ("Liverpool", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-nike-liverpool-tercera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Manchester City", "HOME 25/26"): f"{CDN_BASE}camiseta-puma-manchester-city-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Manchester City", "AWAY 25/26"): f"{CDN_BASE}camiseta-puma-manchester-city-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    ("Manchester City", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-puma-manchester-city-tercera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Manchester United", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-manchester-united-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Manchester United", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-manchester-united-segunda-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Manchester United", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-adidas-manchester-united-tercera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Chelsea", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-chelsea-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Chelsea", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-chelsea-segunda-equipacion-2025-2026-yellow-0-camisetas-futbol-sorpresa-1.webp",
    ("Chelsea", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-nike-chelsea-tercera-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Tottenham", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-tottenham-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Tottenham", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-tottenham-segunda-equipacion-2025-2026-green-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Newcastle United", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-newcastle-united-primera-equipacion-2025-2026-black-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Newcastle United", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-newcastle-united-segunda-equipacion-2025-2026-green-0-camisetas-futbol-sorpresa-1.webp",
    
    # ========== SERIE A ==========
    ("AC Milan", "HOME 25/26"): f"{CDN_BASE}camiseta-puma-ac-milan-primera-equipacion-2025-2026-red-black-0-camisetas-futbol-sorpresa-1.webp",
    ("AC Milan", "AWAY 25/26"): f"{CDN_BASE}camiseta-puma-ac-milan-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("AC Milan", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-puma-ac-milan-tercera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Inter Milan", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-inter-milan-primera-equipacion-2025-2026-blue-black-0-camisetas-futbol-sorpresa-1.webp",
    ("Inter Milan", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-inter-milan-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Inter Milan", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-nike-inter-milan-tercera-equipacion-2025-2026-yellow-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Juventus", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-juventus-primera-equipacion-2025-2026-black-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Juventus", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-juventus-segunda-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Juventus", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-adidas-juventus-tercera-equipacion-2025-2026-yellow-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Napoli", "HOME 25/26"): f"{CDN_BASE}camiseta-ea7-napoli-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Napoli", "AWAY 25/26"): f"{CDN_BASE}camiseta-ea7-napoli-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("AS Roma", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-as-roma-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("AS Roma", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-as-roma-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Lazio", "HOME 25/26"): f"{CDN_BASE}camiseta-mizuno-lazio-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Lazio", "AWAY 25/26"): f"{CDN_BASE}camiseta-mizuno-lazio-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    # ========== BUNDESLIGA ==========
    ("Bayern Munich", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-bayern-munich-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Bayern Munich", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-bayern-munich-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Bayern Munich", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-adidas-bayern-munich-tercera-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Borussia Dortmund", "HOME 25/26"): f"{CDN_BASE}camiseta-puma-borussia-dortmund-primera-equipacion-2025-2026-yellow-black-0-camisetas-futbol-sorpresa-1.webp",
    ("Borussia Dortmund", "AWAY 25/26"): f"{CDN_BASE}camiseta-puma-borussia-dortmund-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    ("Borussia Dortmund", "3ª EQUIPACIÓN 25/26"): f"{CDN_BASE}camiseta-puma-borussia-dortmund-tercera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Bayer Leverkusen", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-bayer-leverkusen-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Bayer Leverkusen", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-bayer-leverkusen-segunda-equipacion-2025-2026-black-0-camisetas-futbol-sorpresa-1.webp",
    
    ("RB Leipzig", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-rb-leipzig-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("RB Leipzig", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-rb-leipzig-segunda-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    
    # ========== SELECCIONES ==========
    ("España", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-espana-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("España", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-espana-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Alemania", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-alemania-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Alemania", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-alemania-segunda-equipacion-2025-2026-pink-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Francia", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-francia-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Francia", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-francia-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Inglaterra", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-inglaterra-primera-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    ("Inglaterra", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-inglaterra-segunda-equipacion-2025-2026-purple-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Portugal", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-portugal-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    ("Portugal", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-portugal-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Italia", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-italia-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Italia", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-italia-segunda-equipacion-2025-2026-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Brasil", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-brasil-primera-equipacion-2025-2026-yellow-0-camisetas-futbol-sorpresa-1.webp",
    ("Brasil", "AWAY 25/26"): f"{CDN_BASE}camiseta-nike-brasil-segunda-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Argentina", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-argentina-primera-equipacion-2025-2026-white-blue-0-camisetas-futbol-sorpresa-1.webp",
    ("Argentina", "AWAY 25/26"): f"{CDN_BASE}camiseta-adidas-argentina-segunda-equipacion-2025-2026-purple-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Holanda", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-holanda-primera-equipacion-2025-2026-orange-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Bélgica", "HOME 25/26"): f"{CDN_BASE}camiseta-adidas-belgica-primera-equipacion-2025-2026-red-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Croacia", "HOME 25/26"): f"{CDN_BASE}camiseta-nike-croacia-primera-equipacion-2025-2026-red-white-0-camisetas-futbol-sorpresa-1.webp",
    
    ("Uruguay", "HOME 25/26"): f"{CDN_BASE}camiseta-puma-uruguay-primera-equipacion-2025-2026-blue-0-camisetas-futbol-sorpresa-1.webp",
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
    stats_by_league = {}
    
    for product in products:
        team = product['team']
        ptype = product['type']
        league = product['league']
        key = (team, ptype)
        
        if league not in stats_by_league:
            stats_by_league[league] = 0
        
        if key in IMAGE_MAPPINGS:
            old_image = product['image']
            product['image'] = IMAGE_MAPPINGS[key]
            updated_count += 1
            stats_by_league[league] += 1
            print(f"✓ {league}: {team} - {ptype}")
    
    return products, updated_count, stats_by_league

def main():
    filepath = 'src/data/products.json'
    
    print("=" * 70)
    print("🖼️  ACTUALIZANDO URLs DE IMÁGENES PARA TODAS LAS LIGAS")
    print("=" * 70)
    
    print("\n📦 Cargando productos...")
    products = load_products(filepath)
    print(f"   {len(products)} productos cargados")
    
    print("\n🔄 Actualizando URLs de imágenes...")
    print("-" * 70)
    products, updated_count, stats = update_product_images(products)
    
    print("\n" + "=" * 70)
    print("📊 ESTADÍSTICAS POR LIGA")
    print("=" * 70)
    for league, count in sorted(stats.items()):
        if count > 0:
            print(f"   {league:20s}: {count:3d} imágenes actualizadas")
    
    print(f"\n💾 Guardando productos...")
    save_products(filepath, products)
    
    print("\n" + "=" * 70)
    print("✅ ¡ACTUALIZACIÓN COMPLETADA!")
    print("=" * 70)
    print(f"   Total de productos:       {len(products)}")
    print(f"   Imágenes actualizadas:    {updated_count}")
    print(f"   Mapeos disponibles:       {len(IMAGE_MAPPINGS)}")
    print("=" * 70)

if __name__ == '__main__':
    main()
