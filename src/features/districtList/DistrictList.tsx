import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, FormGroup } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DistrictList.module.css';
import { checkState, DistrictsByState, selectDistrictList, uncheckState } from './districtListSlice';
import DistrictSelector from './DistrictSelector';

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

const DistrictList: React.FunctionComponent = () => {
  dispatch = useDispatch();
  const handleChange = (panel: string) => (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderState = (state: string) => {
    const districtsForState = districtsByState[state];
    return (
      <Accordion key={state} expanded={expanded === state} onChange={handleChange(state)} TransitionProps={{ unmountOnExit: true }} className={styles.districtList}>
        <AccordionSummary>{renderHeader(state)}</AccordionSummary>
        <AccordionDetails>
          <FormGroup>{districtsForState.map(renderDistrict)}</FormGroup>
        </AccordionDetails>
      </Accordion>
    );
  };

  const [expanded, setExpanded] = React.useState<string | false>(false);
  const districtListState = useSelector(selectDistrictList);
  checkedDistricts = districtListState.checkedDistricts;
  districtsByState = districtListState.districtsByState;
  return <React.Fragment>{Object.keys(districtsByState).map(renderState)}</React.Fragment>;
};

export default React.memo(DistrictList);
