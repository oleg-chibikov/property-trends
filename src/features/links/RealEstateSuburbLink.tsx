import React from 'react';
import { SuburbKeyWithState } from '../../interfaces';
import DomainUtils from '../../utils/domainUtils';

const RealEstateSuburbLink: React.FunctionComponent<SuburbKeyWithState> = ({ state, postCode, locality }) => {
  const paddedPostCode = DomainUtils.padPostCode(postCode);
  return (
    <a href={DomainUtils.getRealEstateSuburbUri(locality, paddedPostCode, state)} rel="noopener noreferrer" target="_blank">
      {locality}
      {postCode && <span> {paddedPostCode}</span>}
    </a>
  );
};

export default React.memo(RealEstateSuburbLink);
