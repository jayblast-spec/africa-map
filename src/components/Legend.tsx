import { useState } from 'react';

interface LegendItem {
  label: string;
  color: string;
  range?: string;
}

const POPULATION_LEGEND: LegendItem[] = [
  { label: '< 1M', color: '#fee5d9', range: '0 - 1,000,000' },
  { label: '1M - 5M', color: '#fcae91', range: '1,000,000 - 5,000,000' },
  { label: '5M - 20M', color: '#fb6a4a', range: '5,000,000 - 20,000,000' },
  { label: '20M - 50M', color: '#de2d26', range: '20,000,000 - 50,000,000' },
  { label: '> 50M', color: '#a50f15', range: '50,000,000+' },
];

const GDP_LEGEND: LegendItem[] = [
  { label: 'Low', color: '#e0f2f1', range: '< $50B' },
  { label: 'Lower-Middle', color: '#80deea', range: '$50B - $200B' },
  { label: 'Upper-Middle', color: '#4dd0e1', range: '$200B - $500B' },
  { label: 'High', color: '#00bcd4', range: '$500B+' },
];

const INFRASTRUCTURE_LEGEND: LegendItem[] = [
  { label: 'Limited', color: '#fff9c4', range: '< 5,000 km' },
  { label: 'Moderate', color: '#fff176', range: '5,000 - 15,000 km' },
  { label: 'Developed', color: '#ffee58', range: '15,000 - 30,000 km' },
  { label: 'Extensive', color: '#ffca28', range: '30,000+ km' },
];

const COUNTRY_AREAS = [
  { name: 'Nigeria', area: '923,768 km²', trueSize: '🟦' },
  { name: 'Democratic Republic of Congo', area: '2,344,858 km²', trueSize: '🟩' },
  { name: 'South Africa', area: '1,221,037 km²', trueSize: '🟨' },
  { name: 'Egypt', area: '1,002,000 km²', trueSize: '🟧' },
  { name: 'Ethiopia', area: '1,104,300 km²', trueSize: '🟪' },
];

export function Legend() {
  const [expandedSection, setExpandedSection] = useState<string | null>('about');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="absolute top-20 left-4 sm:top-24 sm:left-6 bg-white rounded-lg shadow-md border border-gray-200 z-10 max-w-sm max-h-[80vh] overflow-y-auto">
      {/* About Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('about')}
          className="w-full px-4 py-3 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          type="button"
        >
          <span className="font-semibold text-gray-900 text-sm sm:text-base">About</span>
          <span className="text-gray-500">{expandedSection === 'about' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'about' && (
          <div className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-gray-700 border-t border-gray-100 space-y-2">
            <p>
              The <strong>UN Equal Earth projection</strong> shows all countries with accurate
              area proportions.
            </p>
            <p>
              Mercator projection distorts Africa and the Global South. Equal Earth corrects this.
            </p>
          </div>
        )}
      </div>

      {/* Population Scale */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('population')}
          className="w-full px-4 py-3 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          type="button"
        >
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Population</span>
          <span className="text-gray-500">{expandedSection === 'population' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'population' && (
          <div className="px-4 py-3 sm:px-6 space-y-2 border-t border-gray-100">
            {POPULATION_LEGEND.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: item.color }}
                  aria-label={`${item.label}: ${item.range}`}
                />
                <div className="text-xs">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-gray-600">{item.range}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GDP Scale */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('gdp')}
          className="w-full px-4 py-3 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          type="button"
        >
          <span className="font-semibold text-gray-900 text-sm sm:text-base">GDP</span>
          <span className="text-gray-500">{expandedSection === 'gdp' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'gdp' && (
          <div className="px-4 py-3 sm:px-6 space-y-2 border-t border-gray-100">
            {GDP_LEGEND.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: item.color }}
                  aria-label={`${item.label}: ${item.range}`}
                />
                <div className="text-xs">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-gray-600">{item.range}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Infrastructure Scale */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('infrastructure')}
          className="w-full px-4 py-3 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          type="button"
        >
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Infrastructure</span>
          <span className="text-gray-500">{expandedSection === 'infrastructure' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'infrastructure' && (
          <div className="px-4 py-3 sm:px-6 space-y-2 border-t border-gray-100">
            {INFRASTRUCTURE_LEGEND.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: item.color }}
                  aria-label={`${item.label}: ${item.range}`}
                />
                <div className="text-xs">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-gray-600">{item.range}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Country Areas */}
      <div>
        <button
          onClick={() => toggleSection('areas')}
          className="w-full px-4 py-3 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          type="button"
        >
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Country Sizes</span>
          <span className="text-gray-500">{expandedSection === 'areas' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'areas' && (
          <div className="px-4 py-3 sm:px-6 space-y-2 border-t border-gray-100">
            {COUNTRY_AREAS.map((country, idx) => (
              <div key={idx} className="text-xs">
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <span>{country.name}</span>
                </div>
                <div className="text-gray-600">{country.area}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
