/**
 * Data loader utilities for GeoJSON layer management
 * Handles loading, adding, toggling, and removing data layers from MapLibre GL
 */

import { Map } from 'maplibre-gl';
import { DataLayer } from '../types/data';

/**
 * Build color expression for population density layer
 * Uses light yellow → dark red scale based on density_2026
 */
function buildPopulationDensityColor(): any[] {
  return [
    'interpolate',
    ['linear'],
    ['get', 'density_2026'],
    0,
    '#ffffcc', // light yellow
    50,
    '#ffeda0',
    100,
    '#fed976',
    150,
    '#feb24c',
    200,
    '#fd8d3c',
    250,
    '#e31a1c', // dark red
  ];
}

/**
 * Build color expression for GDP layer
 * Uses light green → dark green scale based on gdp_usd_billions
 */
function buildGDPColor(): any[] {
  return [
    'interpolate',
    ['linear'],
    ['get', 'gdp_usd_billions'],
    0,
    '#e5f5e0', // light green
    100,
    '#c7e9c0',
    200,
    '#a1d99b',
    300,
    '#74c476',
    400,
    '#31a354', // dark green
  ];
}

/**
 * Build paint properties based on layer type and configuration
 */
function buildPaintProperties(layer: DataLayer): Record<string, any> {
  const paint: Record<string, any> = {};

  switch (layer.type) {
    case 'fill':
      // Use data-driven color for specific layers
      if (layer.id === 'population-density') {
        paint['fill-color'] = buildPopulationDensityColor();
      } else if (layer.id === 'gdp-layer') {
        paint['fill-color'] = buildGDPColor();
      } else {
        paint['fill-color'] = layer.paint?.fillColor || layer.color;
      }
      paint['fill-opacity'] = layer.paint?.fillOpacity !== undefined
        ? layer.paint.fillOpacity
        : layer.opacity;
      break;

    case 'line':
      paint['line-color'] = layer.paint?.lineColor || layer.color;
      paint['line-opacity'] = layer.paint?.lineOpacity !== undefined
        ? layer.paint.lineOpacity
        : layer.opacity;
      paint['line-width'] = layer.paint?.lineWidth || 2;
      break;

    case 'circle':
      paint['circle-color'] = layer.paint?.circleColor || layer.color;
      paint['circle-opacity'] = layer.paint?.circleOpacity !== undefined
        ? layer.paint.circleOpacity
        : layer.opacity;
      paint['circle-radius'] = layer.paint?.circleRadius || 5;
      break;
  }

  return paint;
}

/**
 * Fetch GeoJSON data from URL
 * @throws Error if fetch fails or data is invalid
 */
async function fetchGeoJSON(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.type || (data.type !== 'FeatureCollection' && data.type !== 'Feature')) {
      throw new Error(`Invalid GeoJSON: missing or invalid type property`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`GeoJSON load error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load a data layer: fetch GeoJSON, add source, and create visualization layer
 * Idempotent: safe to call multiple times for the same layer
 *
 * @param map - MapLibre GL map instance
 * @param layer - Data layer configuration
 * @throws Error if layer creation fails
 */
export async function loadDataLayer(
  map: Map,
  layer: DataLayer
): Promise<void> {
  if (!map) {
    console.error('Map instance is required to load data layer');
    return;
  }

  try {
    // Check if source already exists (idempotent)
    if (map.getSource(layer.id)) {
      console.warn(`Data source '${layer.id}' already exists, skipping load`);
      return;
    }

    // Fetch GeoJSON data
    console.log(`Fetching GeoJSON from ${layer.sourceUrl}`);
    const geoJsonData = await fetchGeoJSON(layer.sourceUrl);

    // Add GeoJSON source
    map.addSource(layer.id, {
      type: 'geojson',
      data: geoJsonData,
    });

    // Build paint properties
    const paint = buildPaintProperties(layer);

    // Create layer configuration
    const layerConfig: any = {
      id: layer.id,
      type: layer.type,
      source: layer.id,
      paint: paint,
    };

    // Apply optional layout properties
    if (layer.type === 'line') {
      layerConfig.layout = {
        'line-join': 'round',
        'line-cap': 'round',
      };
    }

    // Apply filter if provided
    if (layer.filter) {
      layerConfig.filter = layer.filter;
    }

    // Add layer to map
    map.addLayer(layerConfig);

    // Set z-index if provided
    if (layer.zIndex && map.getLayer(layer.id)) {
      // Note: MapLibre GL doesn't have a direct z-index property
      // Layer order is determined by the order they're added
      // So this is noted for future reference but not implemented here
    }

    console.log(`Data layer '${layer.name}' (${layer.id}) loaded successfully`);
  } catch (error) {
    console.error(`Failed to load data layer '${layer.id}':`, error);
    throw error;
  }
}

/**
 * Toggle layer visibility on/off
 * Uses MapLibre GL's layout visibility property
 *
 * @param map - MapLibre GL map instance
 * @param layerId - ID of the layer to toggle
 * @param visible - Whether layer should be visible
 */
export function toggleLayerVisibility(
  map: Map,
  layerId: string,
  visible: boolean
): void {
  if (!map) {
    console.error('Map instance is required to toggle layer visibility');
    return;
  }

  try {
    const layer = map.getLayer(layerId);
    if (!layer) {
      console.warn(`Layer '${layerId}' not found on map`);
      return;
    }

    // Set visibility via layout property
    map.setLayoutProperty(
      layerId,
      'visibility',
      visible ? 'visible' : 'none'
    );

    console.log(`Layer '${layerId}' visibility set to ${visible ? 'visible' : 'hidden'}`);
  } catch (error) {
    console.error(`Failed to toggle visibility for layer '${layerId}':`, error);
  }
}

/**
 * Get current visibility state of a layer
 *
 * @param map - MapLibre GL map instance
 * @param layerId - ID of the layer
 * @returns true if visible, false if hidden
 */
export function getLayerVisibility(
  map: Map,
  layerId: string
): boolean {
  if (!map) {
    console.error('Map instance is required to check layer visibility');
    return false;
  }

  try {
    const visibility = map.getLayoutProperty(layerId, 'visibility') as string | undefined;
    // Default to visible if property not set
    return visibility !== 'none';
  } catch (error) {
    console.error(`Failed to get visibility for layer '${layerId}':`, error);
    return false;
  }
}

/**
 * Remove a data layer and its source from the map
 * Cleans up both the visualization layer and the data source
 *
 * @param map - MapLibre GL map instance
 * @param layerId - ID of the layer to remove
 */
export function removeDataLayer(
  map: Map,
  layerId: string
): void {
  if (!map) {
    console.error('Map instance is required to remove data layer');
    return;
  }

  try {
    // Remove layer if it exists
    const layer = map.getLayer(layerId);
    if (layer) {
      map.removeLayer(layerId);
      console.log(`Layer '${layerId}' removed`);
    }

    // Remove source if it exists
    const source = map.getSource(layerId);
    if (source) {
      map.removeSource(layerId);
      console.log(`Source '${layerId}' removed`);
    }
  } catch (error) {
    console.error(`Failed to remove data layer '${layerId}':`, error);
  }
}

/**
 * Remove all data layers and sources from the map
 * Useful for cleanup or resetting the map state
 *
 * @param map - MapLibre GL map instance
 */
export function removeAllDataLayers(map: Map): void {
  if (!map) {
    console.error('Map instance is required to remove data layers');
    return;
  }

  try {
    const style = map.getStyle();
    if (style && style.layers) {
      // Collect all custom layer IDs (exclude base map layers)
      // Custom layers are those we added, typically with our own source IDs
      const layersToRemove: string[] = [];

      for (const layer of style.layers) {
        // Only remove layers that have a source matching typical data layer patterns
        if ((layer as any).source && typeof (layer as any).source === 'string') {
          // Check if this is one of our data layers
          const source = map.getSource((layer as any).source);
          if (source && (source as any).type === 'geojson') {
            layersToRemove.push(layer.id);
          }
        }
      }

      // Remove collected layers
      for (const layerId of layersToRemove) {
        removeDataLayer(map, layerId);
      }

      console.log(`Removed ${layersToRemove.length} data layers`);
    }
  } catch (error) {
    console.error('Failed to remove all data layers:', error);
  }
}

/**
 * Update layer styling/paint properties
 * Allows changing colors, opacity, etc. without reloading data
 *
 * @param map - MapLibre GL map instance
 * @param layerId - ID of the layer
 * @param paint - Paint properties to apply
 */
export function updateLayerStyle(
  map: Map,
  layerId: string,
  paint: Record<string, any>
): void {
  if (!map) {
    console.error('Map instance is required to update layer style');
    return;
  }

  try {
    const layer = map.getLayer(layerId);
    if (!layer) {
      console.warn(`Layer '${layerId}' not found on map`);
      return;
    }

    // Update each paint property
    for (const [key, value] of Object.entries(paint)) {
      map.setPaintProperty(layerId, key as any, value);
    }

    console.log(`Updated style for layer '${layerId}'`);
  } catch (error) {
    console.error(`Failed to update style for layer '${layerId}':`, error);
  }
}
