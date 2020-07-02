import React from 'react';
import Loader from 'react-loader-spinner';

const Spinner: React.FunctionComponent = () => (
  <div className="spinner">
    <Loader type="TailSpin" color="#292929" height={70} width={70} />
  </div>
);

export default Spinner;
