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

    // Create map instance with inline style
    mapRef.current = new Map({
      container: containerId,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: [20, 0],
      zoom: 3,
      pitch: 0,
      bearing: 0,
    });

    // Apply Equal Earth projection on load
    mapRef.current.on('load', async () => {
      console.log('Map loaded');
      if (mapRef.current) {
        await applyProjection(mapRef.current, 'equalEarth');
        // Adjust bounds for Equal Earth
        setTimeout(() => {
          mapRef.current?.fitBounds([[-20, -40], [60, 40]], { padding: 20 });
        }, 500);
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
