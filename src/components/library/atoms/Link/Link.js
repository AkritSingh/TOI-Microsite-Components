import React from 'react'
import PropTypes from 'prop-types'
// import useStyles from 'isomorphic-style-loader-react18/useStyles';
// import s from './Link.scss'

export default function Link({
  config,
  data,
  children,
  id,
  classname,
}) {
  // useStyles(s);
  const { layout={}, onClick=undefined } = config;
  const { id: layoutId = '', styleObj = {}, classname: layoutClassname = '' } = layout || {};
  const { nofollow = '', target, link, text='' } = data || {};

  function handleClick(event) {
    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }
  }

  const linkAttr = {
    id: id || layoutId,
    href: link,
    className: `${classname || layoutClassname}`,
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
  classname: PropTypes.string,
  id: PropTypes.string,
  data: PropTypes.shape({
    text: PropTypes.string,
    nofollow: PropTypes.string,
    target: PropTypes.string,
    link: PropTypes.string, 
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
  classname: '',
  id: '',
  data:{
      text: 'Link',
      link: '#',
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