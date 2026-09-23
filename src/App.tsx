import { useRef, MutableRefObject } from 'react';
import { MapContainer } from './components/MapContainer';
import { ProjectionToggle } from './components/ProjectionToggle';
import { useProjection } from './hooks/useProjection';

export function App() {
  const mapRef = useRef<any | null>(null);
  const { projection, toggleProjection } = useProjection(mapRef);

  const handleMapReady = (ref: MutableRefObject<any | null>) => {
    mapRef.current = ref.current;
  };

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
      <main className="flex-1 w-full relative">
        <MapContainer onMapReady={handleMapReady} />
        <ProjectionToggle projection={projection} onToggle={toggleProjection} />
      </main>
    </div>
  );
}
