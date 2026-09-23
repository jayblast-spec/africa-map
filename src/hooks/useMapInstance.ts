import { useEffect, useRef, MutableRefObject } from 'react';
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ProjectionType, applyProjection } from '../lib/projections';

export function useMapInstance(
  containerId: string,
  initialProjection: ProjectionType = 'mercator'
): MutableRefObject<any | null> {
  const mapRef = useRef<any | null>(null);

  useEffect(() => {
    // Only initialize if container exists
    const container = document.getElementById(containerId);
    if (!container || mapRef.current) return;

    // Create map instance
    mapRef.current = new Map({
      container: containerId,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [20, 0], // Africa center: longitude 20, latitude 0
      zoom: 3,
      pitch: 0,
      bearing: 0,
    });

    // Log when map loads
    mapRef.current.on('load', async () => {
      console.log('Map loaded');
      // Apply initial projection
      if (mapRef.current && initialProjection !== 'mercator') {
        await applyProjection(mapRef.current, initialProjection);
      }
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [containerId, initialProjection]);

  return mapRef;
}
