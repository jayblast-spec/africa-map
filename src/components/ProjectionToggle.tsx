import { ProjectionType } from '../lib/projections';

interface ProjectionToggleProps {
  projection: ProjectionType;
  onToggle: () => void;
}

export function ProjectionToggle({
  projection,
  onToggle,
}: ProjectionToggleProps) {
  const isEqualEarth = projection === 'equalEarth';
  const buttonText = isEqualEarth
    ? '🗺️ Switch to Mercator'
    : '🗺️ Switch to Equal Earth';

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle map projection"
      className="absolute top-4 right-4 z-10 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm font-medium text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center whitespace-nowrap"
      type="button"
    >
      {buttonText}
    </button>
  );
}
