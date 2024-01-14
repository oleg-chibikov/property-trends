import { useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { TailSpin } from 'react-loader-spinner';

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
        <TailSpin color={color || theme.palette.primary.main} height={size || 70} width={size || 70} />
      </div>
    </Tooltip>
  );
};

export default Spinner;
