import { Chip } from '@material-ui/core';
import Map from '@material-ui/icons/Map';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCheckedStates } from './districtListSlice';

const SelectedStates: React.FunctionComponent = () => {
  const states = useSelector(selectCheckedStates);
  return (
    <div className="chipCollection">
      {Object.keys(states).map((state, index) => (
        <Chip key={index} variant="outlined" size="small" color="primary" icon={<Map />} label={state} />
      ))}
    </div>
  );
};

export default React.memo(SelectedStates);
