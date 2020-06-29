import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { checkDistrict, uncheckDistrict } from './districtListSlice';
import StringUtils from '../../utils/stringUtils';

interface IDistrictSelectorProps {
  name: string;
  checked: boolean;
}

const DistrictSelector: React.FunctionComponent<IDistrictSelectorProps> = ({ name, checked }) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState<boolean>(checked);
  useEffect(() => {
    if (checked) {
      dispatch(checkDistrict(name));
    }
  }, [checked, dispatch, name]);
  return (
    <div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {
          setIsChecked(!isChecked);
          if (isChecked) {
            dispatch(uncheckDistrict(name));
          } else {
            dispatch(checkDistrict(name));
          }
        }}
      />{' '}
      {StringUtils.removePostfix(name.substr(name.indexOf(' - ') + 3))}
    </div>
  );
};

DistrictSelector.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default React.memo(DistrictSelector);
