/**
 * Terrain loader for global elevation data
 * Provides functions to load and remove 3D terrain visualization
 */

import { Map } from 'maplibre-gl';

/**
 * Elevation tile source using AWS elevation tiles
 * Provides global elevation data in GeoTIFF format
 * https://aws.amazon.com/public-datasets/elevation/
 */
const ELEVATION_TILES_URL = 'https://elevation-tiles-prod.s3.amazonaws.com/geotiff/{z}/{x}/{y}.tif';

/**
 * Load terrain layer with DEM (Digital Elevation Model) source
 * Uses AWS elevation tiles for global coverage
 */
export function loadTerrainLayer(map: Map): void {
  if (!map) {
    console.error('Map instance is required to load terrain layer');
    return;
  }

  try {
    // Check if DEM source already exists
    if (!map.getSource('dem')) {
      // Add raster-dem source using AWS elevation tiles
      // These tiles provide elevation data globally with good resolution
      map.addSource('dem', {
        type: 'raster-dem',
        tiles: [ELEVATION_TILES_URL],
        tileSize: 512,
        minzoom: 0,
        maxzoom: 13,
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
