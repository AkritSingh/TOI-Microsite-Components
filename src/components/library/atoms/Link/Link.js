import React from 'react'
import propTypes from 'prop-types'
import s from './Link.scss'
import useStyles from 'isomorphic-style-loader-react18/useStyles';

export default function Link(props) {
  useStyles(s);
  const { config, target, onClick, children, url, text } = props;
  const { styleObj = {}, classname = '' } = config || {};
  const { nofollow = '' } = config || {};
  function handleClick(event) {
    if (onClick && typeof onClick === 'function') {
      onClick(event);
    }
  }
  return (
    <a
      href={url}
      className={`${s.active} ${classname}`}
      onClick={handleClick}
      style={styleObj}
      rel={nofollow}
      target={target}
    >
      {text || children}
    </a>
  )
}

Link.propTypes = {
  config: propTypes.shape({
    styleObj: propTypes.object,
    classname: propTypes.string,
    nofollow: propTypes.string,
  }),
  target: propTypes.string,
  onClick: propTypes.func,
  children: propTypes.node,
  url: propTypes.string,
  text: propTypes.string,
}

Link.defaultProps = {
  config: {
    styleObj: {},
    classname: '',
    nofollow: '',
  },
  target: undefined,
  onClick: undefined,
  children: undefined,
  url: undefined,
  text: '',
}