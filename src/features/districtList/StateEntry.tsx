import { Accordion, AccordionDetails, AccordionSummary, FormGroup } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DistrictList.module.css';
import { selectCheckedDistricts, selectDistrictsByState, selectExpandedState, setExpandedState } from './districtListSlice';
import DistrictSelector from './DistrictSelector';
import StateEntryHeader from './StateEntryHeader';

interface StateEntryProps {
  state: string;
}

const StateEntry: React.FunctionComponent<StateEntryProps> = ({ state }) => {
  const [shouldScroll, setShouldScroll] = useState<boolean>(true);
  const dispatch = useDispatch();
  const expandedState = useSelector(selectExpandedState);
  const checkedDistricts = useSelector(selectCheckedDistricts);
  const districtsByState = useSelector(selectDistrictsByState);
  const districtsForState = districtsByState[state].map((district, index) => {
    const id = `district_${state}_${index}`;
    const isChecked = district in checkedDistricts;
    return {
      district: district,
      checked: isChecked,
      id: id,
    };
  });
  //  .sort((x, y) => (x.checked === y.checked ? 0 : x.checked ? -1 : 1));

  useEffect(() => {
    if (shouldScroll) {
      const districtToScrollTo = districtsForState.find((x) => x.checked);
      if (districtToScrollTo) {
        const scrollIntoView = () => {
          const el = document.querySelector('#' + districtToScrollTo.id);
          if (el) {
            el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
          }
        };
        scrollIntoView();
        setShouldScroll(false);
      }
    }
  }, [districtsForState, setShouldScroll, shouldScroll]);

  const handleStateChange = (panel: string) => (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    setShouldScroll(true);
    dispatch(setExpandedState(isExpanded ? panel : false));
  };

  return (
    <Accordion square key={state} expanded={expandedState === state} onChange={handleStateChange(state)} TransitionProps={{ unmountOnExit: true }} className={'innerAccordion ' + styles.districtList}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <StateEntryHeader state={state} />
      </AccordionSummary>
      <AccordionDetails className="innerAccordionDetails">
        <FormGroup>
          {districtsForState.map((el) => (
            <DistrictSelector id={el.id} key={el.district} checked={el.checked} districtFileName={el.district} />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

StateEntry.propTypes = {
  state: PropTypes.string.isRequired,
};

export default React.memo(StateEntry);
