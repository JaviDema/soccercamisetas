#!/usr/bin/env python3
import json
import sys
from pathlib import Path

def restore_local_image_urls():
    """Restaura las URLs de imágenes a rutas locales manteniendo las equipaciones de niño"""
    
    # Ruta al archivo products.json
    project_root = Path(__file__).parent.parent
    products_file = project_root / 'src' / 'data' / 'products.json'
    
    print(f"📂 Leyendo productos desde: {products_file}")
    
    with open(products_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📦 Total de productos: {len(products)}")
    
    updated_count = 0
    nino_count = 0
    
    for product in products:
        # Si la imagen es una URL de CDN, convertirla a ruta local
        if product['image'].startswith('https://'):
            # Extraer el nombre del archivo de la URL
            # Ejemplo: https://camisetasfutbolsorpresa.com/cdn/shop/files/real-madrid-home-25-26.jpg
            # -> /images/products/{id}_{team}_{type}.jpg
            
            team = product['team'].replace(' ', '_')
            tipo = product['type'].replace(' ', '_').replace('/', '')
            
            # Generar ruta local
            local_path = f"/images/products/{product['id']}_{team}_{tipo}.jpg"
            product['image'] = local_path
            updated_count += 1
        
        # Contar productos de niño
        if 'NIÑO' in product['type']:
            nino_count += 1
    
    # Guardar cambios
    print(f"\n💾 Guardando cambios...")
    with open(products_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Restauración completada:")
    print(f"   - URLs restauradas a local: {updated_count}")
    print(f"   - Equipaciones de niño mantenidas: {nino_count}")
    print(f"   - Total productos: {len(products)}")
    
    return updated_count, nino_count

if __name__ == '__main__':
    try:
        updated, nino = restore_local_image_urls()
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
