import CodeIcon from '@mui/icons-material/Code';
import { Slider, ToggleButton, Tooltip, Typography } from '@mui/material';
import React, { ReactNode, useState } from 'react';

interface Mark {
  value: number;
  label?: React.ReactNode;
  scaledValue?: number;
}

interface SliderFilterProps {
  label: string | ReactNode;
  useRange?: boolean;
  value: number | number[];
  min: number;
  max: number;
  marks: boolean | Mark[];
  restrictSteps?: boolean;
  onChange: (value: number | number[]) => void;
}

const SliderFilter: React.FunctionComponent<SliderFilterProps> = ({ marks, label, useRange, value, onChange, min, max, restrictSteps }) => {
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
          step={restrictSteps ? null : 1}
          valueLabelDisplay="auto"
          marks={marks}
          onChange={(_event: unknown, newValue: number | number[]) => {
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

export default React.memo(SliderFilter);
