import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, FormGroup, useMediaQuery } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DistrictList.module.css';
import { checkState, DistrictsByState, selectDistrictList, uncheckState } from './districtListSlice';
import DistrictSelector from './DistrictSelector';

let dispatch: Dispatch<unknown>;
let checkedDistricts: { [fileName: string]: undefined };
let districtsByState: DistrictsByState;

const renderDistrict = (district: string, checked: boolean) => <DistrictSelector key={district} checked={checked} name={district} />;

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
  const handleInnerChange = (panel: string) => (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    setInnerExpanded(isExpanded ? panel : false);
  };

  const renderState = (state: string) => {
    const districtsForState = districtsByState[state]
      .map((el) => ({
        district: el,
        checked: el in checkedDistricts,
      }))
      .sort((x, y) => (x.checked === y.checked ? 0 : x.checked ? -1 : 1));
    return (
      <Accordion square key={state} expanded={innerExpanded === state} onChange={handleInnerChange(state)} TransitionProps={{ unmountOnExit: true }} className={styles.districtList}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>{renderHeader(state)}</AccordionSummary>
        <AccordionDetails className="innerAccordionDetails">
          <FormGroup>{districtsForState.map((el) => renderDistrict(el.district, el.checked))}</FormGroup>
        </AccordionDetails>
      </Accordion>
    );
  };

  const isDesktop = useMediaQuery('(min-width:768px)');
  const [innerExpanded, setInnerExpanded] = React.useState<string | false>(false);
  const [expanded, setExpanded] = React.useState<boolean>(isDesktop);
  useEffect(() => {
    setExpanded(isDesktop);
  }, [setExpanded, isDesktop]);

  const handleChange = (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const districtListState = useSelector(selectDistrictList);
  checkedDistricts = districtListState.checkedDistricts;
  districtsByState = districtListState.districtsByState;
  return (
    <Accordion square expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>Districts</AccordionSummary>
      <AccordionDetails>
        <FormGroup>{Object.keys(districtsByState).map(renderState)}</FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(DistrictList);
