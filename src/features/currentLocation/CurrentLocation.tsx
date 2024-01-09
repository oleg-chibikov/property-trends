import PropTypes from 'prop-types';
import React from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface CurrentLocationProps {
  onLocationFound: (coords: Coordinates) => void;
}

const CurrentLocation: React.FunctionComponent<CurrentLocationProps> = ({ onLocationFound }) => {
  return (
    <button
      title="Show current location"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            onLocationFound(position.coords);
          },
          (error) => {
            alert(error.message);
          },
          {
            timeout: 5000,
          }
        );
      }}
    >
      ☉
    </button>
  );
};

CurrentLocation.propTypes = {
  onLocationFound: PropTypes.func.isRequired,
};

export type { Coordinates };
export default React.memo(CurrentLocation);
