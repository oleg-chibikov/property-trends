import PropTypes from 'prop-types';
import React from 'react';

interface CurrentLocationProps {
  onLocationFound: (coords: Coordinates) => void;
}

const CurrentLocation: React.FunctionComponent<CurrentLocationProps> = ({ onLocationFound }) => (
  <button
    title="Show current location"
    onClick={() => {
      navigator.geolocation.getCurrentPosition((e) => {
        onLocationFound(e.coords);
      });
    }}
  >
    ☉
  </button>
);

CurrentLocation.propTypes = {
  onLocationFound: PropTypes.func.isRequired,
};

export default React.memo(CurrentLocation);
