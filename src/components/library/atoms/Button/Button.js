import React from 'react'
import propTypes from 'prop-types'
import s from './Button.scss'
import useStyles from 'isomorphic-style-loader-react18/useStyles';


export default function Button(props) {
  useStyles(s);
  const { config, onClick, children, disabled } = props;
  const { styleObj = {}, classname = '' } = config;
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
      disabled={disabled}
    >
      {children}
    </button>

  )
}

Button.propTypes = {
  config: propTypes.shape({
    styleObj: propTypes.object,
    classname: propTypes.string,
  }),
  onClick: propTypes.func,
  children: propTypes.node,
  disabled: propTypes.bool,
}

Button.defaultProps = {
  config: {
    styleObj: {},
    classname: '',
  },
  onClick: undefined,
  children: undefined,
  disabled: false,
}