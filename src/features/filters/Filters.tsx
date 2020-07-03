import { Accordion, AccordionDetails, AccordionSummary, FormGroup, useMediaQuery } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect } from 'react';
import AllowedWindowInDaysFilter from './AllowedWindowInDaysFilter';
import BathroomsFilter from './BathroomsFilter';
import BedroomsFilter from './BedroomsFilter';
import ConstructionStatusFilter from './ConstructionStatusFilter';
import DealTypesFilter from './DealTypesFilter';
import styles from './Filters.module.css';
import MainPriceOnlyFilter from './MainPriceOnlyFilter';
import ParkingSpacesFilter from './ParkingSpacesFilter';
import PropertyTypesFilter from './PropertyTypesFilter';

const Filters: React.FunctionComponent = () => {
  const isDesktop = useMediaQuery('(min-width:1440px)');
  const [expanded, setExpanded] = React.useState<boolean>(isDesktop);
  useEffect(() => {
    setExpanded(isDesktop);
  }, [setExpanded, isDesktop]);

  const handleChange = (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };
  return (
    <Accordion square expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>Filters</AccordionSummary>
      <AccordionDetails>
        <FormGroup className={styles.filters}>
          <PropertyTypesFilter />
          <DealTypesFilter />
          <ConstructionStatusFilter />
          <BedroomsFilter />
          <BathroomsFilter />
          <ParkingSpacesFilter />
          <AllowedWindowInDaysFilter />
          <MainPriceOnlyFilter />
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export default React.memo(Filters);
