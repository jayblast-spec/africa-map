/**
 * Hook to manage terrain layer lifecycle
 * Loads terrain when map is ready and cleans up on unmount
 */

import { useEffect, MutableRefObject, useRef } from 'react';
import { Map } from 'maplibre-gl';
import { loadTerrainLayer, removeTerrainLayer } from '../lib/terrainLoader';

export function useTerrainLayer(mapRef: MutableRefObject<Map | null>): void {
  const terrainLoadedRef = useRef(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Load terrain when map is ready
    const handleMapLoad = () => {
      if (!terrainLoadedRef.current) {
        console.log('Loading terrain layer...');
        loadTerrainLayer(map);
        terrainLoadedRef.current = true;
      }
    };

    // Check if map is already loaded
    if (map.isStyleLoaded()) {
      handleMapLoad();
    } else {
      // Wait for map to load before adding terrain
      map.on('load', handleMapLoad);
    }

    // Cleanup on unmount
    return () => {
      if (map) {
        map.off('load', handleMapLoad);
        if (terrainLoadedRef.current) {
          removeTerrainLayer(map);
          terrainLoadedRef.current = false;
        }
      }
    };
  }, [mapRef]);
}
