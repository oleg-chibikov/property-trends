import L, { ControlPosition, LeafletEvent } from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import React, { useEffect, useRef } from 'react';

interface BoxZoomControlProps {
  leafletMap: L.Map;
  position?: ControlPosition;
}

const BoxZoomControl: React.FC<BoxZoomControlProps> = ({ leafletMap, position }) => {
  const drawControlRef = useRef<L.Control.Draw>();
  useEffect(() => {
    const featureGroup = L.featureGroup().addTo(leafletMap);

    const onDrawCreated = (event: LeafletEvent) => {
      if (drawControlRef.current) {
        const { layer } = event;
        const bounds = layer.getBounds();
        leafletMap.fitBounds(bounds);
      }
    };

    drawControlRef.current = new L.Control.Draw({
      position: position,
      draw: {
        rectangle: {
          shapeOptions: {
            color: 'blue',
          },
        },
        polygon: false,
        circle: false,
        marker: false,
        polyline: false,
        circlemarker: false,
      },
    });

    leafletMap.addLayer(featureGroup);
    leafletMap.addControl(drawControlRef.current);

    leafletMap.on(L.Draw.Event.CREATED, onDrawCreated);

    return () => {
      leafletMap.off(L.Draw.Event.CREATED, onDrawCreated);
      if (drawControlRef.current) {
        leafletMap.removeControl(drawControlRef.current);
      }
    };
  }, [leafletMap, position]);

  return null;
};

export default BoxZoomControl;
