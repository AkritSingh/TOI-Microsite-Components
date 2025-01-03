import React from 'react'
import PropTypes from 'prop-types'
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
  config: PropTypes.shape({
    styleObj: PropTypes.shape({}),
    classname: PropTypes.string,
  }),
  onClick: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool,
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