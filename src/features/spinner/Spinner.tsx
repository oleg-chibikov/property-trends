import { useTheme } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import Loader from 'react-loader-spinner';

interface SpinnerProps {
  tooltip?: string;
  color?: string;
  size?: number;
}

const Spinner: React.FunctionComponent<SpinnerProps> = ({ tooltip, color, size }) => {
  const theme = useTheme();
  return (
    <Tooltip title={tooltip || 'Loading...'}>
      <div className="spinner">
        <Loader type="TailSpin" color={color || theme.palette.primary.main} height={size || 70} width={size || 70} />
      </div>
    </Tooltip>
  );
};

Spinner.propTypes = {
  tooltip: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default Spinner;
