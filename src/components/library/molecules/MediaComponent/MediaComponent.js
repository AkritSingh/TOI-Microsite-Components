/* eslint-disable react/no-unused-prop-types */
/* eslint-disable import/no-cycle */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import s from './MediaComponent.scss';
import Image from '../../atoms/Image/Image';
// import ComponentListRenderer from '../../uiHelpers/ComponentListRenderer/ComponentListRenderer';

export default function MediaComponent(props) {
  useStyles(s);

  const getComponent = (compObj) => {
    switch (compObj.type) {
      case 'image':
        return <Image {...compObj} />;
      case 'video':
        return <div className={s.video}>VIDEO</div>;
      case 'ad':
        return <div className={s.audio}>AD</div>;
      default:
        return null;
    }
  };

  return <>{getComponent(props)}</>;
}

MediaComponent.propTypes = {
  type: PropTypes.string,
  data: PropTypes.shape({}),
  config: PropTypes.shape({}),
};

MediaComponent.defaultProps = {
  type: '',
  data: {},
  config: {},
};
