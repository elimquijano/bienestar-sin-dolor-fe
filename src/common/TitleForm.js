import PropTypes from 'prop-types';
import { useEffect } from 'react';

const TitleFormCommon = ({ titleText }) => {
  useEffect(() => {
    //console.error('hola');
  });

  return (
    <>
      <div className="col-12 text-center">
        <h1 className='text-uppercase'>{titleText}</h1>
        <hr></hr>
      </div>
    </>
  );
};

TitleFormCommon.propTypes = {
  isLoading: PropTypes.bool
};

export default TitleFormCommon;
