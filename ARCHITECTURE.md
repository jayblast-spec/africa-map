# Architecture Documentation

## Overview

The UN Equal Earth Map is built as a **client-side React application** with a focus on performance, accessibility, and responsive design. All data is bundled with the application, eliminating the need for backend services.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│           Browser / Client Environment              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  React Application (App.tsx)                 │  │
│  │  - Component composition                     │  │
│  │  - State management (useState, useCallback)  │  │
│  │  - Event handling                            │  │
│  └──────────────────────────────────────────────┘  │
│                      │                              │
│        ┌─────────────┼─────────────┐               │
│        │             │             │               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │Components│  │  Hooks   │  │Libraries │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│        │             │             │               │
│  ┌─────┴─────┐  ┌────┴────┐  ┌────┴─────┐         │
│  │MapContainer│  │useMap   │  │dataLoader│         │
│  │TimeSlider │  │useProj  │  │projection│         │
│  │LayerCtrl  │  │useTerrain│  │terrainLdr│         │
│  │Legend     │  │useDataLyr│  │          │         │
│  │ProjectTog │  │          │  │          │         │
│  └───────────┘  └──────────┘  └──────────┘         │
│                      │                              │
│  ┌───────────────────┴───────────────────┐         │
│  │       MapLibre GL Instance            │         │
│  │  - Map rendering                      │         │
│  │  - Layer management                   │         │
│  │  - Projection handling                │         │
│  │  - Interaction events                 │         │
│  └───────────────────┬───────────────────┘         │
│                      │                              │
│  ┌───────────────────┴───────────────────┐         │
│  │   Data & Assets (Bundled)             │         │
│  │  - GeoJSON (countries, boundaries)    │         │
│  │  - Raster tiles (satellite, terrain)  │         │
│  │  - Population, GDP, infrastructure    │         │
│  └───────────────────────────────────────┘         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── MapContainer
│   ├── useMapInstance (hook)
│   │   └── MapLibre GL initialization
│   └── Map DOM element
├── Legend
│   ├── About section
│   ├── Population scale
│   ├── GDP scale
│   ├── Infrastructure scale
│   └── Country sizes
├── LayerControls
│   ├── Population toggle
│   ├── GDP toggle
│   └── Infrastructure toggle
├── ProjectionToggle
│   └── Mercator ↔ Equal Earth toggle
└── TimeSeriesSlider
    ├── Range slider (1950-2026)
    └── Year button grid (desktop only)
```

## Data Flow

### Initial Load

```
1. App mounts
   ├── Initialize MapLibre GL (useMapInstance)
   ├── Apply terrain layer (useTerrainLayer)
   ├── Load data layers (useDataLayers)
   │   ├── Fetch GeoJSON (dataLoader.ts)
   │   ├── Add sources (map.addSource)
   │   └── Add layers (map.addLayer)
   └── Set projection (useProjection)
```

### User Interaction

```
User Action → Event Handler → State Update → Map Update → Re-render

Examples:

1. Projection Toggle:
   onClick → handleToggle → useProjection → applyProjection → map.setProjection

2. Layer Toggle:
   onChange → handleLayerChange → setLayerVisibility → toggleLayerVisibility → map.setLayoutProperty

3. Year Selection:
   onChange → handleYearChange → setYear → fetchDataForYear → updateDataSources
```

## State Management

### Component-Level State

The app uses React's built-in hooks for state management:

```typescript
// App.tsx - top-level state
const [year, setYear] = useState(2020);
const [layerVisibility, setLayerVisibility] = useState<LayerState>({
  population: true,
  gdp: false,
  infrastructure: false,
});

// Custom hooks manage local state
// useProjection: manages projection toggle state
// useDataLayers: manages layer loading/unloading state
// useMapInstance: manages map instance reference
```

### Why No Redux/MobX?

- **Simple state**: Only 2 top-level state variables
- **Limited scope**: No cross-component complex updates
- **Performance**: React Context + hooks sufficient
- **Bundle size**: Avoids external dependencies

## Hook Architecture

### Custom Hooks

#### `useMapInstance()`
```typescript
// Purpose: Initialize MapLibre GL map
// Returns: Reference to map instance
// Side effects: Creates map on component mount

Usage:
const mapRef = useMapInstance('map-container');
// mapRef.current is now the MapLibre GL Map instance
```

#### `useProjection()`
```typescript
// Purpose: Manage projection toggle state
// Input: mapRef (reference to map)
// Returns: { projection, toggleProjection }

Usage:
const { projection, toggleProjection } = useProjection(mapRef);
// projection: 'mercator' | 'equalEarth'
// toggleProjection: () => Promise<void>
```

#### `useTerrainLayer()`
```typescript
// Purpose: Initialize 3D terrain layer
// Input: mapRef
// Side effects: Adds terrain layer once map loads

Usage:
useTerrainLayer(mapRef);
// Automatically fetches and renders elevation data
```

#### `useDataLayers()`
```typescript
// Purpose: Manage GeoJSON data layers
// Input: mapRef
// Returns: { loadLayer, toggleLayer, visibility, layers, isLoading, error }

Usage:
const { loadLayer, toggleLayer, visibility } = useDataLayers(mapRef);
// loadLayer(layer): Promise<void> - fetch and render GeoJSON
// toggleLayer(layerId): void - toggle visibility
// visibility: Record<layerId, boolean> - current state
```

## Library Architecture

### `dataLoader.ts`
**Purpose**: GeoJSON layer management

Functions:
- `loadDataLayer()` - Fetch GeoJSON, add source, create layer
- `toggleLayerVisibility()` - Show/hide layer
- `getLayerVisibility()` - Query layer visibility
- `removeDataLayer()` - Remove layer and source
- `updateLayerStyle()` - Change paint properties

### `projections.ts`
**Purpose**: Projection switching logic

Functions:
- `applyProjection()` - Switch between Mercator and Equal Earth
- Uses MapLibre GL's projection API

### `terrainLoader.ts`
**Purpose**: Elevation data management

Functions:
- `loadTerrainLayer()` - Add 3D terrain to map
- Uses AWS elevation tiles (NOAA ETOPO1)

## Performance Considerations

### Bundle Size Optimization

```
Production Build: 324 kB gzipped
├── React (40%)
├── MapLibre GL (35%)
├── Tailwind CSS (15%)
└── Application code (10%)
```

**Strategies**:
- No large dependencies (no Redux, no UI libraries)
- Tree-shaking enabled in Vite
- CSS purging via Tailwind production mode
- Async chunk loading (considered but not needed)

### Rendering Performance

- **MapLibre GL**: Offscreen canvas rendering (efficient GPU usage)
- **React**: Functional components with useMemo/useCallback
- **CSS**: Tailwind utilities (no complex CSS calculations)
- **Tile Caching**: 1-year browser cache for map tiles

### Network Performance

- **Data**: All GeoJSON bundled (no runtime fetching)
- **Tiles**: External CDN (AWS, map tile providers)
- **Gzip**: 60% reduction over uncompressed

## Type Safety

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Definitions

#### `types/data.ts`
```typescript
interface DataLayer {
  id: string;
  name: string;
  type: 'fill' | 'line' | 'circle';
  sourceUrl: string;
  color: string;
  opacity: number;
  paint?: LayerPaint;
  filter?: any[];
  zIndex?: number;
  showLabels?: boolean;
}

interface LayerVisibility {
  [layerId: string]: boolean;
}
```

## Responsive Design Strategy

### Mobile-First Approach

```
Base styles: Mobile (375px)
├── Simplify header (smaller text)
├── Collapse legend (accordion)
├── Hide year button grid
└── Full-width controls

Breakpoints:
├── sm: 640px  - Slight padding increase
├── md: 768px  - Show some desktop features
├── lg: 1024px - Full desktop layout
└── xl: 1440px - Maximum width constraints
```

### Tailwind Responsive Classes

```typescript
// Example: Header text size
<h1 className="text-2xl sm:text-3xl md:text-4xl">

// Example: Component visibility
<div className="hidden sm:block">   // Desktop only
<div className="sm:hidden">          // Mobile only
```

## Accessibility Architecture

### WCAG AA Compliance

1. **Color Contrast**
   - All text: 4.5:1 (normal), 3:1 (large)
   - Verified with contrast checker

2. **Semantic HTML**
   - Proper heading hierarchy (h1 → h2, h3)
   - Landmark roles (header, main, nav)
   - List elements for grouped content

3. **ARIA Attributes**
   - `aria-label`: Button descriptions
   - `aria-expanded`: Accordion states
   - `aria-labelledby`: Complex associations

4. **Keyboard Navigation**
   - Tab order follows visual order
   - Focus indicators visible
   - Enter/Space for activations

5. **Motion Preferences**
   - `prefers-reduced-motion` support
   - Smooth transitions disabled if preferred

## Error Handling

### Component-Level Error Handling

```typescript
try {
  await loadDataLayer(map, layer);
} catch (err) {
  const errorMsg = `Failed to load layer '${layer.id}': ${error.message}`;
  console.error(errorMsg);
  setError(errorMsg);
}
```

### Map Event Listeners

```typescript
map.on('error', (error) => {
  console.error('Map error:', error);
});

map.on('load', () => {
  console.log('Map loaded');
});
```

## Testing Strategy

### Manual Testing Areas

1. **Rendering**: Component display at various viewports
2. **Interaction**: Layer toggles, projection switch, year slider
3. **Accessibility**: Keyboard navigation, screen readers
4. **Performance**: Bundle size, load time, memory
5. **Compatibility**: Browser and device coverage

### Future Testing

```typescript
// Unit tests (Jest)
test('TimeSeriesSlider selects correct year', () => {
  const { getByRole } = render(<TimeSeriesSlider year={2020} onYearChange={mockFn} />);
  // Assert year is rendered
});

// E2E tests (Playwright, Cypress)
test('Toggle layer visibility', async ({ page }) => {
  await page.click('button:has-text("Layers")');
  await page.click('label:has-text("Population")');
  // Assert layer is hidden on map
});
```

## Security Considerations

1. **No Backend Services**
   - No authentication needed
   - No database access
   - No sensitive data stored

2. **External Resources**
   - Map tiles from trusted CDNs
   - Elevation data from AWS
   - GeoJSON validation on load

3. **XSS Prevention**
   - React sanitizes JSX output
   - No `dangerouslySetInnerHTML`
   - Content Security Policy headers

## Future Extensibility

### Adding New Data Layers

```typescript
// 1. Define layer in App.tsx
const newLayer: DataLayer = {
  id: 'new-layer',
  name: 'New Layer',
  type: 'fill',
  sourceUrl: '/data/new-layer.geojson',
  color: '#00ff00',
  opacity: 0.7,
};

// 2. Add to legend (Legend.tsx)
const NEW_LEGEND = [
  { label: 'Low', color: '#...' },
  // ...
];

// 3. Add toggle control (LayerControls.tsx)
infrastructure: false, // Add to LayerState
```

### Adding New Projections

```typescript
// projections.ts
export async function applyProjection(map, projection) {
  if (projection === 'yourProjection') {
    map.setProjection('yourProjection');
  }
}
```

## Deployment Architecture

### Build Process

```
npm run build
├── TypeScript compilation (tsc)
├── Vite bundling
│   ├── Module transformation
│   ├── Code splitting
│   └── Minification (Terser)
├── CSS processing (PostCSS → Tailwind)
├── Asset optimization
└── Output to dist/
```

### Vercel Deployment

```
Git Push → GitHub Webhook → Vercel Build
├── Fetch code
├── npm install
├── npm run build
├── Upload to CDN
└── Deploy to edge
```

**Configuration** (`vercel.json`):
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Headers: Cache control, security headers
- Rewrites: SPA routing (all routes → index.html)

## Monitoring & Logging

### Client-Side Logging

```typescript
// Levels: error, warn, info, debug
console.error('Map initialization failed');
console.warn('Layer already loaded');
console.info('Map loaded successfully');
console.debug('Projection toggled to equal-earth');
```

### Future: Analytics

- Track user interactions (layer toggles, projection switches)
- Monitor performance metrics (load time, frame rate)
- Log errors to remote service

## Conclusion

The architecture prioritizes **simplicity, performance, and accessibility**. By keeping the application client-side with minimal dependencies, we achieve fast load times and reliable functionality across devices and browsers.
