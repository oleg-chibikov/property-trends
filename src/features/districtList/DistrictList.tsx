import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, FormGroup, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DistrictList.module.css';
import { checkState, DistrictsByState, selectCheckedDistricts, selectCheckedStates, selectDistrictsByState, uncheckState } from './districtListSlice';
import DistrictSelector from './DistrictSelector';
import SelectedStates from './SelectedStates';

let dispatch: Dispatch<unknown>;
let checkedDistricts: { [fileName: string]: undefined };
let checkedStates: { [state: string]: number };
let districtsByState: DistrictsByState;

const renderDistrict = (district: string, checked: boolean) => <DistrictSelector key={district} checked={checked} name={district} />;

const renderHeader = (state: string) => {
  const checkedDistrictsCount = checkedStates[state] || 0;
  const checked = checkedDistrictsCount > 0;
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
      label={`${state} (${checkedDistrictsCount})`}
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
      <Accordion square key={state} expanded={innerExpanded === state} onChange={handleInnerChange(state)} TransitionProps={{ unmountOnExit: true }} className={'innerAccordion ' + styles.districtList}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body1">{renderHeader(state)}</Typography>
        </AccordionSummary>
        <AccordionDetails className="innerAccordionDetails">
          <Typography variant="body2">
            <FormGroup>{districtsForState.map((el) => renderDistrict(el.district, el.checked))}</FormGroup>
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [innerExpanded, setInnerExpanded] = React.useState<string | false>(false);
  const [expanded, setExpanded] = React.useState<boolean>(isDesktop);
  useEffect(() => {
    setExpanded(isDesktop);
  }, [setExpanded, isDesktop]);

  const handleChange = (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  checkedDistricts = useSelector(selectCheckedDistricts);
  districtsByState = useSelector(selectDistrictsByState);
  checkedStates = useSelector(selectCheckedStates);
  return (
    <Accordion square expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption">
          Districts
          <SelectedStates />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>{Object.keys(districtsByState).map(renderState)}</FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(DistrictList);
