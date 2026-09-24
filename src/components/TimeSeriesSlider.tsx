import { useCallback, useState } from 'react';

interface TimeSeriesSliderProps {
  year: number;
  onYearChange: (year: number) => void;
}

const YEARS = Array.from({ length: 16 }, (_, i) => 1950 + i * 5);

export function TimeSeriesSlider({ year, onYearChange }: TimeSeriesSliderProps) {
  const [showMarkers, setShowMarkers] = useState(false);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const index = parseInt(e.target.value);
      onYearChange(YEARS[index]);
    },
    [onYearChange]
  );

  const currentIndex = YEARS.indexOf(year);

  return (
    <div className="absolute bottom-6 left-6 right-6 sm:left-8 sm:right-8 bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-300 z-10 max-w-full backdrop-blur-sm bg-opacity-95">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label htmlFor="year-slider" className="text-sm font-semibold text-gray-700">
            Year:
          </label>
          <span className="text-2xl font-bold text-blue-600 min-w-[60px] text-right">
            {year}
          </span>
        </div>

        <input
          id="year-slider"
          type="range"
          min="0"
          max={YEARS.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          aria-label="Select year"
        />

        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>1950</span>
          <span>2026</span>
        </div>

        <button
          onClick={() => setShowMarkers(!showMarkers)}
          className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-800 rounded-md transition-colors border border-gray-300 flex items-center justify-between"
          type="button"
        >
          <span>Year Markers</span>
          <span className="text-sm">{showMarkers ? '▼' : '▶'}</span>
        </button>

        {showMarkers && (
        <div className="text-xs text-gray-600">
          <div className="grid grid-cols-8 gap-1">
            {YEARS.map((y: number) => (
              <button
                key={y}
                onClick={() => onYearChange(y)}
                className={`px-2 py-1 rounded text-center transition-colors ${
                  year === y
                    ? 'bg-blue-500 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                type="button"
              >
                {y.toString().slice(-2)}
              </button>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
