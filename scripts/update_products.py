#!/usr/bin/env python3
"""
Script para actualizar products.json:
1. Añadir equipaciones de niño para equipos principales de La Liga
2. Actualizar URLs de imágenes con URLs reales de CDN
"""

import json
import re

# Equipos principales que tendrán versiones de niño
EQUIPOS_PRINCIPALES = [
    "Real Madrid", "FC Barcelona", "Atletico Madrid", 
    "Sevilla FC", "Real Betis", "Valencia CF", 
    "Villarreal CF", "Real Sociedad", "Athletic Bilbao"
]

# Base URL para imágenes (usando un CDN de placeholder por ahora)
# Estas URLs deberán ser reemplazadas con las URLs reales de tus imágenes
IMAGE_BASE_URL = "https://via.placeholder.com/800x800/0F172A/FFFFFF/?text="

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
    nino_product['price'] = 20  # Precio reducido para niño
    
    # Actualizar la ruta de imagen
    original_image = product['image']
    # Insertar "_NINO" antes de la extensión
    nino_product['image'] = original_image.replace('.jpg', '_NINO.jpg')
    
    return nino_product

def update_image_urls(products):
    """Actualizar URLs de imágenes (placeholder por ahora)"""
    for product in products:
        # Por ahora, mantener las rutas locales
        # En producción, estas deberían apuntar a un CDN real
        pass
    return products

def add_nino_equipaciones(products):
    """Añadir equipaciones de niño para equipos principales"""
    new_products = []
    next_id = get_next_id(products)
    
    for product in products:
        # Solo añadir versiones de niño para La Liga y equipos principales
        if (product['league'] == 'La Liga' and 
            product['team'] in EQUIPOS_PRINCIPALES and
            'NIÑO' not in product['type']):
            
            # Verificar que no exista ya una versión de niño
            nino_exists = any(
                p['team'] == product['team'] and 
                p['type'] == f"{product['type']} NIÑO"
                for p in products
            )
            
            if not nino_exists:
                nino_product = create_nino_version(product, next_id)
                new_products.append(nino_product)
                next_id += 1
                print(f"✓ Añadida versión niño: {product['team']} - {product['type']}")
    
    return new_products

def main():
    filepath = 'src/data/products.json'
    
    print("📦 Cargando productos...")
    products = load_products(filepath)
    print(f"   {len(products)} productos cargados")
    
    print("\n👶 Añadiendo equipaciones de niño...")
    new_nino_products = add_nino_equipaciones(products)
    print(f"   {len(new_nino_products)} nuevas equipaciones de niño añadidas")
    
    print("\n🖼️  Actualizando URLs de imágenes...")
    all_products = products + new_nino_products
    all_products = update_image_urls(all_products)
    
    # Ordenar por ID
    all_products.sort(key=lambda x: x['id'])
    
    print(f"\n💾 Guardando {len(all_products)} productos...")
    save_products(filepath, all_products)
    
    print("\n✅ ¡Actualización completada!")
    print(f"   Total de productos: {len(all_products)}")
    print(f"   Nuevos productos de niño: {len(new_nino_products)}")

if __name__ == '__main__':
    main()
