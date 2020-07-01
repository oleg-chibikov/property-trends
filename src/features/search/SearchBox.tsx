import { CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import fetchDistrictInfoDebounced, { suburbSearchPromiseTrackerArea } from '../../backendRequests/suburbSearch';
import { PostCodeFileInfo } from '../../interfaces';
import StringUtils from '../../utils/stringUtils';
import styles from './SearchBox.module.css';

const SearchBox: React.FunctionComponent = () => {
  const [searchPattern, setSearchPattern] = useState<string>();
  const [data, setData] = useState<PostCodeFileInfo[]>([]);
  const { promiseInProgress } = usePromiseTracker({ area: suburbSearchPromiseTrackerArea, delay: 0 });

  const setDataAsync = useCallback(async () => {
    setData(await fetchDistrictInfoDebounced(searchPattern));
  }, [searchPattern]);

  useEffect(() => {
    setDataAsync();
  }, [setDataAsync]);

  return (
    <Autocomplete
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            const value = event.target.value;

            if (!value || value.length < 3) {
              return;
            }
            console.log('Searching ' + value);
            return setSearchPattern(value as string);
          }}
          margin="normal"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {promiseInProgress ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      className={styles.searchBox}
      options={data.sort((a, b) => -b.state.localeCompare(a.state))}
      groupBy={(option) => option.state}
      getOptionSelected={(option, value) => option.locality === value.locality}
      getOptionLabel={(option) => option.locality + ' ' + StringUtils.padPostCode(option.postCode)}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon />
            </Grid>
            <Grid item xs>
              {option.locality} {StringUtils.padPostCode(option.postCode)}
              <Typography variant="body2" color="textSecondary">
                {option.outerDistrict}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default React.memo(SearchBox);
