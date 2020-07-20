import React, { useEffect, useRef, useState } from 'react';
import { CircleMarker } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { selectIsPaused } from './currentLocationSlice';

let circle: CircleMarker | null;
let isPaused: boolean;
let set: (location: [number, number]) => void;
const setLocation = () => {
  if (isPaused) {
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      set([position.coords.latitude, position.coords.longitude]);
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

const CurrentLocationMarker: React.FunctionComponent = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>();
  set = setCurrentLocation;
  const circleRef = useRef<CircleMarker>(null);
  isPaused = useSelector(selectIsPaused);
  circle = circleRef.current;
  useEffect(() => {
    setLocation();
    window.setInterval(setLocation, 1000);
  }, []);
  if (!currentLocation) {
    return null;
  }
  return <CircleMarker ref={circleRef} center={currentLocation} fillColor="blue" radius={3} />;
};

export default React.memo(CurrentLocationMarker);
