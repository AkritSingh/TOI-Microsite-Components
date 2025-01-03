/* eslint-disable css-modules/no-unused-class */
import React from 'react'
import PropTypes from 'prop-types'
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import s from './Image.scss';

export default function Image({
  config,
  data,
  id,
  classname,
}) {
  useStyles(s);
  const { layout={}, onClick=undefined } = config;
  const { id: layoutId = '', styleObj = {}, classname: layoutClassname = '' } = layout || {};
  const {src, alt} = data || {};

  function handleClick(event) {
    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }
  }

  const imgAttr = {
    id: id || layoutId,
    src,
    className: `${classname || layoutClassname}`,
    onClick: handleClick,
  }
  return (
    <img {...imgAttr} alt={alt} style= {styleObj} />
  )
}

Image.propTypes = {
  id: PropTypes.string,
  classname: PropTypes.string,
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
  id: '',
  classname: '',
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