import { FormGroup } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import withDrawer from '../../hoc/WithDrawer';
import { selectDistrictsByState } from './districtListSlice';
import StateEntry from './StateEntry';
const DistrictList: React.FunctionComponent = () => {
  const districtsByState = useSelector(selectDistrictsByState);

  return (
    <FormGroup>
      {Object.keys(districtsByState).map((state, index) => (
        <StateEntry key={index} state={state} />
      ))}
    </FormGroup>
  );
};

export default React.memo(withDrawer(DistrictList));
