import { useMapInstance } from '../hooks/useMapInstance';
import { useEffect, MutableRefObject } from 'react';

interface MapContainerProps {
  onMapReady?: (mapRef: MutableRefObject<any | null>) => void;
}

export function MapContainer({ onMapReady }: MapContainerProps) {
  const mapRef = useMapInstance('map-container');

  useEffect(() => {
    // Notify parent when map is ready
    if (mapRef.current && onMapReady) {
      onMapReady(mapRef);
    }
  }, [mapRef, onMapReady]);

  return (
    <div
      id="map-container"
      className="w-full h-full bg-blue-100"
      style={{ minHeight: '100vh' }}
    />
  );
}
