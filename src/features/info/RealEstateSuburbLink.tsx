import { Link } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { FeatureProperties } from '../../interfaces';
import DomainUtils from '../../utils/domainUtils';

const RealEstateSuburbLink: React.FunctionComponent<FeatureProperties> = ({ state, postCode, name }) => {
  const paddedPostCode = DomainUtils.padPostCode(postCode);
  return (
    <Link href={DomainUtils.getRealEstateSuburbUri(name, paddedPostCode, state)} target="_blank">
      {name}
      {postCode && <span> {paddedPostCode}</span>}
    </Link>
  );
};

RealEstateSuburbLink.propTypes = {
  state: PropTypes.string.isRequired,
  postCode: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export default React.memo(RealEstateSuburbLink);
