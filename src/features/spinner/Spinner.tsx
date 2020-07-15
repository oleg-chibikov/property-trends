import { useTheme } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import Loader from 'react-loader-spinner';

interface SpinnerProps {
  tooltip?: string;
  color?: string;
}

const Spinner: React.FunctionComponent<SpinnerProps> = ({ tooltip, color }) => {
  const theme = useTheme();
  return (
    <Tooltip title={tooltip || 'Loading...'}>
      <div className="spinner">
        <Loader type="TailSpin" color={color || theme.palette.primary.main} height={70} width={70} />
      </div>
    </Tooltip>
  );
};

Spinner.propTypes = {
  tooltip: PropTypes.string,
  color: PropTypes.string,
};

export default Spinner;
