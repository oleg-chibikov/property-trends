import React from 'react';

interface ShowAllProps {
  onClick: () => void;
}

const ShowAll: React.FunctionComponent<ShowAllProps> = ({ onClick }) => (
  <button title="Show all suburbs" onClick={onClick}>
    ⛶
  </button>
);

export default React.memo(ShowAll);
