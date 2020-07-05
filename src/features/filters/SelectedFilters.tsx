import { Chip } from '@material-ui/core';
import Apartment from '@material-ui/icons/Apartment';
import AttachMoney from '@material-ui/icons/AttachMoney';
import Bathtub from '@material-ui/icons/Bathtub';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import Home from '@material-ui/icons/Home';
import SingleBed from '@material-ui/icons/SingleBed';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilters } from './filtersSlice';

const SelectedFilters: React.FunctionComponent = () => {
  const filters = useSelector(selectFilters);
  const getMaxValue = (value: number) => (value >= 7 ? '7+' : value);
  const getNumberOrRange = (min: number, value: number | number[]) =>
    Array.isArray(value) ? (value[0] !== value[1] ? (value[0] === min && value[1] >= 7 ? null : value[0] + '-' + getMaxValue(value[1])) : value[0].toString()) : value.toString();
  const labels = [
    { label: filters.dealType === 'buy' ? 'Buy' : 'Rent', icon: <AttachMoney /> },
    { label: filters.propertyType === 'apartment' ? 'A' : 'H', icon: filters.propertyType === 'apartment' ? <Apartment /> : <Home /> },
  ];
  const bedrooms = getNumberOrRange(1, filters.bedrooms);
  const bathrooms = getNumberOrRange(0, filters.bathrooms);
  const parkingSpaces = getNumberOrRange(0, filters.parkingSpaces);
  if (bedrooms) {
    labels.push({ label: bedrooms, icon: <SingleBed /> });
  }
  if (bathrooms) {
    labels.push({ label: bathrooms, icon: <Bathtub /> });
  }
  if (parkingSpaces) {
    labels.push({ label: parkingSpaces, icon: <DirectionsCar /> });
  }
  return (
    <div className="chipCollection">
      {labels.map(({ label, icon }, index) => (
        <Chip key={index} variant="outlined" size="small" color="primary" icon={icon} label={label} />
      ))}
    </div>
  );
};

export default React.memo(SelectedFilters);
