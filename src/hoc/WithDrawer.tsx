import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';

interface DrawerComponentProps {
  caption: string;
  anchor: 'left' | 'top' | 'right' | 'bottom';
  selectExpanded: (state: RootState) => boolean;
  setExpanded: ActionCreatorWithPayload<boolean, string>;
  toggleExpanded: ActionCreatorWithoutPayload<string>;
  widthOrHeight?: string | number;
  openWhenDesktop?: boolean;
}

const getButton = (anchor: string) => {
  switch (anchor) {
    case 'left':
      return <KeyboardArrowLeftIcon />;
    case 'right':
      return <KeyboardArrowRightIcon />;
    case 'top':
      return <KeyboardArrowUpIcon />;
    case 'bottom':
      return <KeyboardArrowDownIcon />;
    default:
      return <KeyboardArrowLeftIcon />;
  }
};

const withDrawer =
  <P extends DrawerComponentProps>(Component: React.ComponentType<P>): React.FunctionComponent<P> =>
  (props) => {
    const isHorizontal = props.anchor === 'left' || props.anchor === 'right';
    const dispatch = useDispatch<AppDispatch>();
    const expanded = useSelector(props.selectExpanded);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
    const widthOrHeight = isDesktop ? props.widthOrHeight : undefined;

    if (props.openWhenDesktop === undefined || props.openWhenDesktop) {
      useEffect(() => {
        dispatch(props.setExpanded(isDesktop));
      }, [dispatch, props, isDesktop]);
    }

    const toggleDrawer = useCallback(() => {
      dispatch(props.toggleExpanded());
    }, [dispatch, props]);

    const classes = clsx({
      ['drawerOpen']: expanded,
      ['drawerClose']: !expanded,
      ['horizontal']: isHorizontal,
      ['vertical']: !isHorizontal,
    });
    return (
      <SwipeableDrawer
        variant={widthOrHeight ? 'persistent' : 'temporary'}
        anchor={props.anchor}
        open={widthOrHeight ? true : expanded}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        className={classes}
        classes={{
          paper: classes,
        }}
      >
        <div className={'drawerWrapper ' + (isHorizontal ? 'horizontal' : 'vertical') + ' ' + props.anchor}>
          {isDesktop && <IconButton onClick={toggleDrawer}>{getButton(props.anchor)}</IconButton>}
          {useMemo(
            () => (
              <Component {...props} />
            ),
            [props]
          )}
        </div>
      </SwipeableDrawer>
    );
  };

export default withDrawer;
