import { useRef, MutableRefObject, useEffect, useState } from 'react';
import { MapContainer } from './components/MapContainer';
import { ProjectionToggle } from './components/ProjectionToggle';
import { TimeSeriesSlider } from './components/TimeSeriesSlider';
import { LayerControls, type LayerState } from './components/LayerControls';
import { Legend } from './components/Legend';
import { useProjection } from './hooks/useProjection';
import { useTerrainLayer } from './hooks/useTerrainLayer';
import { useDataLayers } from './hooks/useDataLayers';
import type { DataLayer } from './types/data';

export function App() {
  const mapRef = useRef<any | null>(null);
  const { projection, toggleProjection } = useProjection(mapRef);
  useTerrainLayer(mapRef);
  const { loadLayer, toggleLayer, visibility } = useDataLayers(mapRef);

  const [layersLoaded, setLayersLoaded] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState<LayerState>({
    population: visibility['population-density'] ?? false,
    gdp: visibility['gdp-layer'] ?? false,
    infrastructure: visibility['ports'] ?? false,
  });
  const [year, setYear] = useState(2020);

  // Define data layers with color scales
  const dataLayers: DataLayer[] = [
    {
      id: 'population-density',
      name: 'Population Density (2026)',
      type: 'fill',
      sourceUrl: '/data/population-density.json',
      color: '#ff0000',
      opacity: 0.6,
      paint: {
        fillOpacity: 0.6,
      },
    },
    {
      id: 'gdp-layer',
      name: 'GDP by Country',
      type: 'fill',
      sourceUrl: '/data/gdp-by-country.json',
      color: '#00aa00',
      opacity: 0.5,
      paint: {
        fillOpacity: 0.5,
      },
    },
    {
      id: 'ports',
      name: 'Ports',
      type: 'circle',
      sourceUrl: '/data/infrastructure-2026.geojson',
      color: '#0066cc',
      opacity: 0.8,
      filter: ['==', ['get', 'type'], 'port'],
      paint: {
        circleRadius: 8,
        circleOpacity: 0.8,
      },
    },
    {
      id: 'airports',
      name: 'Airports',
      type: 'circle',
      sourceUrl: '/data/infrastructure-2026.geojson',
      color: '#ff6600',
      opacity: 0.8,
      filter: ['==', ['get', 'type'], 'airport'],
      paint: {
        circleRadius: 6,
        circleOpacity: 0.8,
      },
    },
    {
      id: 'roads',
      name: 'Major Roads',
      type: 'line',
      sourceUrl: '/data/infrastructure-2026.geojson',
      color: '#333333',
      opacity: 0.7,
      filter: ['==', ['get', 'type'], 'road'],
      paint: {
        lineWidth: 2,
        lineOpacity: 0.7,
      },
    },
  ];

  // Load all data layers on mount
  useEffect(() => {
    const loadAllLayers = async () => {
      if (mapRef.current && !layersLoaded) {
        try {
          for (const layer of dataLayers) {
            await loadLayer(layer);
          }
          // Set infrastructure layers to hidden by default
          if (visibility['ports'] !== false) {
            toggleLayer('ports');
          }
          if (visibility['airports'] !== false) {
            toggleLayer('airports');
          }
          if (visibility['roads'] !== false) {
            toggleLayer('roads');
          }
          setLayersLoaded(true);
        } catch (error) {
          console.error('Failed to load data layers:', error);
        }
      }
    };

    loadAllLayers();
  }, [mapRef, loadLayer, toggleLayer, layersLoaded, visibility]);

  const handleMapReady = (ref: MutableRefObject<any | null>) => {
    mapRef.current = ref.current;
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    // TODO: Fetch and update data for the new year
  };

  const handleLayerChange = (layer: keyof LayerState, visible: boolean) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layer]: visible,
    }));

    // Toggle the corresponding layer on the map
    if (layer === 'population') {
      toggleLayer('population-density');
    } else if (layer === 'gdp') {
      toggleLayer('gdp-layer');
    } else if (layer === 'infrastructure') {
      toggleLayer('ports');
      toggleLayer('airports');
      toggleLayer('roads');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          UN Equal Earth Map of Africa
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Discover Africa&apos;s true geographical size and proportions
        </p>
      </header>
      <main className="flex-1 w-full flex overflow-hidden">
        {/* Sidebar Drawer */}
        <div className={`transition-all duration-300 ${showDrawer ? 'w-80 sm:w-96' : 'w-0'} bg-white border-r border-gray-200 overflow-y-auto shadow-lg`}>
          {showDrawer && (
            <div className="p-6 space-y-6">
              <Legend />
              <div className="border-t border-gray-200 pt-6">
                <LayerControls layerVisibility={layerVisibility} onLayerChange={handleLayerChange} />
              </div>
              <div className="border-t border-gray-200 pt-6">
                <TimeSeriesSlider year={year} onYearChange={handleYearChange} />
              </div>
            </div>
          )}
        </div>

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden">
          <MapContainer onMapReady={handleMapReady} />

          {/* Toggle Drawer Button */}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="absolute top-6 left-4 z-20 bg-white rounded-lg shadow-lg p-3 hover:shadow-xl hover:bg-gray-50 transition-all border border-gray-200"
            type="button"
            aria-label="Toggle sidebar"
          >
            {showDrawer ? '✕' : '☰'} Info
          </button>

          {/* Projection Toggle (top-right) */}
          <div className="absolute top-6 right-6 z-10">
            <ProjectionToggle projection={projection} onToggle={toggleProjection} />
          </div>
        </div>
      </main>
    </div>
  );
}
