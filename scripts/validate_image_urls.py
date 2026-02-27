#!/usr/bin/env python3
"""
Script para validar URLs de imágenes
Verifica que todas las URLs sean accesibles y genera un reporte
"""

import json
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import defaultdict

def load_products(filepath):
    """Cargar productos desde JSON"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def check_url(url, timeout=10):
    """Verificar si una URL es accesible"""
    if not url.startswith('http'):
        return False, "URL local (no HTTP)"
    
    try:
        req = urllib.request.Request(url, method='HEAD')
        req.add_header('User-Agent', 'Mozilla/5.0')
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status == 200, f"Status: {response.status}"
    except urllib.error.HTTPError as e:
        return False, f"HTTP Error: {e.code}"
    except urllib.error.URLError as e:
        return False, f"URL Error: {e.reason}"
    except Exception as e:
        return False, f"Error: {str(e)}"

def validate_images(products, max_workers=10):
    """Validar todas las URLs de imágenes en paralelo"""
    results = {
        'valid': [],
        'invalid': [],
        'local': [],
        'stats_by_league': defaultdict(lambda: {'valid': 0, 'invalid': 0, 'local': 0})
    }
    
    # Agrupar URLs únicas para evitar verificar duplicados
    unique_urls = {}
    for product in products:
        url = product['image']
        if url not in unique_urls:
            unique_urls[url] = []
        unique_urls[url].append(product)
    
    print(f"\n🔍 Verificando {len(unique_urls)} URLs únicas...")
    print("-" * 70)
    
    # Verificar URLs en paralelo
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {executor.submit(check_url, url): url for url in unique_urls.keys()}
        
        completed = 0
        for future in as_completed(future_to_url):
            url = future_to_url[future]
            is_valid, message = future.result()
            completed += 1
            
            # Clasificar resultado
            if not url.startswith('http'):
                category = 'local'
                symbol = '📁'
            elif is_valid:
                category = 'valid'
                symbol = '✓'
            else:
                category = 'invalid'
                symbol = '✗'
            
            # Añadir a resultados
            for product in unique_urls[url]:
                results[category].append({
                    'product': product,
                    'url': url,
                    'message': message
                })
                results['stats_by_league'][product['league']][category] += 1
            
            # Mostrar progreso
            if completed % 10 == 0 or completed == len(unique_urls):
                print(f"   Progreso: {completed}/{len(unique_urls)} URLs verificadas", end='\r')
    
    print("\n")
    return results

def generate_report(results, products):
    """Generar reporte de validación"""
    total = len(products)
    valid = len(results['valid'])
    invalid = len(results['invalid'])
    local = len(results['local'])
    
    print("\n" + "=" * 70)
    print("📊 REPORTE DE VALIDACIÓN DE IMÁGENES")
    print("=" * 70)
    
    print(f"\n📈 Resumen General:")
    print(f"   Total de productos:       {total}")
    print(f"   ✓ URLs válidas (CDN):     {valid} ({valid/total*100:.1f}%)")
    print(f"   ✗ URLs inválidas:         {invalid} ({invalid/total*100:.1f}%)")
    print(f"   📁 URLs locales:          {local} ({local/total*100:.1f}%)")
    
    print(f"\n📊 Estadísticas por Liga:")
    print("-" * 70)
    for league, stats in sorted(results['stats_by_league'].items()):
        total_league = stats['valid'] + stats['invalid'] + stats['local']
        print(f"   {league:20s}: ✓{stats['valid']:3d} | ✗{stats['invalid']:3d} | 📁{stats['local']:3d} | Total: {total_league}")
    
    if results['invalid']:
        print(f"\n⚠️  URLs Inválidas ({len(results['invalid'])}):")
        print("-" * 70)
        for item in results['invalid'][:20]:  # Mostrar solo las primeras 20
            product = item['product']
            print(f"   {product['league']:15s} | {product['team']:20s} | {product['type']}")
            print(f"   └─ {item['message']}")
            print(f"   └─ {item['url'][:80]}...")
            print()
        
        if len(results['invalid']) > 20:
            print(f"   ... y {len(results['invalid']) - 20} más")
    
    if results['local']:
        print(f"\n📁 URLs Locales (sin CDN) - Primeros 10:")
        print("-" * 70)
        shown = 0
        for item in results['local']:
            if shown >= 10:
                break
            product = item['product']
            print(f"   {product['league']:15s} | {product['team']:20s} | {product['type']}")
            shown += 1
        
        if len(results['local']) > 10:
            print(f"   ... y {len(results['local']) - 10} más")
    
    print("\n" + "=" * 70)

def save_report(results, filepath='validation_report.json'):
    """Guardar reporte en JSON"""
    report = {
        'summary': {
            'valid': len(results['valid']),
            'invalid': len(results['invalid']),
            'local': len(results['local'])
        },
        'stats_by_league': dict(results['stats_by_league']),
        'invalid_urls': [
            {
                'team': item['product']['team'],
                'league': item['product']['league'],
                'type': item['product']['type'],
                'url': item['url'],
                'error': item['message']
            }
            for item in results['invalid']
        ],
        'local_urls': [
            {
                'team': item['product']['team'],
                'league': item['product']['league'],
                'type': item['product']['type'],
                'url': item['url']
            }
            for item in results['local'][:50]  # Solo las primeras 50
        ]
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Reporte guardado en: {filepath}")

def main():
    filepath = 'src/data/products.json'
    
    print("=" * 70)
    print("🔍 VALIDACIÓN DE URLs DE IMÁGENES")
    print("=" * 70)
    
    print("\n📦 Cargando productos...")
    products = load_products(filepath)
    print(f"   {len(products)} productos cargados")
    
    results = validate_images(products, max_workers=20)
    
    generate_report(results, products)
    
    save_report(results, 'scripts/validation_report.json')
    
    print("\n✅ Validación completada")
    print("=" * 70)

if __name__ == '__main__':
    main()
