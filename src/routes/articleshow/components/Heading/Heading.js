import React, { useState, useEffect } from 'react';
import useStyles from 'isomorphic-style-loader-react18/useStyles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import s from './Heading.scss';

function Heading(props) {
  useStyles(s);
  const [render, setRender] = useState(false);

  const { type, size, className, children, theme, smallCase } = props;

  useEffect(() => {
    setRender(true);
  }, []);

  const classes = classNames({
    [s.heading]: true,
    // [ s.h2]: type === 'h2',
    // [s.h3]: type ===  'h3',
    // [s.h5]: type === 'h5',
    // [s.h4]: type === 'h4',
    [s.medium]: size === 'medium',
    [s.smallCase]: smallCase,
    // s.large]: size === 'large',
    [s.span]: type === 'span',
    [className]: !!className,
    [s.colorChange]: render,
  });
  const themeClass = classNames({
    [s.dark_theme]: theme === 'dark',
  });

  const getTextHtml = () => {
    const { text, link, linkTarget } = props;
    if (link) {
      return (
        <a href={link} target={linkTarget}>
          {text}
          <span />
        </a>
      );
    }
    return text;
  };

  const getHeading = () => {
    switch (type) {
      case 'h2':
        return <h2 className={classes}>{getTextHtml()}</h2>;
      case 'h3':
        return <h3 className={classes}>{getTextHtml()}</h3>;
      case 'h4':
        return <h4 className={classes}>{getTextHtml()}</h4>;
      case 'h5':
        return <h5 className={classes}>{getTextHtml()}</h5>;
      case 'span':
        return <span className={classes}>{getTextHtml()}</span>;
      default:
        return <h1 className={classes}>{getTextHtml()}</h1>;
    }
  };
  if (!render) {
    throw new Error('error heading');
  }

  return children ? (
    <div className={`${s.headingContainer} ${themeClass}`}>
      {getHeading(type, classes)}
      {React.isValidElement(children) && children}
    </div>
  ) : (
    getHeading(type, classes)
  );
}

Heading.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  link: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  dataGA: PropTypes.shape({}),
  children: PropTypes.element,
  theme: PropTypes.string,
  linkTarget: PropTypes.string,
  smallCase: PropTypes.bool,
};
Heading.defaultProps = {
  type: 'h2',
  link: undefined,
  size: 'large',
  className: undefined,
  dataGA: undefined,
  children: null,
  smallCase: false,
  theme: '',
  linkTarget: undefined,
};

export default Heading;
