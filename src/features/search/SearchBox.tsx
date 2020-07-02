import { CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Autocomplete, { AutocompleteChangeReason } from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useDispatch } from 'react-redux';
import fetchDistrictInfoDebounced, { suburbSearchPromiseTrackerArea } from '../../backendRequests/suburbSearch';
import { PostCodeFileInfo } from '../../interfaces';
import StringUtils from '../../utils/stringUtils';
import { checkDistrictOnly } from '../districtList/districtListSlice';
import styles from './SearchBox.module.css';
import { highlightSuburb, selectSuburb, unhighlightSuburb } from './searchBoxSlice';

const SearchBox: React.FunctionComponent = () => {
  const [searchPattern, setSearchPattern] = useState<string>();
  const [data, setData] = useState<PostCodeFileInfo[]>([]);
  const { promiseInProgress } = usePromiseTracker({ area: suburbSearchPromiseTrackerArea, delay: 0 });

  const setDataAsync = useCallback(async () => {
    try {
      setData(await fetchDistrictInfoDebounced(searchPattern));
    } catch {
      // debounce error
    }
  }, [searchPattern]);

  useEffect(() => {
    setDataAsync();
  }, [setDataAsync]);

  const dispatch = useDispatch();

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
      onChange={(event: ChangeEvent<unknown>, value: string | PostCodeFileInfo | null, reason: AutocompleteChangeReason) => {
        if (typeof value === 'object' && value !== null) {
          const suburbId = StringUtils.getSuburbId(value.locality, value.postCode);
          dispatch(selectSuburb(suburbId));
          dispatch(checkDistrictOnly(value.state + ' - ' + value.outerDistrict + '.simplified.json'));
        }
      }}
      className={styles.searchBox}
      options={data.sort((a, b) => -b.state.localeCompare(a.state))}
      groupBy={(option) => option.state}
      getOptionSelected={(option, value) => option.locality === value.locality}
      getOptionLabel={(option) => option.locality + ' ' + StringUtils.padPostCode(option.postCode)}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.locality, inputValue);
        const parts = parse(option.locality, matches);
        const suburbId = StringUtils.getSuburbId(option.locality, option.postCode);
        return (
          <div
            onMouseOver={() => {
              dispatch(highlightSuburb(suburbId));
            }}
            onMouseOut={() => {
              dispatch(unhighlightSuburb());
            }}
          >
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}{' '}
                {StringUtils.padPostCode(option.postCode)}
                <Typography variant="body2" color="textSecondary">
                  {option.outerDistrict}
                </Typography>
              </Grid>
            </Grid>
          </div>
        );
      }}
    />
  );
};

export default React.memo(SearchBox);
