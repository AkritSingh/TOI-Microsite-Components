/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import getComponent from './getComponent';

// flags are maintained to preserve the action done on the events
let firstScrollFlag = false;
// let docClickFlag = false;
let domContentLoadFlag = false;

(() => {
  let lastKnownScrollPosition = 0;

  const isClientSide = typeof window !== 'undefined';

  if (isClientSide) {
    window.memoComponents = {};
    const onScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      if (!firstScrollFlag) {
        firstScrollFlag = true;
        // console.log(
        //   'CCL=============> FIRST_SCROLL_INITIATE Dispatch',
        //   firstScrollFlag,
        // );
        window.dispatchEvent(
          new CustomEvent('FIRST_SCROLL_INITIATE', {
            detail: { lastKnownScrollPosition },
          }),
        );
        window.removeEventListener('scroll', onScroll);
      }
    };

    // const onDocClick = () => {
    //   if (!docClickFlag) {
    //     // console.log('CCL=============> DOCUMENT_CLICKED');
    //     docClickFlag = true;
    //     window.dispatchEvent(new CustomEvent('DOCUMENT_CLICKED'));
    //     document.removeEventListener('click', onDocClick);
    //   }
    // };

    const onDOMContentLoad = () => {
      if (!domContentLoadFlag) {
        domContentLoadFlag = true;
        window.dispatchEvent(new CustomEvent('DOM_CONTENT_LOADED'));
        document.removeEventListener('DOMContentLoaded', onDOMContentLoad);
      }
    };

    // bind scroll event on window
    window.addEventListener('scroll', onScroll);
    // bind click event on docu
    // document.addEventListener('click', onDocClick);
    // bind domload event
    document.addEventListener('DOMContentLoaded', onDOMContentLoad);
  }
})();

// eslint-disable-next-line react/display-name
const ClientComponentLoader = memo(
  ({
    componentName,
    loadOnScroll,
    // loadOnDocLoad,
    loadOnDocClick,
    rootmargin,
    fallbackComponent,
    styles,
    globalClass,
    key,
    ...rest
  }) => {
    // const { config = {} } = rest;
    // const { ga } = config;
    // const gaAttributes = getDOMGAAttributes(ga);
    const observer = useRef();
    const [elementInView, setElementInView] = useState(false);
    // const [domContentLoaded, setDomContentLoaded] = useState(false);
    const [firstScrollInitiated, setFirstScrollInitiated] = useState(false);
    // const [docClickDone, setDocClickDone] = useState(false);

    let ComponenToRender = null;
    const isdefaultLoadInViewEligible = !(
      loadOnScroll ||
      // loadOnDocLoad ||
      loadOnDocClick
    );

    // #todo if time permits will make it separate
    const componentRef = useCallback(
      (node) => {
        // console.log('CCL=============> componentRef');
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              observer.current.unobserve(node);
              // console.log('CCL=============> inview');
              setElementInView(true);
            }
          },
          { rootmargin: rootmargin || '0px 0px 0px 0px' },
        );
        if (node) observer.current.observe(node);
      },
      [rootmargin],
    );

    const getComponentToRender = useCallback(() => {
      if (window.memoComponents[componentName]) {
        return window.memoComponents[componentName];
      }
      window.memoComponents[componentName] = getComponent(componentName);
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('HTML_UPDATED', {
            detail: {},
          }),
        );
      }, 1000);

      return window.memoComponents[componentName];
    }, [componentName]);

    // const domContentLoadedListener = useCallback(() => {
    //   window.addEventListener('DOM_CONTENT_LOADED', () => {
    //     if (!domContentLoaded) {
    //       setDomContentLoaded(true);
    //     }
    //   });
    //   if (!domContentLoaded && document.readyState === 'complete') {
    //     setDomContentLoaded(true);
    //   }
    // }, []);

    useEffect(() => {
      const scrollListener = () => {
        window.addEventListener('FIRST_SCROLL_INITIATE', () => {
          // console.log('CCL=============> FIRST_SCROLL_INITIATE Listened');
          setFirstScrollInitiated(true);
        });
      };
      // const docClickListener = () => {
      //   window.addEventListener('DOCUMENT_CLICKED', () => {
      //     // console.log('CCL=============> DOCUMENT_CLICKED');
      //     setDocClickDone(true);
      //   });
      // };
      // listening event
      if (loadOnScroll) {
        scrollListener();
      }
      // if (loadOnDocClick) {
      //   docClickListener();
      // }
    }, [loadOnScroll, loadOnDocClick]);

    if (
      (loadOnScroll && (firstScrollInitiated || firstScrollFlag)) ||
      // (loadOnDocLoad && (domContentLoaded || domContentLoadFlag)) ||
      // (loadOnDocClick && (docClickDone || docClickFlag)) ||
      (elementInView && isdefaultLoadInViewEligible)
    ) {
      // console.log('CCL=============>conditon ', componentName);
      ComponenToRender = getComponentToRender();
    }

    // console.log('CCL=============> start return ', ComponenToRender);
    return (
      <div
        ref={isdefaultLoadInViewEligible ? componentRef : () => {}}
        style={styles}
        className={globalClass}
        key={key}
        // {...gaAttributes}
      >
        {ComponenToRender ? (
          <ComponenToRender componentName={componentName} {...rest} />
        ) : (
          fallbackComponent
        )}
      </div>
    );
  },
);

ClientComponentLoader.propTypes = {
  componentName: PropTypes.string.isRequired,
  loadOnScroll: PropTypes.bool,
  loadOnDocLoad: PropTypes.bool,
  // loadOnDocClick: PropTypes.bool,
  rootmargin: PropTypes.string,
  fallbackComponent: PropTypes.node,
  styles: PropTypes.shape({}),
  globalClass: PropTypes.string,
  key: PropTypes.string,
};
ClientComponentLoader.defaultProps = {
  loadOnScroll: false,
  loadOnDocLoad: false,
  // loadOnDocClick: false,
  rootmargin: '',
  fallbackComponent: null,
  styles: {},
  globalClass: '',
  key: '',
};

export default ClientComponentLoader;
