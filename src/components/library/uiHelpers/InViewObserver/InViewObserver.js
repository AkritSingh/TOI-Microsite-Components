import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import s from './InViewObserver.scss';

function InViewObserver(props) {
  const {
    inViewCallback,
    // ga,
    children,
    viewMargin,
    unSupportedCallback,
    doNotUnobserve,
    className,
    wrapperClass,
    placeHolderClass,
  } = props;
  const observer = useRef();

  const componentRef = useCallback(
    (node) => {
      if ('IntersectionObserver' in window) {
        if (node) observer.current.observe(node);
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              const entryToCheck = entries[0];
              if (
                entryToCheck &&
                (entryToCheck.isIntersecting ||
                  entryToCheck.intersectionRatio > 0)
              ) {
                inViewCallback();

                // stop watching this element
                if (!doNotUnobserve) {
                  observer.current.unobserve(node);
                }
              }
            }
          },
          { rootMargin: viewMargin || '0px 0px 0px 0px' },
        );
      } else {
        unSupportedCallback();
      }
    },
    [doNotUnobserve, inViewCallback, viewMargin, unSupportedCallback],
  );

  return (
    <div
      data-type="in_view"
      ref={componentRef}
      className={`${className} ${
        wrapperClass ? s.listiclePageWrapper : ''
      } ${placeHolderClass}`}
    >
      {children}
    </div>
  );
}

InViewObserver.propTypes = {
  inViewCallback: PropTypes.func,
  className: PropTypes.string,
  ga: PropTypes.shape({
    category: PropTypes.string,
    action: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
  viewMargin: PropTypes.string,
  unSupportedCallback: PropTypes.func,
  doNotUnobserve: PropTypes.bool,
  wrapperClass: PropTypes.string,
  placeHolderClass: PropTypes.string,
};

InViewObserver.defaultProps = {
  inViewCallback: () => {},
  className: '',
  unSupportedCallback: () => {},
  ga: undefined,
  doNotUnobserve: false,
  viewMargin: '100px 0px 100px 0px',
  wrapperClass: undefined,
  placeHolderClass: '',
};

export default InViewObserver;
