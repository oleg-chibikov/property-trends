import { Accordion, AccordionDetails, AccordionSummary, FormGroup, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DistrictsByState, selectDistrictsByState } from './districtListSlice';
import SelectedStates from './SelectedStates';
import StateEntry from './StateEntry';

let districtsByState: DistrictsByState;

const DistrictList: React.FunctionComponent = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [expanded, setExpanded] = React.useState<boolean>(isDesktop);

  districtsByState = useSelector(selectDistrictsByState);

  useEffect(() => {
    setExpanded(isDesktop);
  }, [setExpanded, isDesktop]);

  const handleChange = (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  return (
    <Accordion square expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption">
          Districts
          <SelectedStates />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {Object.keys(districtsByState).map((state, index) => (
            <StateEntry key={index} state={state} />
          ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(DistrictList);
