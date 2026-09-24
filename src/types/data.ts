/**
 * Data layer type definitions
 * Defines structures for GeoJSON layers, sources, and layer management
 */

/**
 * Paint properties for layer styling
 * Supports fill, line, and circle layers
 */
export interface LayerPaint {
  fillColor?: string;
  fillOpacity?: number;
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
  circleRadius?: number;
  circleColor?: string;
  circleOpacity?: number;
}

/**
 * Data layer configuration
 * Defines a loadable GeoJSON data source and its visualization
 */
export interface DataLayer {
  /**
   * Unique identifier for this layer
   * Used as the layer ID in MapLibre GL
   */
  id: string;

  /**
   * Human-readable name for the layer
   * Displayed in UI controls
   */
  name: string;

  /**
   * Layer type determines rendering style
   * 'fill' = solid polygons, 'line' = boundaries, 'circle' = point markers
   */
  type: 'fill' | 'line' | 'circle';

  /**
   * URL to fetch GeoJSON data from
   * Can be a relative path (e.g., '/data/layer.geojson') or absolute URL
   */
  sourceUrl: string;

  /**
   * Primary color for the layer in hex format
   * Used for fill, line, or circle color depending on type
   */
  color: string;

  /**
   * Opacity level (0-1)
   * 0 = fully transparent, 1 = fully opaque
   */
  opacity: number;

  /**
   * Optional additional paint properties
   * Overrides defaults if specified
   */
  paint?: LayerPaint;

  /**
   * Optional source filter for feature-level filtering
   * MapLibre GL filter expression
   */
  filter?: any[];

  /**
   * Z-index for layer ordering
   * Higher values render on top
   */
  zIndex?: number;

  /**
   * Whether to show layer labels if available
   */
  showLabels?: boolean;
}

/**
 * Layer visibility state
 * Tracks which layers are currently visible
 */
export interface LayerVisibility {
  [layerId: string]: boolean;
}

/**
 * Layer metadata for tracking loaded state
 */
export interface LoadedLayerMetadata {
  id: string;
  name: string;
  sourceId: string;
  layerId: string;
  visible: boolean;
  loadedAt: number;
}

/**
 * Error state for layer loading
 */
export interface DataLayerError {
  layerId: string;
  message: string;
  error: Error;
  timestamp: number;
}
