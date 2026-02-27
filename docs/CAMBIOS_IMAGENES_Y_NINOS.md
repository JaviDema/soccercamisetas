# Actualización de Imágenes y Equipaciones de Niño

## Resumen de Cambios

Se han realizado las siguientes actualizaciones en el proyecto Soccer.Camisetas:

### 1. Equipaciones de Niño Añadidas ✅

Se han añadido **21 nuevas equipaciones de niño** para los equipos principales de La Liga:

#### Equipos con versiones de niño:
- **Real Madrid** (3 equipaciones: HOME, AWAY, 3ª)
- **FC Barcelona** (3 equipaciones: HOME, AWAY, 3ª)
- **Atletico Madrid** (3 equipaciones: HOME, AWAY, 3ª)
- **Sevilla FC** (2 equipaciones: HOME, AWAY)
- **Real Betis** (2 equipaciones: HOME, AWAY)
- **Valencia CF** (2 equipaciones: HOME, AWAY)
- **Villarreal CF** (2 equipaciones: HOME, AWAY)
- **Real Sociedad** (2 equipaciones: HOME, AWAY)
- **Athletic Bilbao** (2 equipaciones: HOME, AWAY)

**Características de las equipaciones de niño:**
- Precio: **20€** (vs 25€ de adulto)
- Tipo: Se añade "NIÑO" al tipo original (ej: "HOME 25/26 NIÑO")
- Badge distintivo: Color naranja (#F59E0B) para fácil identificación

### 2. URLs de Imágenes Actualizadas ✅

Se han actualizado **26 URLs de imágenes** con URLs reales del CDN de camisetasfutbolsorpresa.com:

#### Equipos con imágenes actualizadas:
- Real Madrid (HOME, AWAY, 3ª + versiones niño)
- FC Barcelona (HOME, AWAY, 3ª + versiones niño)
- Atletico Madrid (HOME, AWAY + versiones niño)
- Sevilla FC (HOME, AWAY)
- Real Betis (HOME, AWAY)
- Valencia CF (HOME, AWAY)
- Villarreal CF (HOME, AWAY)
- Real Sociedad (HOME, AWAY)
- Athletic Bilbao (HOME, AWAY)

**Ejemplo de URL actualizada:**
```
Antes: /images/products/1004_FC_Barcelona_HOME_2526.jpg
Ahora: https://camisetasfutbolsorpresa.com/cdn/shop/files/camiseta-nike-fc-barcelona-primera-equipacion-2025-2026-deep-royal-blue-8-camisetas-futbol-sorpresa-2.webp
```

### 3. Componentes Actualizados ✅

#### ProductCard.jsx
- Añadida detección de badge "NIÑO"
- Prioridad: NIÑO > RETRO > PLAYER > AWAY > HOME

#### index.css
- Nuevo estilo `.badge-nino` con color naranja distintivo
- Background: `rgba(245,158,11,0.9)`

## Estadísticas del Proyecto

### Antes de la actualización:
- Total de productos: **533**
- Equipaciones de niño: **0**
- Imágenes con URL de CDN: **0**

### Después de la actualización:
- Total de productos: **554** (+21)
- Equipaciones de niño: **21** (nuevas)
- Imágenes con URL de CDN: **26** (actualizadas)

## Scripts Creados

### 1. `scripts/update_products.py`
Script para añadir equipaciones de niño automáticamente.

**Uso:**
```bash
python3 scripts/update_products.py
```

**Funcionalidades:**
- Detecta equipos principales de La Liga
- Crea versiones de niño con precio reducido (20€)
- Genera rutas de imagen con sufijo "_NINO"
- Evita duplicados

### 2. `scripts/update_image_urls.py`
Script para actualizar URLs de imágenes con CDN real.

**Uso:**
```bash
python3 scripts/update_image_urls.py
```

**Funcionalidades:**
- Mapeo de equipos y tipos a URLs de CDN
- Actualización masiva de URLs
- Reporte de cambios realizados

## Próximos Pasos Recomendados

### 1. Ampliar Mapeo de Imágenes
Añadir más equipos al diccionario `IMAGE_MAPPINGS` en `update_image_urls.py`:
- Equipos de otras ligas (Premier League, Serie A, etc.)
- Equipaciones retro
- Versiones player

### 2. Añadir Más Equipaciones de Niño
Expandir la lista `EQUIPOS_PRINCIPALES` en `update_products.py` para incluir:
- Equipos de otras ligas
- Selecciones nacionales

### 3. Validación de Imágenes
Crear script para validar que todas las URLs de imágenes son accesibles:
```python
# Verificar que las imágenes cargan correctamente
# Detectar enlaces rotos
# Generar reporte de imágenes faltantes
```

### 4. Optimización de Imágenes
- Considerar usar un CDN propio
- Implementar lazy loading avanzado
- Añadir placeholders mientras cargan

## Estructura de Datos

### Producto Estándar
```json
{
  "id": 1004,
  "league": "La Liga",
  "team": "FC Barcelona",
  "type": "HOME 25/26",
  "image": "https://camisetasfutbolsorpresa.com/cdn/...",
  "price": 25
}
```

### Producto de Niño
```json
{
  "id": 9332,
  "league": "La Liga",
  "team": "FC Barcelona",
  "type": "HOME 25/26 NIÑO",
  "image": "https://camisetasfutbolsorpresa.com/cdn/...",
  "price": 20
}
```

## Notas Técnicas

### Badges de Productos
El sistema de badges sigue esta jerarquía de prioridad:
1. **NIÑO** - Naranja (#F59E0B)
2. **RETRO** - Morado (#8B5CF6)
3. **PLAYER** - Azul (#3B82F6)
4. **AWAY** - Blanco con borde
5. **HOME** - Negro (por defecto)

### Compatibilidad
- ✅ React 19.2.0
- ✅ Vite 7.3.1
- ✅ Responsive design
- ✅ Lazy loading de imágenes

## Comandos Útiles

```bash
# Ver productos de niño
jq '[.[] | select(.type | contains("NIÑO"))]' src/data/products.json

# Contar productos por equipo
jq '[.[] | .team] | group_by(.) | map({team: .[0], count: length})' src/data/products.json

# Ver productos con imágenes de CDN
jq '[.[] | select(.image | startswith("https://"))]' src/data/products.json

# Verificar total de productos
jq 'length' src/data/products.json
```

## Contacto y Soporte

Para más información sobre las actualizaciones, consultar:
- `scripts/update_products.py` - Lógica de equipaciones de niño
- `scripts/update_image_urls.py` - Mapeo de imágenes
- `src/components/ProductCard.jsx` - Renderizado de badges
- `src/index.css` - Estilos de badges

---

**Fecha de actualización:** Febrero 2025  
**Versión:** 1.0  
**Productos totales:** 554
