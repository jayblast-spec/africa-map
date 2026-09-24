/**
 * Hook for managing data layer lifecycle
 * Handles loading, visibility toggling, and cleanup of GeoJSON layers
 */

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
  useMemo,
} from 'react';
import { Map } from 'maplibre-gl';
import {
  loadDataLayer,
  removeDataLayer,
  toggleLayerVisibility,
  getLayerVisibility,
} from '../lib/dataLoader';
import { DataLayer, LayerVisibility, LoadedLayerMetadata } from '../types/data';

/**
 * Hook return value with layer management methods
 */
export interface UseDataLayersReturn {
  /** Array of currently loaded layers */
  layers: LoadedLayerMetadata[];

  /** Toggle visibility of a specific layer */
  toggleLayer: (layerId: string) => void;

  /** Get visibility state of a layer */
  getLayerVisibility: (layerId: string) => boolean;

  /** Load a new layer onto the map */
  loadLayer: (layer: DataLayer) => Promise<void>;

  /** Remove a layer from the map */
  removeLayer: (layerId: string) => void;

  /** Current visibility state of all layers */
  visibility: LayerVisibility;

  /** Loading state for async operations */
  isLoading: boolean;

  /** Error state if any layer failed to load */
  error: string | null;
}

/**
 * Hook for managing GeoJSON data layers on a MapLibre GL map
 *
 * Features:
 * - Load multiple GeoJSON data layers
 * - Toggle layer visibility
 * - Track loading and error states
 * - Automatic cleanup on unmount
 * - Memoized callbacks for performance
 *
 * @param mapRef - Reference to MapLibre GL map instance
 * @returns Object with layer management methods and state
 */
export function useDataLayers(
  mapRef: MutableRefObject<Map | null>
): UseDataLayersReturn {
  const [layers, setLayers] = useState<LoadedLayerMetadata[]>([]);
  const [visibility, setVisibility] = useState<LayerVisibility>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track which layers have been loaded to prevent duplicates
  const loadedLayerIdsRef = useRef<Set<string>>(new Set());

  /**
   * Toggle visibility of a layer
   * Updates both MapLibre GL and local state
   */
  const toggleLayer = useCallback(
    (layerId: string): void => {
      const map = mapRef.current;
      if (!map) {
        console.warn('Map not initialized');
        return;
      }

      try {
        const currentVisibility = getLayerVisibility(map, layerId);
        const newVisibility = !currentVisibility;

        // Update map visibility
        toggleLayerVisibility(map, layerId, newVisibility);

        // Update local state
        setVisibility((prev) => ({
          ...prev,
          [layerId]: newVisibility,
        }));

        console.log(`Toggled layer '${layerId}' to ${newVisibility}`);
      } catch (err) {
        const errorMsg = `Failed to toggle layer '${layerId}'`;
        console.error(errorMsg, err);
        setError(errorMsg);
      }
    },
    [mapRef]
  );

  /**
   * Get visibility state of a layer from local state
   */
  const getVisibility = useCallback(
    (layerId: string): boolean => {
      return visibility[layerId] ?? true; // Default to visible if not tracked
    },
    [visibility]
  );

  /**
   * Load a new data layer onto the map
   * Handles GeoJSON fetching, source creation, and layer rendering
   */
  const loadLayer = useCallback(
    async (layer: DataLayer): Promise<void> => {
      const map = mapRef.current;
      if (!map) {
        const errorMsg = 'Map not initialized';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      // Prevent duplicate loads
      if (loadedLayerIdsRef.current.has(layer.id)) {
        console.warn(`Layer '${layer.id}' already loaded`);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Load the layer through the data loader
        await loadDataLayer(map, layer);

        // Track as loaded
        loadedLayerIdsRef.current.add(layer.id);

        // Update layer metadata
        const metadata: LoadedLayerMetadata = {
          id: layer.id,
          name: layer.name,
          sourceId: layer.id,
          layerId: layer.id,
          visible: true,
          loadedAt: Date.now(),
        };

        setLayers((prev) => [...prev, metadata]);

        // Track visibility (default to visible)
        setVisibility((prev) => ({
          ...prev,
          [layer.id]: true,
        }));

        console.log(`Layer '${layer.name}' loaded successfully`);
      } catch (err) {
        const errorMsg = `Failed to load layer '${layer.id}': ${
          err instanceof Error ? err.message : String(err)
        }`;
        console.error(errorMsg);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [mapRef]
  );

  /**
   * Remove a layer from the map
   */
  const removeLayer = useCallback(
    (layerId: string): void => {
      const map = mapRef.current;
      if (!map) {
        console.warn('Map not initialized');
        return;
      }

      try {
        removeDataLayer(map, layerId);

        // Update state
        loadedLayerIdsRef.current.delete(layerId);
        setLayers((prev) => prev.filter((l) => l.id !== layerId));
        setVisibility((prev) => {
          const next = { ...prev };
          delete next[layerId];
          return next;
        });

        console.log(`Layer '${layerId}' removed`);
      } catch (err) {
        const errorMsg = `Failed to remove layer '${layerId}'`;
        console.error(errorMsg, err);
        setError(errorMsg);
      }
    },
    [mapRef]
  );

  /**
   * Cleanup on unmount: remove all loaded layers
   */
  useEffect(() => {
    return () => {
      const map = mapRef.current;
      if (map) {
        // Remove all loaded layers
        for (const layerId of loadedLayerIdsRef.current) {
          try {
            removeDataLayer(map, layerId);
          } catch (err) {
            console.error(`Cleanup: Failed to remove layer '${layerId}'`, err);
          }
        }
        loadedLayerIdsRef.current.clear();
      }
    };
  }, [mapRef]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      layers,
      toggleLayer,
      getLayerVisibility: getVisibility,
      loadLayer,
      removeLayer,
      visibility,
      isLoading,
      error,
    }),
    [layers, toggleLayer, getVisibility, loadLayer, removeLayer, visibility, isLoading, error]
  );
}
