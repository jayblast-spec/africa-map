import { useState, useCallback, MutableRefObject } from 'react';
import { ProjectionType, applyProjection } from '../lib/projections';

export function useProjection(
  mapRef: MutableRefObject<any | null>
) {
  const [projection, setProjection] = useState<ProjectionType>('mercator');

  const toggleProjection = useCallback(async () => {
    if (!mapRef.current) {
      console.warn('Map instance not available');
      return;
    }

    const newProjection: ProjectionType =
      projection === 'mercator' ? 'equalEarth' : 'mercator';

    try {
      await applyProjection(mapRef.current, newProjection);
      setProjection(newProjection);
    } catch (error) {
      console.error('Failed to toggle projection:', error);
    }
  }, [projection, mapRef]);

  return { projection, toggleProjection };
}
