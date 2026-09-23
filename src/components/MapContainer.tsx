import { MutableRefObject } from 'react';
import type { Map } from 'maplibre-gl';

interface MapContainerProps {
  mapRef?: MutableRefObject<Map | null>;
}

export function MapContainer(_props: MapContainerProps) {
  return (
    <div
      id="map-container"
      className="w-full h-full bg-blue-100"
      style={{ minHeight: '100vh' }}
    />
  );
}
