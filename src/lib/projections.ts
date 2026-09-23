export type ProjectionType = 'mercator' | 'equalEarth';

export async function applyProjection(
  map: any,
  projection: ProjectionType
): Promise<void> {
  if (!map) return;

  try {
    if (projection === 'equalEarth') {
      // Apply Equal Earth projection
      if (typeof map.setProjection === 'function') {
        map.setProjection('equalEarth');
        console.log('Switched to Equal Earth projection');
      } else {
        // Fallback: apply via style
        const style = map.getStyle();
        if (style) {
          style.projection = { name: 'equalEarth' };
          map.setStyle(style);
          console.log('Applied Equal Earth via style');
        }
      }
    } else {
      // Apply Mercator projection (default)
      if (typeof map.setProjection === 'function') {
        map.setProjection('mercator');
        console.log('Switched to Mercator projection');
      } else {
        // Fallback: apply via style
        const style = map.getStyle();
        if (style) {
          style.projection = { name: 'mercator' };
          map.setStyle(style);
          console.log('Applied Mercator via style');
        }
      }
    }
  } catch (error) {
    console.error(`Failed to apply ${projection} projection:`, error);
  }
}
