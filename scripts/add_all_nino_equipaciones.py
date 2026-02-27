#!/usr/bin/env python3
"""
Script mejorado para añadir equipaciones de niño a TODAS las ligas principales
"""

import json

# Equipos principales por liga que tendrán versiones de niño
EQUIPOS_POR_LIGA = {
    "La Liga": [
        "Real Madrid", "FC Barcelona", "Atletico Madrid", 
        "Sevilla FC", "Real Betis", "Valencia CF", 
        "Villarreal CF", "Real Sociedad", "Athletic Bilbao",
        "Girona", "Rayo Vallecano", "Getafe", "Osasuna",
        "RCD Mallorca", "Las Palmas", "Celta de Vigo"
    ],
    "Premier League": [
        "Manchester City", "Arsenal", "Liverpool", 
        "Manchester United", "Chelsea", "Tottenham",
        "Newcastle United", "Aston Villa", "Brighton",
        "West Ham", "Everton", "Fulham"
    ],
    "Serie A": [
        "Inter Milan", "AC Milan", "Juventus", 
        "Napoli", "AS Roma", "Lazio",
        "Atalanta", "Fiorentina", "Bolonia"
    ],
    "Bundesliga": [
        "Bayern Munich", "Borussia Dortmund", "RB Leipzig",
        "Bayer Leverkusen", "Eintracht Frankfurt", "Wolfsburg"
    ],
    "Ligue 1": [
        "PSG", "Marseille", "Monaco", 
        "Lyon", "Lille", "Nice"
    ],
    "Selecciones": [
        "España", "Alemania", "Francia", "Inglaterra", 
        "Italia", "Portugal", "Brasil", "Argentina",
        "Holanda", "Bélgica", "Croacia", "Uruguay"
    ]
}

def load_products(filepath):
    """Cargar productos desde JSON"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_products(filepath, products):
    """Guardar productos a JSON"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

def get_next_id(products):
    """Obtener el siguiente ID disponible"""
    return max(p['id'] for p in products) + 1

def create_nino_version(product, new_id):
    """Crear versión de niño de un producto"""
    nino_product = product.copy()
    nino_product['id'] = new_id
    nino_product['type'] = f"{product['type']} NIÑO"
    
    # Precio reducido para niño según el precio original
    if product['price'] >= 25:
        nino_product['price'] = 20
    elif product['price'] >= 20:
        nino_product['price'] = 18
    else:
        nino_product['price'] = max(15, product['price'] - 5)
    
    # Actualizar la ruta de imagen
    original_image = product['image']
    if original_image.startswith('http'):
        # Si es URL de CDN, intentar añadir -nino antes de la extensión
        nino_product['image'] = original_image.replace('.webp', '-nino.webp').replace('.jpg', '-nino.jpg')
    else:
        # Si es ruta local, añadir _NINO
        nino_product['image'] = original_image.replace('.jpg', '_NINO.jpg')
    
    return nino_product

def should_add_nino(product, equipos_principales):
    """Determinar si se debe añadir versión de niño"""
    # Solo para equipos principales de cada liga
    if product['team'] not in equipos_principales:
        return False
    
    # No añadir si ya es versión de niño
    if 'NIÑO' in product['type']:
        return False
    
    # No añadir para versiones RETRO (generalmente no tienen versión niño)
    if 'RETRO' in product['type'].upper():
        return False
    
    # No añadir para versiones PLAYER específicas (ej: "Messi 10")
    if any(char.isdigit() for char in product['type']) and 'PLAYER' in product['type'].upper():
        return False
    
    return True

def add_nino_equipaciones_all_leagues(products):
    """Añadir equipaciones de niño para todas las ligas"""
    new_products = []
    next_id = get_next_id(products)
    stats_by_league = {}
    
    for league, equipos in EQUIPOS_POR_LIGA.items():
        league_count = 0
        
        for product in products:
            if product['league'] != league:
                continue
            
            if not should_add_nino(product, equipos):
                continue
            
            # Verificar que no exista ya una versión de niño
            nino_exists = any(
                p['team'] == product['team'] and 
                p['type'] == f"{product['type']} NIÑO"
                for p in products + new_products
            )
            
            if not nino_exists:
                nino_product = create_nino_version(product, next_id)
                new_products.append(nino_product)
                next_id += 1
                league_count += 1
                print(f"✓ {league}: {product['team']} - {product['type']}")
        
        stats_by_league[league] = league_count
    
    return new_products, stats_by_league

def main():
    filepath = 'src/data/products.json'
    
    print("=" * 70)
    print("🚀 AÑADIENDO EQUIPACIONES DE NIÑO PARA TODAS LAS LIGAS")
    print("=" * 70)
    
    print("\n📦 Cargando productos...")
    products = load_products(filepath)
    print(f"   {len(products)} productos cargados")
    
    print("\n👶 Añadiendo equipaciones de niño...")
    print("-" * 70)
    new_nino_products, stats = add_nino_equipaciones_all_leagues(products)
    
    print("\n" + "=" * 70)
    print("📊 ESTADÍSTICAS POR LIGA")
    print("=" * 70)
    total_added = 0
    for league, count in stats.items():
        if count > 0:
            print(f"   {league:20s}: {count:3d} equipaciones de niño añadidas")
            total_added += count
    
    print("\n💾 Guardando productos...")
    all_products = products + new_nino_products
    all_products.sort(key=lambda x: x['id'])
    save_products(filepath, all_products)
    
    print("\n" + "=" * 70)
    print("✅ ¡ACTUALIZACIÓN COMPLETADA!")
    print("=" * 70)
    print(f"   Productos originales:     {len(products)}")
    print(f"   Nuevos productos niño:    {total_added}")
    print(f"   Total de productos:       {len(all_products)}")
    print("=" * 70)

if __name__ == '__main__':
    main()
