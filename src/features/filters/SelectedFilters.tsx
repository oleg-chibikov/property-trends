import Apartment from '@mui/icons-material/Apartment';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Bathtub from '@mui/icons-material/Bathtub';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import Home from '@mui/icons-material/Home';
import SingleBed from '@mui/icons-material/SingleBed';
import { Chip } from '@mui/material';
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
  const bedrooms = getNumberOrRange(0, filters.bedrooms);
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
