import PropTypes from 'prop-types';
import React from 'react';
import DomainUtils from '../../utils/domainUtils';

interface RealEstatePropertyLink {
  id: number;
  text: string;
}

const RealEstatePropertyLink: React.FunctionComponent<RealEstatePropertyLink> = ({ id, text }) => {
  return (
    <a href={DomainUtils.getRealEstatePropertyUri(id)} rel="noopener noreferrer" target="_blank">
      {text}
    </a>
  );
};

RealEstatePropertyLink.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};

export default React.memo(RealEstatePropertyLink);
