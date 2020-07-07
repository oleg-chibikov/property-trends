import { createStyles, IconButton, makeStyles, SwipeableDrawer, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from '@reduxjs/toolkit';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerOpen: {
      width: '20rem',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen, //1000,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen, // 1000,
      }),
      width: 0,
    },
  })
);

interface DrawerComponentProps {
  caption: string;
  anchor: 'left' | 'top' | 'right' | 'bottom';
  selectExpanded: (state: RootState) => boolean;
  setExpanded: ActionCreatorWithPayload<boolean, string>;
  toggleExpanded: ActionCreatorWithoutPayload<string>;
}

const withDrawer = <P extends DrawerComponentProps>(Component: React.ComponentType<P>): React.FunctionComponent<P> => (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const dispatch = useDispatch();
  const expanded = useSelector(props.selectExpanded);

  useEffect(() => {
    dispatch(props.setExpanded(isDesktop));
  }, [dispatch, props, isDesktop]);

  const toggleDrawer = () => {
    dispatch(props.toggleExpanded());
  };

  const button = props.anchor === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />;
  return (
    <SwipeableDrawer
      variant="permanent"
      anchor={props.anchor}
      open={true}
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
      <div className="drawerWrapper">
        <div className={'iconWrapper ' + props.anchor}>
          <IconButton onClick={toggleDrawer}>{button}</IconButton>
        </div>
        <Component {...props} />
      </div>
    </SwipeableDrawer>
  );
};

export default withDrawer;
