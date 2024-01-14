import { Mark, Slider, Tooltip, Typography } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import ToggleButton from '@material-ui/lab/ToggleButton';
import PropTypes from 'prop-types';
import React, { ReactNode, useState } from 'react';

interface SliderFilterProps {
  label: string | ReactNode;
  useRange?: boolean;
  value: number | number[];
  min: number;
  max: number;
  marks: boolean | Mark[];
  onChange: (value: number | number[]) => void;
}

const SliderFilter: React.FunctionComponent<SliderFilterProps> = ({ marks, label, useRange, value, onChange, min, max }) => {
  let isRange = Array.isArray(value);
  const convertValue = (value: number | number[]) => {
    return isRange ? (Array.isArray(value) ? [...value] : [value, value]) : Array.isArray(value) ? value[0] : value;
  };
  const [localValue, setLocalValue] = useState<number | number[]>(value);
  const valueCopy = convertValue ? convertValue(localValue) : localValue;
  return (
    <div>
      <Typography variant="body1">
        {useRange ? (
          <Tooltip title="Use range selection">
            <span>
              {label}:{' '}
              <ToggleButton
                size="small"
                value="check"
                selected={isRange}
                onChange={() => {
                  isRange = !isRange;
                  onChange(convertValue(localValue));
                }}
              >
                <CodeIcon />
              </ToggleButton>
            </span>
          </Tooltip>
        ) : (
          label
        )}
      </Typography>
      <div className="slider">
        <Slider
          track={!isRange ? false : 'normal'}
          min={min}
          max={max}
          value={valueCopy}
          valueLabelDisplay="auto"
          marks={marks}
          onChange={(event: unknown, newValue: number | number[]) => {
            setLocalValue(newValue);
          }}
          onChangeCommitted={(event: unknown, newValue: number | number[]) => {
            onChange(newValue);
          }}
        />
      </div>
    </div>
  );
};

SliderFilter.propTypes = {
  label: PropTypes.any.isRequired,
  useRange: PropTypes.bool,
  value: PropTypes.any.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  marks: PropTypes.any.isRequired,
};

export default React.memo(SliderFilter);
