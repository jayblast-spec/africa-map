import { useRef } from 'react';
import type { Map } from 'maplibre-gl';
import { MapContainer } from './components/MapContainer';
import { useMapInstance } from './hooks/useMapInstance';

export function App() {
  const mapRef = useRef<Map | null>(null);

  // Initialize map hook
  const localMapRef = useMapInstance('map-container');

  // Sync the local map ref to the prop ref
  mapRef.current = localMapRef.current;

  return (
    <div className="w-full h-full flex flex-col">
      <header className="bg-white shadow-sm p-4 sm:p-6 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          UN Equal Earth Map of Africa
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mt-1">
          Discover Africa&apos;s true size
        </p>
      </header>
      <main className="flex-1 w-full">
        <MapContainer mapRef={mapRef} />
      </main>
    </div>
  );
}
