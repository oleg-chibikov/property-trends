import PropTypes from 'prop-types';
import React from 'react';

interface ShowAllProps {
  onClick: () => void;
}

const ShowAll: React.FunctionComponent<ShowAllProps> = ({ onClick }) => (
  <button title="Show all suburbs" onClick={onClick}>
    ⛶
  </button>
);

ShowAll.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default React.memo(ShowAll);
