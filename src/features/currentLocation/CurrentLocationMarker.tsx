import React, { useEffect, useRef, useState } from 'react';
import { CircleMarker } from 'react-leaflet';

let circle: CircleMarker | null;

const CurrentLocationMarker: React.FunctionComponent = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>();
  const circleRef = useRef<CircleMarker>(null);
  circle = circleRef.current;
  useEffect(() => {
    const setLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
          circle?.leafletElement.bringToFront();
        },
        (error) => {
          console.log(error.message);
        },
        {
          timeout: 5000,
        }
      );
    };
    setLocation();
    // TODO pause it while zooming
    window.setInterval(setLocation, 1000);
  }, []);
  if (!currentLocation) {
    return null;
  }
  return <CircleMarker ref={circleRef} center={currentLocation} fillColor="blue" radius={5} />;
};

export default React.memo(CurrentLocationMarker);
