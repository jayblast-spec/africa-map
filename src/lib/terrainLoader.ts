/**
 * Terrain loader for NOAA ETOPO1 elevation data
 * Provides functions to load and remove 3D terrain visualization
 */

import { Map } from 'maplibre-gl';

/**
 * Load terrain layer with DEM (Digital Elevation Model) source
 * Uses NOAA ETOPO1 elevation data via maplibre demo tiles
 */
export function loadTerrainLayer(map: Map): void {
  if (!map) {
    console.error('Map instance is required to load terrain layer');
    return;
  }

  try {
    // Check if DEM source already exists
    if (!map.getSource('dem')) {
      // Add raster-dem source using NOAA ETOPO1 elevation tiles
      map.addSource('dem', {
        type: 'raster-dem',
        url: 'https://demotiles.maplibre.org/data/raster-dem.json',
        tileSize: 256,
      });
    }

    // Set terrain with exaggeration factor
    // Exaggeration of 1.5 balances visibility with accuracy
    map.setTerrain({
      source: 'dem',
      exaggeration: 1.5,
    });

    console.log('Terrain layer loaded');
  } catch (error) {
    console.error('Failed to load terrain layer:', error);
  }
}

/**
 * Remove terrain layer and associated DEM source
 * Cleans up terrain visualization
 */
export function removeTerrainLayer(map: Map): void {
  if (!map) {
    console.error('Map instance is required to remove terrain layer');
    return;
  }

  try {
    // Remove terrain if it exists
    if (map.getTerrain()) {
      map.setTerrain(null);
    }

    // Remove DEM source if it exists
    if (map.getSource('dem')) {
      map.removeSource('dem');
    }

    console.log('Terrain layer removed');
  } catch (error) {
    console.error('Failed to remove terrain layer:', error);
  }
}
