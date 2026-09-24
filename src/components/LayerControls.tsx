import { useCallback, useState } from 'react';

export interface LayerState {
  population: boolean;
  gdp: boolean;
  infrastructure: boolean;
}

interface LayerControlsProps {
  layerVisibility: LayerState;
  onLayerChange: (layer: keyof LayerState, visible: boolean) => void;
}

const LAYER_LABELS: Record<keyof LayerState, { label: string; description: string }> = {
  population: {
    label: 'Population',
    description: 'Population density by country',
  },
  gdp: {
    label: 'GDP',
    description: 'Gross Domestic Product indicators',
  },
  infrastructure: {
    label: 'Infrastructure',
    description: 'Roads, ports, and facilities',
  },
};

export function LayerControls({ layerVisibility, onLayerChange }: LayerControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLayerToggle = useCallback(
    (layer: keyof LayerState) => {
      onLayerChange(layer, !layerVisibility[layer]);
    },
    [layerVisibility, onLayerChange]
  );

  return (
    <div className="absolute top-20 right-4 sm:top-24 sm:right-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200 z-10 max-w-sm backdrop-blur-md bg-opacity-98">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        type="button"
        aria-label="Toggle layer controls"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">Layers</span>
        <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 p-3 sm:p-4 space-y-3">
          {(Object.keys(LAYER_LABELS) as Array<keyof LayerState>).map((layer) => (
            <label
              key={layer}
              className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={layerVisibility[layer]}
                onChange={() => handleLayerToggle(layer)}
                className="mt-1 w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label={`Toggle ${LAYER_LABELS[layer].label} layer`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">
                  {LAYER_LABELS[layer].label}
                </div>
                <div className="text-xs text-gray-600 line-clamp-2">
                  {LAYER_LABELS[layer].description}
                </div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
