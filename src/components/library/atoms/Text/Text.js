import React from 'react'
import PropTypes from 'prop-types'
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import s from './Text.scss'

export default function Text({
  config,
  data,
  children,
}) {
  useStyles(s);
  const { layout={}} = config;
  const { id, styleObj, classname, type } = layout || {};
  const { text='' } = data || {};

  const component =(layoutType, attr, innerText, childNode)=>{
    switch (layoutType) {
      case 'h1':
        return <h1 {...attr}>{innerText || childNode}</h1>
      case 'h2':
        return <h2 {...attr}>{innerText || childNode}</h2>
      case 'h3':
        return <h3 {...attr}>{innerText || childNode}</h3>
      case 'h4':
        return <h4 {...attr}>{innerText || childNode}</h4>
      case 'h5':
        return <h5 {...attr}>{innerText || childNode}</h5>
      case 'h6':
        return <h6 {...attr}>{innerText || childNode}</h6>
      case 'p':
        return <p {...attr}>{innerText || childNode}</p>
      case 'span':
        return <span {...attr}>{innerText || childNode}</span>
      default:
        return <p {...attr}>{innerText || childNode}</p>
    }
  }

  return component(type, {id, style:{styleObj}, classname}, text, children);
}

Text.propTypes = {
  children: PropTypes.node,
  data: PropTypes.shape({
    text: PropTypes.string,
  }),
  config: PropTypes.shape({
    layout: PropTypes.shape({
      id: PropTypes.string,
      classname: PropTypes.string,
      styleObj: PropTypes.shape(),
      type: PropTypes.string,
    }),
  }),
}

Text.defaultProps = {
  children: undefined,
  data:{
      text: 'Link',
  },
  config: {
    layout:{
      id: '',
      classname: '',
      styleObj: {},
      type: 'normal'
    },
  }
}