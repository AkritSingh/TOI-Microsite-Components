import React from 'react'
import PropTypes from 'prop-types'
// import useStyles from 'isomorphic-style-loader-react18/useStyles';
// import s from './Link.scss'

export default function Link({
  config,
  data,
  children,
}) {
  // useStyles(s);
  const { layout={}, onClick=undefined } = config;
  const { id = '', styleObj = {}, classname = '' } = layout || {};
  const { nofollow = '', target, url, text='' } = data || {};

  function handleClick(event) {
    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }
  }

  const linkAttr = {
    id,
    href: url,
    className: `${classname}`,
    onClick: handleClick,
    rel: nofollow,
    target,
  }
  return (
    <a
      {...linkAttr} style= {styleObj}
    >
      {text || children}
    </a>
  )
}

Link.propTypes = {
  children: PropTypes.node,
  data: PropTypes.shape({
    text: PropTypes.string,
    nofollow: PropTypes.string,
    target: PropTypes.string,
    url: PropTypes.string,
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

Link.defaultProps = {
  children: undefined,
  data:{
      text: 'Link',
      url: '#',
      nofollow: '',
      target: undefined,
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