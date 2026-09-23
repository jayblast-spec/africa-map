import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
export function useMapInstance(containerId) {
    const mapRef = useRef(null);
    useEffect(() => {
        // Only initialize if container exists
        const container = document.getElementById(containerId);
        if (!container || mapRef.current)
            return;
        // Create map instance
        mapRef.current = new maplibregl.Map({
            container: containerId,
            style: 'https://demotiles.maplibre.org/style.json',
            center: [20, 0], // Africa center: longitude 20, latitude 0
            zoom: 3,
            pitch: 0,
            bearing: 0,
        });
        // Log when map loads
        mapRef.current.on('load', () => {
            console.log('Map loaded');
        });
        // Cleanup function
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [containerId]);
    return mapRef;
}
