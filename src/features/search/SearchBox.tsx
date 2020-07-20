import { CircularProgress, Grid, TextField, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Autocomplete from '@material-ui/lab/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import { useDispatch, useSelector } from 'react-redux';
import fetchDistrictInfoDebounced, { suburbSearchPromiseTrackerArea } from '../../backendRequests/suburbSearch';
import withDrawer from '../../hoc/WithDrawer';
import { PostCodeFileInfo } from '../../interfaces';
import DomainUtils from '../../utils/domainUtils';
import { checkDistrictOnly } from '../districtList/districtListSlice';
import styles from './SearchBox.module.css';
import { highlightSuburb, selectExpanded, setExpanded, setSearchResult, unhighlightSuburb } from './searchBoxSlice';

let inputRef: HTMLInputElement | undefined;

const fetchAndSetData = (searchPattern: string | undefined, setData: (data: PostCodeFileInfo[]) => void) => {
  let ignore = false;
  const fetchData = async () => {
    try {
      return await fetchDistrictInfoDebounced(searchPattern);
    } catch {
      // debounce error
      return null;
    }
  };

  const applyData = async () => {
    const data = await fetchData();
    if (!ignore) {
      if (data) {
        setData(data);
      }
    } else {
      console.log('Ignored applying previous search data as it is not the most recent');
    }
  };

  applyData();

  return () => {
    ignore = true;
  };
};

const SearchBox: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [searchPattern, setSearchPattern] = useState<string>();
  const [data, setData] = useState<PostCodeFileInfo[]>([]);
  const { promiseInProgress } = usePromiseTracker({ area: suburbSearchPromiseTrackerArea, delay: 0 });
  const expanded = useSelector(selectExpanded);
  if (expanded && inputRef) {
    inputRef.focus();
  }

  useEffect(() => {
    return fetchAndSetData(searchPattern, setData);
  }, [searchPattern, setData]);

  return useMemo(
    () => (
      <Autocomplete
        renderInput={(params) => (
          <TextField
            inputRef={(input) => {
              inputRef = input;
            }}
            {...params}
            label={isDesktop ? 'Search suburbs/post codes' : 'Search'}
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
        onChange={(event: ChangeEvent<unknown>, value: string | PostCodeFileInfo | null) => {
          if (typeof value === 'object' && value !== null) {
            const suburbId = DomainUtils.getSuburbId(value.locality, value.postCode);
            dispatch(setSearchResult(suburbId));
            dispatch(checkDistrictOnly(value.state + ' - ' + value.outerDistrict + '.json'));
            dispatch(setExpanded(false));
          }
        }}
        className={styles.searchBox}
        options={data.sort((a, b) => -b.state.localeCompare(a.state))}
        groupBy={(option) => option.state}
        getOptionSelected={(option, value) => option.locality === value.locality}
        getOptionLabel={(option) => option.locality + ' ' + DomainUtils.padPostCode(option.postCode)}
        renderOption={(option, { inputValue }) => {
          const matches = match(option.locality, inputValue);
          const parts = parse(option.locality, matches);
          const suburbId = DomainUtils.getSuburbId(option.locality, option.postCode);
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
                  <Typography variant="body1">
                    {parts.map((part, index) => (
                      <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                      </span>
                    ))}{' '}
                    {DomainUtils.padPostCode(option.postCode)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {option.outerDistrict}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          );
        }}
      />
    ),
    [data, dispatch, isDesktop, promiseInProgress]
  );
};

export default React.memo(withDrawer(SearchBox));
