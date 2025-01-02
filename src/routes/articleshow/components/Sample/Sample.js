import React, { useState, useEffect } from 'react';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
// import PropTypes from 'prop-types';
import s from './Sample.scss';

function Sample() {
  useStyles(s);
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  return (
    <div className={`${render ? s.colourChange : ''} ${s.sample}`}>
      <span>sample component for lazy Load</span>
    </div>
  );
}

Sample.propTypes = {};
Sample.defaultProps = {};

export default Sample;
