import MapIcon from '@mui/icons-material/Map';
import { Chip } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCheckedStates } from './districtListSlice';

const SelectedStates: React.FunctionComponent = () => {
  const states = useSelector(selectCheckedStates);
  return (
    <div className="chipCollection">
      {Object.keys(states).map((state, index) => (
        <Chip key={index} variant="outlined" size="small" color="primary" icon={<MapIcon />} label={state} />
      ))}
    </div>
  );
};

export default React.memo(SelectedStates);
