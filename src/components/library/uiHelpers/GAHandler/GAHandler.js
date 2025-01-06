import React, { useEffect, useCallback } from 'react'; // useRef

// import analyticsWrapper from '../../utils/analyticsWrapper';
import { handleLinksForFrmapp } from '../../atoms/Link/frmAppLink';
import yieldToMainThread from '../../utils/yieldToMainThread';
// #todo will change this file name to EventHandler
// will create differnt utility for ga and will call its function from here
function GAHandler() {
  // const inViewElemsStatus = useRef({});
  // const inViewObserver = useRef({});

  // const handleGA = (event) => {
  //   if (event && event.target) {
  //     // const { target } = event;
  //     let targetEl = event.target;
  //     const gaClickStrategy = targetEl.getAttribute('data-ga-click');
  //     if (!gaClickStrategy) {
  //       targetEl = targetEl.closest('[data-ga-click]'); // closest parent
  //     }
  //     if (targetEl) {
  //       const category = targetEl.getAttribute('data-ga-c');
  //       const action = `${targetEl.getAttribute('data-ga-a')}_click`;

  //       const isLabelPageURl =
  //         targetEl.getAttribute('data-ga-sl') === 'pageurl';
  //       const label = isLabelPageURl
  //         ? window.location.href
  //         : targetEl.getAttribute('data-ga-l');

  //       analyticsWrapper('ga', 'send', 'event', category, action, label);
  //     }
  //   }
  // };
  const handleOnClick = useCallback(async (event) => {
    await yieldToMainThread();
    handleLinksForFrmapp(event);
    // await yieldToMainThread();
    // handleGA(event);
  }, []);

  // const handleOnView = async (event) => {
  //   await yieldToMainThread();
  //   if (event && event.target) {
  //     const { target } = event;
  //     const gaInViewstrategy = target.getAttribute('data-ga-view');
  //     const donotUnObserveTarget = target.getAttribute('data-ga-i-uo') === 'no'; // inview unobserve
  //     if (!gaInViewstrategy || !event.isIntersecting) {
  //       return;
  //     }
  //     if (!donotUnObserveTarget) {
  //       inViewObserver.current.unobserve(target);
  //     }
  //     const action = `${target.getAttribute('data-ga-a')}_view`;
  //     const label = target.getAttribute('data-ga-l');
  //     const category = target.getAttribute('data-ga-c');
  //     const gaVal = target.getAttribute('data-ga-v');
  //     const val = gaVal && parseInt(gaVal, 10) ? parseInt(gaVal, 10) : 0;
  //     const nonInteraction = target.getAttribute('data-ga-ni');
  //     let ni;
  //     if (nonInteraction) {
  //       ni = { nonInteraction: 1 };
  //     }

  //     target.setAttribute('data-ga-ivpd', 'yes');

  //     analyticsWrapper('ga', 'send', 'event', category, action, label, val, ni);
  //     // inViewElemsStatus.current[target] = true;
  //   }
  // };

  // const attachInViewObserver = async () => {
  //   const inviewElems = document.querySelectorAll(
  //     "[data-ga-view='yes']:not([data-ga-ivpd='yes']",
  //   ); // elements which are not processed yet
  //   await yieldToMainThread();
  //   if (inviewElems && inviewElems.length) {
  //     inviewElems.forEach((inviewElem) => {
  //       // //console.log('attachInViewObserver', inviewElem);
  //       inViewObserver.current.observe(inviewElem); //
  //       // el -- .setattr processed -yes
  //       // inViewElemsStatus.current[inviewElem] = false;
  //     });
  //   }
  // };

  useEffect(() => {
    if (
      typeof document !== 'undefined' &&
      window.location.href.includes('frmapp=yes')
    ) {
      document.onclick = handleOnClick;
    }
    // const elemObserver = new IntersectionObserver((entries) => {
    //   entries.forEach((entry) => {
    //     // //console.log('entry', entry);
    //     handleOnView(entry);
    //   });
    // });
    // inViewObserver.current = elemObserver;
    // attachInViewObserver();

    // window.addEventListener('HTML_UPDATED', () => {
    //   // const {s detail = {} } = event;
    //   // const rootElem = detail.root;
    //   // if (rootElem) {
    //   attachInViewObserver();
    //   // }
    // });
  }, [handleOnClick]);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

GAHandler.propTypes = {};

export default GAHandler;
