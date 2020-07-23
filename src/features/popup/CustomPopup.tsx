import React from 'react';
import { useSelector } from 'react-redux';
import { selectPopupPosition } from './popupSlice';

const CustomPopup: React.FunctionComponent = () => {
  const popupPosition = useSelector(selectPopupPosition);

  if (!popupPosition) {
    return null;
  }

  // TODO: display info in popup if needed
  return null;

  // const width = isDesktop ? desktopWidth : mobileWidth;

  // return (
  //   <Popup onOpen={() => dispatch(loadDisplaySuburbKey())} onClose={() => dispatch(unloadDisplaySuburbKey())} maxWidth={width} key={`popup-${popupIndex++}`} position={popupPosition} autoClose={true}>
  //     <div style={{ width: width }}>{/* <SuburbInfo /> */}</div>
  //   </Popup>
  // );
};

export default React.memo(CustomPopup);
