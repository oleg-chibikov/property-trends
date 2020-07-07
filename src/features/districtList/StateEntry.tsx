import { Accordion, AccordionDetails, AccordionSummary, FormGroup, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DistrictList.module.css';
import { selectCheckedDistricts, selectDistrictsByState, selectExpandedState, setExpanded, setExpandedState } from './districtListSlice';
import DistrictSelector from './DistrictSelector';
import StateEntryHeader from './StateEntryHeader';

interface StateEntryProps {
  state: string;
}

const StateEntry: React.FunctionComponent<StateEntryProps> = ({ state }) => {
  const dispatch = useDispatch();
  const expandedState = useSelector(selectExpandedState);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const handleStateChange = (panel: string) => (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    dispatch(setExpandedState(isExpanded ? panel : false));
    if (!isDesktop) {
      dispatch(setExpanded(false));
    }
  };

  const checkedDistricts = useSelector(selectCheckedDistricts);
  const districtsByState = useSelector(selectDistrictsByState);
  const districtsForState = districtsByState[state]
    .map((el) => ({
      district: el,
      checked: el in checkedDistricts,
    }))
    .sort((x, y) => (x.checked === y.checked ? 0 : x.checked ? -1 : 1));
  return (
    <Accordion square key={state} expanded={expandedState === state} onChange={handleStateChange(state)} TransitionProps={{ unmountOnExit: true }} className={'innerAccordion ' + styles.districtList}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body1">
          <StateEntryHeader state={state} />
        </Typography>
      </AccordionSummary>
      <AccordionDetails className="innerAccordionDetails">
        <Typography variant="body2">
          <FormGroup>
            {districtsForState.map((el) => (
              <DistrictSelector key={el.district} checked={el.checked} name={el.district} />
            ))}
          </FormGroup>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

StateEntry.propTypes = {
  state: PropTypes.string.isRequired,
};

export default React.memo(StateEntry);
