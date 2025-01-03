import React from 'react'
import PropTypes from 'prop-types'
import s from './Button.scss'
import useStyles from 'isomorphic-style-loader-react18/useStyles';


export default function Button({
  children, data, config
}) {
  useStyles(s);
  const { layout, onClick } = config;
  const { styleObj, classname, id, disabled } = layout;
  const { text } = data;

  function handleClick(event) {
    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }
  }
  return (
    <button
      type="button"
      className={classname}
      onClick={handleClick}
      style={styleObj}
      id={id}
      disabled={disabled}
    >
      {text || children}
    </button>

  )
}

Button.propTypes = {
  children: PropTypes.node,
  data: PropTypes.shape({
    text: PropTypes.string,
  }),
  config: PropTypes.shape({
    layout: PropTypes.shape({
      id: PropTypes.string,
      classname: PropTypes.string,
      styleObj: PropTypes.shape(),
      disabled: PropTypes.bool,
    }),
    onClick: PropTypes.func,
  }),
}

Button.defaultProps = {
  children: undefined,
  data: {
    text: "button"
  },
  config: {
    layout: {
      id: '',
      classname: '',
      styleObj: {},
      disabled: false,
    },
    onClick: undefined,
  }
}