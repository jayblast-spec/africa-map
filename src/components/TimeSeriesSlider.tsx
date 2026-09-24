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
    <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-200 z-10 max-w-2xl mx-auto backdrop-blur-md bg-opacity-98">
      <div className="flex flex-col gap-6">
        {/* Year Display */}
        <div className="flex items-end justify-between">
          <label htmlFor="year-slider" className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Time Period
          </label>
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            {year}
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-3">
          <input
            id="year-slider"
            type="range"
            min="0"
            max={YEARS.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer accent-blue-600"
            aria-label="Select year"
          />
          <div className="flex justify-between text-xs font-semibold text-gray-500 px-1">
            <span>1950</span>
            <span>2026</span>
          </div>
        </div>

        {/* Year Markers Toggle */}
        <button
          onClick={() => setShowMarkers(!showMarkers)}
          className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-sm font-semibold text-blue-900 rounded-lg transition-all duration-200 border border-blue-200 flex items-center justify-between hover:shadow-md active:scale-98"
          type="button"
        >
          <span>Year Markers (5-year intervals)</span>
          <span className="text-lg">{showMarkers ? '▼' : '▶'}</span>
        </button>

        {showMarkers && (
        <div className="pt-2 border-t border-gray-200">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {YEARS.map((y: number) => (
              <button
                key={y}
                onClick={() => onYearChange(y)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  year === y
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-sm'
                }`}
                type="button"
                title={y.toString()}
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
