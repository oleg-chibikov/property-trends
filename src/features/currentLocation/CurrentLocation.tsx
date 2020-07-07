import PropTypes from 'prop-types';
import React from 'react';

interface CurrentLocationProps {
  onLocationFound: (coords: Coordinates) => void;
}

const CurrentLocation: React.FunctionComponent<CurrentLocationProps> = ({ onLocationFound }) => (
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
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    }}
  >
    ☉
  </button>
);

CurrentLocation.propTypes = {
  onLocationFound: PropTypes.func.isRequired,
};

export default React.memo(CurrentLocation);
