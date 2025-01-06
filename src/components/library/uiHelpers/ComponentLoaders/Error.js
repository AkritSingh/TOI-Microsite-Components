import React from 'react';
import PropTypes from 'prop-types';

function CError(props) {
  const { componentName } = props;
  return (
    <div>
      <span style={{ fontSize: '28px', color: 'red' }}>
        Error in Processing :: {componentName}
      </span>
    </div>
  );
}

CError.propTypes = {
  componentName: PropTypes.string,
};

CError.defaultProps = {
  componentName: null,
};

export default CError;
