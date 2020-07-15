import { createStyles, IconButton, makeStyles, SwipeableDrawer, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';

const useStyles = (isWidth: boolean, widthOrHeightWhenOpen: string | number) =>
  makeStyles((theme: Theme) =>
    createStyles(
      isWidth
        ? {
            drawerOpen: {
              width: widthOrHeightWhenOpen,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
            drawerClose: {
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: 0,
            },
          }
        : {
            drawerOpen: {
              height: widthOrHeightWhenOpen,
              transition: theme.transitions.create('height', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
            drawerClose: {
              transition: theme.transitions.create('height', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              height: 0,
            },
          }
    )
  )();

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

const withDrawer = <P extends DrawerComponentProps>(Component: React.ComponentType<P>): React.FunctionComponent<P> => (props) => {
  const isHorizontal = props.anchor === 'left' || props.anchor === 'right';
  const classes = useStyles(isHorizontal, props.widthOrHeight || 'auto');
  const dispatch = useDispatch();
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
  return (
    <SwipeableDrawer
      variant={widthOrHeight ? 'persistent' : 'temporary'}
      anchor={props.anchor}
      open={widthOrHeight ? true : expanded}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      className={clsx({
        [classes.drawerOpen]: expanded,
        [classes.drawerClose]: !expanded,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: expanded,
          [classes.drawerClose]: !expanded,
        }),
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
