import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, FormGroup } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import styles from './DistrictList.module.css';
import { selectCheckedDistricts, selectDistrictListExpandedState, selectDistrictsByState, setDistrictListElementToScrollTo, setDistrictListExpandedState } from './districtListSlice';
import DistrictSelector from './DistrictSelector';
import StateEntryHeader from './StateEntryHeader';

interface StateEntryProps {
  state: string;
}

const StateEntry: React.FunctionComponent<StateEntryProps> = ({ state: politicalState }) => {
  const dispatch = useDispatch<AppDispatch>();
  const expandedPoliticalState = useSelector(selectDistrictListExpandedState);
  const isExpanded = expandedPoliticalState === politicalState;
  const checkedDistricts = useSelector(selectCheckedDistricts);
  const districtsByState = useSelector(selectDistrictsByState);
  const districtsForState = districtsByState[politicalState].map((district, index) => {
    const suburbElementId = `district_${politicalState}_${index}`;
    const isChecked = checkedDistricts && district in checkedDistricts;
    return {
      district: district,
      checked: isChecked,
      id: suburbElementId,
    };
  });
  //  .sort((x, y) => (x.checked === y.checked ? 0 : x.checked ? -1 : 1));

  const firstChecked = districtsForState.find((x) => x.checked)?.id;

  const handleStateChange = (panel: string) => (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    dispatch(setDistrictListExpandedState(isExpanded ? panel : false));
    dispatch(setDistrictListElementToScrollTo(isExpanded ? firstChecked : undefined));
  };

  useEffect(() => {
    if (firstChecked) {
      dispatch(setDistrictListElementToScrollTo(firstChecked));
    }
  }, [dispatch, firstChecked]);

  return (
    <Accordion square key={politicalState} expanded={isExpanded} onChange={handleStateChange(politicalState)} TransitionProps={{ unmountOnExit: true }} className={'innerAccordion ' + styles.districtList}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <StateEntryHeader state={politicalState} />
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

export default React.memo(StateEntry);
