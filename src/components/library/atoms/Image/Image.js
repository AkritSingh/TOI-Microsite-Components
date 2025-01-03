import React from 'react'
import PropTypes from 'prop-types'
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import s from './Image.scss';

export default function Image({
  config,
  data,
}) {
  useStyles(s);
  const { layout={}, onClick=undefined } = config;
  const { id = '', styleObj = {}, classname = '' } = layout || {};
  const {src, alt} = data || {};

  function handleClick(event) {
    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }
  }

  const imgAttr = {
    id,
    src,
    className: `${classname}`,
    onClick: handleClick,
  }
  return (
    <img {...imgAttr} alt={alt} style= {styleObj} />
  )
}

Image.propTypes = {
  data: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  }),
  config: PropTypes.shape({
    layout: PropTypes.shape({
      id: PropTypes.string,
      classname: PropTypes.string,
      styleObj: PropTypes.shape(),
    }),
    onClick: PropTypes.func,
  }),
}

Image.defaultProps = {
  data:{
      src: '',
      alt: 'image',
  },
  config: {
    layout:{
      id: '',
      classname: '',
      styleObj: {},
    },
    onClick: undefined,
  }
}