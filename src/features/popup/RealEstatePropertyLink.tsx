import { Link } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import DomainUtils from '../../utils/domainUtils';

interface RealEstatePropertyLink {
  id: number;
  text: string;
}

const RealEstatePropertyLink: React.FunctionComponent<RealEstatePropertyLink> = ({ id, text }) => {
  return (
    <Link href={DomainUtils.getRealEstatePropertyUri(id)} target="_blank">
      {text}
    </Link>
  );
};

RealEstatePropertyLink.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default React.memo(RealEstatePropertyLink);
