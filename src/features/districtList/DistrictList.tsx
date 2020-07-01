import { DistrictsByState, checkState, selectDistrictList, uncheckState } from './districtListSlice';
import { FormControlLabel } from '@material-ui/core';
import { Panel, PanelGroup } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import DistrictSelector from './DistrictSelector';
import React, { Dispatch } from 'react';
import styles from './DistrictList.module.css';

let dispatch: Dispatch<unknown>;
let checkedDistricts: { [fileName: string]: undefined };
let districtsByState: DistrictsByState;

const renderDistrict = (district: string) => <DistrictSelector key={district} checked={district in checkedDistricts} name={district} />;

const renderHeader = (state: string) => {
  const districtsForState = districtsByState[state];
  let checked = false;
  for (const district of districtsForState) {
    if (district in checkedDistricts) {
      checked = true;
      break;
    }
  }
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) {
              dispatch(checkState(state));
            } else {
              dispatch(uncheckState(state));
            }
          }}
        />
      }
      label={state}
    />
  );
};

const renderState = (state: string, key: number) => {
  const districtsForState = districtsByState[state];
  return (
    <Panel key={key} eventKey={key} header={renderHeader(state)}>
      {districtsForState.map(renderDistrict)}
    </Panel>
  );
};

const DistrictList: React.FunctionComponent = () => {
  dispatch = useDispatch();
  const districtListState = useSelector(selectDistrictList);
  checkedDistricts = districtListState.checkedDistricts;
  districtsByState = districtListState.districtsByState;
  return (
    <PanelGroup accordion bordered className={styles.districtList} defaultActiveKey={1}>
      {Object.keys(districtsByState).map(renderState)}
    </PanelGroup>
  );
};

export default React.memo(DistrictList);
