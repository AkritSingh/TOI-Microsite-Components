import React from 'react';
import PropTypes from 'prop-types';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import s from './Background.scss';

export default function Background({
  children,
  config,
  data,
  id,
  className
}) {
  useStyles(s);
  const { layout={} } = config;
  const { angle } = layout;
  const { colors, image } = data;
  const bgImg = image ? `url(${image})` : '';
 
  const setGradient = () => {
    if (colors && Array.isArray(colors) && colors.length > 0) {
      let gradient = '';
      for(let i = 0; i < colors.length; i += 1) {
        gradient += `, ${colors[i]}`;
      }
      return`linear-gradient(${angle || '0deg'} ${gradient})`
    }
    return ''
  }

  const bgColors = setGradient() || '';

  const styleObj = {
    backgroundImage: bgImg || bgColors,
  }

  const component = (
    <div id={id} className={`${s.background} ${className}`} style={styleObj} >
      {children}
    </div>
  )
  return component
    
  
}

Background.propTypes = {
  children: PropTypes.node,
  config: PropTypes.shape({
    layout: PropTypes.shape({
      angle: PropTypes.string,
    })
  }),
  data: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
  }),
  id: PropTypes.string,
  className: PropTypes.string
}

Background.defaultProps = {
  children: undefined,
  config: {
    layout: {
      angle: '0deg',
    }
  },
  data:{
    colors: [],
    image: '',
  },
  id: '',
  className: '',
}